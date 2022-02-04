import styled from 'styled-components'
import { Order, OrderBookStateData } from './orderBookTypes';
import { commaSeparated } from '../../helpers/numbers';
import { Colors } from '../../constants/orderbook';

interface SideProps {
  side: 'asks' | 'bids';
  recordData: OrderBookStateData;
  order: Order;
  highestTotal: number;
  isMobile: boolean;
}

export const Side = ({
  recordData, order, highestTotal, side, isMobile,
}: SideProps) => {
  const isAsksSide = side === 'asks';

  if (isMobile && isAsksSide) {
    order = order.slice().reverse();
  }

  const rows = order.map((price) => {
    const { size, total } = recordData[price];
    const percent = total / highestTotal * 100;
    const color = isAsksSide
      ? Colors.RED
      : Colors.GREEN;
    const background = isAsksSide
      ? Colors.LIGHT_RED
      : Colors.LIGHT_GREEN;

    const priceTd = (
      <Td color={color}>
        {commaSeparated(price)}
      </Td>
    );
    const totalTd = (
      <Td>
        {total.toLocaleString()}
      </Td>
    )

    return (
      <tr
        key={`${side}-${price}-level`}
        style={{
          display: 'flex',
          height: '18px',
          backgroundImage: `linear-gradient(
            ${isAsksSide || isMobile ? 'to right' :'to left'},
            ${background} ${percent}%,
            ${Colors.DARK_BLUE} ${percent}%
          )`
        }}
      >
        {isAsksSide || isMobile ? priceTd : totalTd}
        <Td>{size.toLocaleString()}</Td>
        {isAsksSide || isMobile ? totalTd : priceTd}
      </tr>
    )
  })

  return (
    <TableWrap isMobile={isMobile}>
      <Table isMobile={isMobile}>
        <tbody>{rows}</tbody>
      </Table>
    </TableWrap>
  )
}

const TableWrap = styled.div<{
  isMobile: boolean;
}>`
  width: 100%;

  ${props => props.isMobile && (`
    height: 100%;
    overflow: scroll;
  `)}
`;

const Table = styled.table<{
  isMobile: boolean;
}>`
  font-size: 14px;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  height: fit-content;

  ${props => props.isMobile && (`
    overflow: scroll;
  `)}
`;

const Td = styled.td<{
  color?: string;
}>`
  color: ${props => props.color || Colors.OFF_WHITE};
  font-family: 'Courier', Courier;
  font-weight: bold;
  padding: 0px 20px;
  text-align: right;
  width: 33%;
`;