const db = require('../db');

const pricesService = {};

pricesService.insertPrices = rows => db.batchInsert('prices', rows);

pricesService.selectAllPrices = () =>
  db
    .select('*')
    .from('prices')
    .orderBy('day', 'asc');

pricesService.selectLatestDay = () =>
  db
    .select('day')
    .from('prices')
    .orderBy('day', 'desc')
    .first();

pricesService.selectPricesBySymbol = symbol => {
  return db
    .select('*')
    .from('prices')
    .where({ symbol })
    .orderBy('day', 'desc');
};

pricesService.selectUniqueDates = () => {
  return db('prices')
    .distinct('day')
    .orderBy('day', 'asc');
};

module.exports = pricesService;
