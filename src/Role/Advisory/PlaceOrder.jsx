import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApiLoader from '../../components/ApiLoader/ApiLoader';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const PlaceOrder = ({ customerId, advisorId, isAddressFilled }) => {
  const [products, setProducts] = useState([{ productId: "", quantity: 1, price: 0 }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(""); // Initialize as an empty string
  const [productOptions, setProductOptions] = useState([]);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { mobileNumber } = useParams();
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-admin/products`);
        setProductOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateTotalAmount = (products, discount) => {
    const validDiscount = Number(discount) || 0;

    const subtotal = products.reduce((acc, product) => {
      const quantity = Number(product.quantity) || 0;
      const price = Number(product.price) || 0;
      return acc + price * quantity;
    }, 0);
    const total = Math.max(subtotal - validDiscount, 0);
    setTotalAmount(total); // Set the calculated total
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    if (field === "productId") {
      const selectedProduct = productOptions.find((p) => p._id === value);
      newProducts[index].productId = value;
      newProducts[index].price = selectedProduct ? Number(selectedProduct.price) : 0;
    } else {
      newProducts[index][field] = value;
    }

    if (field === "quantity" && value <= 0) {
      newProducts[index].quantity = 1;
    }

    setProducts(newProducts);
    calculateTotalAmount(newProducts, discount); // Recalculate total with the new product list
  };

  const addProduct = () => {
    setProducts([...products, { productId: "", quantity: 1, price: 0 }]);
  };

  const deleteProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
    calculateTotalAmount(newProducts, discount); // Recalculate total after deleting
  };

  const handleDiscountChange = (value) => {
    // Update to handle empty input as well
    const validDiscount = value < 0 ? 0 : (value === "" ? "" : Number(value));
    setDiscount(validDiscount);
    calculateTotalAmount(products, validDiscount); // Recalculate total amount when discount changes
  };

  const handleSubmit = async () => {
    const hasEmptyProduct = products.some((product) => product.productId.trim() === "");
    if (hasEmptyProduct) {
      setError("Please select all products.");
      setSnackbarOpen(true);
      toast.error("Please select all products.");
      return;
    }
  
    if (products.length === 0) {
      console.error("No products to place order");
      return;
    }
  
    // Address check
    try {
      setSubmitting(true);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory/customers/${mobileNumber}`);
      const { village, taluka, district, state, pincode, nearbyLocation, postOffice } = response.data;
  
      const isAddressFilled = village && taluka && district && state && pincode && postOffice;
  
      if (!isAddressFilled) {
        toast.error("Address is required. Please enter and save the address.");
        setError("Address is required. Please enter and save the address.");
        setSnackbarOpen(true);
        setSubmitting(false);
        return;
      }
  
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Error fetching address details.");
      setSubmitting(false);
      return;
    }
  
    // Place order
    const orderProducts = products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
      amount: product.price,
    }));
  
    const dataToSend = {
      customerId,
      advisorId,
      products: orderProducts,
      discount,
      totalAmount,
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/advisory/place-order`, dataToSend);
      console.log("Order placed:", response.data);
      toast.success("Order placed successfully!");
      navigate("/advisory-dashboard/order-success");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <ApiLoader />;
  }

  return (
    <Box className="container mt-4">
      <ToastContainer />
      <Typography variant="h4" sx={{ color: '#6C584C' }} className="text-center mb-4">Place Order</Typography>
      {products.map((product, index) => (
        <Box key={index} className="row mb-3 align-items-center">
          <div className="col-md-4">
            <TextField
              select
              label="Product"
              value={product.productId}
              onChange={(e) => handleProductChange(index, "productId", e.target.value)}
              fullWidth
              required
              variant="outlined"
            >
              {productOptions.map((option) => (
                <MenuItem key={option._id} value={option._id}>{option.name}</MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-md-2">
            <TextField
              label="Quantity"
              type="number"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, "quantity", Number(e.target.value) || 1)}
              fullWidth
              required
              variant="outlined"
            />
          </div>
          <div className="col-md-3">
            <TextField
              label="Price"
              type="number"
              value={product.price}
              fullWidth
              variant="outlined"
              disabled
            />
          </div>
          <div className="col-md-1">
            <IconButton onClick={() => deleteProduct(index)} color="error" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </div>
        </Box>
      ))}

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#6C584C',
          borderRadius: 20,
          "&:hover": { backgroundColor: "#DDE5B6", color: 'black' },
          color: 'white',
          padding: '10px 20px',
          fontWeight: 'bold',
        }}
        className="mb-3"
        onClick={addProduct}
      >
        Add Another Product
      </Button>

      <TextField
        label="Discount"
        type="number"
        value={discount} // This will now properly show as an empty field when discount is ""
        onChange={(e) => handleDiscountChange(e.target.value)} // Change handler captures the entire value
        fullWidth
        variant="outlined"
        className="mb-3"
      />
      <Typography variant="h6" className="mb-4" sx={{ color: 'red' }}>
        Total Amount: ₹ {totalAmount.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#6C584C',
          borderRadius: 20,
          "&:hover": { backgroundColor: "#DDE5B6", color: 'black' },
          color: 'white',
          padding: '10px 20px',
          fontWeight: 'bold',
        }}
        fullWidth
        className="mb-4"
        onClick={handleSubmit}
        disabled={submitting || !isAddressFilled} // Button enable state based on address
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error}
      />
    </Box>
  );
};

export default PlaceOrder;