import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { authReducer, userName } from './slices/authSlice';
import { constructorReducer, burgerName } from './slices/constructorSlice';
import { feedReducer, feedName } from './slices/feedSlice';
import { ingredientsReducer } from './slices/ingredientSlice';
import { ordersReducer, userOrderName } from './slices/ordersSlice';

export const rootReducer = combineReducers({
  [userName]: authReducer,
  [burgerName]: constructorReducer,
  [feedName]: feedReducer,
  ingredients: ingredientsReducer,
  [userOrderName]: ordersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
