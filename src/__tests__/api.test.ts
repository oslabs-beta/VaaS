import express, { Request, Response, NextFunction, application } from 'express';
import router from '../server/route';
import cookieParser from 'cookie-parser';
import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import db from '../server/mongoDb';
import { User } from '../server/models';
import request from 'supertest';

const routes = Object.values(router);

//#region  Express app setup
let app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
db.connect();
//#endregion

describe('/user route', () => {
  describe('POST /api/auth', () => {
    const testUser = {
      username: 'test',
      password: 'test',
      firstName: 'test',
      lastName: 'test',
    };

    describe('given correct input', () => {
      it('should return 201 OK and JSON data', async () => {
        const response = await request(app).post('/api/auth').send(testUser);
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('userId');
      });

      it('should add a user to the database', async () => {
        const user = await User.findOne({ username: testUser.username });
        expect(user).toBeDefined();
        expect(user).toHaveProperty('username', testUser.username);
        expect(user).toHaveProperty('password');
        expect(user?.password).not.toBe(testUser.password);
        expect(user).toHaveProperty('firstName', testUser.firstName);
        expect(user).toHaveProperty('lastName', testUser.lastName);
      });

      afterAll(async () => {
        await User.deleteOne({ username: testUser.username });
      });
    });

    describe('given incorrect input', () => {
      const incorrectUser = {
        username: 'test',
        firstName: 'test',
        lastName: 'test',
      };

      it('should return status 500', async () => {
        const response = await request(app)
          .post('/api/auth')
          .send(incorrectUser);
        expect(response.status).toBe(500);
      });

      it('should not add a user to the database', async () => {
        const user = await User.findOne({ username: incorrectUser.username });
        expect(user).toBeNull();
      });
    });

    describe('given duplicate username', () => {
      beforeAll(async () => {
        await request(app).post('/api/auth').send(testUser);
      });

      it('should return status 401', async () => {
        const response = await request(app).post('/api/auth').send(testUser);
        expect(response.status).toBe(401);
      });

      it('should not add a duplicate user to the database', async () => {
        const user = await User.find({ username: testUser.username });
        expect(user).toHaveLength(1);
      });

      afterAll(async () => {
        await User.deleteOne({ username: testUser.username });
      });
    });
  });

  // describe('GET /api/user', () => {});
});