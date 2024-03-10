
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const NodeRSA = require('node-rsa');
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

function encryptEmailWithPublicKey(email, publicKey) {
    const key = new NodeRSA(publicKey, 'public');
    return key.encrypt(email, 'base64');
}

// Encrypts the private key using the user's password
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
    networkId: process.env.NETWORK_ID, // "testnet"
    nodeUrl: process.env.NODE_URL, // "https://rpc.testnet.near.org"
    walletUrl: process.env.WALLET_URL, // "https://wallet.testnet.near.org"
    helperUrl: process.env.HELPER_URL, // "https://helper.testnet.near.org"
};

async function createNearAccount(patientId, hospitalId) {
    const near = await connect(Object.assign({ deps: { keyStore: new utils.keyStores.InMemoryKeyStore() } }, nearConfig));
    const masterAccount = await near.account(hospitalId);
    const newAccountId = `${patientId}.testnet`;
    const keyPair = KeyPair.fromRandom('ed25519');

    // Add the key pair to the keystore
    await near.config.keyStore.setKey(nearConfig.networkId, newAccountId, keyPair);

    // Assume you have enough NEAR in your master account to cover account creation.
    // The actual cost depends on the current network requirements.
    const MINIMUM_BALANCE = "5"; // Example: minimum balance required to create an account, in NEAR tokens.
    try {
        const response = await masterAccount.createAccount(
            newAccountId, // new account name
            keyPair.publicKey, // public key for the new account
            utils.format.parseNearAmount(MINIMUM_BALANCE) // initial balance
        );

        console.log("Account creation transaction response:", response);

        // Save the new account details in the "database"
        usersDb[newAccountId] = {
            publicKey: keyPair.publicKey.toString(),
            encryptedPrivateKey: '', // Placeholder, encryption happens later
            salt: '', // Placeholder
            iv: '', // Placeholder
        };

        console.log(`Account ${newAccountId} created and saved.`);
        return { keyPair, newAccountId };
    } catch (error) {
        console.error("Failed to create account:", error);
        throw error; // Rethrow or handle as needed
    }
}

const nodemailer = require('nodemailer');
const {connect, KeyPair} = require("near-api-js");
const app = express();
app.use(express.json());

app.post('/register-patient', async (req, res) => {
    const { firstName, lastName, email } = req.body;

    const port = 3001;

    // Generate a registration link with user details as query parameters
    const baseUrl = 'http://localhost:'+port+'/complete-registration';
    const registrationLink = `${baseUrl}?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}`;

    let transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587, // Recommended port for Mailgun
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'postmaster@sandbox9cb27e71b2534fb99fc8064c1bb43292.mailgun.org',
            pass: '2f65ba9473f03c2bdb344ddbba825321-2c441066-dfa018da'
        }
    });

    await transporter.sendMail({
        from: '"Hospital Registration" <yourhospital@example.com>', // sender address
        to: email, // recipient
        subject: "Complete Your Registration", // Subject line
        html: `Please click on the link to complete your registration: <a href="${registrationLink}">Complete Registration</a>`, // html body
    });

    res.status(200).send('Registration initiated. Please check your email to complete the registration.');
});

app.post('/complete-register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Generates the userID by taking a random letter from the first name and the last name, and adding a random number
    const userId = firstName.charAt(Math.floor(Math.random() * firstName.length)).toLowerCase() +
        lastName.toLowerCase() + uuidv4().split('-')[0];

    try {
        const keyPair = await createNearAccount(userId);
        const { encryptedData, salt, iv } = encryptPrivateKey(keyPair.secretKey, password);

        // Store in mock database
        usersDb[userId] = {
            email,
            accountData: {
                accountId: `${userId}.testnet`,
                publicKey: keyPair.publicKey.toString(),
                encryptedPrivateKey: encryptedData,
                salt,
                iv
            }
        };

        // Here, you'd also send an email to the user to complete their registration, as in your existing code

        res.json({ success: true, message: 'User registered and wallet created.' });
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ success: false, message: 'Registration failed.' });
    }
});

const PORT = port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

