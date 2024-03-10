import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './CompleteRegistration.module.css'; // Import CSS module
const CompleteRegistration = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const firstNameQuery = queryParams.get('firstName');
    const lastNameQuery = queryParams.get('lastName');


    const [currentPage, setCurrentPage] = useState(1);
    const [firstName, setFirstName] = useState(firstNameQuery || '');
    const [lastName, setLastName] = useState(lastNameQuery || '');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('htto://localhost:3001/create-near-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    dateOfBirth,
                    password, // Ensure this is handled securely
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Wallet creation successful', data);
            // Handle success, e.g., redirect to a success page or display a success message
        } catch (error) {
            console.error('Failed to create NEAR wallet:', error);
            // Handle errors, e.g., show an error message
        }
    };

    return (
        <div className="registration-form">
            <form onSubmit={handleSubmit}>
                <fieldset disabled>
                    <label>Email</label>
                    <input type="email" value={email} readOnly />
                </fieldset>
                {currentPage === 1 && (
                    <>
                        <label>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                        <button type="button" onClick={() => setCurrentPage(2)}>Next</button>
                    </>
                )}
                {currentPage === 2 && (
                    <>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setCurrentPage(1)}>Back</button>
                        <button type="submit">Register</button>
                    </>
                )}
            </form>
        </div>

    );
};

export default CompleteRegistration;
