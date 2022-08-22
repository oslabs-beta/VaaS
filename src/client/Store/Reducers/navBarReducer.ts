import * as types from '../actionTypes';
import { IAction } from '../../Interfaces/IAction'
import { INavBarReducer } from '../../Interfaces/IReducers'


const initialState: INavBarReducer = {
  title: 'Home'
};

const navBarReducer = (state: INavBarReducer = initialState, action: IAction) => {
  switch (action.type) {
    case types.SET_TITLE: {

      return { 
        ...state,
        title: action.payload
      }
    }

    default: {
      return state;
    }
  }
}

export default navBarReducer;
