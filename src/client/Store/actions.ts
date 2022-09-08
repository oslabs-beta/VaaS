import { IClusterMetrics } from '../Interfaces/IAction';
import { ClusterTypes } from '../Interfaces/ICluster';
import * as types from './actionTypes';

export const setRender = (renderState: boolean) => ({
  type: types.SET_RENDER,
  payload: renderState
});

export const setFavRender = (favRenderState: boolean) => ({
  type: types.SET_FAV_RENDER,
  payload: favRenderState
});

export const setTitle = (title : string) => ({
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

export const storeClusterMetricAllNodes = (clusterId: string | undefined, allNodes: string) => ({
  type: types.STORE_CLUSTER_METRIC_ALLNODES,
  payload: {
    clusterId,
    allNodes
  }
});

export const setUI = (test2: string) => ({
  type: types.SET_UI,
  payload: test2
});