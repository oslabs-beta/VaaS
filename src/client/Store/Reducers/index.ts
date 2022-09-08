import { combineReducers } from 'redux';

import clusterReducer from './clusterReducer';
import apiReducer from './apiReducer';
import uiReducer from './uiReducer';

const reducer = combineReducers({
  clusterReducer,
  apiReducer,
  uiReducer
});

export default reducer;
