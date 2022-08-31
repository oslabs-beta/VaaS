export interface ClusterTypes {
  _id?: string | undefined,
  url?: string,
  k8_port?: number,
  faas_port?: number,
  name?: string,
  description?: string,
  favorite?: string[],
  __v?: number,
  favoriteStatus?: boolean,
}

export interface Modules {
  _id?: string | undefined,
  id?: string | undefined
}