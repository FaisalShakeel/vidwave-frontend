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
import { Link, useNavigate } from "react-router-dom";
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
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/videos/liked-videos`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        if (response.data.success) {
          setLikedVideos(response.data.likedVideos);
        } else {
          setError("Failed to fetch liked videos. Please try again later.");
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
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #f5f7ff 0%, #e9f0ff 100%)",
      padding: 0,
      margin: 0,
      mt:{md:-7},
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: "900px", // Reduced from 1200px
        height: "80vh",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Left side - Branding Area (Image Removed) */}
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #0062E6 0%, #33A8FF 100%)",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
          color: "#fff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Velyra",
            fontWeight: "700",
            mb: 2,
            textShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          Your Favorite Videos
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Velyra",
            textAlign: "center",
            opacity: 0.9,
            fontSize: "1rem",
          }}
        >
          Access your personalized collection and discover new content tailored just for you.
        </Typography>
      </Box>

      {/* Right side - Login Container */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ maxWidth: "400px", width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 123, 255, 0.08)",
                mb: 2,
              }}
            >
              <LockIcon sx={{ fontSize: 28, color: "#007BFF" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Velyra",
                fontWeight: "700",
                color: "#1a1a1a",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Velyra",
                color: "#777",
                mb: 4,
                fontSize: "1rem",
              }}
            >
              Sign in to continue to your liked videos
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              fontFamily: "Velyra",
              fontWeight: "600",
              backgroundColor: "#007BFF",
              borderRadius: "12px",
              padding: "14px",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 14px rgba(0, 123, 255, 0.3)",
              "&:hover": {
                backgroundColor: "#0056b3",
                boxShadow: "0 6px 18px rgba(0, 123, 255, 0.4)",
              },
            }}
          >
            Log In
          </Button>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Velyra",
                color: "#777",
                fontSize: "0.9rem",
              }}
            >
              Don't have an account?{" "}
              <Link
                
                style={{
                  fontFamily: "Velyra",
                  color: "#007BFF",
                  fontWeight: "700", // Bold
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
                to="/create-account"
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
    
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