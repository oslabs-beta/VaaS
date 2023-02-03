import { describe, expect, it, beforeAll, beforeEach } from 'vitest';
import { registerUser } from '../client/Queries/auth/register';
import { deleteUser } from '../client/Queries/user/userQueries';
import User from '../server/models/user';

// const mongoUser = process.env.MONGO_USERNAME;
// const mongoPass = process.env.MONGO_PASSWORD;
// const mongoUrl = process.env.MONGO_URL;

describe('User CRUD Test', () => {
  it('registerUser should create a new user', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Smith',
      username: 'jsmith1',
      password: 'password',
    };
    const user = await registerUser(newUser);
    console.log(user);
    expect(user).not.toBe(undefined);
    // await deleteUser(newUser);
  });
});
