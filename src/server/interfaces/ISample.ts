import { Document, Types } from "mongoose";

export interface ISample extends Document {
  _id: Types.ObjectId,
}
