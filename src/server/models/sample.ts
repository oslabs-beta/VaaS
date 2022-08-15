import { Schema } from 'mongoose';
import { ISample } from '../interfaces/ISample';
import Database from '../mongoDb';

const { mongo: { model } } = Database;

const sampleSchema: Schema<ISample> = new Schema<ISample>({
  _id: { type: Schema.Types.ObjectId, required: false }
});

export default model<ISample>('Sample', sampleSchema, 'sample'); // THIRD PARAMETER DEFINES DEFAULT COLLECTION NAME
