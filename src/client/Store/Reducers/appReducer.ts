import * as types from '../actionTypes';
import { IAction } from '../../Interfaces/IAction'

const initialState = {
  welcome: 'Welcome to VaaS'
};

const appReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case types.WELCOME:
      return state;
    default: {
      return state;
    }
  }
};

export default appReducer;
