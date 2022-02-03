import React from 'react';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { Colors, MediaQueries } from '../../constants/orderbook';

export const SideHeader = () => {
  let headers = ['Price', 'Size', 'Total'];
  const isMobile = useMediaQuery({ query: MediaQueries.MOBILE })
  const headerComponents = headers.map((header, idx) => (
    <Td key={`${header}-${idx}`}>{header}</Td>
  ));

  return (
    <SideTable>
      <thead>
        <tr>
          {
            isMobile 
              ? headerComponents
              : headerComponents.slice().reverse()
          }
          {!isMobile && headerComponents}
        </tr>
      </thead>
    </SideTable>
  );
}

const SideTable = styled.table`
  font-size: 14px;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  height: fit-content;
`;

const Td = styled.td`
  color: ${Colors.OFF_WHITE};
  text-align: right;
  text-transform: uppercase;
  border-bottom: 1px solid ${Colors.LIGHT_GRAY};
  padding: 5px 30px;
`
