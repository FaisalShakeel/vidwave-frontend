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
          <CircularProgress size={40} thickness={7} sx={{ color: "#007BFF" }} />
        </Box>
      )}

      {/* Authentication Check */}
      {!loading && !isAuthenticated && renderLoginPrompt()}

      {/* Error State */}
      {!loading && isAuthenticated && error && (
        <ErrorDisplay error={error} onRetry={() => {
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
        }} />
      )}

      {/* Video Grid Section */}
      {!loading && isAuthenticated && !error && (
        <Grid container spacing={3} sx={{ padding: 3, backgroundColor: "#f8f9ff" }}>
          {likedVideos.length > 0 ? (
            likedVideos.map((video, index) => (
              <Grid
                onClick={() => navigate(`/watch/${video._id}`)}
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={4}
                key={video._id || index}
              >
                <Card
                  sx={{
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                    },
                    backgroundColor: "#ffffff",
                  }}
                >
                  {/* Video Thumbnail */}
                  <img
                    src={video.thumbnailUrl || "https://via.placeholder.com/250x140"}
                    alt={video.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                    }}
                  />

                  {/* Video Details */}
                  <CardContent sx={{ padding: 2, flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Velyra",
                        color: "#007BFF",
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {video.title}
                    </Typography>

                    {/* Uploader */}
                    <Box sx={{ marginTop: 2, display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={video.uploadedByProfilePhotoUrl || "https://via.placeholder.com/50"}
                        sx={{ width: 50, height: 50, marginRight: 2, boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
                      />
                      <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#666" }}>
                        {video.uploadedByName || "Unknown Uploader"}
                      </Typography>
                    </Box>

                    {/* Video Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "Velyra", color: "#666", fontSize: "0.875rem" }}
                      >
                        {video.viewedBy?.length || 0} views
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "Velyra", color: "#666", fontSize: "0.875rem" }}
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
                        color: "#666",
                        fontSize: "0.875rem",
                        marginTop: 1,
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
                variant="h6"
                sx={{
                  fontFamily: "Velyra",
                  color: "#666",
                  textAlign: "center",
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