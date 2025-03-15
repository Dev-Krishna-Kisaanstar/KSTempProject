import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideNavbar/Sidebar";
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import the ApiLoader

const OperationalAdminProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching product details
  const [deleting, setDeleting] = useState(false); // Loading state for deletion
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operational-admin/products/${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true); // Start loading state for deletion
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operational-admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      alert(data.message); // Show success message
      navigate("/operational-admin-dashboard/list-product"); // Navigate back to product list
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(false); // End loading state for deletion
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <Box sx={{ padding: 3 }}>
          <ApiLoader /> {/* Show the ApiLoader while data is being fetched */}
        </Box>
      </Sidebar>
    );
  }

  if (!product) {
    return (
      <Sidebar>
        <Box sx={{ padding: 3 }}>
          <Typography variant="h5" align="center">
            Product not found
          </Typography>
        </Box>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Product Details
        </Typography>
        <Card sx={{ marginBottom: 3 }}>
          <CardMedia
            component="img"
            sx={{ width: 250, objectFit: "cover", borderRadius: 1 }}
            image={product.images[0]}
            alt={product.name}
          />
          <CardContent>
            <Typography variant="h5" align="center" component="div" sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      align="center" 
                      sx={{ backgroundColor: "#BBCD79 !important", color: "black !important", fontWeight: "bold" }}
                    >
                      Attribute
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ backgroundColor: "#BBCD79 !important", color: "black !important", fontWeight: "bold" }}
                    >
                      Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">{product.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Subcategory</TableCell>
                    <TableCell align="center">{product.subcategory}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">{product.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">₹{product.price}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", margin: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/operational-admin-dashboard/list-product/edit-product/${id}`)}
                sx={{
                  margin: 1,
                  backgroundColor: "#A52A2A",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#A52A2A",
                    border: "1px solid #A52A2A"
                  }
                }}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/operational-admin-dashboard/list-product")}
                sx={{
                  margin: 1,
                  backgroundColor: "#A52A2A",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#A52A2A",
                    border: "1px solid #A52A2A"
                  }
                }}
              >
                Back to Products
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={deleting} // Disable while deleting
                sx={{
                  margin: 1,
                  backgroundColor: "#A52A2A",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#A52A2A",
                    border: "1px solid #A52A2A"
                  }
                }}
              >
                {deleting ? <ApiLoader /> : "Delete"} {/* Show loader or delete text */}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Sidebar>
  );
};

export default OperationalAdminProductDetails;