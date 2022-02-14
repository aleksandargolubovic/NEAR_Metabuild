import React, { useContext } from 'react'
import { Container, Row, Card, Button } from 'react-bootstrap'
import AppContext from '../appContext';
import { useNavigate } from "react-router-dom";

import near from '../img/near-protocol-near-logo.svg';
import donate from '../img/donation-logo.svg';

import "./payout.css"

const PayoutOptions = () => {
  const { currentBalance } = useContext(AppContext);
  let navigate = useNavigate();

  return (
    <div>
      <center>
        <h2>Total amount to receive</h2>
        <Card className='amount'>
          <Card.Body className='cardBody'>
            <h3>{currentBalance / 100} $</h3>
          </Card.Body>
        </Card>
      </center>
      <Container>
        <Row className='row'>
          <h5>Please choose a payment option</h5>
        </Row>
        <Row>
          <Card style={{ cursor: "pointer", backgroundColor: '#000000' }}
            onClick={() => { navigate("/payout/near"); }}>
            <Card.Body className='cardBody'>
              <Card.Img src={near} />
            </Card.Body>
          </Card>

          <Card style={{ cursor: "pointer", backgroundColor: '#ffc61b' }}
            onClick={() => { navigate("/donate"); }}>
            <Card.Body className='cardBody'>
              <Card.Img src={donate} />
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <Button className='back-button' onClick={() => navigate(-1)}><h4>&#10094; Back</h4></Button>
        </Row>
      </Container>
    </div>
  );
}

export default PayoutOptions;
