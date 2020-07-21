// router for folders endpoint

const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('../../logger');
const pricesService = require('../../db/services/prices-service');
const { SYMBOLS } = require('../../config');

const pricesRouter = express.Router();

pricesRouter.use(cors()); // TODO, set cors settings

pricesRouter.route('/').get(async (req, res, next) => {
  try {
    const dates = (await pricesService.selectUniqueDates()).map((e) => e.day);
    let prices = await pricesService.selectAllPrices();
    prices.forEach((p) => (p.price = Number(p.price)));

    let pricesByAsset = Array(SYMBOLS.length)
      .fill(0)
      .map((p) => []);

    prices.forEach((p) => {
      const symbolIndex = SYMBOLS.indexOf(p.symbol);
      pricesByAsset[symbolIndex].push(p.price);
    });

    res.json({ symbols: SYMBOLS, dates, pricesByAsset });
  } catch (error) {
    next(error);
  }
});

pricesRouter.route('/:symbol').get((req, res, next) => {
  pricesService
    .selectPricesBySymbol(req.params.symbol)
    .then((prices) => {
      res.json(prices);
    })
    .catch(next);
});

module.exports = pricesRouter;
