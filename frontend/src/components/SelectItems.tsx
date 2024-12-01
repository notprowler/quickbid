import React from "react";
import { Box, Checkbox, Typography, Button } from "@mui/material";

interface SelectItemsProps {
  isAllSelected: boolean;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

const SelectItems: React.FC<SelectItemsProps> = ({ isAllSelected, onSelectAll, onDelete }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "2px solid #333",
        borderRadius: "4px",
        padding: "16px",
        gap: "24px",
        width: "100%",
        maxWidth: "1000px",
        height: "100px", // Smaller height
        backgroundColor: "#fff",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Checkbox
          checked={isAllSelected}
          onChange={onSelectAll}
          className="h-5 w-5 text-blue-500"
        />
        <Typography variant="h6" sx={{ color: "black" }}>
          Select All Items
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={onDelete}
        sx={{ backgroundColor: "green", color: "white" }}
      >
        Delete Selected
      </Button>
    </Box>
  );
};

export default SelectItems;