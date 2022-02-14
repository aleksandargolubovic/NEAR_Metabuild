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
  });

  app.post('/donate', async (req, res) => {
    let recyclingMachineContract = await getContract();
    if (!recyclingMachineContract) {
      res.send("Network error");
      return;
    }
    console.log("Adding donation:", getCurrentBalance(), "[cents]");
    const tokenPrice = await getNEARUSDPrice();
    const amount = getCurrentBalance() / tokenPrice / 100;
    const nearAmount = utils.format.parseNearAmount(amount.toString());
    console.log("Near amount: ", nearAmount);
    try {
      let ret = await recyclingMachineContract.donate({
        args: {
          amount: nearAmount,
        },
        gas: "300000000000000",
      });
      console.log(ret);
      console.log("Donation completed successfully");
      res.send("Thank you for your donation!");
      restartSession();
    } catch (err) {
      console.log(err.message);
      res.send("Donation failed, try again!");
    }
  });
}
