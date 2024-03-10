import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        // Add other registration fields as necessary
    });

    const history = useHistory();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would usually send the form data to your server for processing
        console.log(formData);
        // If registration is successful, redirect to the dashboard
        history.push('/dashboard');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
            </label>
            {/* Include other fields here */}
            <button type="submit">Register</button>
        </form>
    );
}

export default Registration;
