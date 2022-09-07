import { ClusterTypes } from '../Interfaces/ICluster';
import * as types from './actionTypes';

export const setRender = (signInState: boolean) => ({
  type: types.SET_RENDER,
  payload: signInState
});

export const setTitle = (title : string) => ({
  type: types.SET_TITLE,
  payload: title
});

export const storeClusters = (clusters: ClusterTypes[]) => ({
  type: types.SET_CLUSTERS,
  payload: clusters
});

export const setUI = (test2: string) => ({
  type: types.SET_UI,
  payload: test2
});