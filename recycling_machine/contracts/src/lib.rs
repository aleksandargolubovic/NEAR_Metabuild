use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{json_types::U128, env, near_bindgen, PanicOnDefault, AccountId, Promise};
use near_sdk::serde::{Serialize};


#[derive(Serialize)]
#[serde( crate = "near_sdk::serde")]
pub struct Stats {
  num_of_payouts: u128,
  total_amount_paid_out: u128,
  num_of_donations: u128,
  total_amount_donated: u128,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct RecyclingMachine {
  owner_id: AccountId,
  num_of_payouts: u128,
  total_amount_paid_out: u128,
  num_of_donations: u128,
  total_amount_donated: u128,
  donation_address: AccountId,
}

#[near_bindgen]
impl RecyclingMachine {
  #[init]
  pub fn new(owner_id: AccountId, donation_address: AccountId) -> Self {
    Self {
      owner_id,
      num_of_payouts: 0,
      total_amount_paid_out: 0,
      num_of_donations: 0,
      total_amount_donated: 0,
      donation_address: donation_address,    
    }
  }

  pub fn set_donation_address(&mut self, donation_address: AccountId) {
    assert_eq!(
      env::predecessor_account_id(),
      self.owner_id,
      "Only the owner can call this method!"
    );
    self.donation_address = donation_address;
  }

  pub fn payout(&mut self, receiver: AccountId, amount: U128) {
    assert_eq!(
      env::predecessor_account_id(),
      self.owner_id,
      "Only the owner can call this method!"
    );
    env::log_str(&format!("amount: {}", amount.0));
    assert!(env::account_balance() >= amount.0, "Insufficient balance!");
    Promise::new(receiver).transfer(amount.0);
  }

  pub fn donate(&mut self, amount: U128) {
    self.num_of_donations += 1;
    self.total_amount_donated += amount.0;
    Promise::new(self.donation_address.clone()).transfer(amount.0);
  }

  pub fn get_stats(&self) -> Stats {
    Stats {
      num_of_payouts: self.num_of_payouts,
      total_amount_paid_out: self.total_amount_paid_out,
      num_of_donations: self.num_of_donations,
      total_amount_donated: self.total_amount_donated,
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use near_sdk::test_utils::{get_logs, VMContextBuilder};
  use near_sdk::{testing_env, AccountId};

  // #[test]
  // fn debug_get_hash() {
  //   testing_env!(VMContextBuilder::new().build());

  //   let debug_solution = "near nomicon ref finance";
  //   let debug_hash_bytes = env::sha256(debug_solution.as_bytes());
  //   let debug_hash_string = hex::encode(debug_hash_bytes);

  //   println!("Let's debug {:?}", debug_hash_string);
  // }

  fn get_context(predecessor: AccountId) -> VMContextBuilder {
    let mut builder = VMContextBuilder::new();
    builder.predecessor_account_id(predecessor);
    builder
  }

  #[test]
  fn check_guess_solution() {
    let alice = AccountId::new_unchecked("alice.testnet".to_string());
    let donation = AccountId::new_unchecked("donation.testnet".to_string());
    let acafaca = AccountId::new_unchecked("acafaca.testnet".to_string());
    let context = get_context(alice.clone());
    testing_env!(context.build());

    let mut recycling_machine = RecyclingMachine::new(alice, donation);
    //println!("Beginning balance: {}", acafaca.)
    recycling_machine.payout(acafaca, 1000_000_000);
    // let mut guess_result = contract.guess_solution("wrong answer here".to_string());
    // assert!(!guess_result, "Expected a failure from the wrong guess!");
    // assert_eq!(get_logs(), ["Try again."], "Expected a failure log.");
    // guess_result = contract.guess_solution("near nomicon ref finance".to_string());
    // assert!(guess_result, "Expected the correct answer to return true");
    // assert_eq!(get_logs(), ["Try again.", "You guessed right!"],
    //   "Expected a successful log after the previous failed log.");
  }
}