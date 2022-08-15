export interface IConfigs {
  mongodb: IMongo,
  // can add more configurations here for export
}

interface IMongo {
  url: string,
  port: number,
  username: string,
  password: string,
  collection: string,
}
