import { ClusterTypes } from "./ICluster";

export interface IAction {
  type: string;
  payload: string | boolean | ClusterTypes[];
}

//need
