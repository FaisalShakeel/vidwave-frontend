import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose} // Optional: allows parent to handle close event
      anchorOrigin={{ vertical: "top", horizontal: "center" }} // Centered at bottom
    >
      <Alert
        severity={severity} // "error", "success", etc.
        sx={{
          fontFamily: "Velyra",
        
    
        
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;