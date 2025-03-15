import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';

const AdvisoryPrivateRoute = ({ children }) => {

    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async() => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory/dashboard`, {
                    withCredentials: true,
                });
                setAuthenticated(true);
            } catch {
                setAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (authenticated === null) {
        return <div > Loading... < /div>;
    }

    return authenticated ? children : < Navigate to = "/advisory/login" / > ;

}

export default AdvisoryPrivateRoute