import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SideNavbar/Sidebar";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import ApiLoader
import { toast, ToastContainer } from "react-toastify"; // Import Toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const OperationalAdminShowAddProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedDescription, setExpandedDescription] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/operational-admin/products`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        toast.success("Products loaded successfully!");  // Notify on success
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products: " + error.message); // Notify on error
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar>
      <Box sx={{ padding: 3 }}>
        <ToastContainer /> {/* Include ToastContainer */}
        
        <Typography variant="h4" gutterBottom>
          List of Products
        </Typography>
        <TextField
          label="Search by Product Name"
          variant="outlined"
          sx={{ width: 300, mb: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => {
                    setSearchTerm("");
                    toast.info("Search cleared"); // Notify on clearing search
                }} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" m={3}>
            <ApiLoader /> {/* Show ApiLoader while loading */}
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Sr. No.
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Photo
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Subcategory
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Price (INR)
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#BBCD79", color: "black", textAlign: "center", fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <TableRow key={product._id} hover>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="img-thumbnail"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">{product.name}</TableCell>
                      <TableCell className="text-center">{product.category}</TableCell>
                      <TableCell className="text-center">{product.subcategory}</TableCell>
                      <TableCell className="text-center">
                        <Typography variant="body2">
                          {expandedDescription[product._id]
                            ? product.description
                            : `${product.description.slice(0, 50)}... `}
                          <Link to={`/operational-admin-dashboard/list-product/${product._id}`}>
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => toggleDescription(product._id)}
                            >
                              {expandedDescription[product._id] ? "Show Less" : "Read More"}
                            </Button>
                          </Link>
                        </Typography>
                      </TableCell>
                      <TableCell className="text-center">₹{product.price}</TableCell>
                      <TableCell className="text-center">
                        <Link to={`/operational-admin-dashboard/list-product/${product._id}`}>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "#A52A2A", '&:hover': { backgroundColor: '#A3C161' } }}
                            size="small"
                          >
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No Product Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Sidebar>
  );
};

export default OperationalAdminShowAddProduct;