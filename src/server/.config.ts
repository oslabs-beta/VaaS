import { IConfigs } from "./interfaces/IConfigs";

export const configs: IConfigs = {
  mongodb: {
    url: '@dev.url.mongodb.net', //@---->.net
    port: 27017,
    username: 'user',
    password: 'pass',
    collection: 'database',
  }
}
