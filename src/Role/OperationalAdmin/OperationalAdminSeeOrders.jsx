import React, { useEffect, useState, useRef } from 'react';
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
    styled,
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

// Styled components for improved UI
const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
    backgroundColor: 'green', // Green background for header
    color: '#ffffff',          // White text for header
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '15px',          // Added padding for even spacing
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#ffffff', // White background for body cells
    color: '#000000',            // Black text for body cells
    textAlign: 'center',
    padding: '10px',            // Added padding for even spacing
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#f5f5f5', // Light gray background for odd rows
    },
    '&:hover': {
        backgroundColor: 'lightgreen', // Light green on hover
    },
}));

const TableStyledContainer = styled(TableContainer)(({ theme }) => ({
    backgroundColor: '#ffffff', // White background for the table
    borderRadius: '8px',        // Rounded corners for a better aesthetic
    marginBottom: '20px',       // Added margin to the bottom
    // Removed fixed height to allow the table to expand with content
}));

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
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
    const headerRef = useRef(null);
    const [headerSticky, setHeaderSticky] = useState(false);
    const [headerZIndex, setHeaderZIndex] = useState(1);

    useEffect(() => {
        const fetchOrders = async (date) => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory/orders`);
                console.log('Fetched orders:', response.data);

                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                    filterOrdersByDate(date, response.data);
                } else {
                    setError("Expected an array but received: " + JSON.stringify(response.data));
                }
            } catch (err) {
                setError(err.response ? err.response.data.message : "An error occurred while fetching orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders(selectedDate);
    }, [selectedDate]); // Fetch orders when selectedDate changes

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                const headerPosition = headerRef.current.getBoundingClientRect().top;

                // Check if the header should be sticky
                if (headerPosition < 0) {
                    setHeaderSticky(true);
                    setHeaderZIndex(1000); // Increase zIndex when sticky
                } else {
                    setHeaderSticky(false);
                    setHeaderZIndex(1);
                }
            }
        };

        // Listen for scroll events
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const filterOrdersByDate = (date, ordersList) => {
        const filteredOrdersByDate = ordersList.filter(order => {
            const orderDate = new Date(order.createdAt);
            return (
                orderDate.getFullYear() === new Date(date).getFullYear() &&
                orderDate.getMonth() === new Date(date).getMonth() &&
                orderDate.getDate() === new Date(date).getDate()
            );
        });
        setSelectedDateOrders(filteredOrdersByDate);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/advisory/orders/${orderId}/status`, { status: newStatus });
            setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
            filterOrdersByDate(selectedDate, orders); // Re-filter orders after status change
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

    const calculateRevenue = (orders) => {
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const pendingRevenue = orders.filter(order => order.orderStatus === "Pending").reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const confirmRevenue = orders.filter(order => order.orderStatus === "Confirm").reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const canceledRevenue = orders.filter(order => order.orderStatus === "Cancel").reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        return { totalRevenue, pendingRevenue, confirmRevenue, canceledRevenue };
    };

    const handleDateClick = (arg) => {
        const dateString = arg.dateStr;
        setSelectedDate(dateString); // Update selected date to fetch new orders
    };

    const exportToExcel = () => {
        const excelData = selectedDateOrders.map(order => ({
            'Order Number': order._id,
            'Placed At': new Date(order.createdAt).toLocaleString(),
            'Advisor Name': order.advisorId?.name || 'N/A',
            'Mobile Number': order.customerId?.mobileNumber || 'N/A',
            'Farmer Alt. Number': order.customerId?.alternativeNumber || 'N/A',
            'Farmer Name': order.customerId?.name || 'N/A',
            'Village': order.customerId?.village || 'N/A',
            'Taluka': order.customerId?.taluka || 'N/A',
            'District': order.customerId?.district || 'N/A',
            'Pincode': order.customerId?.pincode || 'N/A',
            'Nearby Location': order.customerId?.nearbyLocation || 'N/A',
            'Post Office': order.customerId?.postOffice || 'N/A',
            'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
            'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
            'Total Amount': (order.totalAmount || 0) + (order.discount || 0),
            'Discount Amount': order.discount || 0,
            'Final Amount': order.totalAmount - (order.discount || 0),
            'Order Status': order.orderStatus // Added Order Status to Excel export
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, `AllOrders.xlsx`);
    };

    const csvData = selectedDateOrders.map(order => ({
        'Order Number': order._id,
        'Placed At': new Date(order.createdAt).toLocaleString(),
        'Advisor Name': order.advisorId?.name || 'N/A',
        'Mobile Number': order.customerId?.mobileNumber || 'N/A',
        'Farmer Alt. Number': order.customerId?.alternativeNumber || 'N/A',
        'Farmer Name': order.customerId?.name || 'N/A',
        'Village': order.customerId?.village || 'N/A',
        'Taluka': order.customerId?.taluka || 'N/A',
        'District': order.customerId?.district || 'N/A',
        'Pincode': order.customerId?.pincode || 'N/A',
        'Nearby Location': order.customerId?.nearbyLocation || 'N/A',
        'Post Office': order.customerId?.postOffice || 'N/A',
        'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
        'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
        'Total Amount': (order.totalAmount || 0) + (order.discount || 0),
        'Discount Amount': order.discount || 0,
        'Final Amount': order.totalAmount - (order.discount || 0),
        'Order Status': order.orderStatus,
    }));

    const exportToPDF = () => {
        const pdfDoc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a3', // A3 size for wider table
            putOnlyUsedFonts: true,
            floatPrecision: 16
        });
    
        const rows = selectedDateOrders.map(order => ([
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
            order.customerId?.postOffice || 'N/A',
            order.products.map(product => product.productId?.name || 'N/A').join(', '),
            order.products.reduce((acc, product) => acc + product.quantity, 0),
            (order.totalAmount || 0) + (order.discount || 0),
            order.discount || 0,
            (order.totalAmount - (order.discount || 0)).toFixed(2),
            order.orderStatus || 'N/A' // Ensure Order Status is captured
        ]));
    
        const tableColumnNames = [
            'Order Number', 'Placed At', 'Advisor Name', 'Mobile Number',
            'Farmer Alt. Number', 'Farmer Name', 'Village', 'Taluka',
            'District', 'Pincode', 'Nearby Location', 'Post Office',
            'Product Names', 'Total Quantity', 'Final Amount', 'Discount Amount', 'Total Amount', 'Order Status'
        ];
    
        pdfDoc.autoTable({
            head: [tableColumnNames],
            body: rows,
            styles: {
                fillColor: [255, 255, 255], // Body fill color
                textColor: [0, 0, 0], // Body text color
                fontSize: 8, // Font size for data
                halign: 'center', // Center align horizontally
                valign: 'middle', // Middle align vertically
                cellPadding: 2 // Reduced padding
            },
            headStyles: {
                fillColor: [0, 128, 0], 
                textColor: [255, 255, 255], 
                fontStyle: 'bold',
                fontSize: 9 // Font size for header
            },
            margin: { top: 20 },
            theme: 'grid', // Grid theme for the table
            columnStyles: {
                0: { cellWidth: 40 },  // Order Number
                1: { cellWidth: 100 }, // Placed At
                2: { cellWidth: 75 },  // Advisor Name
                3: { cellWidth: 85 },  // Mobile Number
                4: { cellWidth: 85 },  // Farmer Alt. Number
                5: { cellWidth: 75 },  // Farmer Name
                6: { cellWidth: 60 },  // Village
                7: { cellWidth: 60 },  // Taluka
                8: { cellWidth: 60 },  // District
                9: { cellWidth: 60 },  // Pincode
                10: { cellWidth: 80 }, // Nearby Location
                11: { cellWidth: 80 }, // Post Office
                12: { cellWidth: 150 }, // Product Names
                13: { cellWidth: 50 },  // Total Quantity
                14: { cellWidth: 70 },  // Final Amount
                15: { cellWidth: 70 },  // Discount Amount
                16: { cellWidth: 70 },  // Total Amount
                17: { cellWidth: 70 }   // Order Status
            },
            cellWidth: 'auto', 
            overflow: 'linebreak', // Allow text wrapping for long content
        });
    
        // Add a title at the top of the PDF
        pdfDoc.setFontSize(18);
        pdfDoc.text("Order List", 20, 30); // Positioning the title
        
        pdfDoc.save('AllOrders.pdf');
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

    const { totalRevenue, pendingRevenue, confirmRevenue, canceledRevenue } = calculateRevenue(selectedDateOrders);

    return (
        <Sidebar>
            <ToastContainer />
            <Box sx={{ padding: 3, height: '100vh', overflow: 'auto' }}>
                <Typography variant="h4" className="orders-title" gutterBottom>
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
                    <Button variant="contained" onClick={() => setShowCalendar(prev => !prev)} sx={{ marginRight: 2 }}>
                        {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                    </Button>

                    <Button variant="contained" onClick={handleExportClick}>
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
                    <Box className="calendar-container" sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
                        <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} dateClick={handleDateClick} />
                    </Box>
                )}

                <TableStyledContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <div ref={headerRef}>
                        <Table sx={{ minWidth: 2000, tableLayout: 'fixed', borderCollapse: 'collapse' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {[
                                        "Order Number", "Placed At", "Advisor Name", "Mobile Number", 
                                        "Farmer Alt. Number", "Farmer Name", "Village", "Taluka", 
                                        "District", "Pincode", "Nearby Location", "Post Office",
                                        "Product Names", "Total Quantity", "Total Amount", "Discount Amount", "Final Amount", 
                                        "Order Status"
                                    ].map((header) => (
                                        <StyledTableCellHeader key={header}>
                                            {header}
                                        </StyledTableCellHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedDateOrders.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCellBody colSpan={18} align="center" sx={{ padding: '20px', border: '1px solid #e0e0e0' }}>
                                            No {filterStatus || 'orders'} found
                                        </StyledTableCellBody>
                                    </TableRow>
                                ) : (
                                    selectedDateOrders.map(order => (
                                        <StyledTableRow key={order._id} hover>
                                            <StyledTableCellBody>
                                                {order._id?.substring(0, 10)}...
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {new Date(order.createdAt).toLocaleString()}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.advisorId?.name || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.mobileNumber || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.alternativeNumber || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.name || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.village || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.taluka || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.district || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.pincode || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.nearbyLocation || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.customerId?.postOffice || 'N/A'}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.products?.map(product => product.productId?.name || 'N/A').join(', ')}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.products?.reduce((acc, product) => acc + product.quantity, 0) || 0}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.totalAmount || 0}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {order.discount || 0}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                {(order.totalAmount - (order.discount || 0)).toFixed(2)}
                                            </StyledTableCellBody>
                                            <StyledTableCellBody>
                                                <Select
                                                    value={order.orderStatus || ''}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="Confirm">Confirm</MenuItem>
                                                    <MenuItem value="Cancel">Cancel</MenuItem>
                                                </Select>
                                            </StyledTableCellBody>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TableStyledContainer>
            </Box>
        </Sidebar>
    );
};

export default OperationalAdminSeeOrders;