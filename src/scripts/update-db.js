const dbUpdater = require('../db/db-updater');

const updateDb = async () => {
  await dbUpdater();
  process.exit(0);
};

updateDb().catch((e) => {
  console.error(e);
  process.exit(1);
});
