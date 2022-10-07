import * as types from "../actionTypes";
import { IOFAction } from "../../Interfaces/IAction";
import { IOFReducer } from "../../Interfaces/IReducers";


const initialState: IOFReducer = {
  clusterOpenFaaSData: {}
};

const OFReducer = (state: IOFReducer = initialState, action: IOFAction) => {
  switch (action.type) {
    case types.GET_OFFunc: {
      return {
        clusterOpenFaaSData: {
          [action.payload.clusterId as string]: {
            ...state.clusterOpenFaaSData[action.payload.clusterId as string],
            openFaaSFunctions: action.payload.openFaaSFunctions
          }
        }
      };
    }
    case types.GET_DeployedOFFunc: {
      console.log('ID is: ', action.payload.clusterId as string);
      console.log('adding this to deployed func: ', action.payload.deployedFunctions);
      console.log('THIS IS OG STATE: ', state);
      // if (state.clusterOpenFaaSData[action.payload.clusterId as string]) {
      return {
        ...state,
        clusterOpenFaaSData: {
          ...state.clusterOpenFaaSData,
          [action.payload.clusterId as string]: {
            ...state.clusterOpenFaaSData[action.payload.clusterId as string],
            deployedFunctions: action.payload.deployedFunctions
          },
        }
      };
    }
    case types.SET_DeployedOFFunc: {
      return {
        ...state,
        selectedDeployedFunction: action.payload,
      };
    }
    case types.SET_OFFunc: {
      return {
        ...state,
        selectedOpenFaaSFunction: action.payload,
      };
    }
    case types.DEL_DeployedOFFunc: {
      return {
        clusterOpenFaaSData: {
          [action.payload.clusterId as string]: {
            // ...state.clusterOpenFaaSData[action.payload.clusterId as string],
            deployedFunctions: action.payload.deployedFunctions
          }
        }
      };
    }
    default: {
      return state;
    }
  }
};

export default OFReducer;