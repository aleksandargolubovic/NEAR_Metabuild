#!/bin/bash

export NEAR_ACCT=recyclingmachine.friend.testnet
export PARENT_ACCT=friend.testnet
near delete $NEAR_ACCT $PARENT_ACCT
near create-account $NEAR_ACCT --masterAccount $PARENT_ACCT
near deploy $NEAR_ACCT --wasmFile res/crypto_recycling_machine.wasm --initFunction new --initArgs '{"owner_id": "'$NEAR_ACCT'", "donation_address": "golubovic.testnet"}'
