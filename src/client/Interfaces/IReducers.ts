import { IClusterMetrics } from "./IAction";
import { ClusterTypes } from "./ICluster";

export interface IClusterReducer {
  render: boolean;
  favRender: boolean;
}

export interface INavBarReducer {
  title: string;
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
  test2: string;
}

export interface IReducers {
  clusterReducer: IClusterReducer;
  navBarReducer: INavBarReducer;
  apiReducer: IApiReducer;
}
