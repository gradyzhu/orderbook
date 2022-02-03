import { combineReducers, createStore } from '@reduxjs/toolkit';
import { orderBookReducer } from '../features/orderbook/orderBookReducer';
import { OrderBookState } from '../features/orderbook/orderBookTypes';
import { composeWithDevTools } from 'redux-devtools-extension';
import { initialState as orderBookIntState } from '../features/orderbook/orderBookReducer';

const initialState = {
  orderbook: orderBookIntState,
}

export type ReduxState = {
  orderbook: OrderBookState;
}

export const rootReducer = combineReducers({
  orderbook: orderBookReducer,
})

export const store = createStore(rootReducer, initialState, composeWithDevTools())

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;