import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Container,
    Stack,
    Paper,
    CssBaseline,
} from "@mui/material";
import { CheckCircle, Cancel, LocalOffer } from "@mui/icons-material"; // MUI icons
import axios from "axios";
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import your ApiLoader component
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const AdvisorySeeCustomerOldOrders = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/advisorys/orders?customerId=${customerId}`
                );
                console.log(response.data);

                // Assuming each order has an orderDate (or similar) property to determine the order creation time.
                const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders); // Set the sorted orders for the customer
                toast.success("Orders fetched successfully!"); // Success toast
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch orders");
                toast.error(err.response?.data?.message || "Failed to fetch orders"); // Error toast
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        if (customerId) {
            fetchOrders(); // Fetch orders only when customerId is available
        }
    }, [customerId]);

    // Show loader while loading
    if (loading) {
        return <ApiLoader />;
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" className="mt-4" fontWeight="bold">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className="mt-4" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} /> {/* Toast Container */}
            <CssBaseline />
            <Typography variant="h5" align="center" className="mb-4 text-success" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                Order History
            </Typography>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <Paper key={order._id} elevation={3} className="mt-3" style={{ padding: '16px', borderRadius: '8px', backgroundColor: order.orderStatus === "Completed" ? '#e8f5e9' : '#ffebee' }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {/* Status Icon */}
                                {order.orderStatus === "Completed" ? (
                                    <CheckCircle sx={{ color: "green" }} />
                                ) : (
                                    <Cancel sx={{ color: "red" }} />
                                )}
                                <Typography variant="subtitle1" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                                    Order ID: {order._id}
                                </Typography>
                            </Stack>
                            <Typography variant="body1" color="text.secondary" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                                Advisor Name: {order.advisorId.name} {/* Displaying the advisor's name */}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                                Status: {order.orderStatus}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="mt-2" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                                Total Amount: ₹{order.totalAmount}
                            </Typography>
                            
                            <Box mt={2}>
                                <Typography variant="body2" color="text.secondary" className="mb-1" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                                    Products:
                                </Typography>
                                {order.products.map((product, index) => (
                                    <Grid container spacing={1} key={index} alignItems="center">
                                        <Grid item xs={6} md={6}>
                                            <Typography variant="body2" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                                                <LocalOffer sx={{ color: "orange", marginRight: '4px' }} />
                                                {product.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3} md={3}>
                                            <Typography variant="body2" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Qty: {product.quantity}</Typography>
                                        </Grid>
                                        <Grid item xs={3} md={3}>
                                            <Typography variant="body2" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>₹{product.price}</Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Box>
                        </CardContent>
                    </Paper>
                ))
            ) : (
                <Typography variant="body1" align="center" color="text.secondary" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>No orders found for this user.</Typography>
            )}
        </Container>
    );
};

export default AdvisorySeeCustomerOldOrders;