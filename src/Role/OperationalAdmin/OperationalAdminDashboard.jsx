import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../../components/SideNavbar/Sidebar";
import {
  Group,
  ShoppingCart,
  PendingActions,
  CheckCircle,
  Cancel,
  AttachMoney,
} from '@mui/icons-material'; // Import MUI icons
import './dashboardStyles.css'; // Import the CSS styles

const OperationalAdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [advisoryCount, setAdvisoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmCount, setConfirmCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingRevenue, setPendingRevenue] = useState(0);
  const [confirmRevenue, setConfirmRevenue] = useState(0);
  const [canceledRevenue, setCanceledRevenue] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/operational-admin/dashboard`,
          {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true", // Add this header
            },
          }
        );
        setAdmin(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred");
      }
    };

    const fetchOrderStatusCounts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/advisory/orders/status-count`, {
            withCredentials: true,
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );
        console.log('Order Status Counts:', response.data); // Ensure you see what you're fetching
        // Update these based on the console log you provided
        setPendingCount(response.data.Pending);
        setConfirmCount(response.data.Confirm);
        setCancelCount(response.data.Cancel);
      } catch (error) {
        console.error('Error fetching order status counts:', error);
      }
    };
    
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/operational-admin/counts`,
          { 
            withCredentials: true,
            headers: { 
              "ngrok-skip-browser-warning": "true", // Add this header
            },
          }
        );
        console.log('Counts Response:', response.data); // Log the response
        setAdvisoryCount(response.data.advisoryCount);
        setProductCount(response.data.productCount);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    const fetchRevenueDataFromOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory/orders`, {
          headers: {
            "ngrok-skip-browser-warning": "true" // Add this header
          }
        });
        const revenueData = calculateRevenue(response.data);
        setTotalRevenue(revenueData.totalRevenue);
        setPendingRevenue(revenueData.pendingRevenue);
        setConfirmRevenue(revenueData.confirmRevenue);
        setCanceledRevenue(revenueData.canceledRevenue);
      } catch (error) {
        setMessage("Failed to fetch order data for revenue calculations.");
      }
    };

    fetchAdminData();
    fetchCounts();
    fetchOrderStatusCounts();
    fetchRevenueDataFromOrders(); // New call to fetch revenue data
  }, []);

  // Calculate the revenue based on orders
  const calculateRevenue = (orders) => {
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const pendingRevenue = orders
      .filter(order => order.orderStatus === "Pending")
      .reduce((acc, order) => acc + order.totalAmount, 0);
    const confirmRevenue = orders
      .filter(order => order.orderStatus === "Confirm")
      .reduce((acc, order) => acc + order.totalAmount, 0);
    const canceledRevenue = orders
      .filter(order => order.orderStatus === "Cancel")
      .reduce((acc, order) => acc + order.totalAmount, 0);
    
    return { totalRevenue, pendingRevenue, confirmRevenue, canceledRevenue };
  };

  if (message) {
    return <Typography color="error">{message}</Typography>;
  }

  return (
    <Sidebar>
      <Container maxWidth="lg" className="mt-5 p-4 bg-light rounded shadow-lg">
        <Box className="text-center mb-5" style={{ color: "#FFFFFF" }}>
          <Typography
            variant="h3"
            className="mb-4"
            style={{
              fontFamily: "Exo, sans-serif",
              color: "#6C584C" // Set the color to #6C584C
            }}
          >
            Operational Admin Dashboard
          </Typography>
          {admin ? (
            <>
              <Typography variant="h5" className="text-success mb-3" style={{ fontFamily: "Exo, sans-serif", color: "#FFFFFF" }}>
                Welcome, <strong>{admin.name}</strong>!
              </Typography>
              <Typography variant="body1" className="text-muted mb-4" style={{ fontFamily: "Inter, sans-serif", color: "#FFFFFF" }}>
                <strong>Email:</strong> {admin.email}
              </Typography>

              {/* Existing Card Section */}
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#3A6B3E, #2c5264)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <Group sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Number of Advisories
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                        {advisoryCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#BBCD79, #8ab827)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <ShoppingCart sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Number of Products
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                        {productCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Order Status Counts */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#f1c40f, #f39c12)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <PendingActions sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Pending Orders
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                      {pendingCount !== null ? pendingCount : 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#2ecc71, #28b463)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <CheckCircle sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Confirmed Orders
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                      {confirmCount !== null ? confirmCount : 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#e74c3c, #c0392b)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <Cancel sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Canceled Orders
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                      {cancelCount !== null ? cancelCount : 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>

              {/* New Revenue Cards with Icons */}
              <Grid container spacing={4} justifyContent="center" className="mt-5">
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#F39C12, #f8b400)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <AttachMoney sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                        ₹ {totalRevenue.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#2980B9, #00A4E4)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <PendingActions sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Pending Revenue
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                        ₹ {pendingRevenue.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#27AE60, #4CAF50)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <CheckCircle sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Confirmed Revenue
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                        ₹ {confirmRevenue.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '15px',
                      background: 'linear-gradient(#C0392B, #E74C3C)',
                      textAlign: 'center',
                    }}
                    className="shadow-sm"
                  >
                    <CardContent sx={{ color: 'white' }}>
                      <Cancel sx={{ color: 'white', fontSize: '40px' }} />
                      <Typography variant="h5" className="card-title" sx={{ color: 'white' }}>
                        Canceled Revenue
                      </Typography>
                      <Typography variant="h4" className="card-count" sx={{ color: 'white' }}>
                        ₹ {canceledRevenue.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          ) : (
            <Typography variant="body1" className="text-muted">
              Loading...
            </Typography>
          )}
        </Box>
      </Container>
    </Sidebar>
  );
};

export default OperationalAdminDashboard;