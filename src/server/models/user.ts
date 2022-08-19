import { Schema } from 'mongoose';

import Database from '../mongoDb';
import { IUser } from '../interfaces/IUser';
const { mongo: { model } } = Database;

const userSchema: Schema<IUser> = new Schema<IUser>({
  _id: {type: Schema.Types.ObjectId, required: true},
  firstName: String,
  lastName: String,
  username: String,
  password: String,
});

// THIRD PARAMETER DEFINES DEFAULT COLLECTION NAME
export default model<IUser>('User', userSchema, 'users');