import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async() => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-admin/dashboard`, {
                    withCredentials: true,
                    headers: {
                        "ngrok-skip-browser-warning": "true"  // Add this header
                      }
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

    return authenticated ? children : < Navigate to = "/login" / > ;
};

export default PrivateRoute;