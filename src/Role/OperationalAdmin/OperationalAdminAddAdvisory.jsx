import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import Sidebar from "../../components/SideNavbar/Sidebar";
import { styled } from '@mui/system';
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import the ApiLoader component
import { toast, ToastContainer } from "react-toastify"; // Import Toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #f0f4c3, #c8e6c9)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

const OperationalAdminAddAdvisory = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/add-advisory`,
        {
          name,
          email,
        },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      toast.success("Advisory added successfully!"); // Show success toast
      setName("");
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while adding the advisory."
      );
      toast.error("Failed to add advisory. Please try again."); // Show error toast
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <Sidebar>
      <Container className="mt-5">
        <ToastContainer /> {/* Include ToastContainer for toast notifications */}
        <Typography variant="h4" className="mb-4 text-center">
          Add Advisory
        </Typography>
        <StyledPaper elevation={3}>
          {loading ? (
            <ApiLoader /> // Show ApiLoader while loading
          ) : (
            <form onSubmit={handleSubmit} className="p-4">
              <Box mb={3}>
                <TextField
                  label="Advisory Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    style: {
                      borderRadius: '10px',
                    },
                  }}
                />
              </Box>
              <Box mb={3}>
                <TextField
                  label="Advisory Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    style: {
                      borderRadius: '10px',
                    },
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt={2}>
                <StyledButton variant="contained" type="submit">
                  Add Advisory
                </StyledButton>
              </Box>
              {message && (
                <Typography color="error" className="mt-3 text-center">
                  {message}
                </Typography>
              )}
            </form>
          )}
        </StyledPaper>
      </Container>
    </Sidebar>
  );
};

export default OperationalAdminAddAdvisory;