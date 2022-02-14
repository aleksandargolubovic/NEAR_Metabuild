const { utils } = require("near-api-js");
const axios = require('axios');
const getContract = require('../contract/recyclingMachineContract');
const {getCurrentBalance, restartSession} = require('./bottlesReceiver');


getNEARUSDPrice = async () => {
  console.log("Getting NEARUSD price...");
  try {
    response = await axios.get('https://api.binance.com/api/v3/ticker/price\?symbol\=NEARUSDT');
    console.log(response.data.price);
    return(response.data.price);
  } catch (error) {
    console.error(error);
  }
  return 0;
}

module.exports = function (app) {

  app.get('/getNEARUsdPrice', async (req, res) => {
    tokenPrice = await getNEARUSDPrice();
    res.send(tokenPrice);
  });

  app.post('/payOut', async (req, res) => {
    console.log("Payout...", getCurrentBalance());
    let recyclingMachineContract = await getContract();
    if (!recyclingMachineContract) {
      res.send("Network error");
      return;
    }
    const tokenPrice = await getNEARUSDPrice();
    const amount = getCurrentBalance() / tokenPrice / 100;
    const nearAmount = utils.format.parseNearAmount(amount.toString());
    console.log("Near amount: ", nearAmount);
    try {
      let ret = await recyclingMachineContract.payout({
        args: {
          receiver: req.body.receiver,
          amount: nearAmount,
        },
        gas: "300000000000000",
      });
      console.log(ret);
      console.log("Payment completed successfully");
      res.send("Payment completed successfully!");
      restartSession();
    } catch (err) {
      console.log(err.message);
      res.send("Payment failed, try again!");
    }
    


  //   const accounts = await web3.eth.getAccounts();
  //   try {
  //     let ret = await recyclingMachineContract.methods.payOut(req.body.receiver, getCurrentBalance(), req.body.isStableCoin).send({
  //       from: accounts[0],
  //       gas: '1000000',
  //     });
  //     console.log(ret);
  //     console.log("Payment completed successfully");
  //     res.send("Payment completed successfully!");
  //     restartSession();
  //   } catch (err) {
  //     console.log(err.message);
  //     res.send("Payment failed, try again!");
  //   }
  });

  // app.post('/donate', async (req, res) => {
  //   const accounts = await web3.eth.getAccounts();
  //   console.log("Adding donation:", getCurrentBalance(), "[cents]");
  //   try {
  //     await recyclingMachineContract.methods.donate(getCurrentBalance()).send({
  //       from: accounts[0],
  //       gas: '1000000'
  //     });
  //     console.log("Donation completed successfully");
  //     res.send("Thank you for your donation!");
  //     restartSession();
  //   } catch (err) {
  //     console.log(err.message);
  //     res.send("Donation failed, try again!");
  //   }
  // });
}
