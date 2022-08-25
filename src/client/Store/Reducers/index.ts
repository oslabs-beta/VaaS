import { combineReducers } from 'redux';

import userReducer from './userReducer';
import navBarReducer from './navBarReducer';

const reducer = combineReducers({
  userReducer,
  navBarReducer
});

export default reducer;
