import React, { useState } from 'react';
import axios from 'axios';

const RegisterPatient = () => {
    const [formData, setFormData] = useState({
        hospital_id: '', // Ensure you have hospital_id in your initial state
        firstName: '',
        lastName: '',
        email: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Example list of hospitals, ideally this would come from your backend
    const hospitals = [
        { id: 'dedoctorhospital1', name: 'Hospital One' },
        { id: 'dedoctorhospital2', name: 'Hospital Two' },
        { id: 'dedoctorhospital3', name: 'Hospital Three' },
    ];

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
            await axios.post('http://localhost:3001/register-patient', formData);
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
                <label htmlFor="hospital_id">Hospital ID:</label>
                <select
                    id="hospital_id"
                    name="hospital_id"
                    value={formData.hospital_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Please select a hospital</option>
                    {hospitals.map((hospital) => (
                        <option key={hospital.id} value={hospital.id}>
                            {hospital.name}
                        </option>
                    ))}
                </select>
            </div>
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
