import { ClusterTypes } from "./ICluster";

export interface IClusterReducer {
  render: boolean;
}
export interface INavBarReducer {
  title: string;
}
export interface IApiReducer {
  clusters: ClusterTypes[];
  clusterMetrics?: ClusterTypes
}
export interface IUiReducer {
  test2: string;
}

export interface IReducers {
  clusterReducer: IClusterReducer;
  navBarReducer: INavBarReducer;
  apiReducer: IApiReducer;
  // uiReducer: IUiReducer;
}


