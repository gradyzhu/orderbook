
import produce from 'immer';
import * as _ from 'lodash';
import { OrderBookState } from './orderBookTypes';
import { OrderBookActionTypes } from './orderBookActions'

type Action = {
  type: string;
  payload?: any;
}

export enum ActionStatus {
  BUSY = 'busy',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export const initialState: OrderBookState = {
  status: null,
  asks: {},
  bids: {},
  asksOrder: [],
  bidsOrder: [],
};

export type OrderBookData = [number, number];
export type Order = number[];

export const orderBookReducer = produce((
  state: OrderBookState = initialState, action: Action
) => {
  switch (action.type) {
    case OrderBookActionTypes.CLEAR_ORDER_BOOK:
      return initialState;
    case OrderBookActionTypes.SET_INITIAL_STATE:
      state.status = ActionStatus.BUSY;

      for (let key in action.payload) {
        let total = 0;
        const payloadData = action.payload[key];
        const isAsks = key === 'asks';
        const recordsKey = isAsks ? 'asks' : 'bids';
        const orderKey = isAsks? 'asksOrder' : 'bidsOrder';

        if (!payloadData.length) continue;

        payloadData.forEach((datum: OrderBookData) => {
          const [price, size] = datum;
          state[orderKey].push(price);
          total += size;
          state[recordsKey][price] = { price, size, total };
        })
      }
      break;
    case OrderBookActionTypes.UPDATE_ORDER_BOOK:
      for (let key in action.payload) {
        const payloadData = action.payload[key];
        const isAsks = key === 'asks';
        const recordsKey = isAsks ? 'asks' : 'bids';
        const orderKey = isAsks ? 'asksOrder' : 'bidsOrder';

        if (!payloadData.length) continue;

        payloadData.forEach((datum: OrderBookData) => {
          const [price, size] = datum;
          const data = state[recordsKey];
          let order = state[orderKey];
          const sortFunc = (n: number) => isAsks ? n : -n;
          const idx = _.sortedIndexBy(order, price, sortFunc);

          // ignore prices with size zero that we don't already know about
          if (size === 0 && !(price in data)) return;

          // handle removal of price from state
          if (size === 0) {
            // update all subsequent prices in data set
            for (let i = idx+1; i < order.length; i++) {
              const total = data[order[i]].total - data[price].size;
              _.set(state, [key, order[i], 'total'], total);
            }
            // remove object from state, remove price from order
            _.unset(state, [key, price]);
            _.pull(state[orderKey], price);
          } else {
            // if new price insert it into order
            if (!(price in data)) {
              const left = _.slice(order, 0, idx);
              const right = _.slice(order, idx, order.length);
              order = _.concat(left, price, right);
            }
            // calculate and set total for price
            const prevTotal = idx === 0 ? 0 : data[order[idx-1]].total;
            let total = prevTotal + size;
            _.set(state, [key, price], { price, size, total });

            // update all subsequent prices in data set
            for (let i = idx+1; i < order.length; i++) {
              total += data[order[i]].size;
              _.set(state, [key, order[i], 'total'], total);
            }

            state[orderKey] = order;
          }
        });
      }
      state.status = ActionStatus.SUCCESS;
      break;
    default:
      return state;
  }
}, initialState)