import React, { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleLogin = async () => {
    if (!emailAddress || !password) {
      setSnackbar({ open: true, message: "Please fill all fields!", severity: "warning" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { emailAddress, passWord: password });

      if (response.data.success) {
        localStorage.setItem("UID", response.data.user._id);
        localStorage.setItem("EMailAddress", response.data.user.EMailAddress);
        localStorage.setItem("passWord", response.data.user.passWord);
        localStorage.setItem("profilePhotoUrl", response.data.user.profilePhotoUrl);

        setSnackbar({ open: true, message: "You are successfully logged in", severity: "success" });
        window.location.href = "/home"; // Redirect after successful login
      } else {
        setSnackbar({ open: true, message: "Invalid email address or password", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error occurred during login", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "400px",
        margin: "auto",
        padding: "30px",
        height: "610px", // Fixed height
        display: "flex", // Flexbox layout
        flexDirection: "column", // Stack the children vertically
        justifyContent: "space-between", // Distribute space between elements
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
        borderRadius: "16px",
        backgroundColor: "#fff",
        fontFamily: "Velyra, Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Velyra",
          marginBottom: "20px",
        }}
      >
        Log In
      </Typography>

      {/* Input Fields */}
      <Box sx={{ flexGrow: 1 }}> {/* Allows the form to grow within available space */}
        <TextField
          fullWidth
          label="Email Address"
          variant="standard"
          margin="normal"
          InputProps={{ style: { fontFamily: "Velyra" } }}
          InputLabelProps={{ style: { fontFamily: "Velyra" } }}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="standard"
          margin="normal"
          InputProps={{ style: { fontFamily: "Velyra" } }}
          InputLabelProps={{ style: { fontFamily: "Velyra" } }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>

      {/* Login Button */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          fontFamily: "Velyra",
          marginTop: "20px",
          padding: "10px 0",
        }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
      </Button>

      {/* Link to Sign Up */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: "Velyra",
          marginTop: "10px",
        }}
      >
        Don't have an account?{" "}
        <Link to="/createaccount" style={{ textDecoration: "none", color: "#1976d2" }}>
          Create Account
        </Link>
      </Typography>

      {/* Snackbar for Error/Success messages */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
