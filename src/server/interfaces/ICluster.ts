import { Document, Types } from 'mongoose';

export interface ICluster extends Document {
  _id: Types.ObjectId;
  url: string;
  k8_port: number;
  faas_url: string;
  faas_port: number;
  authorization: string;
  name: { type: string; unique: boolean };
  description: string;
  favorite: string[];
  grafana_url: string;
  kubeview_url?: string;
  cost_url?: string;
  cost_port?: string;
  multi?: [number];
}
