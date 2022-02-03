import React from 'react';
import styled from 'styled-components'
import { Pairings, Colors } from '../../constants/orderbook';
import { Spread } from './Spread';
import { Paragraph } from './OrderBook';

interface HeaderProps {
  pair: Pairings;
  isMobile?: boolean;
}

export const Header = ({
  pair, isMobile = false,
}: HeaderProps) => {
  const humanReadable = (p: Pairings) => p === Pairings.BTC_USD ? 'BTC-USD' : 'ETH-USD';

  return (
    <OrderBookHeaderWrap>
      <OrderBookHeader>
        {<Paragraph bold>Order Book&nbsp;</Paragraph>}
        {!isMobile && <Spread />}
        {<Paragraph bold>{humanReadable(pair)}</Paragraph>}
      </OrderBookHeader>
    </OrderBookHeaderWrap>
  )
}

const OrderBookHeaderWrap = styled.div`
  display: -webkit-flex;
  width: 100%;
  border-top: 1px solid ${Colors.GRAY};
  border-bottom: 1px solid ${Colors.GRAY};
`
const OrderBookHeader = styled.div`
  display: -webkit-flex;
  justify-content: space-between;
  padding: 8px 15px;
  width: 100%;
`