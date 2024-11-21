import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ShopIcon from '@mui/icons-material/Shop';
import {motion} from 'framer-motion';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
const Navbar = () => {

  const MotionTypography = motion(Typography);

  return (
    <AppBar sxposition="static" sx = {{ backgroundColor: 'white'}}>
      <Toolbar>
        <IconButton edge="start" color="white" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <MotionTypography
          variant="h6"
          style={{
            fontFamily: 'Inter',
            color: 'black',
            flexGrow: 1,
            textAlign: 'left',
            fontSize: '22px'
          }}
          whileHover={{ scale: 1.05, textShadow: '15px 10px 8px rgb(255,255,255)' }} 
        >
          QuickBID
        </MotionTypography>
        <Box 
          sx={{ 
            position: { xs: 'static', sm: 'static', md: 'absolute' }, 
            left: { md: '50%' }, 
            transform: { md: 'translateX(-50%)' }, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button sx = {{color: 'black'}}>Home</Button>
            <Button sx = {{color: 'black'}}>Categories</Button>
            <Button sx = {{color: 'black'}}>Listings</Button>
          </Stack>
        </Box>

        <IconButton sx = {{color: 'black'}}color="inherit">
          <ShopIcon />
        </IconButton>
        <Button sx = {{color: 'black'}}color="black">Login</Button>
        
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;