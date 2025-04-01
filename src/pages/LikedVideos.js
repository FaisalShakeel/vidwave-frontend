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
import ErrorDisplay from "../components/ErrorDisplay";

const LikedVideos = () => {
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState([]);
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

  useEffect(() => {
    const fetchLikedVideos = async () => {
      if (!checkAuthentication()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/videos/get-liked-videos", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        if (response.data.success) {
          setLikedVideos(response.data.likedVideos);
        } else {
          throw new Error("Failed to fetch liked videos. Please try again later.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching liked videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
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
          You need to be logged in to view your liked videos. Sign in to access your personalized content!
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
            const fetchLikedVideos = async () => {
              try {
                const response = await axios.get("http://localhost:5000/videos/get-liked-videos", {
                  headers: { Authorization: localStorage.getItem("token") },
                });
                if (response.data.success) {
                  setLikedVideos(response.data.likedVideos);
                } else {
                  throw new Error("Failed to fetch liked videos. Please try again later.");
                }
              } catch (err) {
                setError(err.message || "An error occurred while fetching liked videos.");
              } finally {
                setLoading(false);
              }
            };
            fetchLikedVideos();
          }}
        />
      )}

      {/* Video Grid Section */}
      {!loading && isAuthenticated && !error && (
        <Grid container spacing={2} sx={{ padding: 2, backgroundColor: "#fff" }}>
          {likedVideos.length > 0 ? (
            likedVideos.map((video, index) => (
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
                You haven’t liked any videos yet!
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default LikedVideos;