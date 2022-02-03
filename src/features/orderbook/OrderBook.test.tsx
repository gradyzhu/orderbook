import { render, screen } from '@testing-library/react'
import { rootReducer } from '../../app/store';
import { OrderBook } from './OrderBook';
import { Side } from './Side';
import { createStore } from '@reduxjs/toolkit';
import { WebSockets } from '../../constants/orderbook';
import WS from "jest-websocket-mock";
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

let server: any;

describe('Side', () => {
  it('renders records', () => {
    render(
      <Side
        side="asks"
        recordData={{
          50: { price: 50, size: 25, total: 25 },
          100: { price: 100, size: 130, total: 155 },
        }}
        order={[50, 100]}
        highestTotal={155}
        isMobile={false}
      />
    );

    expect(screen.getByText(/50.00/)).toBeInTheDocument();
    expect(screen.getAllByText(/25/).length).toEqual(2);
    expect(screen.getByText(/100.00/)).toBeInTheDocument();
    expect(screen.getByText(/130/)).toBeInTheDocument();
    expect(screen.getByText(/155/)).toBeInTheDocument();
  });
})

describe('OrderBook', () => {
  const store = createStore(rootReducer, {
    orderbook: {
      status: null,
      asks: {},
      bids: {},
      asksOrder: [],
      bidsOrder: [],
    }
  });

  it("renders records when websocket connects", async () => {
    server = new WS(WebSockets.CRYPTO_FACILITIES);
    render(<Provider store={store}><OrderBook /></Provider>);
    await server.connected

    server.send(JSON.stringify({
      feed: 'book_ui_1',
      product_id: 'PI_XBTUSD',
      bids: [[1, 200]],
      asks: [[3, 400]],
      numLevels: 2,
    }))

    server.send(JSON.stringify({
      feed: 'book_ui_1',
      product_id: 'PI_XBTUSD',
      bids: [[500, 100]],
      asks: [[501, 101]],
    }))

    expect(screen.getByText(/500.00/)).toBeInTheDocument();
    expect(screen.getByText(/501.00/)).toBeInTheDocument();
    expect(screen.getAllByText(/100/).length).toEqual(2);
    expect(screen.getByText(/101/)).toBeInTheDocument();

    WS.clean()
  });

  it("renders loading screen when websocket fails to connect", () => {
    render(<Provider store={store}><OrderBook /></Provider>);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  })

  it("renders alternative feed on toggle click", async () => {
    server = new WS(WebSockets.CRYPTO_FACILITIES);
    render(<Provider store={store}><OrderBook /></Provider>);
    userEvent.click(screen.getByText('Toggle Feed'))

    server.send(JSON.stringify({
      event: 'unsubscribed',
    }));

    server.send(JSON.stringify({
      feed: 'book_ui_1',
      product_id: 'PI_ETHUSD',
      bids: [[1, 200]],
      asks: [[3, 400]],
      numLevels: 2,
    }))

    server.send(JSON.stringify({
      feed: 'book_ui_1',
      product_id: 'PI_ETHUSD',
      bids: [[500, 100]],
      asks: [[501, 101]],
    }))

    expect(screen.getByText(/ETH-USD/)).toBeInTheDocument();
  })
});