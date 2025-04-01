import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorDisplay from "../components/ErrorDisplay";

const History = () => {
  const navigate = useNavigate();
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
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

  useEffect(() => {
    const fetchWatchedVideos = async () => {
      if (!checkAuthentication()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/videos/get-watched-videos", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        if (response.data.success) {
          setWatchedVideos(response.data.watchedVideos);
        } else {
          throw new Error("Failed to fetch watched videos. Please try again later.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching watched videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedVideos();
  }, []);

  const handleDeleteHistory = async () => {
    setIsDeletingHistory(true);
    try {
      const response = await axios.delete("http://localhost:5000/videos/delete-watch-history", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setWatchedVideos([]);
      } else {
        toast.error("Failed to delete watch history.", { style: { fontFamily: "Velyra" } });
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsDeletingHistory(false);
    }
  };

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
          You need to be logged in to view your watch history. Sign in to see what you’ve watched!
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
      <Box sx={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <ToastContainer />
        {/* Top Centered Delete History Button */}
        {!loading && isAuthenticated && !error && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "2rem 0",
            }}
          >
            <Button
              onClick={handleDeleteHistory}
              disabled={isDeletingHistory}
              variant="contained"
              sx={{
                fontFamily: "Velyra",
                fontSize: "16px",
                textTransform: "capitalize",
                backgroundColor: "#007BFF",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              {isDeletingHistory ? "Deleting" : "Delete History"}
            </Button>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size={30} thickness={6} sx={{ color: "#007BFF" }} />
          </Box>
        )}

        {/* Authentication Check */}
        {!loading && !isAuthenticated && renderLoginPrompt()}

        {/* Error State */}
        {!loading && isAuthenticated && error && (
          <ErrorDisplay
            error={error}
            onRetry={() => {
              setLoading(true);
              setError(null);
              const fetchWatchedVideos = async () => {
                try {
                  const response = await axios.get("http://localhost:5000/videos/get-watched-videos", {
                    headers: { Authorization: localStorage.getItem("token") },
                  });
                  if (response.data.success) {
                    setWatchedVideos(response.data.watchedVideos);
                  } else {
                    throw new Error("Failed to fetch watched videos. Please try again later.");
                  }
                } catch (err) {
                  setError(err.message || "An error occurred while fetching watched videos.");
                } finally {
                  setLoading(false);
                }
              };
              fetchWatchedVideos();
            }}
          />
        )}

        {/* Video Grid Section */}
        {!loading && isAuthenticated && !error && (
          <Grid container spacing={2} sx={{ padding: 2 }}>
            {watchedVideos.length > 0 ? (
              watchedVideos.map((video, index) => (
                <Grid
                  onClick={() => navigate(`/watch/${video._id}`)}
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  key={video._id || index}
                >
                  <Card
                    sx={{
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      overflow: "hidden",
                      ":hover": {
                        transform: "scale(1.03)",
                        transition: "0.3s ease",
                        boxShadow: "0px 6px 12px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    {/* Video Thumbnail */}
                    <img
                      src={video.thumbnailUrl || "https://via.placeholder.com/200x120"}
                      alt={video.title}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />

                    {/* Video Details */}
                    <CardContent sx={{ padding: 1, flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontFamily: "Velyra",
                          color: "#333",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {video.title}
                      </Typography>

                      {/* Uploader */}
                      <Box sx={{ marginTop: 1, display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={video.uploadedByProfilePhotoUrl || "https://via.placeholder.com/30"}
                          sx={{ width: 30, height: 30, marginRight: 1 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#555",
                            fontSize: "0.8rem",
                          }}
                        >
                          {video.uploadedByName || "Unknown Uploader"}
                        </Typography>
                      </Box>

                      {/* Video Stats */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#555",
                            fontSize: "0.75rem",
                          }}
                        >
                          {video.viewedBy?.length || 0} views
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#555",
                            fontSize: "0.75rem",
                          }}
                        >
                          {video.likedBy?.length || 0} likes
                        </Typography>
                      </Box>

                      {/* Uploaded Time */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Velyra",
                          textAlign: "center",
                          color: "#555",
                          fontSize: "0.75rem",
                          marginTop: 0.5,
                        }}
                      >
                        {moment(new Date(video.createdAt).toLocaleString()).fromNow()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: "Velyra",
                    color: "#555",
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                >
                  You haven’t watched any videos yet!
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default History;