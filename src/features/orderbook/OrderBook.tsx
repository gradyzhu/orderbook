import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components'

import { Side } from './Side';
import { Colors, Pairings, BATCH_LIMIT } from '../../constants/orderbook';
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive';
import {
  orderBookStatusSelector,
  orderBookAsksDataSelector,
  orderBookAsksOrderSelector,
  orderBookBidsDataSelector,
  orderBookBidsOrderSelector,
} from './orderBookSelector';
import { WebSockets, MediaQueries } from '../../constants/orderbook';
import {
  setInitialState,
  clearOrderBook,
  updateOrderBook,
} from './orderBookActions';
import { SideHeader } from './SideHeader';
import { Header } from './Header';
import { Spread } from './Spread';
import { ResumeModal } from './ResumeModal';
import { ActionStatus } from './orderBookReducer';
import { unsubscribe, subscribe } from '../../helpers/websocket';

let updateNow = true;
let asksBatch: number[][] = [];
let bidsBatch: number[][] = [];

export const OrderBook = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [isPaused, setIsPaused] = useState(false);
  const [pair, setPair] = useState<Pairings>(Pairings.BTC_USD);
  const status = useSelector(orderBookStatusSelector);
  const asksData = useSelector(orderBookAsksDataSelector);
  const asksOrder = useSelector(orderBookAsksOrderSelector);
  const bidsData = useSelector(orderBookBidsDataSelector);
  const bidsOrder = useSelector(orderBookBidsOrderSelector);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: MediaQueries.MOBILE })

  const batchUpdate = useCallback((a: any, b: any, ms: number) => {
    asksBatch = asksBatch.concat(a);
    bidsBatch = bidsBatch.concat(b);

    if (updateNow) {
      updateNow = false;
      dispatch(updateOrderBook(asksBatch, bidsBatch));
      asksBatch = [];
      bidsBatch = [];
      setTimeout(() => updateNow = true, ms);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearOrderBook());
    const s = new WebSocket(WebSockets.CRYPTO_FACILITIES);
    setSocket(s);
    s.onopen = () => subscribe(s, Pairings.BTC_USD);
    s.onmessage = (payload) => {
      const data = JSON.parse(payload.data);
      if (data.event) return; // handle this
      const { asks, bids } = data;
      data.numLevels
        ? dispatch(setInitialState(asks, bids))
        : batchUpdate(asks, bids, BATCH_LIMIT);
    };

    const disconnectWS = () => {
      s.close();
      setIsPaused(true);
    }

    document.addEventListener('visibilitychange', disconnectWS);

    return () => {
      disconnectWS();
      document.removeEventListener('visibilitychange', disconnectWS);
    }
  }, [batchUpdate, dispatch]);

  const handleOrderbookState = (payload: any) => {
    const data = JSON.parse(payload.data);
    if (data.event) return;
    const { asks, bids } = data;

    data.numLevels
      ? dispatch(setInitialState(asks, bids))
      : batchUpdate(asks, bids, BATCH_LIMIT);
  }

  const handleToggleFeed = () => {
    if (!socket) return;

    const nextPair = pair === Pairings.BTC_USD 
      ? Pairings.ETH_USD
      : Pairings.BTC_USD;

    unsubscribe(socket, pair);

    socket.onmessage = (payload) => {
      const { event } = JSON.parse(payload.data);
      if (event === 'unsubscribed') {
        dispatch(clearOrderBook());

        asksBatch = [];
        bidsBatch = [];

        subscribe(socket, nextPair)

        socket.onmessage = handleOrderbookState;
        setPair(nextPair);
      }
    }
  }

  const isDataAvail = asksOrder.length && bidsOrder.length;
  const highestAsk = asksData[asksOrder[asksOrder.length-1]];
  const lowestBid = bidsData[bidsOrder[bidsOrder.length-1]];
  const highestTotal = isDataAvail && (Math.max(highestAsk.total, lowestBid.total) || 0);

  const handleResume = () => {
    dispatch(clearOrderBook());
    const s = new WebSocket(WebSockets.CRYPTO_FACILITIES);
    s.onopen = () => subscribe(s, pair);
    s.onmessage = handleOrderbookState;
    setIsPaused(false);
  }

  return (
    <>
      {isPaused && <ResumeModal handleResume={handleResume} />}
      <OrderBookContainer>
        <Header
          pair={pair}
          isMobile={isMobile}
        />
        <div>
          <SideHeader />
            <SidesContainer isMobile={isMobile}>
              {!status || status === ActionStatus.BUSY
                ? <Paragraph center>
                    Loading...
                  </Paragraph>
                : <>
                    <Side
                      side="bids"
                      order={bidsOrder} 
                      recordData={bidsData}
                      highestTotal={highestTotal}
                      isMobile={isMobile}
                    />
                    {isMobile && (
                      <BreakContainer>
                        <Spread />
                      </BreakContainer>
                    )}
                    <Side
                      side="asks"
                      order={asksOrder}
                      recordData={asksData}
                      highestTotal={highestTotal}
                      isMobile={isMobile}
                    />
                  </>
              }
            </SidesContainer>
        </div>
        <Button onClick={handleToggleFeed}>
          Toggle Feed
        </Button>
      </OrderBookContainer>
    </>
  )
}

const BreakContainer = styled.div<{
  justifyContent?: string,
  alignItems?: string,
}>`
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5px;
  border-top: 1px solid ${Colors.LIGHT_GRAY};
  border-bottom: 1px solid ${Colors.LIGHT_GRAY};
`;

const OrderBookContainer = styled.div`
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const SidesContainer = styled.div<{
  isMobile: boolean;
}>`
  display: -webkit-flex;
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden !important;
  border-bottom: 1px solid ${Colors.LIGHT_GRAY};

  ${props => props.isMobile && (`
    flex-direction: column-reverse;
    justify-content: center;
    overflow: hidden;
  `)}
`;

export const Button = styled.button`
  color: ${Colors.WHITE};
  background: ${Colors.PURPLE};
  border-radius: 4px;
  padding: 8px 20px;
  margin-top: 20px;
  border: none;
  font-weight: 800;
  cursor: pointer;
`;

export const Paragraph = styled.p<{
  bold?: boolean;
  center?: boolean;
  color?: string;
}>`
  color: ${props => props.color || Colors.WHITE};
  margin: 0;
  font-size: 14px;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};

  ${props => props.center && `
    align-self: center;
    text-align: center;
    width: 100%;
  `}
`;