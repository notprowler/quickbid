import React, { useState, useEffect } from "react";
import { Box, Checkbox, Button, Typography, IconButton, Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Item {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

interface CardComponentsProps {
  item: Item;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onToggleSelect: (id: number, isSelected: boolean) => void;
}

const CardComponents: React.FC<CardComponentsProps> = ({ item, onRemove, onUpdateQuantity, onToggleSelect }) => {
  const [counter, setCounter] = useState<number>(item.quantity);
  const [title, setTitle] = useState<string>(item.title);
  const [price, setPrice] = useState<number>(item.price);
  const [currentPrice, setCurrentPrice] = useState<number>(item.price * item.quantity);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPrice(price * counter);
  }, [counter, price]);

  const handleIncrement = () => {
    const newQuantity = counter + 1;
    setCounter(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = counter > 1 ? counter - 1 : 1;
    setCounter(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleToggleSelect = () => {
    setIsSelected(!isSelected);
    onToggleSelect(item.id, !isSelected);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid #333', borderRadius: '4px', padding: '24px', gap: '24px', width: '100%', maxWidth: '1000px', height: '200px', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
      <Checkbox className="h-5 w-5 text-blue-500" checked={isSelected} onChange={handleToggleSelect} />

      <Box sx={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: 'auto', color: 'black', border: '1px solid #333', padding: '4px', borderRadius: '4px' }}>{title}</Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>Price: ${currentPrice.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #333', padding: '8px', borderRadius: '4px' }}>
          <Button onClick={handleDecrement} sx={{ backgroundColor: '#f0f0f0', borderRadius: '100%', border: '1px solid #333', padding: '12px', minWidth: '40px', color: 'black' }}>-</Button>
          <Typography variant="h6" sx={{ color: 'black' }}>{counter}</Typography>
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
    </Box>
  );
};

export default CardComponents;