// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, NearPromise, initialize } from 'near-sdk-js';
import { AccountId } from "near-sdk-js/lib/types";

const FIVE_TGAS = BigInt("50000000000000");
const NO_DEPOSIT = BigInt(0);
const NO_ARGS = JSON.stringify({});

@NearBindgen({})
class Hospital {
  name = "hospital_1"
  ms_account: AccountId = "hello-nearverse.testnet";
  ms_model_path = "";

  @initialize({})
  init({ ms_account }: { ms_account: AccountId }) {
    this.ms_account = ms_account
  }

  @view({})
  get_hospital_name(): string {
    return this.name;
  }

  @call({})
  query_model_url(): NearPromise {
    const promise = NearPromise.new(this.ms_account)
    .functionCall("get_model_url", NO_ARGS, NO_DEPOSIT, FIVE_TGAS)
    
    return promise;
  }

  @call({}) // This method changes the state, for which it cost gas
  set_model_url({ ms_model_path }: { ms_model_path: string }): void {
    near.log(`Saving greeting ${ms_model_path}`);
    this.ms_model_path = ms_model_path;
  }

  @view({})
  get_model_url(): string {
    return this.ms_model_path;
  }
}