import { IClusterMetrics, IClusterUIState } from "./IAction";
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

export interface IUIReducer {
  clusterUIState: IClusterUIState;
}

export interface IReducers {
  clusterReducer: IClusterReducer;
  uiReducer: IUIReducer;
  apiReducer: IApiReducer;
}
