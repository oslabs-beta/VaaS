import { Document, Types } from "mongoose";

export interface IUser extends Document{
  _id: Types.ObjectId,
  firstName: string,
  lastName: string,
  username: {type: string, unique: boolean},
  password: string,
  darkMode: boolean,
  refreshRate: number
}
