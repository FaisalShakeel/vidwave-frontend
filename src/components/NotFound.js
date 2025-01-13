import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#F4F6F8",
        padding: "0 16px",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "72px", sm: "100px", md: "120px" },
          fontWeight: "bold",
          color: "#007BFF",
          fontFamily: "Velyra",
        }}
      >
        404
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: "18px", sm: "22px", md: "28px" },
          fontWeight: "medium",
          color: "#6C757D",
          marginBottom: 2,
          fontFamily: "Velyra",
        }}
      >
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: "14px", sm: "16px" },
          color: "#6C757D",
          marginBottom: 3,
          fontFamily: "Velyra",
        }}
      >
        It might have been moved or deleted. Please check the URL or go back to the home page.
      </Typography>
      <Button
        variant="contained"
        onClick={handleGoHome}
        sx={{
          backgroundColor: "#007BFF",
          color: "#FFFFFF",
          padding: "10px 24px",
          fontSize: { xs: "14px", sm: "16px" },
          fontWeight: "bold",
          borderRadius: "50px",
          textTransform: "none",
          fontFamily: "Velyra",
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
