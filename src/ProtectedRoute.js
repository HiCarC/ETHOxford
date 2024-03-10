import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

// Simple auth check function (modify as needed for your auth mechanism)
const checkAuth = async () => {
    const token = localStorage.getItem('token');

    return true
};

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);

    React.useEffect(() => {
        (async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);
        })();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or some other loading state
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;