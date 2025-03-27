import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import moment from "moment";
import Layout from "../components/Layout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useSocket } from "../contexts/SocketContext";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ErrorDisplay from "../components/ErrorDisplay";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const getNotifications = async () => {
    if (!checkAuthentication()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/notifications/all-notifications", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        throw new Error("Notifications could not be fetched!");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message || "An error occurred while fetching notifications.");
      toast.error(e.response ? e.response.data.message : e.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket && isAuthenticated) {
      const handleNewNotification = (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      };

      socket.on("new-notification", handleNewNotification);

      // Cleanup the listener when the component unmounts
      return () => {
        socket.off("new-notification", handleNewNotification);
      };
    }
  }, [socket, isAuthenticated]);

  useEffect(() => {
    getNotifications();
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
          You need to be logged in to view your notifications. Sign in to stay updated!
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
    <Layout>
      <Box sx={{ backgroundColor: "#f8f9ff", minHeight: "100vh", width: "100%", padding: "16px", boxSizing: "border-box" }}>
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
            onRetry={getNotifications}
          />
        )}

        {/* Notifications Content */}
        {!loading && isAuthenticated && !error && (
          <Box sx={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                fontFamily: "Velyra",
                fontSize: "16px",
                textTransform: "capitalize",
                color: "#007BFF",
                "&:hover": { color: "#0056b3" },
              }}
            >
              Back
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                fontSize: "28px",
                marginBottom: "24px",
                fontFamily: "Velyra",
                color: "#007BFF",
                textAlign: "center",
              }}
            >
              Notifications
            </Typography>
            <List>
              {notifications.length === 0 ? (
                <Typography sx={{ fontFamily: "Velyra", textAlign: "center", color: "#666", py: 2 }}>
                  No Notifications Yet!
                </Typography>
              ) : (
                notifications.map((notification, index) => (
                  <ListItem
                    onClick={() => {
                      if (notification.type === "Liked Video" || notification.type === "Added Comment") {
                        navigate(`/watch/${notification.videoId}`);
                      } else {
                        navigate(`/profile/${notification.sentBy}`);
                      }
                    }}
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #E9ECEF",
                      "&:hover": { backgroundColor: "#F4F8FB" },
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={notification.sentByPhotoUrl || "https://via.placeholder.com/50"}
                        alt={notification.sentByName}
                        sx={{
                          width: "50px",
                          height: "50px",
                          border: "2px solid #007BFF",
                          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            color: "#333",
                            fontFamily: "Velyra",
                            fontSize: "18px",
                          }}
                        >
                          {notification.sentByName || "Unknown User"}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6C757D",
                              fontFamily: "Velyra",
                              fontSize: "14px",
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#ADB5BD",
                              fontFamily: "Velyra",
                              fontSize: "12px",
                            }}
                          >
                            {moment(notification.createdAt).fromNow()}
                          </Typography>
                        </>
                      }
                      sx={{ marginLeft: "16px" }}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Notifications;