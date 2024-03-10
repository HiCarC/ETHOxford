require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const {KeyPair, connect, utils, keyStores, Contract} = require("near-api-js");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { storeKey, retrieveKey, removeKey } = require('./mockKeyHolder');
const {redirect} = require("react-router-dom");
/**
 * Creates an instance of Express application.
 * @returns {Object} The Express application instance.
 */
const app = express();
app.use(cors());
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const {readFile} = require("fs");


/**
 * Generates a secret key of specified length.
 *
 * @param {number} [length=32] - The length of the secret key to generate.
 * @return {string} - The generated secret key.
 */
function generateSecretKey(length = 32) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

/**
 * Represents a secret key generated for encryption purposes.
 *
 * @typedef {string} SecretKey
 */
const secretKey = generateSecretKey()

app.ctor = {
    name: "dedoctor-authservice",
};


// Example: Storing a key for a hospital
storeKey('dedoctorhospital1', 'privatekey');

/**
 * The configuration object for connecting to NEAR network.
 * @typedef {Object} NearConfig
 * @property {string} networkId - The network ID (e.g., "mainnet", "testnet", etc.).
 * @property {string} nodeUrl - The URL of the NEAR RPC node to connect to.
 * @property {string} walletUrl - The URL of the NEAR wallet website.
 * @property {string} helperUrl - The URL of the NEAR helper website.
 * @property {string} explorerUrl - The URL of the NEAR explorer website.
 */
const nearConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

/**
 * Creates a key pair from a private key.
 *
 * @param {string} privateKey - The private key to create the key pair from.
 * @returns {KeyPair} The generated key pair.
 */
const getKeyPairFromPrivate = (privateKey) => KeyPair.fromString(privateKey);

/**
 * Creates a new Near account for a patient with a master account owned by a hospital.
 *
 * @param {string} patientId - The ID of the patient.
 * @param {string} hospitalId - The ID of the hospital owning the master account.
 *
 * @returns {Promise<Object>} - An object containing the new account's ID and key pair.
 * @throws {Error} - If the hospital master account is not found or there is an error creating the account.
 */
async function createNearAccount(patientId, hospitalId) {

    try {
        const [masterPrivateKey] = await Promise.all([retrieveKey(hospitalId)]);
        if (!masterPrivateKey) {
            throw new Error("Hospital master account not found.");
        }

        const near = await connect({
            networkId: nearConfig.networkId,
            nodeUrl: nearConfig.nodeUrl,
            walletUrl: nearConfig.walletUrl,
            helperUrl: nearConfig.helperUrl,
            keyStore: new keyStores.InMemoryKeyStore(),
        });

        const keyBuffer = Buffer.from(masterPrivateKey, 'base64');

        console.log("Key Length:", keyBuffer.length); // Should output 64 for a valid ED25519 key

        const masterKeyPair = getKeyPairFromPrivate(masterPrivateKey);
        const masterAccountId = `${hospitalId}.${nearConfig.networkId}`;

        // Set the master account's key in the key store
        await near.config.keyStore.setKey(nearConfig.networkId, masterAccountId, masterKeyPair);
        const masterAccount = await near.account(masterAccountId);

        const newAccountId = `${patientId}.${masterAccountId}`.toLowerCase();
        const newAccountKeyPair = KeyPair.fromRandom('ed25519');

        // Create the new account with an initial balance
        await masterAccount.createAccount(
            newAccountId,
            newAccountKeyPair.publicKey,
            utils.format.parseNearAmount("0.1") // Example balance
        );

        storeKey(newAccountId, newAccountKeyPair.secretKey);

       /// await createContract(hospitalId, newAccountId.toLowerCase());

        console.log(`Successfully created account: ${newAccountId}`);
        return({ accountId: newAccountId, keyPair: newAccountKeyPair });
    } catch (error) {
        console.error(`Failed to create account for ${patientId} with master account ${hospitalId}:`, error);
        throw error;
    }
}

async function deployContractAndGetInterface(deployerAccount, contractCode, contractAccountId) {
    // Deploy the contract
    await deployerAccount.deployContract(contractCode);

    // Get a contract interface to interact with it
    return new Contract(deployerAccount, contractAccountId, {
        // Assuming the contract has methods for setting up and managing the agreement
        changeMethods: ['setUpAgreement', 'otherChangeMethod'],
        viewMethods: ['getAgreementDetails', 'otherViewMethod'],
    });
}

// Define a new method that can create an initial contract between the hospital and the patient
// This method will be called by the hospital to create a contract with the patient when the patient is registered

async function createContract(hospitalAccountId, patientAccountId) {

    const keyStore = new keyStores.InMemoryKeyStore();
    // Assume we have the private key for deployerAccount; load it into keyStore
    const deployerPrivateKey = await retrieveKey(hospitalAccountId);
    const deployerAccountId = `${hospitalAccountId}.${nearConfig.networkId}`;
    const deployerKeyPair = KeyPair.fromString(deployerPrivateKey);
    await keyStore.setKey(nearConfig.networkId, deployerAccountId, deployerKeyPair);

    const near = await connect(Object.assign({ keyStore }, nearConfig));

    // Load the compiled contract code
    const contractCode = await readFile('./build/hello_near.wasm');

    const deployerAccount = await near.account(deployerAccountId);
    
    const contract = await deployContractAndGetInterface(deployerAccount, contractCode, deployerAccountId);

    // Initialize the contract with hospital and patient account IDs
    await contract.setUpAgreement({ hospitalAccountId, patientAccountId }, 300000000000000, utils.format.parseNearAmount("1"));
    console.log("Contract successfully deployed and initialized with hospital and patient account IDs.");
}




/**
 * Creates a transporter for sending email using nodemailer library.
 *
 * @param {Object} options - The options for creating the transporter.
 * @param {string} options.host - The SMTP server host.
 * @param {number} options.port - The SMTP server port.
 * @param {boolean} options.secure - Use secure connection or not.
 * @param {Object} options.auth - Authentication credentials.
 * @param {string} options.auth.user - The email address of the sender.
 * @param {string} options.auth.pass - The password of the sender's email address.
 *
 * @returns {Object} - A transporter object for sending emails.
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports. Most local SMTP servers use non-secure connections
    auth : {
        user: "dedoctoreth@gmail.com",
        pass: 0 // Secret Key for the email, not to be shared
    }
});

/**
 * Sends a registration email to the specified email address with a registration link.
 *
 * @async
 * @param {string} email - The email address to send the registration email to.
 * @param {string} registrationLink - The link to the registration form.
 * @returns {Promise<void>} - A promise that resolves when the email has been sent successfully, or rejects with an error if the sending fails.
 */
const sendRegistrationEmail = async (email, registrationLink) => {
    await transporter.sendMail({
        from: "Hospital Registration <registration@hospital.com>",
        to: email,
        subject: "Please Fill In Registration Form",
        html: `Please click on the link for your registration: <a href="${registrationLink}">Complete Registration</a>`,
    });
};

/**
 * Sends an email to the specified email address with a download link for an authentication key.
 *
 * @param {string} email - The email address to send the email to.
 * @param {string} downloadLink - The download link for the authentication key.
 * @returns {Promise<void>} - A promise that resolves when the email has been sent.
 */
const sendKeyEmail = async (email, downloadLink) => {
    await transporter.sendMail({
        from: "Hospital Registration <registration@hospital.con",
        to: email,
        subject: "Please Complete Your Registration",
        html: `Please click on the link to download your authentication key: <a href="${downloadLink}">Download Key</a>`,
    });
};




app.post('/register-patient', async (req, res) => {
    const { firstName, lastName, email, hospital_id } = req.body;
    const registrationLink = `http://localhost:3000/complete-registration?
    firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}
    &email=${encodeURIComponent(email)} &hospital_id=${encodeURIComponent(hospital_id)}`;

    try {
        await sendRegistrationEmail(email, registrationLink);
        res.status(200).send('Registration initiated. Please check your email to complete the registration.');
    } catch (error) {
        console.error('Failed to send registration email:', error);
        res.status(500).json({ success: false, message: 'Failed to initiate registration.' });
    }
});

app.post('/complete-register', async (req, res) => {
    const { firstName, lastName, email, hospital_id} = req.body;
    const userId = `${firstName[0]}${lastName[0]}${uuidv4().split('-')[0]}`; // Simplified for uniqueness and readability

    try {
        const { accountId, keyPair } = await createNearAccount(userId, hospital_id);


        // Emails user with a link to download the key
        const downloadLink = `http://localhost:3000/download-key?accountId=${accountId}`;
        await sendKeyEmail(email, downloadLink);

        // redirect to a page that tells the user to check their email

        res.redirect('http://localhost:3000/login');
    } catch (error) {
        console.error('Registration completion failed:', error);
        res.status(500).json({ success: false, message: 'Failed to complete registration.' });
    }
});

app.get('/download-key', async (req, res) => {
    const { accountId } = req.query;
    const privateKey = await retrieveKey(accountId);
    if (!privateKey) {
        // tell the user that the key is no longer available, and they need to contact the hospital
        res.status(404).json({ success: false, message: 'Key no longer available. Please contact the hospital for assistance.' });
    } else {
        await removeKey(accountId);
        res.json({ accountId: accountId, privateKey });
    }
});

app.post('/login', async (req, res) => {
    const { accountId, privateKey } = req.body;
    const keyPair = getKeyPairFromPrivate(privateKey);
    const near = await connect({
        networkId: nearConfig.networkId,
        nodeUrl: nearConfig.nodeUrl,
        walletUrl: nearConfig.walletUrl,
        helperUrl: nearConfig.helperUrl,
        keyStore: new keyStores.InMemoryKeyStore(),
    });

    try {
        await near.config.keyStore.setKey(nearConfig.networkId, accountId, keyPair);
        const account = await near.account(accountId);
        const state = await account.state();

        // Token generation part
        const token = jwt.sign(
            { accountId: accountId, state: state },
            secretKey,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Respond with the token
        res.json({ success: true, token: token });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ success: false, message: 'Failed to log in.' });
    }
});

app.get('/verify', (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            console.error('Token verification failed:', error);
            return res.status(500).json({ success: false, message: 'Failed to verify token.' });
        }

        res.json({ success: true, decoded: decoded });
    });
});

/**
 * Represents the port number used by the software.
 * @type {number}
 */
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
