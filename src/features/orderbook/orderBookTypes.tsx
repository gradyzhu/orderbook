import { ActionStatus } from './orderBookReducer';

export interface OrderBookState {
  status: ActionStatus | null;
  asks: OrderBookStateData;
  bids: OrderBookStateData;
  asksOrder: Order;
  bidsOrder: Order;
  // asksBatch: OrderData[];
  // bidsBatch: OrderData[];
}

export type OrderBookStateData = Record<Price, RecordData>
export type Price = number;
export type Size = number;
export type RecordData = Record<'total'|'price'|'size', number>
export type Order = Price[];
export type OrderData = [Price, Size];