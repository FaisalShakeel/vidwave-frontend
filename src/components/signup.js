import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  IconButton,
  LinearProgress,
  InputAdornment,
  Divider,
  Paper,
  Fade,
  CircularProgress,
} from "@mui/material";
import { storage } from "../firebaseConfig";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import {
  Person,
  Email,
  Description,
  Lock,
  ArrowForward,
  AddAPhoto,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomSnackbar from "./CustomSnackbar";
import { useAuth } from "../contexts/AuthContext";

function SignUp() {
  const {login} = useAuth()
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePhotoUrl(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setIsDialogOpen(true);
      const storageRef = ref(storage, `profile_photos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setPhotoUploadProgress(progress);
        },
        (error) => {
          setSnackbar({ open: true, message: "Failed to upload photo!", severity: "error" });
          setIsDialogOpen(false);
          setPhotoUploadProgress(0);
        },
        async () => {
          const photoUrl = await getDownloadURL(storageRef);
          setProfilePhotoUrl(photoUrl);
          setSnackbar({ open: true, message: "Profile photo uploaded!", severity: "success" });
          setTimeout(() => setIsDialogOpen(false), 500);
          setPhotoUploadProgress(0);
        }
      );
    }
  };

  const handleSignUp = async () => {
    if (!userName || !email || !bio || !password) {
      setSnackbar({ open: true, message: "Please fill all fields!", severity: "warning" });
      return;
    } else if (!profilePhotoUrl) {
      setSnackbar({ open: true, message: "Please upload a profile photo!", severity: "warning" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/create-account`, {
        name: userName,
        EMailAddress: email,
        passWord: password,
        bio,
        profilePhotoUrl: typeof profilePhotoUrl === "string" ? profilePhotoUrl : "",
      });

      if (response.data.success) {
        login(response.data.token)
        localStorage.setItem("token", response.data.token);
        setSnackbar({ open: true, message: "Account created successfully!", severity: "success" });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else if (response.data.message === "AlreadyRegistered") {
        setSnackbar({ open: true, message: "Email is already taken!", severity: "warning" });
      } else {
        setSnackbar({ open: true, message: "Failed to create account! Please try again", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error occurred during signup! Please try again", severity: "error" });
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
          padding: "20px", // Reduced padding slightly
          height: "auto", // Changed to auto to fit content
          minHeight: "450px", // Reduced minHeight
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // Moved content upwards
          borderRadius: "20px",
          backgroundColor: "#fff",
          fontFamily: "Velyra, Arial, sans-serif",
          textAlign: "center",
          overflow: "visible",
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Velyra",
              fontWeight: 600,
              marginBottom: "4px", // Reduced margin
              background: "linear-gradient(45deg, #007BFF, #00C6FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "Velyra",
              fontSize: "0.875rem",
              marginBottom: "12px", // Reduced margin
            }}
          >
            Sign up to join Vidwave
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
          <Box
            sx={{
              position: "relative",
              width: "80px",
              height: "80px",
            }}
          >
            <Avatar
              src={profilePhotoPreview}
              sx={{
                width: "80px",
                height: "80px",
                cursor: "pointer",
                border: "2px solid #e0e0e0",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#e0e0e0",
              }}
              onClick={() => fileInputRef.current.click()}
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: "0",
                right: "0",
                backgroundColor: "#007BFF",
                color: "white",
                width: "24px",
                height: "24px",
                padding: "4px",
                "&:hover": {
                  backgroundColor: "#0069d9",
                },
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <AddAPhoto fontSize="small" />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleFileUpload}
            />
          </Box>
        </Box>

        <Box sx={{ width: "100%", mb: 1 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            size="small"
            margin="dense" // Changed to dense for tighter spacing
            InputProps={{
              style: { fontFamily: "Velyra", fontSize: "0.9rem" },
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { fontFamily: "Velyra", fontSize: "0.9rem" } }}
            onChange={(e) => setUserName(e.target.value)}
            sx={{ mb: 0.5 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            margin="dense"
            InputProps={{
              style: { fontFamily: "Velyra", fontSize: "0.9rem" },
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { fontFamily: "Velyra", fontSize: "0.9rem" } }}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 0.5 }}
          />
          <TextField
            fullWidth
            label="Bio"
            variant="outlined"
            size="small"
            margin="dense"
            multiline
            rows={2}
            InputProps={{
              style: { fontFamily: "Velyra", fontSize: "0.9rem" },
              startAdornment: (
                <InputAdornment position="start">
                  <Description fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { fontFamily: "Velyra", fontSize: "0.9rem" } }}
            onChange={(e) => setBio(e.target.value)}
            sx={{ mb: 0.5 }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            size="small"
            margin="dense"
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { fontFamily: "Velyra", fontSize: "0.9rem" } }}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 0.5 }}
          />
        </Box>

        <Box>
          <Button
            fullWidth
            variant="contained"
            sx={{
              fontFamily: "Velyra",
              padding: "8px 0", // Reduced padding
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
            onClick={handleSignUp}
            disabled={loading}
            endIcon={loading ? null : <ArrowForward />}
          >
            {loading ? <CircularProgress style={{height:"20px",width:"20px",color:"white"}} thickness={7}/>:"Sign Up"}
          </Button>

          <Divider sx={{ my: 1.5, opacity: 0.7 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Velyra", px: 1 }}>
              OR
            </Typography>
          </Divider>

          <Typography
            variant="body2"
            sx={{
              fontFamily: "Velyra",
              fontSize: "0.9rem",
              color: "text.secondary",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#007BFF",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>

        {/* Modern Photo Upload Dialog */}
        <Dialog
          open={isDialogOpen}
          PaperProps={{
            sx: {
              p: 4,
              borderRadius: "16px",
              background: "linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)",
              textAlign: "center",
              maxWidth: "360px",
              boxShadow: "0 15px 40px rgba(0, 123, 255, 0.2)",
              border: "none",
              overflow: "hidden",
            },
          }}
          TransitionComponent={Fade}
          transitionDuration={400}
        >
          <Box sx={{ position: "relative", mb: 3 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: `conic-gradient(#007BFF ${photoUploadProgress}%, #e0e7ff 0)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Velyra",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "#007BFF",
                  }}
                >
                  {photoUploadProgress}%
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography
            sx={{
              color: "#1A1A1A",
              fontSize: "1.6rem",
              fontWeight: 700,
              fontFamily: "Velyra",
              mb: 1,
              background: "linear-gradient(45deg, #007BFF, #00C6FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Uploading Photo
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontSize: "1rem",
              fontFamily: "Velyra",
              mb: 2,
            }}
          >
            Hang tight, your profile pic is on its way!
          </Typography>
          <LinearProgress
            variant="determinate"
            value={photoUploadProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e0e7ff",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #007BFF, #00C6FF)",
                borderRadius: 4,
              },
            }}
          />
        </Dialog>
<CustomSnackbar open={snackbar.open} onClose={handleSnackbarClose} message={snackbar.message} severity={snackbar.severity}/>
  
      </Paper>
    </Fade>
  );
}

export default SignUp;