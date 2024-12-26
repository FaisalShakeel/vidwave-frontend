import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { storage } from "../firebaseConfig";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() 
{
  const navigate=useNavigate()
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const[isDialogOpen,setIsDialogOpen]=useState(false)

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleFileUpload = (e) => {
    setIsDialogOpen(true); // Open the modal
  
    try {
      const selectedImage = e.target.files[0];
      if (!selectedImage) {
        setIsDialogOpen(false); // Close modal if no file selected
        return;
      }
  
      const storageRef = ref(storage, `profile_photos/${selectedImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Update progress
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setPhotoUploadProgress(progress);
        },
        (error) => {
          // Handle upload error
          setSnackbar({ open: true, message: "Failed to upload photo!", severity: "error" });
          setIsDialogOpen(false); // Close modal on error
        },
        async () => {
          // Upload success
          const photoUrl = await getDownloadURL(storageRef);
          setProfilePhotoUrl(photoUrl);
          setSnackbar({ open: true, message: "Profile photo uploaded!", severity: "success" });
          setPhotoUploadProgress(0); // Reset progress
          setIsDialogOpen(false); // Close modal after successful upload
        }
      );
    } catch (e) {
      
      setSnackbar({ open: true, message: "Profile Photo could not be uploaded!Please try again!", severity: "error" });
      setIsDialogOpen(false); // Close modal on unexpected error
    }
  };
  

  const handleSignUp = async () => {
    if (!userName || !email || !bio || !password) {
      
      setSnackbar({ open: true, message: "Please fill all fields!", severity: "warning" });
      return;
    }
    else if(!profilePhotoUrl)
    {
      setSnackbar({ open: true, message: "Please upload profile photo!", severity: "warning" });
      return;

    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/users/createaccount", {
        name: userName,
        EMailAddress: email,
        passWord: password,
        bio,
        profilePhotoUrl,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
       
      

        setSnackbar({ open: true, message: "Account created successfully!", severity: "success" });
        setTimeout(()=>{
        navigate("/")

        },1000)
        
      } else if (response.data.message === "AlreadyRegistered") {
        setSnackbar({ open: true, message: "Email is already taken!", severity: "warning" });
      } else {
        setSnackbar({ open: true, message: "Failed to create account!Please try again", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error occurred during signup!Please Try Again", severity: "error" });
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
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
        borderRadius: "16px",
        backgroundColor: "#fff",
        fontFamily: "Velyra, Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <Dialog
      open={isDialogOpen}
      PaperProps={{
        sx: {
          p: 4,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          textAlign: "center",
          maxWidth: 400,
        },
      }}
    >
      {/* Profile Photo Placeholder */}
      

      {/* Loading Icon */}
      <Box sx={{ my: 3 }}>
        <CircularProgress
          sx={{ color: "#0077b6" }}
          size={50}
          thickness={5}
        />
      </Box>

      {/* Message */}
      <Typography
        sx={{
          color: "#424242",
          fontSize: "1.25rem",
          fontWeight: 500,
          fontFamily:"Velyra"
        }}
      >
        Please Wait<br />
        Profile Photo Is Being Uploaded
      </Typography>
    </Dialog>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Velyra",
          marginBottom: "20px",
        }}
      >
        Create Account
      </Typography>

      <Box sx={{ position: "relative", margin: "0 auto 20px", width: "100px", height: "100px" }}>
        <Avatar
          src={profilePhotoUrl || ""}
          sx={{
            width: "100px",
            height: "100px",
            border: "2px solid #1976d2",
          }}
        >
          {!profilePhotoUrl && <CameraAltIcon fontSize="large" />}
        </Avatar>
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #1976d2",
            padding: "5px",
          }}
        >
          <EditIcon />
          <input type="file" hidden onChange={handleFileUpload} />
        </IconButton>
        {photoUploadProgress > 0 && (
          <Box sx={{ marginTop: "10px" }}>
            <Typography variant="body2">{photoUploadProgress}%</Typography>
            <LinearProgress variant="determinate" value={photoUploadProgress} />
          </Box>
        )}
      </Box>

      <TextField
        fullWidth
        label="Username"
        variant="standard"
        margin="normal"
        InputProps={{ style: { fontFamily: "Velyra" } }}
        InputLabelProps={{ style: { fontFamily: "Velyra" } }}
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        variant="standard"
        margin="normal"
        InputProps={{ style: { fontFamily: "Velyra" } }}
        InputLabelProps={{ style: { fontFamily: "Velyra" } }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Bio"
        variant="standard"
        margin="normal"
        multiline
        rows={3}
        InputProps={{ style: { fontFamily: "Velyra" } }}
        InputLabelProps={{ style: { fontFamily: "Velyra" } }}
        onChange={(e) => setBio(e.target.value)}
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

      <Button
        fullWidth
        variant="contained"
        sx={{
          fontFamily: "Velyra",
          marginTop: "20px",
          padding: "10px 0",
        }}
        onClick={handleSignUp}
        disabled={loading}
      >
        Create Account
      </Button>

      <Typography
        variant="body2"
        sx={{
          fontFamily: "Velyra",
          marginTop: "10px",
        }}
      >
        Already Have an Account?{" "}
        <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
          Log In
        </Link>
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignUp;
