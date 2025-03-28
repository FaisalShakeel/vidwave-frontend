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
  const navigate=useNavigate()
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
      <Box sx={{ padding: 2, backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  cursor: "pointer",
                  fontFamily: "Velyra",
                  backgroundColor: selectedCategory === category ? "#0077ff" : "#f1f5fc",
                  color: selectedCategory === category ? "#fff" : "#333",
                  ":hover": { backgroundColor: "#0077ff", color: "#fff" },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={40} thickness={7} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ padding: 2 }}>
          <ErrorDisplay error={error} onRetry={fetchVideos}/>
        </Box>
      )}

      {/* Video Grid Section */}
      {!loading && !error && (
        <Grid container spacing={3} sx={{ padding: 3, backgroundColor: "#fff" }}>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <Grid onClick={()=>{
                navigate(`/watch/${video._id}`)
              }} item xs={12} sm={12} md={6} lg={6} xl={4} key={video._id || index}>
                <Card
                  sx={{
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                    ":hover": {
                      transform: "scale(1.05)",
                      transition: "0.3s ease",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                    },
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
                        color: "#333",
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
                        sx={{ width: 50, height: 50, marginRight: 2 }}
                      />
                      <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#555" }}>
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
                        sx={{ fontFamily: "Velyra", color: "#555", fontSize: "0.875rem" }}
                      >
                        {video.viewedBy?.length || 0} views
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "Velyra", color: "#555", fontSize: "0.875rem" }}
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
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Velyra",
                color: "#555",
                textAlign: "center",
                margin: "2rem auto",
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
