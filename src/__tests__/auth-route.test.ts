import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './test-api';
import { User } from '../server/models';

const testUser = {
  username: 'authtest',
  password: 'test',
  firstName: 'test',
  lastName: 'test',
};

describe('/auth route', () => {
  describe('POST /api/auth', () => {
    describe('given correct input', () => {
      it('should return 201 OK and JSON data', async () => {
        const response = await request(app).post('/api/auth').send(testUser);
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('userId');
      });

      it('should add a user to the database with correct info', async () => {
        const user = await User.findOne({ testUser });
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
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

  describe('GET /api/auth', () => {
    let cookieHeader: string[] = [];

    beforeAll(async () => {
      const response = await request(app).post('/api/auth').send(testUser);
      cookieHeader = response.headers['set-cookie'];
      console.log(response.status);
    });

    describe('given a valid cookie', () => {
      it('should respond with status 200', async () => {
        const response = await request(app)
          .get('/api/auth')
          .set('Cookie', cookieHeader);
        expect(response.status).toBe(201);
      });
    });

    describe('given an invalid cookie', () => {
      it('should respond with status 400', async () => {
        const response = await request(app).get('/api/auth');
        expect(response.status).toBe(400);
      });
    });

    afterAll(async () => {
      await User.deleteOne({ username: testUser.username });
    });
  });

  describe('PUT /api/auth', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth').send(testUser);
    });

    describe('given correct login credentials', () => {
      let response: request.Response;

      beforeAll(async () => {
        response = await request(app)
          .put('/api/auth')
          .send({ username: testUser.username, password: testUser.password });
      });

      it('should respond with status 201', async () => {
        expect(response.status).toBe(201);
      });

      it('should respond with a cookie', async () => {
        expect(response.headers['set-cookie']).toBeDefined();
      });

      it('should respond with a JSON object', async () => {
        expect(response.headers['content-type']).toMatch(/json/);
      });

      it('should respond with a userId', async () => {
        expect(response.body).toHaveProperty('userId');
      });

      it('should respond with an auth token', async () => {
        expect(response.header).toHaveProperty('x-auth-token');
      });
    });

    describe('given incorrect login credentials', () => {
      let response: request.Response;

      beforeAll(async () => {
        response = await request(app)
          .put('/api/auth')
          .send({ username: testUser.username, password: 'wrong' });
      });

      it('should respond with status 401', async () => {
        expect(response.status).toBe(401);
      });

      it('should respond with an error message', () => {
        expect(response.body).toHaveProperty('message');
      });

      it('should not respond with a cookie', async () => {
        expect(response.headers['set-cookie']).toBeUndefined();
      });

      it('should not respond with a userId', async () => {
        expect(response.body).not.toHaveProperty('userId');
      });

      it('should not respond with an auth token', async () => {
        expect(response.header).not.toHaveProperty('x-auth-token');
      });
    });

    describe('given no login credentials', async () => {
      let response: request.Response;

      beforeAll(async () => {
        response = await request(app).put('/api/auth');
      });

      it('should respond with error code 500', () => {
        expect(response.status).toBe(500);
      });

      it('should respond with an error message', () => {
        expect(response.body).toHaveProperty('message');
      });

      it('should not respond with a cookie', async () => {
        expect(response.headers['set-cookie']).toBeUndefined();
      });

      it('should not respond with a userId', async () => {
        expect(response.body).not.toHaveProperty('userId');
      });

      it('should not respond with an auth token', async () => {
        expect(response.header).not.toHaveProperty('x-auth-token');
      });
    });

    afterAll(async () => {
      await User.deleteOne({ username: testUser.username });
    });
  });
});
