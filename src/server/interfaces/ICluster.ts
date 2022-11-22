import { Document, Types } from "mongoose";

export interface ICluster extends Document{
  _id: Types.ObjectId,
  url: string,
  k8_port: number,
  faas_port: number,
  authorization: string
  name: string,
  description: string,
  favorite: string[]
}
