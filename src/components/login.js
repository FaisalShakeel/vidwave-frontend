import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Snackbar, 
  Alert, 
  CircularProgress, 
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  Fade
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  ArrowForward
} from "@mui/icons-material";
import axios from "axios";
import CustomSnackbar from "./CustomSnackbar";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const {login} = useAuth()
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    if (!emailAddress || !password) {
      setSnackbar({ open: true, message: "Please fill all fields!", severity: "warning" });
      return;
    }

    setLoading(true);
    console.log("API URL",process.env.REACT_APP_API_URL)

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, { 
        EMailAddress: emailAddress, 
        passWord: password 
      });

      if (response.data.success) {
        login(response.data.token)
        localStorage.setItem("token", response.data.token);
        setSnackbar({ open: true, message: "Login successful!", severity: "success" });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else if (response.data.success == false && response.data.message == "Incorrect Password") {
        setSnackbar({ open: true, message: "Incorrect password", severity: "error" });
      } else if (response.data.success == false && response.data.message == "NotRegistered") {
        setSnackbar({ open: true, message: "Account not found", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Connection error", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: "380px",
          margin: "auto",
          padding: "24px",
          height: "480px", // Reduced height
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "20px",
          backgroundColor: "#fff",
          fontFamily: "Velyra, Arial, sans-serif",
          textAlign: "center",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #007BFF, #00C6FF)",
          }
        }}
      >
        <Box>
          <Typography
            variant="h5" // Reduced from h4
            sx={{
              fontFamily: "Velyra",
              fontWeight: 600,
              marginBottom: "8px",
              background: "linear-gradient(45deg, #007BFF, #00C6FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px"
            }}
          >
            Welcome Back
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "Velyra",
              fontSize: "0.875rem",
              marginBottom: "16px",
            }}
          >
            Sign in to continue to Vidwave
          </Typography>
        </Box>

        {/* Input Fields */}
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            size="small"
            margin="normal"
            InputProps={{ 
              style: { fontFamily: "Velyra", fontSize: "0.9rem" },
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { fontFamily: "Velyra", fontSize: "0.9rem" } }}
            onChange={(e) => setEmailAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            size="small"
            margin="normal"
            InputProps={{ 
              style: { fontFamily: "Velyra", fontSize: "0.9rem" },
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { fontFamily: "Velyra", fontSize: "0.9rem" } }}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
          />
          
          
        </Box>

        {/* Login Button */}
        <Box>
          <Button
            fullWidth
            variant="contained"
            sx={{
              fontFamily: "Velyra",
              padding: "10px 0",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.25)",
              background: "linear-gradient(45deg, #007BFF, #00C6FF)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(0, 123, 255, 0.35)",
                transform: "translateY(-2px)",
              },
            }}
            onClick={handleLogin}
            disabled={loading}
            endIcon={loading ? null : <ArrowForward />}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>

          <Divider sx={{ my: 3, opacity: 0.7 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Velyra", px: 1 }}>
              OR
            </Typography>
          </Divider>

          {/* Link to Sign Up */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Velyra",
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            Don't have an account?{" "}
            <Link 
              to="/create-account" 
              style={{ 
                textDecoration: "none", 
                color: "#007BFF",
                fontWeight: 600,
              }}
            >
              Create Account
            </Link>
          </Typography>
        </Box>
        <CustomSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleSnackbarClose}/>

        
      </Paper>
    </Fade>
  );
}

export default Login;