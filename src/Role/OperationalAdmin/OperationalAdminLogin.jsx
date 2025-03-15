import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../useAuth/useAuth";
import horImage from "../../Assets/BackGroundImg/horimage.webp";
import verImage from "../../Assets/BackGroundImg/verimage.webp";

const steps = ["Enter Email", "Enter Password"];
const OperationalAdminLogin = () => {
  useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Define loading state
  const navigate = useNavigate();

  const handleNext = async () => {
    setLoading(true); // Set loading to true when the button is clicked
    if (activeStep === 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/operational-admin/send-password`,
          { email },
          {
            headers: {
              "ngrok-skip-browser-warning": "true"  // Add this header
            }
          }
        );
        setMessage(response.data.message);
        setActiveStep(1);
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred");
      }
    } else {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/operational-admin/login`,
          { email, password },
          { withCredentials: true },
          {
            headers: {
              "ngrok-skip-browser-warning": "true"  // Add this header
            }
          }
        );
        navigate("/operational-admin-dashboard");
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred");
      }
    }
    setLoading(false); // Reset loading state after API call
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      {/* Full-screen horizontal background image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${horImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
          opacity: 0.8, // Added overlay effect
        }}
      />

      {/* Content container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 50-50 split container */}
        <Card
          sx={{
            display: "flex",
            width: "60%",
            height: "70%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px", // Increased border radius for a softer look
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Stronger shadow for depth
          }}
        >
          {/* Left side - Vertical image */}
          <Box
            sx={{
              flex: 1,
              backgroundImage: `url(${verImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Right side - Login form */}
          <Box
            sx={{
              flex: 1,
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Operational Admin Login
            </Typography>

            {/* Stepper for progress indication */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Form fields */}
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {activeStep === 0 && (
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px", // Softer border radius
                    },
                  }}
                />
              )}
              {activeStep === 1 && (
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px", // Softer border radius
                    },
                  }}
                />
              )}

              {/* Submit button */}
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading} // Use loading state to disable button
                  sx={{
                    py: 1.5,
                    width: '200px', // Adjust width here
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    backgroundColor: "brown",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "brown",
                    },
                    transition: "background-color 0.3s, color 0.3s, transform 0.2s",
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                    position: "relative", // Needed for positioning spinner
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" sx={{ position: "absolute" }} /> // Spinner on button
                  ) : (
                    activeStep === 0 ? "Send Password" : "Login"
                  )}
                </Button>
              </Box>
            </Box>

            {/* Message Display */}
            {message && (
              <Typography color="error" align="center" sx={{ mt: 3 }}>
                {message}
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default OperationalAdminLogin;
