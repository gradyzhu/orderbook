import { useSelector } from 'react-redux'
import {
  orderBookAsksDataSelector,
  orderBookAsksOrderSelector,
  orderBookBidsDataSelector,
  orderBookBidsOrderSelector,
} from './orderBookSelector';
import { Paragraph } from './OrderBook';
import { Colors } from '../../constants/orderbook';

export const Spread = () => {
  const asksData = useSelector(orderBookAsksDataSelector);
  const asksOrder = useSelector(orderBookAsksOrderSelector);
  const bidsData = useSelector(orderBookBidsDataSelector);
  const bidsOrder = useSelector(orderBookBidsOrderSelector);

  const isDataAvail = asksOrder.length && bidsOrder.length;
  const lowestAsk = asksData[asksOrder[0]];
  const highestBid = bidsData[bidsOrder[0]];
  const spread = isDataAvail && (lowestAsk.price - highestBid.price)
  const percentage = spread && (spread / lowestAsk.price * 100).toFixed(3);

  return (
    <Paragraph color={Colors.OFF_WHITE} bold>
      Spread:&nbsp;
      {spread.toFixed(1)}&nbsp;
      ({percentage}%)
    </Paragraph>
  )
}