import { IClusterMetrics, IClusterUIState } from '../Interfaces/IAction';
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

export const setUI = (clusterId: string | undefined, clusterUIState: IClusterUIState) => ({
  type: types.SET_UI,
  payload: {
    clusterId,
    clusterUIState
  }
});
