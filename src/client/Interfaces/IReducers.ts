import { IClusterMetrics } from "./IAction";
import { ClusterTypes } from "./ICluster";

export interface IClusterReducer {
  render: boolean;
  favRender: boolean;
}

export interface IApiReducer {
  initialLoad: boolean;
  lastFetch: number;
  clusterDbData: ClusterTypes[];
  clusterQueryData: {
    [index: string]: IClusterMetrics;
  }
}

export interface IUiReducer {
  clusters: any;
}

export interface IReducers {
  clusterReducer: IClusterReducer;
  apiReducer: IApiReducer;
  uiReducer: IUiReducer;
}
