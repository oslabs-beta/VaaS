import * as types from "../actionTypes";
import { IAction } from "../../Interfaces/IAction";
import { IUiReducer } from "../../Interfaces/IReducers";

const initialState: IUiReducer = {
  test2: ''
};

const uiReducer = (state: IUiReducer = initialState, action: IAction) => {
  switch (action.type) {
    case types.SET_UI: {
      return {
        ...state,
        test2: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default uiReducer;
