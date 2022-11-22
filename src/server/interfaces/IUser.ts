import { Document, Types } from "mongoose";

export interface IUser extends Document{
  _id: Types.ObjectId,
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  darkMode: boolean,
  refreshRate: number
}
