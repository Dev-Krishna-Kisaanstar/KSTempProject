import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideNavbar/AdvisorSidebar";
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import your ApiLoader component
import { toast, ToastContainer } from "react-toastify"; // Import Toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// Import the Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const styles = {
  shaking: {
    display: 'inline-block',
    animation: 'shake 0.5s infinite alternate',
  },
  '@keyframes shake': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-10px)' },
  },
};

const AdvisoryDashboard = () => {
  const [advisory, setAdvisory] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for fetching advisory data
  const [loggingOut, setLoggingOut] = useState(false); // Loading state for logout process
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisoryData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/advisory/dashboard`,
          { withCredentials: true }
        );
        setAdvisory(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred");
        toast.error("Error fetching advisory data"); // Notify user of error
      } finally {
        setLoading(false); // End loading when data is fetched
      }
    };

    fetchAdvisoryData();
  }, []);

  const clearCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = async () => {
    setLoggingOut(true); // Start the loading state for logout
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory/logout`,
        {},
        { withCredentials: true }
      );
      clearCookie("AdvisoryToken"); 
      toast.success("Logout successful"); // Notify user on successful logout
      navigate("/"); 
    } catch (error) {
      setMessage("Logout failed. Please try again.");
      toast.error("Logout failed. Please try again."); // Notify user on logout failure
    } finally {
      setLoggingOut(false); // End loading for logout action
    }
  };

  if (loading || loggingOut) {
    return <ApiLoader />; // Show loader while loading or logging out
  }

  return (
    <Sidebar>
      <ToastContainer /> {/* Include ToastContainer for notifications */}
      <Container maxWidth="lg" className="mt-5 p-4 bg-light rounded shadow-lg">
        <Box className="text-center mb-5">
          <Typography 
            variant="h3" 
            style={{ fontFamily: 'Roboto, sans-serif', color: "#004d00" }} 
          >
            Advisory Dashboard
          </Typography>
          {advisory ? (
            <>
              <Typography 
                variant="h5" 
                style={{ fontFamily: 'Roboto, sans-serif', color: "#004d00" }} 
              >
                Welcome,{' '}
                <span style={styles.shaking}>
                  <strong>{advisory.name}</strong>
                </span>!
              </Typography>
              <Typography 
                variant="body1" 
                className="text-muted mb-4" 
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <strong>Email:</strong> {advisory.email}
              </Typography>

              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={3} className="shadow-sm text-center" style={{ backgroundColor: "#3A6B3E" }}>
                    <CardContent>
                      <Typography 
                        variant="h5" 
                        style={{ color: "#FFFFFF", fontFamily: 'Roboto, sans-serif' }}
                      >
                        Advisory Information
                      </Typography>
                      <Typography 
                        variant="body1" 
                        style={{ color: "#FFFFFF", fontFamily: 'Roboto, sans-serif' }}
                      >
                        {advisory.name} - Advisor
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <div className="d-flex justify-content-center mt-5">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Typography 
              variant="body1" 
              className="text-muted" 
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Loading...
            </Typography>
          )}
        </Box>
      </Container>
    </Sidebar>
  );
};

export default AdvisoryDashboard;