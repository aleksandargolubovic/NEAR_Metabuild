let sessionActive = false;
let bottleStatus = {};

const bottlePrices = {
  pet: 10,
  tetra_pak: 5,
  glass: 6,
  aluminium: 15,
}

let currentBalance = 0;

const setBottlePrice = (bottleType, price) => {
  if (sessionActive) {
    console.log("Session started");
    return;
  }
  if (bottlePrices[bottleType] == undefined) {
    console.error("Unknown bottle type");
    return;
  }
  bottlePrices[bottleType] = price;
  console.log("A new price set: ", price, " for ", bottleType, " bottles");
}

const restartSession = () => {
  console.log("session restart")
  sessionActive = true;
  currentBalance = 0;
  bottleStatus = {
    pet: 0,
    tetra_pak: 0,
    glass: 0,
    aluminium: 0,
    lastInserted: ""
  };
}

const insertBottle = (bottleType) => {
  if (!sessionActive) {
    console.log("Session not started");
    return;
  }

  if (bottleStatus[bottleType] != undefined) {
    bottleStatus[bottleType] = bottleStatus[bottleType] + 1;
    currentBalance += bottlePrices[bottleType];
    bottleStatus["lastInserted"] = bottleType;
    console.log(getAll());
    console.log("Inserted:", bottleType, ", currentBalance: ", currentBalance);
  }
}

const getAll = () => {
  return JSON.stringify({...bottleStatus, currentBalance});
}

const getCurrentBalance = () => {
  return currentBalance;
}

module.exports = {restartSession, insertBottle, getAll, getCurrentBalance};