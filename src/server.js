// crypto-robos server
const { PORT, DATABASE_URL } = require('./config'); // env configs
const httpService = require('./api/app'); // express app
const logger = require('./logger'); // application logger
const knex = require('knex'); // db query builder
const dbUpdater = require('./db/db-updater');
const CronJob = require('cron').CronJob;

// start express http service
httpService.listen(PORT, () => {
  logger.info('server is listening on port ' + PORT);
  //dbUpdater();
});

// start db updater

logger.info(`db updater started.`);
