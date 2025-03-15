import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Sidebar from '../../components/SideNavbar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import the ApiLoader
import { toast, ToastContainer } from 'react-toastify'; // Import Toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const OperationalAdminEditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        images: [],
        description: '',
        category: '',
        subcategory: '',
        price: '',
    });
    const [loading, setLoading] = useState(true); // Loading state initialized to true
    const [imageFiles, setImageFiles] = useState([]); // State for holding newly uploaded files
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operational-admin/products/${id}`, {
                    credentials: "include",
                });
                const data = await response.json();
                setProduct({
                    name: data.name,
                    images: data.images, // Assume this is an array of image URLs
                    description: data.description,
                    category: data.category,
                    subcategory: data.subcategory,
                    price: data.price,
                });
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validImageFiles = [];
        const maxImageSize = 1 * 1024 * 1024; // 1MB in bytes
        setErrorMessage(''); // Reset error message

        files.forEach((file) => {
            if (file.size <= maxImageSize) {
                validImageFiles.push(URL.createObjectURL(file)); // Create a URL for the image
            } else {
                setErrorMessage(`${file.name} exceeds the 1MB size limit.`); // Show error if image size exceeds limit
            }
        });

        // Update the state only with valid images
        if (validImageFiles.length > 0 && errorMessage === '') {
            setImageFiles(validImageFiles); // Update state with valid images
        } else {
            setImageFiles([]); // Clear the image files if there are errors
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prevent submitting if there are any error messages
        if (errorMessage) {
            toast.error("Please fix the image size errors before submitting.");
            return;
        }

        // Proceed to update the product if all validations pass
        fetch(`${process.env.REACT_APP_API_URL}/api/operational-admin/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ ...product, images: imageFiles }), // Send the latest uploaded images
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update product');
                }
                return response.json();
            })
            .then((data) => {
                toast.success("Product updated successfully!"); // Notify success
                // Update the product state with the new image URL
                setProduct(prev => ({
                    ...prev,
                    images: imageFiles // Update with the latest images
                }));
                navigate(`/operational-admin-dashboard/list-product`);
            })
            .catch((error) => {
                console.error("Error updating product:", error);
                toast.error("Error updating product"); // Notify error
            });
    };

    return (
        <Sidebar>
            <ToastContainer /> {/* Include ToastContainer for toast notifications */}
            <Box sx={{ padding: 3 }} className="container">
                <Typography variant="h4" gutterBottom align="center">
                    Edit Product
                </Typography>
                {loading ? ( // Show ApiLoader if loading is true
                    <ApiLoader />
                ) : (
                    <form onSubmit={handleSubmit} className="mb-4">
                        {/* Section to Render Uploaded Images */}
                        <Box className="mb-3">
                            <Typography variant="h6">Current Product Image:</Typography>
                            <Box display="flex" flexWrap="wrap" className="g-2 mb-2">
                                {/* Display current product images */}
                                {product.images?.length > 0 ? (
                                    <img
                                        src={product.images[0]} // Display the first image as the current image
                                        alt="Current Product"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                ) : (
                                    <Typography variant="body2">No image uploaded.</Typography>
                                )}
                            </Box>
                            <Typography variant="h6">Uploaded Images:</Typography>
                            <Box display="flex" flexWrap="wrap" className="g-2 mb-2">
                                {/* Display newly uploaded images */}
                                {imageFiles.map((file, index) => (
                                    <img
                                        key={index} // Ensure unique key
                                        src={file}
                                        alt={`Newly Uploaded Image ${index + 1}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                ))}
                                {errorMessage && (
                                    <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                                        {errorMessage}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <div className="mb-3">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="form-control"
                            />
                            <Typography variant="caption" display="block" gutterBottom>
                                *Upload multiple images (max size 1MB each)
                            </Typography>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-md-6">
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <TextField
                                fullWidth
                                label="Product Description"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3 row">
                            <div className="col-md-6">
                                <TextField
                                    fullWidth
                                    label="Category"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    fullWidth
                                    label="Subcategory"
                                    name="subcategory"
                                    value={product.subcategory}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-md-6">
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Product Price (in INR)"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="d-block mx-auto"
                        >
                            Update Product
                        </Button>
                    </form>
                )}
            </Box>
        </Sidebar>
    );
};

export default OperationalAdminEditProduct;