import React, { useState } from 'react';
import axios from 'axios';

const RegisterPatient = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Replace 'YOUR_BACKEND_ENDPOINT' with the actual endpoint to your backend
            await axios.post('YOUR_BACKEND_ENDPOINT/register-patient', formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error sending registration data:', error);
            alert('There was an error sending the registration data.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return <p>Thank you for registering. Please check your email to complete the registration process.</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register Patient</h2>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default RegisterPatient;
