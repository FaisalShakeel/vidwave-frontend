import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Replay, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ErrorDisplay = ({ error, onRetry, hideBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #007BFF 0%, #ffffff 100%)",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: "16px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#ffffff",
          boxShadow: "0px 8px 24px rgba(0, 123, 255, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Velyra",
            fontWeight: "bold",
            color: "#007BFF",
            mb: 2,
          }}
        >
          Oops! Something Went Wrong
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Velyra",
            color: "#333",
            mb: 3,
          }}
        >
          {error || "An unexpected error occurred. Please try again."}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {!hideBackButton && (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                fontFamily: "Velyra",
                color: "#007BFF",
                borderColor: "#007BFF",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e7f3ff",
                  borderColor: "#0056b3",
                },
              }}
            >
              Go Back
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Replay />}
            onClick={onRetry}
            sx={{
              fontFamily: "Velyra",
              backgroundColor: "#007BFF",
              borderRadius: "20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            Try Again
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorDisplay;