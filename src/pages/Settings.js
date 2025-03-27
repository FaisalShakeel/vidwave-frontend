import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Input,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ErrorDisplay from "../components/ErrorDisplay";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      setIsAuthenticated(false);
      return false;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profilePhotos/${file.name}`);
    setUploading(true);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.error("Upload failed:", error);
        toast.error("Failed to upload profile photo.", { style: { fontFamily: "Velyra" } });
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProfilePhotoUrl(downloadURL);
        toast.success("Profile photo uploaded successfully!", { style: { fontFamily: "Velyra" } });
        setUploading(false);
      }
    );
  };

  const getProfileBasicInfo = async () => {
    if (!checkAuthentication()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/users/getprofile-basicinfo", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setProfilePhotoUrl(response.data.user.profilePhotoUrl || "");
        setUsername(response.data.user.name || "");
        setEmail(response.data.user.EMailAddress || "");
        setBio(response.data.user.bio || "");
      } else {
        throw new Error("Failed to fetch profile information. Please try again later.");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message || "An error occurred while fetching profile information.");
      toast.error(e.response ? e.response.data.message : e.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsSavingChanges(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/users/update-profile",
        { username, bio, profilePhotoUrl },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setIsSavingChanges(false);
    }
  };

  const changePassword = async () => {
    setIsChangingPassword(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/users/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    getProfileBasicInfo();
  }, []);

  const renderLoginPrompt = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f8f9ff",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 20px rgba(0,123,255,0.1)",
        }}
      >
        <LockIcon sx={{ fontSize: 60, color: "#007BFF", mb: 2 }} />
        <Typography
          variant="h5"
          sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF", mb: 2 }}
        >
          Please Log In
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontFamily: "Velyra", color: "#666", mb: 3 }}
        >
          You need to be logged in to manage your settings. Sign in to update your profile!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            fontFamily: "Velyra",
            fontWeight: "bold",
            backgroundColor: "#007BFF",
            borderRadius: "8px",
            padding: "10px 20px",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Log In
        </Button>
      </Paper>
    </Box>
  );

  return (
    <DashboardLayout>
      <Box sx={{ padding: 3, backgroundColor: "#f8f9ff", minHeight: "100vh" }}>
        <ToastContainer />
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size={35} thickness={10} sx={{ color: "#007BFF" }} />
          </Box>
        )}

        {/* Authentication Check */}
        {!loading && !isAuthenticated && renderLoginPrompt()}

        {/* Error State */}
        {!loading && isAuthenticated && error && (
          <ErrorDisplay
            error={error}
            onRetry={getProfileBasicInfo}
          />
        )}

        {/* Settings Content */}
        {!loading && isAuthenticated && !error && (
          <>
            <Typography
              variant="h4"
              sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 4, color: "#007BFF" }}
            >
              Settings
            </Typography>

            <Box sx={{ width: "100%" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 4 }}
              >
                <Tab sx={{ fontFamily: "Velyra", fontWeight: "bold" }} label="Profile Information" />
                <Tab sx={{ fontFamily: "Velyra", fontWeight: "bold" }} label="Change Password" />
              </Tabs>

              {activeTab === 0 && (
                <Box sx={{ width: "100%" }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <Box position="relative" display="inline-block">
                        <Avatar
                          src={profilePhotoUrl || "https://via.placeholder.com/120"}
                          sx={{
                            width: 120,
                            height: 120,
                            margin: "auto",
                            border: "2px solid #007BFF",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            backgroundColor: "#007BFF",
                            color: "white",
                            "&:hover": { backgroundColor: "#0056b3" },
                          }}
                          component="label"
                        >
                          <Edit />
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: "0.875rem",
                          color: "#666",
                          mb: 1,
                        }}
                      >
                        Username
                      </Typography>
                      <Input
                        placeholder="Username"
                        sx={{
                          width: "100%",
                          padding: "0.5rem",
                          fontSize: "1rem",
                          borderBottom: "2px solid #007BFF",
                          fontFamily: "Velyra",
                          "&:hover:not(.Mui-disabled):before": { borderBottom: "2px solid #0056b3" },
                        }}
                        disableUnderline
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: "0.875rem",
                          color: "#666",
                          mb: 1,
                        }}
                      >
                        Email
                      </Typography>
                      <Input
                        placeholder="Email"
                        sx={{
                          width: "100%",
                          padding: "0.5rem",
                          fontSize: "1rem",
                          borderBottom: "2px solid #007BFF",
                          fontFamily: "Velyra",
                          color: "#999",
                        }}
                        disableUnderline
                        value={email}
                        readOnly
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: "0.875rem",
                          color: "#666",
                          mb: 1,
                        }}
                      >
                        Bio
                      </Typography>
                      <Input
                        placeholder="Bio"
                        sx={{
                          width: "100%",
                          padding: "0.5rem",
                          fontSize: "1rem",
                          borderBottom: "2px solid #007BFF",
                          fontFamily: "Velyra",
                          "&:hover:not(.Mui-disabled):before": { borderBottom: "2px solid #0056b3" },
                        }}
                        onChange={(e) => setBio(e.target.value)}
                        disableUnderline
                        value={bio}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updateProfile}
                    disabled={isSavingChanges}
                    sx={{
                      mt: 3,
                      fontFamily: "Velyra",
                      width: "200px",
                      height: "50px",
                      padding: "0.5rem 2rem",
                      backgroundColor: "#007BFF",
                      "&:hover": { backgroundColor: "#0056b3" },
                      "&:disabled": { backgroundColor: "#cccccc" },
                    }}
                  >
                    {isSavingChanges ? (
                      <CircularProgress style={{ height: 20, width: 20, color: "white" }} thickness={10} />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ width: "100%" }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: "0.875rem",
                          color: "#666",
                          mb: 1,
                        }}
                      >
                        Current Password
                      </Typography>
                      <Input
                        placeholder="Current Password"
                        type="password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        value={currentPassword}
                        sx={{
                          width: "100%",
                          padding: "0.5rem",
                          fontSize: "1rem",
                          borderBottom: "2px solid #007BFF",
                          fontFamily: "Velyra",
                          "&:hover:not(.Mui-disabled):before": { borderBottom: "2px solid #0056b3" },
                        }}
                        disableUnderline
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: "0.875rem",
                          color: "#666",
                          mb: 1,
                        }}
                      >
                        New Password
                      </Typography>
                      <Input
                        placeholder="New Password"
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        sx={{
                          width: "100%",
                          padding: "0.5rem",
                          fontSize: "1rem",
                          borderBottom: "2px solid #007BFF",
                          fontFamily: "Velyra",
                          "&:hover:not(.Mui-disabled):before": { borderBottom: "2px solid #0056b3" },
                        }}
                        disableUnderline
                      />
                    </Grid>
                  </Grid>
                  <Button
                    disabled={isChangingPassword}
                    onClick={changePassword}
                    variant="contained"
                    color="primary"
                    sx={{
                      width: "200px",
                      height: "50px",
                      mt: 3,
                      fontFamily: "Velyra",
                      padding: "0.5rem 2rem",
                      backgroundColor: "#007BFF",
                      "&:hover": { backgroundColor: "#0056b3" },
                      "&:disabled": { backgroundColor: "#cccccc" },
                    }}
                  >
                    {isChangingPassword ? (
                      <CircularProgress style={{ height: 20, width: 20, color: "white" }} thickness={10} />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Box>
              )}

              <Modal
                open={uploading}
                onClose={() => {}}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "2rem",
                    textAlign: "center",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    width: "400px",
                  }}
                >
                  <CircularProgress sx={{ color: "#007BFF", marginBottom: "1rem" }} size={30} thickness={8} />
                  <Typography
                    sx={{
                      fontFamily: "Velyra",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Uploading Profile Photo
                  </Typography>
                </Box>
              </Modal>
            </Box>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Settings;