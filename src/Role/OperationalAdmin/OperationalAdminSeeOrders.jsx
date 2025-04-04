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
    backgroundColor: 'green',
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '15px',
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#ffffff',
    color: '#000000',
    textAlign: 'center',
    padding: '10px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#f5f5f5',
    },
    '&:hover': {
        backgroundColor: 'lightgreen',
    },
}));

const TableStyledContainer = styled(TableContainer)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginBottom: '20px',
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
    const [filteredOrders, setFilteredOrders] = useState([]);

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

                if (headerPosition < 0) {
                    setHeaderSticky(true);
                    setHeaderZIndex(1000);
                } else {
                    setHeaderSticky(false);
                    setHeaderZIndex(1);
                }
            }
        };

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
        filterOrdersByStatus(filterStatus, filteredOrdersByDate); // Apply status filter immediately
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/advisory/orders/${orderId}/status`, { status: newStatus });
            setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
            filterOrdersByDate(selectedDate, orders);
            toast.success("Order status updated successfully!");
        } catch (error) {
            console.error("Failed to update order status:", error);
            setError("Failed to update order status");
            toast.error("Error updating order status");
        } finally {
            setUpdating(false);
        }
    };

    const filterOrdersByStatus = (status, ordersList) => {
        const filtered = ordersList.filter(order => (status === '' || order.orderStatus === status));
        setFilteredOrders(filtered);
    };

    useEffect(() => {
        filterOrdersByStatus(filterStatus, selectedDateOrders); // Re-filter orders when status changes
    }, [filterStatus, selectedDateOrders]);

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
        filterOrdersByStatus(event.target.value, selectedDateOrders); // Apply filter immediately
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
        setSelectedDate(dateString);
    };

    const calculateOrderAmounts = (order) => {
        const totalAmount = order.products.reduce((acc, product) => 
            acc + (product.productId?.price || 0) * product.quantity, 0
        );
        const discount = order.discount || 0;
        const finalAmount = Math.max(0, totalAmount - discount); // ensure final amount doesn't go negative
    
        return { totalAmount, discount, finalAmount };
    };

    const exportToExcel = () => {
        const excelData = filteredOrders.map(order => {
            const { totalAmount, discount, finalAmount } = calculateOrderAmounts(order);
            return {
                'Order Number': order._id,
                'Placed At': new Date(order.createdAt).toLocaleString(),
                'Advisor Name': order.advisorId?.name || 'N/A',
                'Mobile Number': order.customerId?.mobileNumber || 'N/A',
                'Farmer Alt. Number': order.customerId?.alternativeNumber || 'N/A',
                'Farmer Name': order.customerId?.name || 'N/A',
                'Village/Post': `${order.customerId?.village || 'N/A'} / ${order.customerId?.postOffice || 'N/A'}`,
                'Taluka': order.customerId?.taluka || 'N/A',
                'District': order.customerId?.district || 'N/A',
                'Pincode': order.customerId?.pincode || 'N/A',
                'Nearby Location': order.customerId?.nearbyLocation || 'N/A',
                'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
                'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
                'Total Amount': totalAmount,
                'Discount Amount': discount,
                'Final Amount': finalAmount,
                'Order Status': order.orderStatus 
            };
        });
        
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, `AllOrders.xlsx`);
    };

    const csvData = filteredOrders.map(order => {
        const { totalAmount, discount, finalAmount } = calculateOrderAmounts(order);
        return {
            'Order Number': order._id,
            'Placed At': new Date(order.createdAt).toLocaleString(),
            'Advisor Name': order.advisorId?.name || 'N/A',
            'Mobile Number': order.customerId?.mobileNumber || 'N/A',
            'Farmer Alt. Number': order.customerId?.alternativeNumber || 'N/A',
            'Farmer Name': order.customerId?.name || 'N/A',
            'Village/Post': `${order.customerId?.village || 'N/A'} / ${order.customerId?.postOffice || 'N/A'}`,
            'Taluka': order.customerId?.taluka || 'N/A',
            'District': order.customerId?.district || 'N/A',
            'Pincode': order.customerId?.pincode || 'N/A',
            'Nearby Location': order.customerId?.nearbyLocation || 'N/A',
            'Product Names': order.products.map(product => product.productId?.name || 'N/A').join(', '),
            'Total Quantity': order.products.reduce((acc, product) => acc + product.quantity, 0),
            'Total Amount': totalAmount,
            'Discount Amount': discount,
            'Final Amount': finalAmount,
            'Order Status': order.orderStatus,
        };
    });

    const exportToPDF = () => {
        const pdfDoc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a3',
        });
    
        const rows = filteredOrders.map(order => {
            const { totalAmount, discount, finalAmount } = calculateOrderAmounts(order);
            return [
                order._id,
                new Date(order.createdAt).toLocaleString(),
                order.advisorId?.name || 'N/A',
                order.customerId?.mobileNumber || 'N/A',
                order.customerId?.alternativeNumber || 'N/A',
                order.customerId?.name || 'N/A',
                `${order.customerId?.village || 'N/A'} / ${order.customerId?.postOffice || 'N/A'}`,
                order.customerId?.taluka || 'N/A',
                order.customerId?.district || 'N/A',
                order.customerId?.pincode || 'N/A',
                order.customerId?.nearbyLocation || 'N/A',
                order.products.map(product => product.productId?.name || 'N/A').join(', '),
                order.products.reduce((acc, product) => acc + product.quantity, 0),
                totalAmount.toFixed(2),
                discount,
                finalAmount.toFixed(2),
                order.orderStatus || 'N/A'
            ];
        });

        const tableColumnNames = [
            "Order Number", "Placed At", "Advisor Name", "Mobile Number", 
            "Farmer Alt. Number", "Farmer Name", "Village/Post", "Taluka", 
            "District", "Pincode", "Nearby Location",
            "Product Names", "Total Quantity", "Total Amount", "Discount Amount", "Final Amount", 
            "Order Status"
        ];

        pdfDoc.autoTable({
            head: [tableColumnNames],
            body: rows,
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontSize: 8,
                halign: 'center',
                valign: 'middle',
                cellPadding: 2
            },
            headStyles: {
                fillColor: [0, 128, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9
            },
            margin: { top: 20 },
            theme: 'grid',
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 100 },
                2: { cellWidth: 75 },
                3: { cellWidth: 85 },
                4: { cellWidth: 85 },
                5: { cellWidth: 75 },
                6: { cellWidth: 60 },
                7: { cellWidth: 60 },
                8: { cellWidth: 60 },
                9: { cellWidth: 60 },
                10: { cellWidth: 80 },
                11: { cellWidth: 80 },
                12: { cellWidth: 150 },
                13: { cellWidth: 50 },
                14: { cellWidth: 70 },
                15: { cellWidth: 70 },
                16: { cellWidth: 70 },
                17: { cellWidth: 70 }
            },
            cellWidth: 'auto',
            overflow: 'linebreak',
        });

        pdfDoc.setFontSize(18);
        pdfDoc.text("Order List", 20, 30);
        
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
                                        "Farmer Alt. Number", "Farmer Name", "Village/Post", "Taluka", 
                                        "District", "Pincode", "Nearby Location",
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
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCellBody colSpan={18} align="center" sx={{ padding: '20px', border: '1px solid #e0e0e0' }}>
                                            No {filterStatus || 'orders'} found
                                        </StyledTableCellBody>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map(order => {
                                        const totalAmount = order.products.reduce((acc, product) => 
                                            acc + (product.productId?.price || 0) * product.quantity, 0
                                        );

                                        const finalAmount = totalAmount - (order.discount || 0);

                                        return (
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
                                                    {order.customerId?.village || 'N/A'}  ,  
                                                    {order.customerId?.postOffice || 'N/A'}
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
                                                {/* <StyledTableCellBody>
                                                    {order.customerId?.postOffice || 'N/A'}
                                                </StyledTableCellBody> */}
                                                <StyledTableCellBody>
                                                    {order.products?.map(product => product.productId?.name || 'N/A').join(', ')}
                                                </StyledTableCellBody>
                                                <StyledTableCellBody>
                                                    {order.products?.reduce((acc, product) => acc + product.quantity, 0) || 0}
                                                </StyledTableCellBody>
                                                <StyledTableCellBody>
                                                    {totalAmount.toFixed(2)}
                                                </StyledTableCellBody>
                                                <StyledTableCellBody>
                                                    {order.discount || 0}
                                                </StyledTableCellBody>
                                                <StyledTableCellBody>
                                                    {finalAmount.toFixed(2)}
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
                                        );
                                    })
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