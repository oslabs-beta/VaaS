import { combineReducers } from 'redux';

import clusterReducer from './clusterReducer';
import apiReducer from './apiReducer';
import uiReducer from './uiReducer';
import OFReducer from './OFReducer';
import authReducer from './OAuthReducer';

const reducer = combineReducers({
  clusterReducer,
  apiReducer,
  uiReducer,
  OFReducer,
  authReducer,
});

export default reducer;
