import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import the ApiLoader component

const AdvisoryOrderSuccess = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [countdown, setCountdown] = useState(5); // State for countdown timer
    const [loading, setLoading] = useState(true); // Loading state for demonstration

    useEffect(() => {
        // Set a timer to navigate after 5 seconds
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/advisory-dashboard/search-customer"); // Navigate to the desired route
                    return 0; // Return 0 to avoid negative numbers
                }
                return prev - 1; // Decrement countdown
            });
        }, 1000); // Update every second

        // Simulate loading duration
        const loadingTimer = setTimeout(() => {
            setLoading(false); // Stop loading after a short duration
        }, 1000); // Assume loading for 1 second for a better user experience

        // Cleanup the timers on component unmount
        return () => {
            clearInterval(timer);
            clearTimeout(loadingTimer);
        };
    }, [navigate]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
          {loading ? (
            <ApiLoader /> // Show the ApiLoader while loading
          ) : (
            <>
              <Typography variant="h4">🎉 Order Placed Successfully!</Typography>
              <Typography variant="h6" color="primary">
                Thank you for choosing us! Your order is being processed, and we appreciate your trust in us.
              </Typography>
              <Typography variant="body1">
                You will be redirected to your dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
              </Typography>
            </>
          )}
        </Box>
    );
};

export default AdvisoryOrderSuccess;