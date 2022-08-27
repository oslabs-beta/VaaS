import * as types from './actionTypes';

export const setRender = (signInState: boolean) => ({
  type: types.SET_RENDER,
  payload: signInState
});

export const setTitle = (title : string) => ({
  type: types.SET_TITLE,
  payload: title
});
