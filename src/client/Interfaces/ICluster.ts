export interface ClusterTypes {
  _id: string,
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
  _id?: string,
  id?: string,
  nested?: boolean,
  name?: string,
  url?: string,
  k8_port?: number | undefined,
  faas_port?: number | undefined,
  description?: string,
}