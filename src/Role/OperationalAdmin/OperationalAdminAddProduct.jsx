import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "../../components/SideNavbar/Sidebar";
import ApiLoader from '../../components/ApiLoader/ApiLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";

const OperationalAdminAddProduct = () => {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageErrors, setImageErrors] = useState(""); // Single error message for images
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = {
    "Agro Chemicals": [
      "Fungicide",
      "Insecticide",
      "Herbicide",
      "Fertilizers",
      "Micronutrients",
      "Plant Growth Regulators",
      "Bio Fertilizers",
      "Organic Pesticide",
    ],
    "Allied Products": [
      "Electrical Products",
      "Plastic Sheets",
      "Plastic Nets",
    ],
    Irrigation: ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
    Seeds: [
      "Animal Feed-Grass Seed",
      "Cereals",
      "Flowers",
      "Fruits and Vegetables",
      "Oil Seed",
      "Pulses",
    ],
    "Tools and Machinery": [
      "Plant Care Tools",
      "Sprayer",
      "Sprayer Part",
      "Safety Equipment",
      "Plowing and Cultivator Attachments",
    ],
    Garden: ["Horticulture"],
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = [];
    let hasError = false; // Flag for managing error

    files.forEach((file) => {
      if (file.size <= 1 * 1024 * 1024) { // Check if file size is less than or equal to 1 MB
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          newImagePreviews.push(result); // Store image preview
          setImages([result]); // Set the valid image as the latest one
          setImageErrors(""); // Clear any previous error message if this image is valid
        };
        reader.readAsDataURL(file); // Read file as Base64
      } else {
        hasError = true; // Image exceeds limit, set error flag
      }
    });

    // If an error occurred, set the error message
    if (hasError) {
      setImageErrors("Please upload images that are less than or equal to 1 MB.");
    } else {
      setImagePreviews(newImagePreviews); // Update to show the valid images
    }
  };

  const handlePriceChange = (e) => {
    const input = e.target.value;
    if (!/^\d*$/.test(input)) {
      setError("Price must be a positive number");
    } else {
      setError("");
      const priceValue = Math.max(Number(input), 1);
      setPrice(priceValue.toString());
    }
  };

  const handleClearFields = () => {
    setName("");
    setImages([]);
    setImagePreviews([]);
    setImageErrors("");
    setDescription("");
    setCategory("");
    setSubcategory("");
    setPrice("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageErrors) {
      setError(imageErrors);
      return;
    }

    if (name.length < 6) {
      setError("Product name must be at least 6 characters.");
      return;
    }

    if (price <= 0) {
      setError("Price must be greater than zero.");
      setPrice("1");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/products`,
        {
          name,
          images,
          description,
          category,
          subcategory,
          price,
        },
        { withCredentials: true }
      );
      setSuccess(true);
      handleClearFields();
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <Box className="container mt-3 p-4" style={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <ToastContainer />
        <Typography variant="h5" gutterBottom color="primary" className="mb-4 text-center">
          Add New Product
        </Typography>
        {loading ? (
          <ApiLoader />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} style={{ marginTop: "16px" }}>
                <TextField
                  label="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  error={name.length < 6 && error.includes("Product name")}
                  helperText={
                    name.length < 6 && error.includes("Product name") 
                      ? "Product name must be at least 6 characters." 
                      : ""
                  }
                  placeholder="Enter product name"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" className="mt-3">
                  <InputLabel>Main Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    label="Main Category"
                  >
                    {Object.keys(categories).map((mainCategory) => (
                      <MenuItem key={mainCategory} value={mainCategory}>
                        {mainCategory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  fullWidth
                  select
                  variant="outlined"
                  disabled={!category}
                  placeholder="Select subcategory"
                >
                  {(categories[category] || []).map((sub) => (
                    <MenuItem key={sub} value={sub}>
                      {sub}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Price (INR)"
                  value={price}
                  onChange={handlePriceChange}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!error && !error.includes("images")}
                  helperText={!!error && !error.includes("images") ? error : ""}
                  placeholder="Enter price"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  className="mt-3"
                  placeholder="Enter product description"
                />
              </Grid>

              <Grid item xs={12}>
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="form-control mt-3"
                />
                <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                  {imagePreviews.map((src, index) => (
                    <Box key={index} textAlign="center">
                      <img
                        src={src}
                        alt={`product-${index}`}
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </Box>
                  ))}
                </Box>
                {imageErrors && (
                  <Typography variant="caption" color="error" style={{ marginTop: '10px' }}>
                    {imageErrors}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} className="text-center">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#A52A2A", color: "#fff", marginRight: "10px" }}
                  type="submit"
                >
                  Add Product
                </Button>
                <Button
                  variant="outlined"
                  style={{ borderColor: "#A52A2A", color: "#A52A2A" }}
                  onClick={handleClearFields}
                >
                  Clear Fields
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
        <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
          <Alert severity="success">Product added successfully!</Alert>
        </Snackbar>
      </Box>
    </Sidebar>
  );
};

export default OperationalAdminAddProduct;