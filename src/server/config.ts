import 'dotenv/config';
import { IConfigs } from "./interfaces/IConfigs";

export const configs: IConfigs = {
    mongodb: {
      url: process.env.MONGO_URL,
      port: Number(process.env.MONGO_PORT),
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
      collection: process.env.MONGO_COLLECTION,
    },
    jwt: {
      access: process.env.ACCESS_TOKEN_SECRET,
      refresh: process.env.REFRESH_TOKEN_SECRET
    }
}
