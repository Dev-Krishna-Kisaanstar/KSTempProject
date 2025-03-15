import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Container,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Email, Person, ArrowBack, Lock, LockOpen } from "@mui/icons-material";
import Sidebar from "../../components/SideNavbar/Sidebar";
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import the ApiLoader
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast

import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const OperationalAdminAdvisoryDetails = () => {
  const { id } = useParams();
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisoryDetails = async () => {
      setLoading(true); // Set loading to true before the request
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/operational-admin/advisories/${id}`,
          { withCredentials: true }
        );
        setAdvisory(response.data);
      } catch (error) {
        console.error("Error fetching advisory details:", error);
        toast.error("Error fetching advisory details."); // Show toast notification on error
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisoryDetails();
  }, [id]);

  const toggleLoginStatus = async () => {
    try {
      setLoading(true); // Set loading to true before the request
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/advisories/${id}/toggle-login`,
        {},
        { withCredentials: true }
      );
      setAdvisory((prev) => ({
        ...prev,
        loginDisabled: response.data.loginDisabled,
      }));
      toast.success("Login status updated successfully!"); // Show toast notification on successful update
    } catch (error) {
      console.error("Error toggling login status:", error);
      toast.error("Error toggling login status."); // Show toast notification on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (loading) return <ApiLoader />; // Show the ApiLoader while loading

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} /> {/* Toast Container */}
      <Sidebar>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          {/* Back Button */}
          <Box textAlign="center" mb={2}>
            <Tooltip title="Go Back">
              <IconButton sx={{ color: "#A52A2A" }} onClick={() => window.history.back()}>
                <ArrowBack fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Advisory Details Card */}
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              {/* Title */}
              <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#A52A2A' }}>
                Advisory Details
              </Typography>

              {/* Advisory Information */}
              <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Person sx={{ color: "#A52A2A" }} fontSize="medium" />
                  <Typography variant="h6" sx={{ color: '#424242' }}>
                    <strong>Name:</strong> {advisory.name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email sx={{ color: "#A52A2A" }} fontSize="medium" />
                  <Typography variant="h6" sx={{ color: '#424242' }}>
                    <strong>Email:</strong> {advisory.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            {/* Card Actions for Switch and Status Message */}
            <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {/* Toggle Switch with Background */}
              <Box
                sx={{
                  p: 2,
                  width: '100%',
                  bgcolor: advisory.loginDisabled ? '#ffe6e6' : '#e6f7e6',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" sx={{ color: advisory.loginDisabled ? '#d32f2f' : '#388e3c' }}>
                  Login is {advisory.loginDisabled ? "Disabled" : "Enabled"}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={advisory.loginDisabled}
                      onChange={toggleLoginStatus}
                      inputProps={{ "aria-label": "controlled" }}
                      color="primary"
                      icon={<LockOpen sx={{ color: "#A52A2A" }} />}
                      checkedIcon={<Lock sx={{ color: "#A52A2A" }} />}
                    />
                  }
                  label=""
                />
              </Box>

              {/* Conditional Warning Message */}
              {advisory.loginDisabled && (
                <Typography color="error" variant="body2" align="center" sx={{ fontStyle: 'italic', mt: 1 }}>
                  Advisory login is disabled by the admin.
                </Typography>
              )}
            </CardActions>
          </Card>
        </Container>
      </Sidebar>
    </>
  );
};

export default OperationalAdminAdvisoryDetails;