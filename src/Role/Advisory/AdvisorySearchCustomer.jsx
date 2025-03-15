import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/SideNavbar/AdvisorSidebar";
import { toast, ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 

const AdvisorySearchCustomer = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    
    setLoading(true);

    try {
      // First try to search using the primary mobile number
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/advisory/search-customer/${mobileNumber}`
      );
      setShowForm(false);
      navigate(`/advisory-dashboard/search-customer/customer-details/${response.data._id}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setShowForm(true);
        resetFormFields(); // Reset form fields if customer not found
      } else {
        console.error("Error searching customer:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetFormFields = () => {
    setFormData({
      name: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      toast.error("Mobile number must be a 10-digit numeric value.");
      return;
    }

    if (formData.name.trim() === "") {
      toast.error("Name is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory/add-customer`,
        {
          mobileNumber,
          ...formData,
        }
      );
      toast.success(response.data.message); 
      navigate(`/advisory-dashboard/search-customer/customer-details/${response.data.customer._id}`);
    } finally {
      setLoading(false); 
    }
  };

  const handleClearMobileNumber = () => {
    setMobileNumber("");
    setShowForm(false);
    resetFormFields();
  };

  return (
    <Sidebar>
      <Container className="py-5">
        <ToastContainer />
        <Typography
          variant="h4"
          className="text-center"
          sx={{
            color: '#6C584C',
            fontWeight: 'bold',
            letterSpacing: 1,
            mb: 4
          }}
        >
          <PersonAddIcon className="me-2" fontSize="large" /> Search Customer
        </Typography>
  
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
              error={mobileNumber.length > 10}
              helperText={mobileNumber.length > 10 ? "Max 10 digits allowed" : ""}
              sx={{ height: '60px' }}
            />
          </Grid>
  
          <Grid item xs="auto">
            <IconButton color="secondary" onClick={handleClearMobileNumber}>
              <ClearIcon />
            </IconButton>
          </Grid>
          
          <Grid item xs="auto">
            <Button
              variant="contained"
              className="btn btn-primary"
              sx={{
                height: '60px',
                px: 4,
                backgroundColor: '#6C584C',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#DDE5B6',
                  color: 'black'
                }
              }}
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </Grid>
        </Grid>
  
        {showForm && (
          <div className="my-4">
            <Typography variant="h5" className="text-danger text-center mb-3">
              Customer Not Found - Add New Customer
            </Typography>
            <Paper elevation={3} className="p-4" style={{ borderRadius: '8px' }}>
              <form onSubmit={handleAddCustomer}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      label="Name"
                      required
                      sx={{ height: '60px' }}
                    />
                  </Grid>
  
                  <Button
                    type="submit"
                    variant="contained"
                    className="btn btn-danger mt-4"
                    disabled={loading}
                    fullWidth
                    sx={{ height: '60px' }}
                    startIcon={<PersonAddIcon />}
                  >
                    {loading ? <CircularProgress size={24} /> : "Add Customer"}
                  </Button>
                </Grid>
              </form>
            </Paper>
          </div>
        )}
      </Container>
    </Sidebar>
  );
};

export default AdvisorySearchCustomer;