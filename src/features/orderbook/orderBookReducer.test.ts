import { orderBookReducer } from './orderBookReducer';
import { ActionStatus } from './orderBookReducer';
import {
  setInitialState,
  updateOrderBook,
  clearOrderBook,
} from './orderBookActions';

it('should handle SET_INITIAL_STATE', () => {
  const prevState = {
    status: null,
    asks: {},
    bids: {},
    asksOrder: [],
    bidsOrder: [],
  }
  const asks = [[1, 50], [2, 100], [3, 150]];
  const bids = [[3, 50], [2, 100], [1, 150]];

  expect(orderBookReducer(prevState, setInitialState(asks, bids))).toEqual({
    status: ActionStatus.BUSY,
    asks: {
      1: { price: 1, size: 50, total: 50 },
      2: { price: 2, size: 100, total: 150 },
      3: { price: 3, size: 150, total: 300 },
    },
    bids: {
      3: { price: 3, size: 50, total: 50 },
      2: { price: 2, size: 100, total: 150 },
      1: { price: 1, size: 150, total: 300 },
    },
    asksOrder: [1, 2, 3],
    bidsOrder: [3, 2, 1],
  })
})

it('should handle UPDATE_ORDER_BOOK', () => {
  const prevState = {
    status: ActionStatus.BUSY,
    asks: {
      1: { price: 1, size: 100, total: 100 },
      3: { price: 3, size: 200, total: 300 },
    },
    bids: {
      3: { price: 3, size: 200, total: 200 },
      1: { price: 1, size: 100, total: 300 },
    },
    asksOrder: [1,3],
    bidsOrder: [3,1],
  }
  const asks = [[2, 50]];
  const bids = [[2, 50]];

  expect(orderBookReducer(prevState, updateOrderBook(asks, bids))).toEqual({
    status: ActionStatus.SUCCESS,
    asks: {
      1: { price: 1, size: 100, total: 100 },
      2: { price: 2, size: 50, total: 150 },
      3: { price: 3, size: 200, total: 350 },
    },
    bids: {
      3: { price: 3, size: 200, total: 200 },
      2: { price: 2, size: 50, total: 250 },
      1: { price: 1, size: 100, total: 350 },
    },
    asksOrder: [1, 2, 3],
    bidsOrder: [3, 2, 1],
  })
})

it('should handle CLEAR_ORDER_BOOK', () => {
  const prevState = {
    status: ActionStatus.SUCCESS,
    asks: {
      1: { price: 1, size: 100, total: 100 },
      3: { price: 3, size: 200, total: 300 },
    },
    bids: {
      3: { price: 3, size: 200, total: 200 },
      1: { price: 1, size: 100, total: 300 },
    },
    asksOrder: [1,3],
    bidsOrder: [3,1],
  }

  expect(orderBookReducer(prevState, clearOrderBook())).toEqual({
    status: null,
    asks: {},
    bids: {},
    asksOrder: [],
    bidsOrder: [],
  })
})