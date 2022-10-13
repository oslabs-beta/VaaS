import { IClusterMetrics, IClusterUIState } from "./IAction";
import { ClusterTypes } from "./ICluster";
import { DeployedFunctionTypes, FunctionTypes } from "../Interfaces/IFunction";

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

export interface IOFReducer {

      selectedDeployedFunction: string,
      selectedOpenFaaSFunction: string,
      openFaaSFunctions: FunctionTypes[],
      deployedFunctions: DeployedFunctionTypes[]
  }

export interface IReducers {
  clusterReducer: IClusterReducer;
  uiReducer: IUIReducer;
  apiReducer: IApiReducer;
  OFReducer: IOFReducer;
}

