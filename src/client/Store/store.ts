import { configureStore } from '@reduxjs/toolkit';
import { reducers } from './Reducers';

const store = configureStore({ reducer: reducers });

export default store;
