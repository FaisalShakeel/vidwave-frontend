import React from "react";
import { Modal, Box, CircularProgress, Typography } from "@mui/material";

const DeletingModal = ({ open }) => {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "#F4F8FB",
          border: "2px solid #D1E3F8",
          boxShadow: 24,
          borderRadius: "12px",
          p: 4,
          textAlign: "center",
          fontFamily: "Velyra",
        }}
      >
        <CircularProgress sx={{ color: "#007BFF", mb: 2 }} size={35} thickness={8} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Velyra",
            color: "#007BFF",
          }}
        >
          Deleting...
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Velyra",
            color: "#555",
          }}
        >
          Please wait while we delete the video.
        </Typography>
      </Box>
    </Modal>
  );
};

export default DeletingModal;
