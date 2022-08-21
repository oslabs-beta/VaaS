import { combineReducers } from 'redux';

import appReducer from './appReducer';
import navBarReducer from './navBarReducer'

const reducer = combineReducers({
  appReducer,
  navBarReducer
});

export default reducer;
