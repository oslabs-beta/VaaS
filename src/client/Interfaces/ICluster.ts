import { Dispatch, SetStateAction } from "react";

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
  homeRender?: boolean | undefined,
  setHomeRender: Dispatch<SetStateAction<boolean>>
}

export interface ClusterSettings {
  id?: string | undefined
}