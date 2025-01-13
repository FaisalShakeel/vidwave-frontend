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

const SavedVideos = () => {
  const navigate=useNavigate()


  const [savedVideos, setSavedVideos] = useState([]); // To store the fetched videos
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle errors


  useEffect(() => {
    const fetchSavedVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/videos/get-saved-videos",{headers:{"Authorization":localStorage.getItem("token")}});
        if (response.data.success) {
          setSavedVideos(response.data.savedVideos);
        } else {
          throw new Error("Failed to fetch saved videos. Please try again later.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching saved videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVideos();
  }, []);


 

  return (
    <Layout>
      {/* Category Selection Section */}
      

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={40} thickness={7} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ padding: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Video Grid Section */}
      {!loading && !error && (
        <Grid container spacing={3} sx={{ padding: 3, backgroundColor: "#fff" }}>
          {savedVideos.length > 0 ? (
            savedVideos.map((video, index) => (
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
              No saved videos!.
            </Typography>
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default SavedVideos;
