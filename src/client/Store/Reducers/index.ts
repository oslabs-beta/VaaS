import { combineReducers } from 'redux';

import clusterReducer from './clusterReducer';
import navBarReducer from './navBarReducer';
import apiReducer from './apiReducer';

const reducer = combineReducers({
  clusterReducer,
  navBarReducer,
  apiReducer,
  //uiReducer
});

export default reducer;
