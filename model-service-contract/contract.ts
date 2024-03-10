// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view } from 'near-sdk-js';

@NearBindgen({})
class ModelServer {
  model_url: string = "";

  @view({}) // This method is read-only and can be called for free
  get_model_url(): string {
    return this.model_url;
  }

  @call({}) // This method changes the state, for which it cost gas
  set_model_url({ model_url }: { model_url: string }): void {
    near.log(`Saving greeting ${model_url}`);
    this.model_url = model_url;
  }
}