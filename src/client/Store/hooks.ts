import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// invoke action to change state
export const useAppDispatch: () => AppDispatch = useDispatch;
// access the state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
