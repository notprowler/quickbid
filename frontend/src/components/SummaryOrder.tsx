import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface SummaryOrderProps {
  subtotal: number;
}

const SummaryOrder: React.FC<SummaryOrderProps> = ({ subtotal }) => {
  return (
    <Box sx={{ padding: '25px', border: '2px solid black', borderRadius: '16px', width: '300px', height: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px', color: 'black', textAlign: 'left' }}>Summary Order</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', color: 'black' }}>
        <Typography variant="body1" sx={{ textAlign: 'left' }}>Sum Total</Typography>
        <Typography variant="body1" sx={{ textAlign: 'left', marginLeft: '5px' }}>${subtotal}</Typography>
      </Box>
      <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white', borderRadius: '16px' }} fullWidth>Buy</Button>
    </Box>
  );
};

export default SummaryOrder;