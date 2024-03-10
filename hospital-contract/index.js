const { connect, keyStores, Contract } = require('near-api-js');

// Function to initialize and return a contract object
async function initContract() {
    // Path to your key storage, usually near credentials located at ~/.near-credentials
    const keyStore = new keyStores.UnencryptedFileSystemKeyStore(`${process.env.HOME}/.near-credentials`);

    const near = await connect({
        networkId: "testnet", // or "mainnet"
        keyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
    });

    const account = await near.account("ox_ho_1_10.testnet"); // Use the account that can call the contract

    const contract = new Contract(account, "ox_ho_1_10.testnet", {
        viewMethods: ["get_hospital_name", "get_model_url"],
        changeMethods: ["query_model_url", "set_model_url"],
    });

    return contract;
}

async function getHospitalName() {
    const contract = await initContract();
    const name = await contract.get_hospital_name();
    console.log("Hospital name from contract:", name);
}

// Example function to call a change method
async function queryModelUrl() {
    const contract = await initContract();
    try {
        // Now we can directly call the method as defined in the contract object
        const result = await contract.query_model_url({}, "100000000000000"); // Pass empty args and gas
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error calling contract method:", error);
    }
}

async function setModelUrl(ms_model_path) {
    const contract = await initContract();
    try {
        // Call 'set_model_url' with the provided model path
        const result = await contract.set_model_url({ ms_model_path });
        console.log("Transaction Result:", result);
    } catch (error) {
        console.error("Error calling contract method:", error);
    }
}

// Example function to get the model URL after the query
async function getModelUrl() {
    const contract = await initContract();
    const modelUrl = await contract.get_model_url();
    console.log("Model URL from contract:", modelUrl);
}

async function main() {
    await getHospitalName();
    const url = await queryModelUrl();
    await setModelUrl(url);
    await getModelUrl();
}

main();