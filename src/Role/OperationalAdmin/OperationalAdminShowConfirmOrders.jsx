import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Menu,
    MenuItem,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../../components/SideNavbar/Sidebar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import ApiLoader from '../../components/ApiLoader/ApiLoader';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const OperationalAdminShowConfirmOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDateOrders, setSelectedDateOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory/orders`);
                const confirmedOrders = response.data.filter(order => order.orderStatus === 'Confirm');
                setOrders(confirmedOrders);
                toast.success("Orders loaded successfully!"); // Notify user on successful load
            } catch (err) {
                setError(err.message);
                toast.error("Failed to load orders: " + err.message); // Notify user on error
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleExportClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDateClick = (arg) => {
        const dateString = arg.dateStr;
        setSelectedDate(dateString);

        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return (
                orderDate.getFullYear() === new Date(dateString).getFullYear() &&
                orderDate.getMonth() === new Date(dateString).getMonth() &&
                orderDate.getDate() === new Date(dateString).getDate()
            );
        });

        setSelectedDateOrders(filteredOrders);
        if (filteredOrders.length > 0) {
            toast.info(`Found ${filteredOrders.length} orders on ${new Date(dateString).toLocaleDateString()}`); // Notify user of orders found
        } else {
            toast.warning(`No orders found on ${new Date(dateString).toLocaleDateString()}`); // Notify user of no orders found
        }

        // Hide the calendar after selecting a date
        setShowCalendar(false);
    };

    const exportToExcel = () => {
        const excelData = selectedDateOrders.map(order => ({
            'Order Number': order._id,
            'Created At': new Date(order.createdAt).toLocaleString(),
            'Advisor Name': order.advisorId?.name || 'N/A',
            'Mobile Number': order.customerId?.mobileNumber || 'N/A',
            'Farmer Alt. Number': order.customerId?.alternativeNumber || 'N/A',
            'Farmer Name': order.customerId?.name || 'N/A',
            'Village': order.customerId?.village || 'N/A',
            'Taluka': order.customerId?.taluka || 'N/A',
            'District': order.customerId?.district || 'N/A',
            'Pincode': order.customerId?.pincode || 'N/A',
            'Nearby Location': order.customerId?.nearbyLocation || 'N/A',
            'Post Office': order.customerId?.postOffice || 'N/A', // Added Post Office field
            'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
            'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
            'Final Amount': order.totalAmount,
            'Order Status': order.orderStatus,
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    
        XLSX.writeFile(workbook, `ConfirmedOrders.xlsx`);
        handleClose();
    };
    
    const csvData = selectedDateOrders.map(order => ({
        'Order Number': order._id,
        'Created At': new Date(order.createdAt).toLocaleString(),
        'Advisor Name': order.advisorId?.name || 'N/A',
        'Mobile Number': order.customerId?.mobileNumber || 'N/A',
        'Farmer Alt. Number': order.customerId?.alternativeNumber || 'N/A',
        'Farmer Name': order.customerId?.name || 'N/A',
        'Village': order.customerId?.village || 'N/A',
        'Taluka': order.customerId?.taluka || 'N/A',
        'District': order.customerId?.district || 'N/A',
        'Pincode': order.customerId?.pincode || 'N/A',
        'Nearby Location': order.customerId?.nearbyLocation || 'N/A',
        'Post Office': order.customerId?.postOffice || 'N/A', // Added Post Office field
        'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
        'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
        'Final Amount': order.totalAmount,
        'Order Status': order.orderStatus,
    }));
    
    const exportToPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'letter',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        });
    
        const rows = selectedDateOrders.map(order => [
            order._id,
            new Date(order.createdAt).toLocaleString(),
            order.advisorId?.name || 'N/A',
            order.customerId?.mobileNumber || 'N/A',
            order.customerId?.alternativeNumber || 'N/A',
            order.customerId?.name || 'N/A',
            order.customerId?.village || 'N/A',
            order.customerId?.taluka || 'N/A',
            order.customerId?.district || 'N/A',
            order.customerId?.pincode || 'N/A',
            order.customerId?.nearbyLocation || 'N/A',
            order.customerId?.postOffice || 'N/A', // Added Post Office field
            order.products.map(product => product.productId?.name || 'N/A').join(', '),
            order.products.reduce((acc, product) => acc + product.quantity, 0),
            order.totalAmount,
            order.orderStatus,
        ]);
    
        doc.autoTable({
            head: [['Order Number', 'Created At', 'Advisor Name', 'Mobile Number', 'Farmer Alt. Number',
                    'Farmer Name', 'Village', 'Taluka', 'District', 'Pincode',
                    'Nearby Location', 'Post Office', 'Product Names', 'Total Quantity', 'Final Amount', 'Order Status']],
            body: rows,
            margin: { top: 20, left: 20, right: 20, bottom: 20 },
        });
    
        doc.save('ConfirmedOrders.pdf');
        handleClose();
    };

    // Handle loading and error states
    if (loading) {
        return (
            <Sidebar>
                <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                    <ApiLoader /> {/* Show ApiLoader while loading */}
                </Box>
            </Sidebar>
        );
    }

    if (error) {
        return (
            <Sidebar>
                <Box m={3}>
                    <Typography variant="h6" color="error">Error: {error}</Typography>
                    <ToastContainer />
                </Box>
            </Sidebar>
        );
    }

    return (
        <Sidebar>
    <ToastContainer /> {/* Include ToastContainer */}
    <Box m={3}>
        <Typography variant="h4" gutterBottom>
            Confirmed Orders
        </Typography>

        <Button
            variant="contained"
            onClick={() => setShowCalendar(prev => !prev)}
            sx={{ mb: 2 }}
            startIcon={<CalendarTodayIcon />}
        >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </Button>

        <Button
            variant="contained"
            onClick={handleExportClick}
            sx={{
                mb: 2,
                ml: 2,
                backgroundColor: '#6C584C', // Background color for the button
                color: 'white', // Default text color
                '&:hover': {
                    backgroundColor: '#DDE5B6', // Hover color
                    color: 'black', // Text color on hover
                },
            }}
            startIcon={<DownloadIcon />}
        >
            Export
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
            <CSVLink data={csvData} filename={"ConfirmedOrders.csv"} style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleClose}>Export to CSV</MenuItem>
            </CSVLink>
            <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
        </Menu>

        {showCalendar && (
            <Box
                className="calendar-container"
                sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        width: '40%',
                        maxWidth: '850px',
                        height: '550px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        boxShadow: 2,
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        events={[]} // Ensuring no events are passed, so dates will be blank
                        dateClick={handleDateClick}
                        eventRender={info => { // Do nothing on event render if you want to keep the days empty
                            info.el.innerHTML = ''; // Typically used to prevent rendering
                        }}
                    />
                </Box>
            </Box>
        )}

        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Added box for scrollable table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Order Number</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Created At</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Advisor Name</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Mobile Number</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Farmer Alt. Number</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Farmer Name</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Village</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Taluka</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>District</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Pincode</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Nearby Location</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Post Office</TableCell> {/* Added Post Office header */}
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Product Names</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Total Quantity</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Final Amount</TableCell>
                            <TableCell sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>Order Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedDateOrders.length > 0 ? (
                            selectedDateOrders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{order.advisorId?.name || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.mobileNumber || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.alternativeNumber || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.name || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.village || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.taluka || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.district || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.pincode || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.nearbyLocation || 'N/A'}</TableCell>
                                    <TableCell>{order.customerId?.postOffice || 'N/A'}</TableCell> {/* Added Post Office field */}
                                    <TableCell>
                                        <ul style={{ padding: 0, margin: 0 }}>
                                            {order.products.map((product) => (
                                                <li key={product.productId?._id}>
                                                    {product.productId?.name || 'N/A'}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell>{order.products.reduce((acc, product) => acc + product.quantity, 0)}</TableCell>
                                    <TableCell>{order.totalAmount}</TableCell>
                                    <TableCell>{order.orderStatus}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={16} align="center" className="text-muted">
                                    {selectedDate ? `No orders on ${new Date(selectedDate).toLocaleDateString()}` : 'Select a date to view orders.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Box>
</Sidebar>
    );
};

export default OperationalAdminShowConfirmOrders;