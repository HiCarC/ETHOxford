import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const LoginPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate(); // Use useNavigate hook for navigation

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }

        try {
            const fileData = await selectedFile.text();
            const credentials = JSON.parse(fileData);
            const { accountId, privateKey } = credentials;

            const response = await axios.post('http://localhost:3001/login', { accountId, privateKey });

            // Saves the token in a cookie
            Cookies.set('token', response.data.token, { expires: 1 })

            localStorage.setItem('token', response.data.token);

            // Redirect to the dashboard using navigate
            navigate('/StartDiagnosis');
        } catch (error) {
            console.error('Error during file processing or login:', error);
            // Handle errors here
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} accept=".json" />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;
