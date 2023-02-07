export interface IConfig {
  mongodb: IMongo;
  jwt: ITokenSecret;
}

interface IMongo {
  url: string | undefined;
  port: number | undefined;
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
}

interface ITokenSecret {
  access: string | undefined;
  refresh: string | undefined;
}
