import React, { useState, useEffect } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupFastAuthWallet } from 'near-fastauth-wallet';

const WalletAuthentication = () => {
    const [selector, setSelector] = useState(null); // To store the wallet selector
    const [email, setEmail] = useState(''); // To store user's email
    const [nearAddress, setNearAddress] = useState(''); // To store user's desired NEAR address

    // Replace these placeholders with actual values
    const networkId = 'testnet'; // 'mainnet' or 'testnet'
    const relayerUrl = 'YOUR_RELAYER_URL';
    const walletUrl = 'YOUR_WALLET_URL';
    const contractId = 'YOUR_CONTRACT_ID';

    useEffect(() => {
        // Asynchronously setup the wallet selector
        const initializeSelector = async () => {
            const walletSelector = await setupWalletSelector({
                network: networkId,
                modules: [
                    setupFastAuthWallet({
                        relayerUrl: relayerUrl,
                        walletUrl: walletUrl,
                    }),
                ],
            });
            setSelector(walletSelector);
        };
        initializeSelector();
    }, []);

    // Function to handle login for recovery
    const handleLoginRecovery = () => {
        if (!selector) return;
        selector.wallet('fast-auth-wallet')
            .then(wallet => wallet.signIn({
                contractId: contractId,
                email: email,
                isRecovery: true,
            }))
            .catch(console.error);
    };

    // Function to handle login for creating a new account
    const handleLoginNewAccount = () => {
        if (!selector) return;
        selector.wallet('fast-auth-wallet')
            .then(wallet => wallet.signIn({
                contractId: contractId,
                email: email,
                accountId: `${nearAddress}.near`,
                isRecovery: false,
            }))
            .catch(console.error);
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <input
                type="text"
                value={nearAddress}
                onChange={(e) => setNearAddress(e.target.value)}
                placeholder="Desired NEAR address (without .near)"
            />
            <button onClick={handleLoginRecovery}>Login (Recovery)</button>
            <button onClick={handleLoginNewAccount}>Login (New Account)</button>
        </div>
    );
};

export default WalletAuthentication;
