import * as types from '../actionTypes';
import { IAction } from '../../Interfaces/IAction'
import { IAppReducer } from '../../Interfaces/IReducers'

const initialState: IAppReducer = {
  signInState: false,
  username: ''
  // clusterHealth: [/* can be array - depends on what promQL returns*/],
};

const appReducer = (state: IAppReducer = initialState, action: IAction) => {
  switch (action.type) {
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
        signInState: action.payload.signInState,
        username: action.payload.username
      }
      //else return {state}
    }

    default: {
      return state;
    }
  }
}

export default appReducer;


