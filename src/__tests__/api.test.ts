import express, { Request, Response, NextFunction, application } from 'express';
import router from '../server/route';
import cookieParser from 'cookie-parser';
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import db from '../server/mongoDb';
import { User } from '../server/models';

const request = require('supertest');
const routes = Object.values(router);

let app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
db.connect();

// test
describe('POST /api/user', () => {
  describe('given correct input', () => {
    afterAll(async () => {
      await User.deleteMany({});
    });
    it('should return 201 OK and JSON data', () => {
      return request(app)
        .post('/api/auth')
        .send({
          username: 'test',
          password: 'test',
          firstName: 'test',
          lastName: 'test',
        })
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');
    });
  });
  //   describe('given incorrect input', () => {
  //     it('should return status 500');
  //   });
});
