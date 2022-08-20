import * as types from './actionTypes';

export const setWelcome = (message: string) => ({
  type: types.WELCOME,
  payload: message,
});

export const signUp = (credential: Record<string, string>) => ({
  type: types.SIGN_UP,
  payload: credential,
});

export const signIn = (credential: boolean) => ({
  type: types.SIGN_IN,
  payload: credential,
});

export const deleteUser = (credential: boolean) => ({
  type: types.DELETE,
  payload: credential,
});

// export const setClusterInfo = () => ({
//   type: types.CLUSTER_INFO,
//   payload: 
// });

