import React, { useState } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupFastAuthWallet } from 'near-fastauth-wallet';

const WalletAuthentication = () => {
    // State for user's email and desired NEAR address (if applicable)
    const [email, setEmail] = useState('');
    const [nearAddress, setNearAddress] = useState('');
    const [isRecovery, setIsRecovery] = useState(false); // Toggle between recovery mode or not

    // Initialize wallet selector
    const selector = setupWalletSelector({
        network: 'networkId', // replace 'networkId' with actual network ID (e.g., 'testnet', 'mainnet')
        modules: [
            setupFastAuthWallet({
                relayerUrl: "$RELAYER_URL", // replace with your actual relayer URL
                walletUrl: "$WALLET_URL" // replace with your actual wallet URL
            })
        ]
    });

    // Function to handle login, supports both recovery and non-recovery modes
    const handleLogin = () => {
        selector.then((selector) => selector.wallet('fast-auth-wallet'))
            .then((fastAuthWallet) =>
                fastAuthWallet.signIn({
                    contractId: "$CONTRACT_ID", // replace with your actual contract ID
                    email: email,
                    accountId: isRecovery ? undefined : `${nearAddress}.near`,
                    isRecovery: isRecovery,
                }),
            ).catch(console.error);
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            {!isRecovery && (
                <input
                    type="text"
                    value={nearAddress}
                    onChange={(e) => setNearAddress(e.target.value)}
                    placeholder="Desired NEAR address (without .near)"
                />
            )}
            <button onClick={() => setIsRecovery(true)}>Login (Recovery)</button>
            <button onClick={() => setIsRecovery(false)}>Login (New Account)</button>
            <button onClick={handleLogin}>Sign In</button>
        </div>
    );
};

export default WalletAuthentication;
