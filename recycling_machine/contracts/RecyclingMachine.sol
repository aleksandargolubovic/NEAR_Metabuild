// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract PackagePrices {
  uint256 pet;
  uint256 tetra_pak;
  uint256 glass;
  uint256 aluminium;

  function SetPrices(
    uint256 pet_price,
    uint256 tetra_pak_price,
    uint256 glass_price,
    uint256 aluminium_price) public {

    pet = pet_price;
    tetra_pak = tetra_pak_price;
    glass = glass_price;
    aluminium = aluminium_price;
  }

  function GetPrices() public view returns(
    uint256 _pet, uint256 _tetra_pak, uint256 _glass, uint256 _aluminium) {
      return (pet, tetra_pak, glass, aluminium);
  }
}

contract RecyclingMachine {
    event Paid(address indexed to, address indexed from, uint256 amount);
    AggregatorV3Interface maticUsdPriceFeed = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada);
    AggregatorV3Interface usdtUsdPriceFeed = AggregatorV3Interface(0x92C09849638959196E976289418e5973CC96d645);
    IERC20 USDTContractOnMumbai = IERC20(0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e);
    address owner;
    address payable donationAddress;
    uint256 numOfDonations;
    uint256 totalAmountDonated;
    uint256 numOfPayouts;
    uint256 totalAmountPaidOut;
    
    constructor(address payable donationAddr) {
      owner = msg.sender;
      donationAddress = donationAddr;
      numOfDonations = 0;
      totalAmountDonated = 0;
      numOfPayouts = 0;
      totalAmountPaidOut = 0;
    }
    
    modifier restricted() {
      require(msg.sender == owner);
      _;
    }

    function setDonationAddress(address payable donationAddr) restricted public {
      donationAddress = donationAddr;
    }

    function getDonationAddress() public view returns(address){
      return donationAddress;
    }
    
    function addFunds() public payable {}
    
    function checkMaticBalance() public view returns(uint256) {
      return address(this).balance;
    }

    function checkUsdtBalance() public view returns(uint256) {
      return USDTContractOnMumbai.balanceOf(address(this));
    }
    
    function withdraw() payable restricted public {
      payable(msg.sender).transfer(address(this).balance);
      USDTContractOnMumbai.transfer(payable(msg.sender), USDTContractOnMumbai.balanceOf(address(this)));
    }

    function getMaticUsdPrice() public view returns(uint256) {
      (,int256 answer,,,) = maticUsdPriceFeed.latestRoundData();
      return uint256(answer);
    }

    function getUsdtUsdPrice() public view returns(uint256) {
      (,int256 answer,,,) = usdtUsdPriceFeed.latestRoundData();
      return uint256(answer);
    }
    
    function payOut(address payable receiver, uint256  USCentAmount, bool isStableCoin) payable restricted public {
      uint256 amountInWei;
      if (isStableCoin) {
        amountInWei = USCentAmount * 10**24 / getUsdtUsdPrice();
        USDTContractOnMumbai.transfer(receiver, amountInWei);
      }
      else {
        amountInWei = USCentAmount * 10**24 / getMaticUsdPrice();
        receiver.transfer(amountInWei);
      }
      numOfPayouts++;
      totalAmountPaidOut += USCentAmount;
      emit Paid(receiver, owner, amountInWei);
    }

    function donate(uint256  USCentAmount) payable restricted public {
      uint256 amountInWei = USCentAmount * 10**24 / getMaticUsdPrice();
      donationAddress.transfer(amountInWei);
      numOfDonations++;
      totalAmountDonated += USCentAmount;
      emit Paid(donationAddress, owner, amountInWei);
    }

    function getStatistics() public view returns(
      uint256 _numOfDonations, uint256 _totalAmountDonated, 
      uint256 _numOfPayouts, uint256 _totalAmountPaidOut) {
        return (numOfDonations, totalAmountDonated, numOfPayouts, totalAmountPaidOut);
  }
}
