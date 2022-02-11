const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

const polygonProvider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MNEMONIC_PHRASE
  },
  providerOrUrl: process.env.MUMBAI_RPC_URL
});

const web3Polygon = new Web3(polygonProvider);

module.exports = web3Polygon;
