import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
} from '@mui/material';
import axios from 'axios';
import Sidebar from '../../components/SideNavbar/AdvisorSidebar';
import ApiLoader from '../../components/ApiLoader/ApiLoader'; // Import the ApiLoader component

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-admin/products`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar>
      <Container className="mt-5">
        <Typography variant="h4" className="mb-4" align="center">
          Product List
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search for a product..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {loading ? (
          <ApiLoader /> // Show the ApiLoader while loading
        ) : error ? (
          <Typography variant="h6" align="center" className="mt-4">
            Error: {error}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card className="shadow-lg mb-4">
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.images[0] || 'https://via.placeholder.com/150'} // Use the first image or fallback
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div" className="font-bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" className="mt-2">
                      ₹ {product.price}
                    </Typography>
                    {/* <Button variant="contained" color="primary" className="mt-2">
                      Add to Cart
                    </Button> */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {filteredProducts.length === 0 && !loading && (
          <Typography variant="h6" align="center" className="mt-4">
            No products found.
          </Typography>
        )}
      </Container>
    </Sidebar>
  );
}

export default ProductList;