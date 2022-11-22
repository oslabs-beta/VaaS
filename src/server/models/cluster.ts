import { Schema } from 'mongoose';
import Database from '../mongoDb';
import { ICluster } from '../interfaces/ICluster';
const { mongo: { model } } = Database;

const clusterSchema: Schema<ICluster> = new Schema<ICluster>({
  _id: {type: Schema.Types.ObjectId, required: true},
  url: String,
  k8_port: Number,
  faas_port: Number,
  authorization: String,
  name: String,
  description: String,
  favorite: [Schema.Types.ObjectId],});

// THIRD PARAMETER DEFINES DEFAULT COLLECTION NAME
export default model<ICluster>('Cluster', clusterSchema, 'clusters');
