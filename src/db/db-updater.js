require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment-timezone');
const pricesService = require('./services/prices-service');
const logger = require('../logger');
const { SYMBOLS, AV_API_KEY } = require('../config');
const db = require('./db');

// format params for fetch query
const formatQueryParams = (params) => {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
};

// fetch single symbol data from Alpha Vantage
async function fetchCurrentPricesBySymbol(symbol) {
  const searchURL = 'https://www.alphavantage.co/query';
  const params = {
    function: 'DIGITAL_CURRENCY_DAILY',
    symbol: symbol,
    market: 'USD',
    apikey: AV_API_KEY,
    datatype: 'json',
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  //const url = ('test/dailyBTC.json');

  try {
    //console.log('fetching data for' + symbol + ' from ' + url);
    const response = await fetch(url);
    if (response.ok) {
      const responseJSON = await response.json();
      //console.log('data fetched', responseJSON);
      return responseJSON;
    }
    throw new Error(response.statusText);
  } catch (error) {
    console.error(error);
  }
}

// fetch current prices for all symbols from Alpha Vantage
const fetchAllCurrentPrices = async (currentSymbols) => {
  const prices = [];
  for (symbol of currentSymbols) {
    //console.log('fetching data for current symbols:' + currentSymbols);
    let retries = 3;
    let attempts = 0;
    let responseJSON = {};
    while (attempts < retries) {
      attempts++;
      responseJSON = await fetchCurrentPricesBySymbol(symbol);
      if (responseJSON.Note) {
        //console.log('hit rate limit, retrying in 60000 miliseconds');
        await new Promise((resolve) => setTimeout(resolve, 60000));
        continue;
      } else break;
    }
    if (attempts === retries) throw new Error('failed after 3 retries');
    //prices.push(timeSeries);
    for (const day of Object.keys(
      responseJSON['Time Series (Digital Currency Daily)']
    )) {
      const dayResponse =
        responseJSON['Time Series (Digital Currency Daily)'][day];
      if (dayResponse.hasOwnProperty(`4a. close (USD)`)) {
        const dayValue = dayResponse[`4a. close (USD)`];
        if (dayValue > 0)
          prices.push({
            day: moment(day).format('YYYY-MM-DD'),
            symbol: symbol,
            price: dayValue,
          });
      }
    }
  }
  return prices;
};

const updatePrices = async () => {
  var existingPrices = await pricesService.selectAllPrices();
  var currentPrices = await fetchAllCurrentPrices(SYMBOLS);
  var newPrices = currentPrices.filter(function (o1) {
    return !existingPrices.some(function (o2) {
      return (
        o1.symbol === o2.symbol &&
        o1.day === moment(o2.day).format('YYYY-MM-DD')
      ); // assumes symbol + day composite primary key
    });
  });
  await pricesService.insertPrices(newPrices);
  logger.info(`Added ${newPrices.length} new prices to db`);
};

// runs on start up and launches recurring jobs
const dbUpdater = async () => {
  // get day of most recent price data from db
  let latestDay = await pricesService.selectLatestDay();
  //console.log('latest day when db is blank', latestDay);
  if (!latestDay) {
    latestDay = moment.unix(0);
  } else latestDay = moment(latestDay.day).tz('UTC');
  logger.info('Found latest day of data: ' + latestDay.toString());

  // check if its been 24h since most recent date
  const now = moment();
  logger.info(`now is ${now}`);
  const sinceLatestDay = now.diff(latestDay, 'h');
  logger.info(`Data is ${sinceLatestDay} hrs old`);

  // if yes, do fetches, get new most recent date
  if (sinceLatestDay > 24) {
    logger.info('Data is > 24 hrs old. Time to update!');
    try {
      await updatePrices();
    } catch (error) {
      logger.error('Unable to update prices data', error);
    }
    // update most recent date
    latestDay = (await pricesService.selectLatestDay()).day;
    latestDay = moment(latestDay);
    logger.info('Found latest day of data: ' + latestDay.toString());
  }
};

module.exports = dbUpdater;
