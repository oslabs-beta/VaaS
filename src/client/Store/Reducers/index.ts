import { combineReducers } from 'redux';

import clusterReducer from './clusterReducer';
import apiReducer from './apiReducer';
import uiReducer from './uiReducer';
import OFReducer from './OFReducer';
const reducer = combineReducers({
  clusterReducer,
  apiReducer,
  uiReducer,
  OFReducer,
});

export default reducer;
