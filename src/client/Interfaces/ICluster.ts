export interface ClusterTypes {
  _id?: string | undefined,
  url?: string,
  k8_port?: number,
  faas_port?: number,
  name?: string,
  description?: string,
  favorite?: Array<string>[],
  __v?: number
}