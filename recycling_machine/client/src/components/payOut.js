import React, { useContext, useState, useEffect } from 'react'
import QrReader from 'react-qr-reader'
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Container, Row, Card, Spinner } from 'react-bootstrap'
import AppContext from '../appContext';
import { useParams, useNavigate } from 'react-router-dom'

const addressRegex = /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/;
///0x[a-fA-F0-9]{40}/; 
const States = {
  BEGIN: 'begin',
  ADDRESS_READ: 'addressRead',
  PAYING_OUT: 'payingOut',
  END_FAILURE: 'endFailure',
  END: 'end',
};
const defaultState = States.BEGIN;

const PayOut = () => {
  let navigate = useNavigate();
  const { currentBalance } = useContext(AppContext);
  const [currentState, setCurrentState] = useState(defaultState);
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const { paymentOption } = useParams();
  const [tokenBalance, setTokenBalance] = useState(0);

  const calculateTokenBalance = async () => {
    console.log("Params ", paymentOption);
    let price;
    // if (paymentOption === 'stableCoin')
    //   price = await axios.get("/api/getUsdtUsdPrice");
    // else
    price = await axios.get("/api/getNEARUsdPrice");
    console.log(price.data);
    setTokenBalance((currentBalance / 100) / (price.data));
  }

  useEffect(() => {
    calculateTokenBalance();
  }, []);

  const handleScan = data => {
    if (data) {
      let address = data.match(addressRegex);
      let result = address ? address[0] : "Invalid address";
      setResult(result);
      setCurrentState(States.ADDRESS_READ);
      console.log(result);
    }
  }

  const handleError = err => {
    console.error(err);
  }

  const resetState = () => {
    setCurrentState(States.BEGIN);
    setResult('result');
  }

  let payout = async () => {
    setCurrentState(States.PAYING_OUT);
    try {
      let isStableCoin = paymentOption === 'stableCoin' ? true : false;
      let msg = await axios.post("/api/payOut", {
        receiver: result,
        isStableCoin: isStableCoin
      });
      console.log(msg.data);
      setMessage(msg.data);
      const newState = msg.data.includes("Payment failed") ? States.END_FAILURE : States.END;
      setCurrentState(newState);
    } catch (error) {
      console.log(error.message);
      setCurrentState(States.END_FAILURE);
    }
  }

  const amountInformation = () => {
    return (
      <div>
        <h2>Total amount to receive on NEAR network</h2>
        <Card className='amount' style={{ width: 'fit-content' }}>
          <Card.Body className='cardBody'>
            <h3> {tokenBalance.toFixed(8)} {paymentOption === 'stableCoin' ? 'USDT' : 'NEAR'} </h3>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const renderStates = () => {
    switch (currentState) {
      case States.BEGIN: return (
        <center>
          {amountInformation()}
          <Container>
            <Row className='row'>
              <h5>Please scan your QR code address</h5>
            </Row>
            <Row>
              <Card className='addressReaderCard'>
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: '100%' }}
                  facingMode={"front"}
                />
              </Card>
            </Row>
            <Row>
              <Button className='back-button' onClick={() => navigate(-1)}><h4>&#10094; Back</h4></Button>
            </Row>
          </Container>
        </center>
      );
      case States.ADDRESS_READ: return (
        <center>
          {amountInformation()}
          <Container>
            <Row>
              <h5>Your account id:</h5>
            </Row>
            <Row>
              <Card className='amount' style={{ width: 'fit-content' }}>
                <Card.Body className='cardBody'>
                  <h5> {result} </h5>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              {
                result !== "Invalid address" ?
                  <span>
                    <Button className='button' onClick={payout}><h3>Confirm</h3></Button> &nbsp;&nbsp;
                  </span>
                  :
                  null
              }
              <Button className='button' onClick={resetState}><h3>Scan again</h3></Button>
            </Row>
          </Container>
        </center>

      );
      case States.PAYING_OUT: return (
        <div className='center'>
          <h4>Paying out...</h4>
          <Spinner animation="border" />
        </div>
      );
      case States.END_FAILURE: return (
        <div className='center'>
          <h4>{message}</h4>
          <Button className='button' onClick={resetState}>
            <h3>Try again!</h3>
          </Button>
        </div>
      );
      case States.END: return (
        <div className='center'>
          <h4>{message}</h4>
          <Button className='button' onClick={() => {
            navigate("/");
          }}>
            <h3>Recycle again!</h3>
          </Button>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div>
      {renderStates()}
    </div>
  )
}

export default PayOut;
