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
}
