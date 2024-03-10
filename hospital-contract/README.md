near create-account ox_ho_1_10.testnet --useFaucet

near deploy ox_ho_1_10.testnet build/hello_near.wasm

near call ox_ho_1_10.testnet init '{"ms_account":"ox_ms_1.testnet"}' --accountId ox_ho_1_10.testnet

near call ox_ho_1_10.testnet query_model_url --accountId ox_ho_1_10.testnet --gas=100000000000000

near call ox_ho_1_10.testnet set_model_url '{"ms_model_path":"blabla"}' --accountId ox_ho_1_10.testnet

near view ox_ho_1_10.testnet get_model_url
