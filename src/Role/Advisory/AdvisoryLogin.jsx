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
import useAuthAdvisory from "../../useAuth/useAuthAdvisory";
import horImage from "../../Assets/BackGroundImg/horimage.webp";
import verImage from "../../Assets/BackGroundImg/verimage.webp";
import { toast, ToastContainer } from "react-toastify"; // Import Toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const steps = ["Enter Email", "Enter Password"];

const AdvisoryLogin = () => {
  useAuthAdvisory();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    setLoading(true);
    if (activeStep === 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/advisory/send-password`,
          { email }
        );
        setMessage(response.data.message);
        toast.success(response.data.message); // Notify user of success
        setActiveStep(1);
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred"); // Notify user of error
      }
    } else {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/advisory/login`,
          { email, password },
          { withCredentials: true }
        );
        toast.success("Login successful!"); // Notify user of successful login
        navigate("/advisory-dashboard");
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred"); // Notify user of error
      }
    }
    setLoading(false);
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
          opacity: 0.8,
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
        {/* Card for login form */}
        <Card
          sx={{
            display: "flex",
            width: "60%",
            height: "70%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
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
              Advisory Login
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

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
                      borderRadius: "12px",
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
                      borderRadius: "12px",
                    },
                  }}
                />
              )}

              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    width: '200px',
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
                    position: "relative",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" sx={{ position: "absolute" }} />
                  ) : activeStep === 0 ? "Send Password" : "Login"}
                </Button>
              </Box>
            </Box>

            {message && (
              <Typography color="error" align="center" sx={{ mt: 3 }}>
                {message}
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </Box>
  );
};

export default AdvisoryLogin;