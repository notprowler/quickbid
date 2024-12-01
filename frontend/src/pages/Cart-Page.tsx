import React, { useState, useEffect } from "react";
import SummaryOrder from '../components/SummaryOrder';
import { Box, Typography } from '@mui/material';
import CardComponent from '../components/CardComponent';
import SelectItems from '../components/SelectItems';
import Footer from "../components/Footer";

interface Item {
  id: number;
  title: string;
  quantity: number;
  price: number;
  userHighestBid: number;
  currentHighestBid: number;
  imageUrl: string;
}

const CartPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, title: "Item 1", quantity: 1, price: 10, userHighestBid: 50, currentHighestBid: 60, imageUrl: "https://via.placeholder.com/250" },
    { id: 2, title: "Item 2", quantity: 1, price: 20, userHighestBid: 70, currentHighestBid: 80, imageUrl: "https://via.placeholder.com/250" },
    { id: 3, title: "Item 3", quantity: 1, price: 30, userHighestBid: 90, currentHighestBid: 100, imageUrl: "https://via.placeholder.com/250" },
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', padding: '20px', fontFamily: "Arial, sans-serif", backgroundColor: '#fff' }}>
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <Typography variant="h3" sx={{ color: 'black' }}>Current Live Bids</Typography>
      </Box>
      
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexGrow: 1 }}>
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <SelectItems />
          {items.map((item) => (
            <CardComponent 
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

      <Footer />
    </Box>
  );
};

export default CartPage;