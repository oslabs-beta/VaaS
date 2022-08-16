import * as types from './actionTypes';

export const setWelcome = (message) => ({
  type: types.WELCOME,
  payload: message,
});
