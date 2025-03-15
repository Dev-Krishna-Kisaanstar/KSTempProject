import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../../components/SideNavbar/Sidebar";
import { useNavigate } from "react-router-dom";
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import ApiLoader

const OperationalAdminShowAddedAdvisor = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/operational-admin/advisories`,
          { withCredentials: true }
        );
        setAdvisories(response.data);
      } catch (error) {
        console.error("Error fetching advisories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisories();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/operational-admin-dashboard/list-advisory/${id}`);
  };

  return (
    <Sidebar>
      <Box m={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Registered Advisories
        </Typography>
        <TableContainer component={Paper} elevation={3} sx={{ maxHeight: 440 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <ApiLoader /> {/* Show ApiLoader while loading */}
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Sr. No.
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {advisories.length > 0 ? (
                  advisories.map((advisory, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{advisory.name}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{advisory.email}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#A52A2A", color: "white" }}
                          onClick={() => handleViewDetails(advisory._id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No advisories registered
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </Sidebar>
  );
};

export default OperationalAdminShowAddedAdvisor;