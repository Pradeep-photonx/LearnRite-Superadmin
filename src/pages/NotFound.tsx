// src/pages/NotFound.tsx
import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import Layout from '../layouts/Layout';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    // <Layout>
    <Container>
      <Box textAlign="center" py={10}>
        <Typography variant="h4" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you are looking for does not exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/home')}>
          Go to Home
        </Button>
      </Box>
    </Container>
    // </Layout>
  );
};

export default NotFound;
