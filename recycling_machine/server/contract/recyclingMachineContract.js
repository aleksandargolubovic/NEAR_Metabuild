const nearAPI = require("near-api-js");

// creates keyStore from a provided file
// you will need to pass the location of the .json key pair

const { KeyPair, keyStores } = require("near-api-js");
const fs = require("fs");
const homedir = require("os").homedir();

const ACCOUNT_ID = "recyclingmachine.golubovic.testnet";  // NEAR account tied to the keyPair
const NETWORK_ID = "testnet";
// path to your custom keyPair location (ex. function access key for example account)
const KEY_PATH = '/.near-credentials/testnet/recyclingmachine.golubovic.testnet.json';

const credentials = JSON.parse(fs.readFileSync(homedir + KEY_PATH));
const keyStore = new keyStores.InMemoryKeyStore();
keyStore.setKey(NETWORK_ID, ACCOUNT_ID, KeyPair.fromString(credentials.private_key));


const { connect } = nearAPI;

const config = {
  networkId: "testnet",
  keyStore, // optional if not signing transactions
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

const getContract = async () => {
  const near = await connect(config);
  const account = await near.account("recyclingmachine.golubovic.testnet");

  const contract = new nearAPI.Contract(
    account, // the account object that is connecting
    "recyclingmachine.golubovic.testnet",
    {
      // name of contract you're connecting to
      viewMethods: ["get_stats"], // view methods do not change state but usually return a value
      changeMethods: ["set_donation_address", "payout", "donate"], // change methods modify state
      sender: account, // account object to initialize and sign transactions.
    }
  );
  return contract;
}
module.exports = getContract;
