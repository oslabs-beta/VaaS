import { combineReducers } from 'redux';

import clusterReducer from './clusterReducer';
import navBarReducer from './navBarReducer';

const reducer = combineReducers({
  clusterReducer,
  navBarReducer
});

export default reducer;
