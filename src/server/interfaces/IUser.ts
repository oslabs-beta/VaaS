import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  darkMode: boolean;
  refreshRate: number;
  // made optional so cookieId can be deleted from user object to be returned to the client when fetching user(s)
  cookieId?: { type: string; unique: true };
}
