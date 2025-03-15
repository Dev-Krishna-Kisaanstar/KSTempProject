// RevenueSummary.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const RevenueSummary = ({ totalRevenue, pendingRevenue, confirmRevenue, canceledRevenue }) => {
    return (
        <Box display="flex" justifyContent="space-around" mb={3}>
            <Box p={2} bgcolor="#d9edf7" borderRadius={1} width="23%">
                <Typography variant="h6" align="center">Total Revenue</Typography>
                <Typography variant="h5" align="center">₹ {totalRevenue.toFixed(2)}</Typography>
            </Box>
            <Box p={2} bgcolor="#fcf8e3" borderRadius={1} width="23%">
                <Typography variant="h6" align="center">Pending Revenue</Typography>
                <Typography variant="h5" align="center">₹ {pendingRevenue.toFixed(2)}</Typography>
            </Box>
            <Box p={2} bgcolor="#dff0d8" borderRadius={1} width="23%">
                <Typography variant="h6" align="center">Confirmed Revenue</Typography>
                <Typography variant="h5" align="center">₹ {confirmRevenue.toFixed(2)}</Typography>
            </Box>
            <Box p={2} bgcolor="#f2dede" borderRadius={1} width="23%">
                <Typography variant="h6" align="center">Canceled Revenue</Typography>
                <Typography variant="h5" align="center">₹ {canceledRevenue.toFixed(2)}</Typography>
            </Box>
        </Box>
    );
};

export default RevenueSummary;