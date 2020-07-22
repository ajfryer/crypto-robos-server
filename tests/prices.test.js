// web service integration tests

const env = require('../src/config.js');
const api = require('../src/api/app.js');
const updateDb = require('../src/db/db-updater.js');

context('given prices ARE NOT in db', () => {
  describe('api/prices endpoint', () => {
    console.log('running prices endpoint test');
    console.log('connecting to db', env.DATABASE_URL);

    // set up environment
    const postgrator = new Postgrator({
      migrationDirectory: 'migrations',
      driver: 'pg',
      connectionString: env.DATABASE_URL,
    });

    beforeEach(async () => {
      // initialize db
      await postgrator.migrate('000');
      await postgrator.migrate('001');
    });
    //
    it('GET prices responds with ', (done) => {
      supertest(api)
        .get('/api/prices')
        .end((req, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.pricesByAsset[0]).to.be.an('array').that.is.empty;
          done();
        });
    });

    after(async () => {
      await postgrator.migrate('000');
    });
  });
});

context('given prices ARE in db', (done) => {
  describe('api/prices endpoint', function () {
    this.enableTimeouts(false);
    console.log('running prices endpoint test');
    console.log('connecting to db', env.DATABASE_URL);

    // set up environment
    const postgrator = new Postgrator({
      migrationDirectory: 'migrations',
      driver: 'pg',
      connectionString: env.DATABASE_URL,
    });

    beforeEach(async () => {
      // initialize db
      await postgrator.migrate('000');
      await postgrator.migrate('001');
      await updateDb();
    });
    //
    it('GET prices responds with ', (done) => {
      supertest(api)
        .get('/api/prices')
        .end((req, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.pricesByAsset[0]).to.be.an('array').that.is.not.empty;
          done();
        });
    });

    after(async () => {
      await postgrator.migrate('000');
    });
  });
});
