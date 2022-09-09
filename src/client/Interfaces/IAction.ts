export interface IAction {
  type: string;
  payload: any;
}

export interface IClusterAction {
  type: string;
  payload: IClusterPayload;
}

export interface IClusterPayload {
  clusterId: string,
  clusterMetrics: IClusterMetrics
}

export interface IClusterMetrics {
  cpuLoad: any | unknown;
  memoryLoad: any;
  totalDeployments: any;
  totalPods: any;
  allNodes: any;
  allNamespaces: any;
  allServices: any;
  allNameList: any;
}

export interface IClusterUIAction {
  type: string;
  payload: IClusterUIPayload;
}

export interface IClusterUIPayload {
  clusterId: string,
  clusterUIState: IClusterUIState
}

export interface IClusterUIState {
  clusterId?: string,
  currentModule: string,
  fullscreen: boolean,
  modules: any
}
