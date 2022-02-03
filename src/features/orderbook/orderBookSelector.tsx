import { ReduxState } from '../../app/store';

export const orderBookStatusSelector = (state: ReduxState) =>
  state.orderbook.status;
export const orderBookAsksDataSelector = (state: ReduxState) =>
  state.orderbook.asks;
export const orderBookAsksOrderSelector = (state: ReduxState) =>
  state.orderbook.asksOrder;
export const orderBookBidsDataSelector = (state: ReduxState) =>
  state.orderbook.bids;
export const orderBookBidsOrderSelector = (state: ReduxState) =>
  state.orderbook.bidsOrder;
