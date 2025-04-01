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
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router";
import ErrorDisplay from "../components/ErrorDisplay";

const HomePage = () => {
  const navigate = useNavigate();
  const categories = ["All", "Music", "Gaming", "Sports", "News", "Comedy", "Tech"];

  const [videos, setVideos] = useState([]); // To store the fetched videos
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors
  const [selectedCategory, setSelectedCategory] = useState("All"); // Selected category filter

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/videos/get-allvideos");
      if (response.data.success) {
        setVideos(response.data.videos);
      } else {
        throw new Error("Failed to fetch videos. Please try again later.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filtered videos based on category
  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

  return (
    <Layout>
      {/* Category Selection Section */}
      <Box sx={{ padding: 1, backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
        <Grid container spacing={1}>
          {categories.map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  cursor: "pointer",
                  fontFamily: "Velyra",
                  fontSize: "0.75rem", // Slightly increased from 0.65rem
                  backgroundColor: selectedCategory === category ? "#0077ff" : "#f1f5fc",
                  color: selectedCategory === category ? "#fff" : "#333",
                  ":hover": { backgroundColor: "#0077ff", color: "#fff" },
                  padding: "2px 6px",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={30} thickness={6} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ padding: 1 }}>
          <ErrorDisplay error={error} onRetry={fetchVideos} />
        </Box>
      )}

      {/* Video Grid Section */}
      {!loading && !error && (
        <Grid container spacing={2} sx={{ padding: 2, backgroundColor: "#fff" }}>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <Grid
                onClick={() => {
                  navigate(`/watch/${video._id}`);
                }}
                item
                xs={12}
                sm={6}
                md={6}
                lg={4} // 3 videos per row on large screens
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
                        fontSize: "0.95rem", // Slightly increased from 0.85rem
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
                          fontSize: "0.8rem", // Slightly increased from 0.7rem
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
                          fontSize: "0.75rem", // Slightly increased from 0.65rem
                        }}
                      >
                        {video.viewedBy?.length || 0} views
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Velyra",
                          color: "#555",
                          fontSize: "0.75rem", // Slightly increased from 0.65rem
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
                        fontSize: "0.75rem", // Slightly increased from 0.65rem
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
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "Velyra",
                color: "#555",
                textAlign: "center",
                margin: "1rem auto",
                fontSize: "1rem", // Slightly increased from 0.9rem
              }}
            >
              No videos available in this category.
            </Typography>
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default HomePage;