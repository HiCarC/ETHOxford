// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, initialize, NearPromise } from 'near-sdk-js';
import { AccountId } from "near-sdk-js/lib/types";

const FIVE_TGAS = BigInt("50000000000000");
const NO_DEPOSIT = BigInt(0);
const NO_ARGS = JSON.stringify({});

@NearBindgen({})
class Patient {
  ho_account: AccountId = "hello-nearverse.testnet";

  @initialize({})
  init({ ho_account }: { ho_account: AccountId }) {
    this.ho_account = ho_account
  }

  @call({})
  query_hospital_model_url(): NearPromise {
    const promise = NearPromise.new(this.ho_account)
    .functionCall("get_model_url", NO_ARGS, NO_DEPOSIT, FIVE_TGAS)
    
    return promise.asReturn();
  }
}