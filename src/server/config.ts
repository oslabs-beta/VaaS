import 'dotenv/config';
import { IConfig } from './interfaces/IConfig';

export const config: IConfig = {
  mongodb: {
    url: process.env.MONGO_URL,
    port: Number(process.env.MONGO_PORT),
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database:
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_DATABASE_TEST
        : process.env.MONGO_DATABASE,
  },
  jwt: {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
  },
};
