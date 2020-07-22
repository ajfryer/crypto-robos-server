# Crypto Robos Server

Backend for Crypto Robos - Think like a crypto robo.

Simulate popular investment strategies on Crypto coins and benchmark your HODL.

Tech stack: Node, Express, Postgres

[Client Repo](https://github.com/ajfryer/crypto-robos-client)

[Live Demo](https://cryptorobos.vercel.app/)

## Install

1. `yarn install` or `npm install`

2. `cp sample.env .env`

3. Add dev, test, and production database URLs to .env

4. Migrate database: `yarn migrate` or `npm migrate`

5. Schedule Heroku scheduler to run `yarn refresh-db` or `npm refresh-db` after market close (5pm EST)

## Scripts

Start server: `yarn start` or `npm run start`

Dev server: `yarn dev` or `npm dev`

Refresh database: `yarn refresh-db` or `npm refresh-db`

Migrate database: `yarn migrate-db` or `npm migrate-db`

Deploy to Heroku: `yarn deploy` or `npm run deploy`

## API

**Prices**
'/api/prices'

--returns all the market prices necesssary to run the simulations on the client

## Heroku

1. `heroku create`

2. `heroku addons:create heroku-postgresql:hobby-dev`

3. `yarn migrate:production` or `npm migrate:production`

4. `heroku addons:create scheduler:standard`

5. Schedule Heroku scheduler to run `yarn refresh-db` or `npm refresh-db` after market close (5pm EST)

6. `yarn deploy` or `npm run deploy`

7. `heroku ps:scale web=1`
