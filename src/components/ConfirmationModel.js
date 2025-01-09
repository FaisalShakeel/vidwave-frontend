import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmationModal = ({ open, handleClose, handleConfirm }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          border: "2px solid #D1E3F8",
          boxShadow: 24,
          borderRadius: "12px",
          p: 4,
          textAlign: "center",
          fontFamily: "Velyra",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: "Velyra", color: "#007BFF", mb: 2 }}
        >
          Do You Want to Delete the Video?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              fontFamily: "Velyra",
              backgroundColor: "#007BFF",
              color: "white",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              fontFamily: "Velyra",
              borderColor: "#007BFF",
              color: "#007BFF",
              "&:hover": { borderColor: "#0056b3", color: "#0056b3" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
