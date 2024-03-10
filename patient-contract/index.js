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

    const account = await near.account("ox_pa_1_4.testnet"); // Use the account that can call the contract

    const contract = new Contract(account, "ox_pa_1_4.testnet", {
        changeMethods: ["query_hospital_model_url"],
    });

    return contract;
}

// Function to call the change method query_hospital_model_url
async function queryHospitalModelUrl() {
    const contract = await initContract();
    try {
        // Now we can directly call the method as defined in the contract object
        const result = await contract.query_hospital_model_url({}, "100000000000000"); // Pass empty args and gas
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error calling contract method:", error);
    }
}

async function main() {
    await queryHospitalModelUrl();
}

main();