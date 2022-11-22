import * as types from "../actionTypes";
import { IClusterAction } from "../../Interfaces/IAction";
import { IApiReducer } from "../../Interfaces/IReducers";

const initialState: IApiReducer = {
  initialLoad: true,
  lastFetch: new Date().getTime(),
  clusterDbData: [],
  clusterQueryData: {}
};

const apiReducer = (state: IApiReducer = initialState, action: IClusterAction) => {
  switch (action.type) {
    case types.STORE_CLUSTERS: {
      return {
        ...state,
        initialLoad: false,
        lastFetch: new Date().getTime(),
        clusterDbData: action.payload,
      };
    }
    case types.STORE_CLUSTER_METRICS: {
      return {
        ...state,
        clusterQueryData: {
          ...state.clusterQueryData,
          initialLoad: false,
          lastFetch: new Date().getTime(),
          [action.payload.clusterId]: action.payload.clusterMetrics
        }
      };
    }
    default: {
      return state;
    }
  }
};

export default apiReducer;