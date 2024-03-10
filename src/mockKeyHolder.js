const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Simple in-memory storage for the sake of demonstration
const keysStorage = {};

// Function to simulate storing a key
function storeKey(id, privateKey) {
    // For additional realism, you could encrypt the privateKey here using a passphrase
     // Simulated encryption
    keysStorage[id] = encryptKey(privateKey, 'passphrase');

    // Optionally, persist keys to a file for demonstration
    fs.writeFileSync(path.join(__dirname, 'keysStorage.json'), JSON.stringify(keysStorage, null, 2));
}

// Function to simulate retrieving a key
function retrieveKey(id) {
    // Simulating decryption of the key
    const encryptedKey = keysStorage[id] || null;
    if (!encryptedKey) {
        throw new Error(`Key for ${id} not found.`);
    }
    return decryptKey(encryptedKey, 'passphrase'); // Simulated decryption
}

//function to simulate removing a key
function removeKey(accountId){
    try{
        if(!keysStorage[accountId]){
            throw new Error(`Key for accountId ${accountId} not found.`);
        }
    }catch(err){
        console.log(err);
    }
    delete keysStorage[accountId];
    fs.writeFileSync(path.join(__dirname, 'keysStorage.json'), JSON.stringify(keysStorage, null, 2));
    return true;
}

// Mock encryption function
function encryptKey(key, passphrase) {
    // This is a placeholder. In a real scenario, you'd use a secure method.
    return `encrypted-${key}`;
}

// Mock decryption function
function decryptKey(encryptedKey, passphrase) {
    // Matching the placeholder encryption logic
    return encryptedKey.replace('encrypted-', '');
}

module.exports = { storeKey, retrieveKey, removeKey };
