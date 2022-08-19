import * as types from '../actionTypes';
import { IAction } from '../../Interfaces/IAction'

interface reducerState {
  welcome: string,
  signInState: boolean,
  // clusterHealth: [],
}

const initialState: reducerState = {
  welcome: 'Welcome to VaaS',
  signInState: false,
  // clusterHealth: [/* can be array - depends on what promQL returns*/],
};

const appReducer = (state: reducerState = initialState, action: IAction) => {
  switch (action.type) {
    case types.WELCOME: {
      return state;
    }

    case types.SIGN_UP: {
      //have it set up where sign up does not automatically sign user in
      //credential is going to be an object
      //pass credential back to via fetch request
      //async await here
      return {state}
    }

    case types.SIGN_IN: {
      //returns successful from backend in response
      //fetch request
        //if response === 'success
        //async await
      // return {
      //   ...state,
      //   signInState: true,
      // }
      // console.log(state.counter)
      return {
        ...state,
        signInState: action.payload,
      }
      //else return {state}
    }

    default: {
      return state;
    }
  }
}
console.log(appReducer)
;

export default appReducer;


