const web3 = require("./web3");
const PackagePrices = require("./abi/PackagePrices.json");

const packagePricesPolygon = new web3.eth.Contract(
  PackagePrices.abi,
  process.env.MUMBAI_PACKAGE_PRICES_ADDRESS
);

module.exports = packagePricesPolygon;
