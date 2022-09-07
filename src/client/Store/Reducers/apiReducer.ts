import * as types from "../actionTypes";
import { IAction } from "../../Interfaces/IAction";
import { IApiReducer } from "../../Interfaces/IReducers";

const initialState: IApiReducer = {
  clusters: [],
  clusterMetrics: {}
};

const apiReducer = (state: IApiReducer = initialState, action: IAction) => {
  switch (action.type) {
    case types.SET_CLUSTERS: {
      return {
        ...state,
        clusters: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default apiReducer;
