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
  darkMode: Boolean,
  refreshRate: Number
});

// THIRD PARAMETER DEFINES DEFAULT COLLECTION NAME
export default model<IUser>('User', userSchema, 'users');
