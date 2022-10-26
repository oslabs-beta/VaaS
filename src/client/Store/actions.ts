import { IClusterMetrics, IClusterUIState } from '../Interfaces/IAction';
import { ClusterTypes } from '../Interfaces/ICluster';
import { DeployedFunctionTypes, FunctionTypes } from "../Interfaces/IFunction";
import * as types from './actionTypes';

export const setRender = (renderState: boolean) => ({
  type: types.SET_RENDER,
  payload: renderState
});

export const setFavRender = (favRenderState: boolean) => ({
  type: types.SET_FAV_RENDER,
  payload: favRenderState
});

export const setTitle = (title: string) => ({
  type: types.SET_TITLE,
  payload: title
});

export const storeClusterDbData = (clusters: ClusterTypes[]) => ({
  type: types.STORE_CLUSTERS,
  payload: clusters
});

export const storeClusterQueryData = (clusterId: string | undefined, clusterMetrics: IClusterMetrics) => ({
  type: types.STORE_CLUSTER_METRICS,
  payload: {
    clusterId,
    clusterMetrics
  }
});

export const setUI = (clusterId: string | undefined, clusterUIState: IClusterUIState) => ({
  type: types.SET_UI,
  payload: {
    clusterId,
    clusterUIState
  }
});

export const setDarkMode = (darkMode: boolean) => ({
  type: types.SET_DarkMode,
  payload: {
    darkMode
  }
});

export const SET_OFFunc = (clusterId: string | undefined, selectedOpenFaaSFunction: string) => ({
  type: types.SET_OFFunc,
  payload: {
    clusterId,
    selectedOpenFaaSFunction
  }
});

export const SET_DeployedOFFunc = (clusterId: string | undefined, selectedDeployedFunction: string) => ({
  type: types.SET_DeployedOFFunc,
  payload: {
    clusterId,
    selectedDeployedFunction
  }
});

export const GET_OFFunc = (clusterId: string | undefined, openFaaSFunctions: FunctionTypes[]) => ({
  type: types.GET_OFFunc,
  payload: {
    clusterId,
    openFaaSFunctions
  }
});

export const GET_DeployedOFFunc = (deployedFunctions: DeployedFunctionTypes[]) => ({
  type: types.GET_DeployedOFFunc,
  payload: deployedFunctions
});

export const DEL_DeployedOFFunc = (clusterId: string | undefined, deployedFunctions: DeployedFunctionTypes[]) => ({
  type: types.DEL_DeployedOFFunc,
  payload: {
    clusterId,
    deployedFunctions
  }
});