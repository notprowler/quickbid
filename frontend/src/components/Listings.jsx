import React from 'react'
import SearchBar from '../Components/SearchBar.jsx';
import Card from './../Components/Card.jsx';
import { Box } from '@mui/material';

const Listings = () => {
  const inter = [];
  for(let i = 0; i < 5; i ++)
  {
   
    for(let j = 0; j < 3; j++)
    {
      inter.push([i,j])
    }
   
  }
  return (
    <Box sx = {{display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
    <SearchBar></SearchBar>
    <Box
    sx = {{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', padding: '10px', color: 'white'}}
    >
       {inter.map((items) =>
      (
        <Card key={items} />
      ))}
    </Box>
    </Box>

  )
}

export default Listings