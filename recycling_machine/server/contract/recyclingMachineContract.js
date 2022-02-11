const web3 = require("./web3");
const RecyclingMachine = require("./abi/RecyclingMachine.json");

const recyclingMachinePolygon = new web3.eth.Contract(
  RecyclingMachine.abi,
  process.env.MUMBAI_CONTRACT_ADDRESS
);

module.exports = recyclingMachinePolygon;
