//const web3 = require('../contract/web3');
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

  // app.post('/addFunds', async (req, res) => {
  //   if (!web3 || !recyclingMachineContract) {
  //     res.send("Network error");
  //     return;
  //   }
  //   const accounts = await web3.eth.getAccounts();
  //   const amount = req.body.amount;
  //   console.log("Attempting to send", amount, "[wei] from account", accounts[0]);
  //   try {
  //     await recyclingMachineContract.methods.addFunds().send({
  //       from: accounts[0],
  //       value: amount,
  //       gas: '1000000'
  //     });
  //     res.send("Success!");
  //   } catch (err) {
  //     console.log(err.message);
  //     res.send(err.message);
  //   }
  // });

  // app.get('/checkMaticBalance', async (req, res) => {
  //   if (!recyclingMachineContract) {
  //     res.send("Network error");
  //     return;
  //   }
  //   console.log("Checking MATIC balance!");
  //   const balance = await recyclingMachineContract.methods.checkMaticBalance().call();
  //   console.log("Balance:", balance);
  //   res.send(balance);
  // });

  // app.get('/checkUsdtBalance', async (req, res) => {
  //   if (!recyclingMachineContract) {
  //     res.send("Network error");
  //     return;
  //   }
  //   console.log("Checking USDT balance!");
  //   const balance = await recyclingMachineContract.methods.checkUsdtBalance().call();
  //   console.log("Balance:", balance);
  //   res.send(balance);
  // });

  // app.post('/withdraw', async (req, res) => {
  //   if (!web3 || !recyclingMachineContract) {
  //     res.send("Network error");
  //     return;
  //   }
  //   const accounts = await web3.eth.getAccounts();
  //   try {
  //     await recyclingMachineContract.methods.withdraw().send({
  //       from: accounts[0],
  //       gas: '1000000',
  //     });
  //     res.send("Success!");
  //   } catch (err) {
  //     console.log(err.message);
  //     res.send(err.message);
  //   }
  // });

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
