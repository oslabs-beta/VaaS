import mongoose, { Connection, Mongoose } from 'mongoose';
import { config } from './config';
import { IConfig } from "./interfaces/IConfig";

class Database {
  private readonly _config: IConfig;
  private readonly _mongo: Mongoose;

  constructor(config: IConfig, mongo: Mongoose) {
    this._config = config;
    this._mongo = mongo;
  }

  connect(): Mongoose {
    console.log("Attempting to connect to MongoDB cluster");
    const { mongodb: { url, port, collection, password, username } } = this._config;
    let protocol: string;
    // IF ADMIN INPUTS LOCALHOST, CHANGE PROTOCOL DEFINITION
    url === 'localhost' || url === '127.0.0.1' ? protocol = 'mongodb://' : protocol = 'mongodb+srv://';
    const uri = (username && password)
      // MODIFY URI SYNTAX BASED ON ADMIN INPUT
      ? `${protocol}${username}:${password}${url}/${collection}`
      : `${protocol}${url}:${port}/${collection}`;
    // INITIATE CONNECTION TO MONGODB
    this._mongo
      .connect(uri);
    const db: Connection = this._mongo.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', () => {
      console.log(`Successfully connected to MongoDB cluster: ${uri}`);
    });
    return mongoose;
  }

  get mongo() {
    return this._mongo;
  }

  get config() {
    return this._config;
  }
}

// FREEZE OBJECT TO PREVENT CHANGES TO IT
export default Object.freeze(new Database(config, mongoose));
