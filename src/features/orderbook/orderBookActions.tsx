export enum OrderBookActionTypes {
  CLEAR_ORDER_BOOK = 'orderbook/CLEAR_ORDER_BOOK',
  UPDATE_ORDER_BOOK = 'orderbook/UPDATE_ORDER_BOOK',
  SET_INITIAL_STATE = 'orderbook/SET_INITIAL_STATE',
  FILL_ORDER_BOOK_BATCHES = 'orderbook/FILL_ORDER_BOOK_BATCHES',
  CLEAR_ORDER_BOOK_BATCHES = 'orderbook/CLEAR_ORDER_BOOK_BATCHES',
}

export const setInitialState = (asks: any, bids: any) => ({
  type: OrderBookActionTypes.SET_INITIAL_STATE,
  payload: { asks, bids },
})

export const updateOrderBook = (asks: any, bids: any) => ({
  type: OrderBookActionTypes.UPDATE_ORDER_BOOK,
  payload: { asks, bids },
})

export const clearOrderBook = () => ({
  type: OrderBookActionTypes.CLEAR_ORDER_BOOK,
})