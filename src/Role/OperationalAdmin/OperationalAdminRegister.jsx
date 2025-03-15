// client/src/OperationalAdminRegister.js
import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../useAuth/useAuth";

// Import images
import horImage from "../../Assets/BackGroundImg/horimage.webp";
import verImage from "../../Assets/BackGroundImg/verimage.webp";
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import the ApiLoader

const OperationalAdminRegister = () => {
  useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/register`,
        {
          name,
          email,
        }
      );
      setMessage(response.data.message);
      setName("");
      setEmail("");
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Set loading to false when submission ends
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
        <Box
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

          {/* Right side - Registration form */}
          <Box
            sx={{
              flex: 1,
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Register Operational Admin
            </Typography>
            
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", // Softer border radius
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main", // Focus state color
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "1rem",
                    color: "grey.600",
                  },
                }}
              />
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
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main", // Focus state color
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "1rem",
                    color: "grey.600",
                  },
                }}
              />
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading} // Disable button while loading
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#eab85f", // Set button background color
                  "&:hover": {
                    backgroundColor: "#d4a95b", // Darker shade for hover state
                  },
                  transition: "background-color 0.3s, transform 0.2s",
                  "&:active": {
                    transform: "scale(0.98)", // Scale down on active
                  },
                }}
              >
                {loading ? <ApiLoader /> : "Register"} {/* Show ApiLoader or button text */}
              </Button>
            </Box>

            {message && (
              <Typography color="error" align="center" sx={{ mt: 3 }}>
                {message}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OperationalAdminRegister;