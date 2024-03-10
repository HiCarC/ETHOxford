require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const {KeyPair} = require("near-api-js");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { storeKey, retrieveKey } = require('./mockKeyHolder');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example: Storing a key for a hospital
storeKey('hospital-123', 'private-key-for-hospital-123');
// Encrypts the private key using the user's password and a salt
function encryptPrivateKey(privateKey, password) {
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, salt: salt.toString('hex'), iv: iv.toString('hex') };
}

const nearConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

// Convert the private key string to a KeyPair object

// Function to create a NEAR account using hospital_id as the master account
// Example: Creating a patient account using the stored key

// Utility function to convert a private key string into a KeyPair object
const getKeyPairFromPrivate = (privateKey) => KeyPair.fromString(privateKey);

app.post('/create-patient-account', async (req, res) => {
    const { patientId, hospitalId } = req.body;

    try {
        // Use the mock key holder to fetch the hospital's master private key
        const masterPrivateKey = await retrieveKey(hospitalId);
        if (!masterPrivateKey) {
            return res.status(404).json({ error: "Hospital master account not found." });
        }

        const near = await connect({
            networkId: nearConfig.networkId,
            nodeUrl: nearConfig.nodeUrl,
            walletUrl: nearConfig.walletUrl,
            helperUrl: nearConfig.helperUrl,
            keyStore: new utils.keyStores.InMemoryKeyStore(),
        });

        const masterKeyPair = getKeyPairFromPrivate(masterPrivateKey);
        const masterAccountId = `${hospitalId}.${nearConfig.networkId}`;

        // Set the master account's key in the key store
        await near.config.keyStore.setKey(nearConfig.networkId, masterAccountId, masterKeyPair);
        const masterAccount = await near.account(masterAccountId);

        const newAccountId = `${patientId}.${nearConfig.networkId}`;
        const newAccountKeyPair = KeyPair.fromRandom('ed25519');

        // Create the new account with an initial balance
        await masterAccount.createAccount(
            newAccountId,
            newAccountKeyPair.publicKey,
            utils.format.parseNearAmount("10") // Example balance
        );

        console.log(`Successfully created account: ${newAccountId}`);
        res.json({ success: true, accountId: newAccountId, publicKey: newAccountKeyPair.publicKey.toString() });
    } catch (error) {
        console.error(`Failed to create account for ${patientId} with master account ${hospitalId}:`, error);
        res.status(500).json({ success: false, message: 'Failed to create patient account.' });
    }
});

// Assuming usersDb is defined somewhere accessible
let usersDb = {};

const transporter = nodemailer.createTransport({
    host: "mailhog",
    port: 1025,
    secure: false, // true for 465, false for other ports. Most local SMTP servers use non-secure connections
    // No need for auth object since most local SMTP servers don't require authentication
});

const sendRegistrationEmail = async (email, registrationLink) => {
    await transporter.sendMail({
        from: `"Hospital Registration" <"registration@hospital.com">`,
        to: email,
        subject: "Complete Your Registration",
        html: `Please click on the link to complete your registration: <a href="${registrationLink}">Complete Registration</a>`,
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
    const { firstName, lastName, email, password } = req.body;
    const userId = `${firstName[0]}${lastName}${uuidv4()}`; // Simplified for uniqueness and readability

    try {
        const { accountId, keyPair } = await createNearAccount(userId, hospital_id);
        const { encryptedData, salt, iv } = encryptPrivateKey(keyPair.secretKey, password);

        usersDb[accountId] = {
            accountData: {
                accountId,
                publicKey: keyPair.publicKey.toString(),
                encryptedPrivateKey: encryptedData,
                salt,
                iv,
            },
        };

        // emails

        res.json({ success: true, message: 'User registration completed successfully.' });
    } catch (error) {
        console.error('Registration completion failed:', error);
        res.status(500).json({ success: false, message: 'Failed to complete registration.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
