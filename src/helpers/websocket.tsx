import { Pairings } from '../constants/orderbook';

export const subscribe = (socket: WebSocket, p: Pairings) => {
  socket.send(JSON.stringify({
    event: 'subscribe',
    feed:'book_ui_1',
    product_ids:[p],
  }))
}

export const unsubscribe = (socket: WebSocket, p: Pairings) => {
  socket.send(JSON.stringify({
    event: 'unsubscribe',
    feed:'book_ui_1',
    product_ids:[p],
  }))
}