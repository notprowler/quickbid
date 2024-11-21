import React from "react";
import { Box, TextField, InputAdornment, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";


const MotionBox = motion(Box);
const MotionTextField = motion(TextField);
const SearchBar = () => {
  return (
    <MotionBox
      elevation={3}
      sx={{
        width: "650px",
        display: "flex",
        justifyContent: "center",
        borderRadius: "50px",
        alignItems: "center",
        backgroundColor: "white",// Light grey background
        padding: 2 // Add padding to ensure the content is not squished

      }}
    >
      <MotionTextField
        variant="outlined"
        placeholder="Search for items"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#9aa0a6" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: "600px", // Set specific width
          height: "50px", // Set specific height
          backgroundColor: "white",
          borderRadius: "50px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            boxShadow: "0 1px 6px rgba(32,33,36,0.28)",
            "&.Mui-focused": {
              boxShadow: "0 1px 8px rgba(32,33,36,0.35)",
              borderColor: "#dfe1e5",
            },
          },
        }}
        whileFocus={{ scale: 1.05 }}
      />
      <Button sx = {{color: 'black', backdropFilter: 'contrast(200%)', borderRadius: '16px', height: '50px' }}>Search</Button>
    </MotionBox>
  );
};

export default SearchBar;