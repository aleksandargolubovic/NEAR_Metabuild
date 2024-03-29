# Crypto Recycling Machine - NEAR Metabuild Hackathon

<div align="center">
    <img src = "img.jpeg" width = "800px"/>
</div>

## Crypto Recycling Machine Overview
Crypto Recycling Machine is a project developed for Near Metabuild Hackathon. It gives an opportunity to recycle different kinds of bottles and get paid in crypto currency.

The project consists of two units:
* ### Recycling Machine Emulator

A service running on Raspberry Pi which uses a breadboard, some LEDs and buttons to simulate inserting the bottle into the recycling machine. Each button on the breadboard represents an inserting different kind of bottle: aluminium cans, glass bottles, tetra pak, or PET.

* ### Recycling Machine server and client

Used for user interaction with the machine and interaction between the recycling machine and smart contracts on Near network. The Recycling Machine supports payments on NEAR testnet network in $NEAR tokens. There is also an option to donate the money.

## Technologies
* React
* Node.js
* Rust
* Docker

## Project developed with
* near-sdk
* near-api-js

## Quick start

## Prerequisites
* [Node 12+](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/)
* [Rust and near-cli](https://www.near-sdk.io/zero-to-hero/basics/set-up-skeleton)
* Raspberry Pi 3B/3B+/4B, breadboard, LEDs, buttons (if not available, see [the option without Raspberry Pi](https://github.com/aleksandargolubovic/NEAR_Metabuild/tree/main/recycling_machine_emulator#option-without-a-raspberry-pi))
* Docker

## Recommendations for client side of the app
* The application is optimised for display with 16:10 ratio
* Recommendation is to run it with Chrome browser
* Since QR scanner is using camera, it needs to be [enabled in Chrome for (Local) Unsecure Origins](https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339)

## Initial Setup

### Build and deploy smart contract
* Go to /recycling_machine/contracts and run build.sh
* Open /recycling_machine/contracts/deploy_and_init.sh and set preferred values of NEAR_ACCT and PARENT_ACCT account ids
* Run deploy_and_init.sh script
* Go to /recycling_machine/server and create .env file (please see .env.example for reference). Set proper ACCOUNT_ID and PRIVATE_KEY information.

## How to run

Recycling machine services and Raspberry Pi emulator should be run in the same local network (It's not mandatory, but it makes life much easier).
First we need to start recycling machine services, and then the emulator, which needs to know the IP address of the server.

- To start the recycling machine services, go to /recycling_machine directory and run the following:
```bash
docker-compose build
docker-compose up
```
- After the docker containers are built and started, there should be two services running: a frontend service on http://localhost:3050/ and backend service on http://localhost:3050/api/
- Then we need to start an emulator on Raspberry Pi. It's recommended to use Ubuntu Server OS for Raspberry Pi.
- Copy the source from recycling_machine_emulator to your Raspberry Pi.
- Find an IP address of the host which runs backend service.
- run
```bash
yarn
yarn start [backend-service-ip-address]:3050/api
```
- That's it! All the services should be up and running!

## Demo


## Future work/TODO
Implement a back office app, which will be used to manage the recycling machine contracts. It will allow administrator to deploy a new Recycling Machine contracts, manage existing ones and follow theirs statistics. For example, admin could see the balance, total amount donated, number of payouts, etc.
