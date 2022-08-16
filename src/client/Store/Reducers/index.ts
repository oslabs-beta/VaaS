import { combineReducers } from 'redux';

import appReducer from './appReducer';

export const reducers = combineReducers({
  app: appReducer,
});
