import React, { useState, useEffect } from "react";
import SummaryOrder from '../components/SummaryOrder';
import { Box, Typography, Button } from '@mui/material';
import CardComponents from '../Components/CardComponents';
import SelectItems from '../components/SelectItems';

interface Item {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, title: "Item 1", quantity: 1, price: 10 },
    { id: 2, title: "Item 2", quantity: 1, price: 20 },
    { id: 3, title: "Item 3", quantity: 1, price: 30 },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    const newSubtotal = selectedItems.reduce((acc, itemId) => {
      const item = items.find(item => item.id === itemId);
      return acc + (item ? item.price * item.quantity : 0);
    }, 0);
    setSubtotal(newSubtotal);
  }, [selectedItems, items]);

  const handleRemoveItem = (id: number) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
    setSelectedItems((prevSelected) => prevSelected.filter(itemId => itemId !== id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setItems((prevItems) => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleToggleSelect = (id: number, isSelected: boolean) => {
    setSelectedItems((prevSelected) => 
      isSelected ? [...prevSelected, id] : prevSelected.filter(itemId => itemId !== id)
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', padding: '20px', fontFamily: "Arial, sans-serif" }}>
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <Typography variant="h3" sx={{ color: 'black' }}>Current Live Bids</Typography>
      </Box>
      
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexGrow: 1 }}>
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <SelectItems />
          {items.map((item) => (
            <CardComponents 
              key={item.id} 
              item={item} 
              onRemove={handleRemoveItem} 
              onUpdateQuantity={handleUpdateQuantity} 
              onToggleSelect={handleToggleSelect} 
            />
          ))}
        </Box>

        <Box sx={{ flex: 1 }}>
          <SummaryOrder items={items} subtotal={subtotal} />
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', marginTop: 'auto', padding: '20px', borderTop: '1px solid #ccc', textAlign: 'left' }}>
        <Typography>© 2024 QuickBid. All rights reserved.</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '15px', marginTop: '10px' }}>
          <Button href="/home">Home</Button>
          <Button href="/contact">Contact</Button>
          <Button href="/about">About</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;