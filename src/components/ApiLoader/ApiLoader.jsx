import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Style the loader container
const LoaderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundImage: 'url("path_to_farming_background_image.jpg")', // Path to your farming background image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
});

function ApiLoader() {
  return (
    <LoaderContainer>
      <CircularProgress style={{ color: 'green' }} />
      <Typography variant="h6" style={{ marginTop: '16px', color:'black' }}>
        Loading, please wait...
      </Typography>
    </LoaderContainer>
  );
}

export default ApiLoader;