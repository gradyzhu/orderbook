import styled from 'styled-components'
import { Paragraph, Button } from './OrderBook';
import { Colors } from '../../constants/orderbook';

interface ResumeModalProps {
  handleResume: () => void;
}

export const ResumeModal = ({
  handleResume,
}: ResumeModalProps) => {
  return (
    <ModalContainer>
      <Modal>
        <Paragraph>You switched to a different tab silly.</Paragraph>
        <Button onClick={handleResume}>Resume</Button>
      </Modal>
    </ModalContainer>
  )
}

const Modal = styled.div`
  padding: 20px 40px;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  background: #0C1323;
  color: white;
  height: 100px;
  border-radius: 8px;
  flex-direction: column;
  border: 1px solid ${Colors.LIGHT_GRAY};
`
const ModalContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  background: ${Colors.DIM};
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`