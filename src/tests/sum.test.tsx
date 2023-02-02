import { describe, expect, it, beforeAll, beforeEach } from 'vitest';
import mongoose, { Types } from 'mongoose';
import User from '../server/models/user';

const mongoUser = process.env.MONGO_USERNAME;
const mongoPass = process.env.MONGO_PASSWORD;
const mongoUrl = process.env.MONGO_URL;

// typeof window === 'undefined'
//   ? console.log('Window is undefined')
//   : console.log('Window is defined');

describe('User CRUD Test', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(
        `mongodv+srv://${mongoUser}:${mongoPass}${mongoUrl}`
      );
    } catch (error) {
      console.log(error);
    }
  });

  it('should create a new user', async () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Smith',
      username: 'johnsmith',
      password: 'password',
      darkMode: false,
      refreshRate: 10,
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeInstanceOf(Types.ObjectId);
  });
});
