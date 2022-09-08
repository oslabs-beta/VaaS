import * as types from "../actionTypes";
import { IClusterUIAction } from "../../Interfaces/IAction";
import { IUIReducer } from "../../Interfaces/IReducers";

const initialState: IUIReducer = {
  clusterUIState: {
    currentModule: 'OpenFaaS',
    fullscreen: false,
    modules: {
      OpenFaaS: {
        deployDropdown: '',
        invokeDropdown: '',
        requestBody: '',
        responseBody: ''
      },
      query: {
        inputField: '',
        responseObject: ''
      }
    }
  }
};

const uiReducer = (state: IUIReducer = initialState, action: IClusterUIAction) => {
  switch (action.type) {
    case types.SET_UI: {
      return {
        ...state,
        clusterUIState: {
          ...state.clusterUIState,
          [action.payload.clusterId]: action.payload.clusterUIState
        }
      };
    }
    default: {
      return state;
    }
  }
};

export default uiReducer;
