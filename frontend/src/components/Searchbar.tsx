import React from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionTextField = motion(TextField);

const Searchbar: React.FC = () => {
  return (
    <MotionBox
      sx={{
        width: "800px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: '10px'
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
          width: "700px",
          height: "50px",
          backgroundColor: "white",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            height: "50px",
            boxShadow: "0 1px 6px rgba(32,33,36,0.28)",
            "&.Mui-focused": {
              boxShadow: "0 1px 8px rgba(32,33,36,0.35)",
              borderColor: "#dfe1e5",
            },
          },
        }}
        whileFocus={{ scale: 1.05 }}
      />
      <Button
        sx={{
          color: 'white',
          backgroundColor: 'black',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          height: '50px',
          padding: '0 20px',
          minWidth: '100px',
          '&:hover': {
            backgroundColor: 'black',
          },
        }}
      >
        Search
      </Button>
    </MotionBox>
  );
};

export default Searchbar;