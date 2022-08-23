export interface IConfig {
  mongodb: IMongo,
  jwt: ITokenSecret
}

interface IMongo {
  url: string | undefined,
  port: number | undefined,
  username: string | undefined,
  password: string | undefined,
  collection: string | undefined,
}

interface ITokenSecret {
  access: string | undefined,
  refresh: string | undefined
}
