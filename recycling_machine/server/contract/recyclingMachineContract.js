const nearAPI = require("near-api-js");
require('dotenv').config();
// creates keyStore from an environment variable

const { keyStores, KeyPair } = nearAPI;
const keyStore = new keyStores.InMemoryKeyStore();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// creates a public / private key pair using the provided private key
const keyPair = KeyPair.fromString(PRIVATE_KEY);
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const NETWORK_ID = process.env.NETWORK_ID;
const CONTRACT_ID = ACCOUNT_ID;

keyStore.setKey(NETWORK_ID, ACCOUNT_ID, keyPair);

const { connect } = nearAPI;

const config = {
  networkId: NETWORK_ID,
  keyStore,
  nodeUrl: process.env.NODE_URL,
  walletUrl: process.env.WALLET_URL,
  helperUrl: process.env.HELPER_URL,
  explorerUrl: process.env.EXPLORER_URL,
};

const getContract = async () => {
  const near = await connect(config);
  const account = await near.account(ACCOUNT_ID);

  const contract = new nearAPI.Contract(
    account,
    CONTRACT_ID,
    {
      viewMethods: ["get_stats"],
      changeMethods: ["set_donation_address", "payout", "donate"],
      sender: account, // account object to initialize and sign transactions.
    }
  );
  return contract;
}
module.exports = getContract;
