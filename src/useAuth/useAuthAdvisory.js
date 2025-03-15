// client/src/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuthAdvisory = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async() => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory/dashboard`, { withCredentials: true });
                // If the request is successful, navigate to the dashboard
                navigate('/advisory-dashboard');
            } catch (error) {
                // If unauthorized, stay on the current page
                console.log('User is not logged in');
            }
        };

        checkAuth();
    }, [navigate]);
};

export default useAuthAdvisory;