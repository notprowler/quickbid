import React from 'react';
import { Box, Typography, Button, Divider, IconButton, Paper, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import cuteDog from '../assets/cutedog.jpg';

interface Item {
  id: number;
  title: string;
  quantity: number;
  price: number;
  userHighestBid: number;
  currentHighestBid: number;
  imageUrl: string;
}

interface CardComponentProps {
  item: Item;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onToggleSelect: (id: number, isSelected: boolean) => void;
}

const CardComponent: React.FC<CardComponentProps> = ({ item, onRemove, onUpdateQuantity, onToggleSelect }) => {
  const { title, userHighestBid, currentHighestBid, imageUrl } = item;

  const handleDecrement = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <Paper elevation={3} sx={{ padding: '16px', borderRadius: '16px', borderRight: '1px solid #333', backgroundColor: '#ffffff', display: 'flex', gap: '16px' }}>
      <CardMedia
        component="img"
        sx={{ width: 151, borderRadius: '8px' }}
        image={cuteDog}
        alt={title}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: 'auto', color: 'black', border: '1px solid #333', padding: '4px', borderRadius: '4px' }}>{title}</Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>Your Highest Bid: ${userHighestBid.toFixed(2)}</Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>Current Highest Bid: ${currentHighestBid.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #333', padding: '8px', borderRadius: '4px' }}>
          <Button onClick={handleDecrement} sx={{ backgroundColor: '#f0f0f0', borderRadius: '100%', border: '1px solid #333', padding: '12px', minWidth: '40px', color: 'black' }}>-</Button>
          <Typography variant="h6" sx={{ color: 'black' }}>{item.quantity}</Typography>
          <Button onClick={handleIncrement} sx={{ backgroundColor: '#f0f0f0', borderRadius: '100%', border: '1px solid #333', padding: '12px', minWidth: '40px', color: 'black' }}>+</Button>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />

        <Box sx={{ display: 'flex', gap: '16px' }}>
          <IconButton title="Delete" sx={{ color: 'gray' }} onClick={() => onRemove(item.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton title="Price" sx={{ color: 'gray' }}>
            <AttachMoneyIcon />
          </IconButton>
          <IconButton title="Arrow Forward" sx={{ color: 'gray' }}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default CardComponent;