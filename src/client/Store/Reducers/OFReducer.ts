import * as types from "../actionTypes";
import { IOFAction } from "../../Interfaces/IAction";
import { IOFReducer } from "../../Interfaces/IReducers";


const initialState: IOFReducer = {
  selectedDeployedFunction: '',
  selectedOpenFaaSFunction: '',
  openFaaSFunctions: [],
  deployedFunctions: []
};

const OFReducer = (state: IOFReducer = initialState, action: IOFAction) => {
  switch (action.type) {
    case types.GET_OFFunc: {
      return {
        ...state,
        openFaaSFunctions: action.payload
      };
    }
    case types.GET_DeployedOFFunc: {
      console.log('adding this to deployed func: ', action.payload);
      console.log('THIS IS OG STATE: ', state);
      // if (state.clusterOpenFaaSData[action.payload.clusterId as string]) {
      return {
        ...state,
        deployedFunctions: action.payload
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
        ...state,
        deployedFunctions: action.payload,
      }
    }
    default: {
      return state;
    }
  }
};

export default OFReducer;