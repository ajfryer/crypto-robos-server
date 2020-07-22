// Setup test environment

process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';

const chai = require('chai');
const { expect } = chai;

const supertest = require('supertest');
const Postgrator = require('postgrator');

global.expect = expect;
global.supertest = supertest;
global.Postgrator = Postgrator;
