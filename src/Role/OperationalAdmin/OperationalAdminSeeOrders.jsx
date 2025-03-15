import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Select,
    MenuItem,
    FormControl,
    Box,
    Typography,
    TableContainer,
    Button,
    Menu,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Sidebar from '../../components/SideNavbar/Sidebar';
import ApiLoader from '../../components/ApiLoader/ApiLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RevenueSummary from '../../components/RevenueSummary/RevenueSummary';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OperationalAdminSeeOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDateOrders, setSelectedDateOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory/orders`);
                console.log('Fetched orders:', response.data);
                
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    setError("Expected an array but received: " + JSON.stringify(response.data));
                }
            } catch (err) {
                setError(err.response ? err.response.data.message : "An error occurred while fetching orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/advisory/orders/${orderId}/status`, { status: newStatus });
            setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
            toast.success("Order status updated successfully!");
        } catch (error) {
            console.error("Failed to update order status:", error);
            setError("Failed to update order status");
            toast.error("Error updating order status");
        } finally {
            setUpdating(false);
        }
    };

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const filteredOrders = orders
        .filter(order => !filterStatus || order.orderStatus === filterStatus)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const calculateRevenue = (orders) => {
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const pendingRevenue = orders.filter(order => order.orderStatus === "Pending").reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const confirmRevenue = orders.filter(order => order.orderStatus === "Confirm").reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const canceledRevenue = orders.filter(order => order.orderStatus === "Cancel").reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        return { totalRevenue, pendingRevenue, confirmRevenue, canceledRevenue };
    };

    const handleDateClick = (arg) => {
        const dateString = arg.dateStr;
        setSelectedDate(dateString);
        const filteredOrdersByDate = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return (
                orderDate.getFullYear() === new Date(dateString).getFullYear() &&
                orderDate.getMonth() === new Date(dateString).getMonth() &&
                orderDate.getDate() === new Date(dateString).getDate()
            );
        });
        setSelectedDateOrders(filteredOrdersByDate);
        if (filteredOrdersByDate.length > 0) {
            toast.info(`Found ${filteredOrdersByDate.length} orders on ${new Date(dateString).toLocaleDateString()}`);
            setShowCalendar(false);
        } else {
            toast.warning(`No orders found on ${new Date(dateString).toLocaleDateString()}`);
        }
    };

    const exportToExcel = () => {
        const excelData = filteredOrders.map(order => ({
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
            'Post Office': order.customerId?.postOffice || 'N/A',  // Added Post Office field
            'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
            'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
            'Total Amount': (order.totalAmount || 0) + (order.discount || 0),
            'Discount Amount': order.discount || 0,
            'Final Amount': order.totalAmount || 0,
            'Order Status': order.orderStatus,
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, `AllOrders.xlsx`);
    };
    
    const csvData = filteredOrders.map(order => ({
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
        'Post Office': order.customerId?.postOffice || 'N/A',  // Added Post Office field
        'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
        'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
        'Total Amount': (order.totalAmount || 0) + (order.discount || 0),
        'Discount Amount': order.discount || 0,
        'Final Amount': order.totalAmount || 0,
        'Order Status': order.orderStatus,
    }));
    
    const exportToPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'letter',
            putOnlyUsedFonts: true,
            floatPrecision: 16
        });
    
        const rows = filteredOrders.map(order => ({
            orderNumber: order._id,
            createdAt: new Date(order.createdAt).toLocaleString(),
            advisorName: order.advisorId?.name || 'N/A',
            mobileNumber: order.customerId?.mobileNumber || 'N/A',
            farmerAltNumber: order.customerId?.alternativeNumber || 'N/A',
            farmerName: order.customerId?.name || 'N/A',
            village: order.customerId?.village || 'N/A',
            taluka: order.customerId?.taluka || 'N/A',
            district: order.customerId?.district || 'N/A',
            pincode: order.customerId?.pincode || 'N/A',
            nearbyLocation: order.customerId?.nearbyLocation || 'N/A',
            postOffice: order.customerId?.postOffice || 'N/A',  // Added Post Office field
            productNames: order.products.map(product => product.productId?.name || 'N/A').join(', '),
            totalQuantity: order.products.reduce((acc, product) => acc + product.quantity, 0),
            totalAmount: (order.totalAmount || 0) + (order.discount || 0),
            discountAmount: order.discount || 0,
            finalAmount: order.totalAmount || 0,
            orderStatus: order.orderStatus,
        }));
    
        const tableColumnNames = [
            'Order Number', 'Created At', 'Advisor Name', 'Mobile Number',
            'Farmer Alt. Number', 'Farmer Name', 'Village', 'Taluka',
            'District', 'Pincode', 'Nearby Location', 'Post Office',  // Added Post Office field
            'Product Names', 'Total Quantity', 'Final Amount', 'Discount Amount', 'Total Amount', 'Order Status'
        ];
        doc.autoTable({
            head: [tableColumnNames],
            body: rows.map(row => Object.values(row)),
            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { top: 20 },
        });

        doc.save('AllOrders.pdf');
    };

    const handleExportClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (loading) {
        return (
            <Sidebar>
                <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                    <ApiLoader />
                </Box>
            </Sidebar>
        );
    }

    if (error) {
        return (
            <Sidebar>
                <Box m={3}>
                    <Alert severity="error">Error: {error}</Alert>
                </Box>
            </Sidebar>
        );
    }

    const { totalRevenue, pendingRevenue, confirmRevenue, canceledRevenue } = calculateRevenue(filteredOrders);

    return (
        <Sidebar>
        <ToastContainer />
        <Box sx={{ padding: 3, height: '100vh', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom>
                All Orders
            </Typography>

            <RevenueSummary 
                totalRevenue={totalRevenue}
                pendingRevenue={pendingRevenue}
                confirmRevenue={confirmRevenue}
                canceledRevenue={canceledRevenue} 
            />

            <FormControl sx={{ margin: '16px', minWidth: 200 }}>
                <Select value={filterStatus} onChange={handleFilterChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirm">Confirm</MenuItem>
                    <MenuItem value="Cancel">Cancel</MenuItem>
                </Select>
            </FormControl>

            <Box display="flex" sx={{ alignItems: 'center', mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => setShowCalendar(prev => !prev)}
                    sx={{ marginRight: 2 }}
                >
                    {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleExportClick}
                >
                    Export
                </Button>
            </Box>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
                <CSVLink data={csvData} filename={"AllOrders.csv"} style={{ textDecoration: 'none' }}>
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
                        justifyContent: 'flex-start',
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        dateClick={handleDateClick}
                    />
                </Box>
            )}

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 480,
                    overflowY: 'auto',
                }}
            >
                <Table sx={{ minWidth: 800 }} stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {[
                                "Order Number", "Created At", "Advisor Name", "Mobile Number", 
                                "Farmer Alt. Number", "Farmer Name", "Village", "Taluka", 
                                "District", "Pincode", "Nearby Location", "Post Office",  // Added Post Office column
                                "Product Names", "Total Quantity", "Total Amount", "Discount Amount", "Final Amount", "Order Status", "Change Status"
                            ].map(header => (
                                <TableCell key={header} sx={{ backgroundColor: "#BBCD79", fontWeight: "bold", textAlign: "center" }}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={18} align="center">
                                    No {filterStatus || 'orders'} found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map(order => (
                                <TableRow key={order._id} hover>
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
                                        <ol style={{ padding: 0, margin: 0 }}>
                                            {order.products?.map(product => (
                                                <li key={`${product.productId?._id}-${order._id}`}>
                                                    {product.productId?.name || 'N/A'}
                                                </li>
                                            )) || 'N/A'}
                                        </ol>
                                    </TableCell>
                                    <TableCell>{order.products?.reduce((acc, product) => acc + product.quantity, 0) || 0}</TableCell>
                                    <TableCell>{(order.totalAmount || 0) + (order.discount || 0)}</TableCell>
                                    <TableCell>{order.discount || 0}</TableCell>
                                    <TableCell>{order.totalAmount || 0}</TableCell>
                                    <TableCell>{order.orderStatus}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.orderStatus || 'Pending'}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            disabled={updating}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Confirm">Confirm</MenuItem>
                                            <MenuItem value="Cancel">Cancel</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Sidebar>
    );
};

export default OperationalAdminSeeOrders;