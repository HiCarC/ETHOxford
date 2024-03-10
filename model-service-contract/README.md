near create-account ox_ms_1.testnet --useFaucet

near deploy hox_ms_1.testnet build/hello_near.wasm

near view ox_ms_1.testnet get_model_url

near call ox_ms_1.testnet set_model_url '{"model_url":"https://global_model.com"}' --accountId ox_ms_1.testnet
