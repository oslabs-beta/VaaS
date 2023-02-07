import * as types from '../actionTypes';
import { IClusterUIAction } from '../../Interfaces/IAction';
import { IUIReducer } from '../../Interfaces/IReducers';

const initialState: IUIReducer = {
  clusterUIState: {
    currentModule: 'OpenFaaS',
    fullscreen: false,
    modules: {
      OpenFaaS: {
        deployDropdown: '',
        invokeDropdown: '',
        requestBody: '',
        responseBody: '',
      },
      query: {
        inputField: '',
        responseObject: '',
      },
    },
    darkmode: false,
  },
};

const uiReducer = (
  state: IUIReducer = initialState,
  action: IClusterUIAction
) => {
  switch (action.type) {
    case types.SET_UI: {
      return {
        ...state,
        clusterUIState: {
          ...state.clusterUIState,
          [action.payload.clusterId as string]: action.payload.clusterUIState,
        },
      };
    }
    case types.SET_DarkMode: {
      // console.log('darkMode currently:', state.clusterUIState.darkmode);
      return {
        ...state,
        clusterUIState: {
          ...state.clusterUIState,
          darkmode: action.payload.darkMode,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default uiReducer;
