// client/src/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async() => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-admin/dashboard`, { withCredentials: true,headers: {
                    "ngrok-skip-browser-warning": "true"  // Add this header
                  } },);
                // If the request is successful, navigate to the dashboard
                navigate('/operational-admin-dashboard');
            } catch (error) {
                // If unauthorized, stay on the current page
                console.log('User is not logged in');
            }
        };

        checkAuth();
    }, [navigate]);
};

export default useAuth;