import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import Layout from "../components/Layout";
import { ArrowBack } from "@mui/icons-material";
import ErrorDisplay from "../components/ErrorDisplay";
import CustomSnackbar from "../components/CustomSnackbar";

const PlaylistVideos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch playlist details
  const fetchPlaylistDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/playlists/playlist/${id}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (response.data.success) {
        setPlaylist(response.data.playlist);
      } else {
        setError(response.data.message || "Failed to fetch playlist videos!");
      }
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      const message = error.response?.data?.message || error.message;
      setError(message);
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [id]);

  if (error) {
    return (
      <Layout>
        <ErrorDisplay error={error} onRetry={fetchPlaylistDetails} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: "12px", sm: "20px", md:"30px" },
          paddingTop:{md:"10px"}
        }}
      >
        {/* Back Button */}
        <Box sx={{ width: "100%", maxWidth: "1200px", mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              fontFamily: "Velyra",
              fontSize: "0.9rem",
              textTransform: "none",
              color: "#007BFF",
              borderRadius: "12px",
              padding: "6px 16px",
              backgroundColor: "rgba(0, 123, 255, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(0, 123, 255, 0.1)",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Back
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress
              size={50}
              thickness={5}
              sx={{
                color: "#007BFF",
                animationDuration: "700ms",
                boxShadow: "0 0 15px rgba(0, 123, 255, 0.3)",
              }}
            />
          </Box>
        ) : !playlist ? (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Velyra",
              textAlign: "center",
              color: "#666",
              fontWeight: "medium",
              mt: 4,
              fontSize: "1.1rem",
            }}
          >
            Playlist not found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0, 123, 255, 0.15)",
              width: "100%",
              maxWidth: "1200px",
              minHeight: "80vh",
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 10px 30px rgba(0, 123, 255, 0.25)",
              },
            }}
          >
            {/* Playlist Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
                color: "#FFFFFF",
                padding: { xs: "16px", md: "24px" },
                textAlign: "center",
                borderRadius: "16px 16px 0 0",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Velyra",
                  fontWeight: "bold",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  textShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                {playlist.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Velyra",
                  mt: 1,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  opacity: 0.9,
                }}
              >
                {playlist.description || "No description provided"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Velyra",
                  mt: 1,
                  fontWeight: "medium",
                  fontSize: { xs: "0.8rem", md: "0.85rem" },
                  opacity: 0.8,
                }}
              >
                {playlist.videos.length} {playlist.videos.length === 1 ? "Video" : "Videos"}
              </Typography>
            </Box>

            <Divider sx={{ bgcolor: "rgba(0, 123, 255, 0.15)" }} />

            {/* Playlist Content */}
            <Box
              sx={{
                flex: 1,
                padding: { xs: "16px", md: "24px" },
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#007BFF",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(0, 123, 255, 0.05)",
                  borderRadius: "3px",
                },
              }}
            >
              {playlist.videos.length === 0 ? (
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Velyra",
                    color: "#666",
                    fontWeight: "medium",
                    textAlign: "center",
                    mt: 4,
                    fontSize: "1.1rem",
                  }}
                >
                  No Videos in this Playlist
                </Typography>
              ) : (
                playlist.videos.map((video, index) => (
                  <Card
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      p: 1.5,
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 123, 255, 0.1)",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0, 123, 255, 0.2)",
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                    onClick={() => navigate(`/watch/${video._id}`)}
                  >
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: "90px", md: "120px" },
                        height: { xs: "50px", md: "70px" },
                        backgroundImage: `url(${video.thumbnailUrl || "https://via.placeholder.com/120x70"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                        mr: 2,
                        boxShadow: "0 2px 8px rgba(0, 123, 255, 0.15)",
                      }}
                    />
                    {/* Video Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Velyra",
                          fontWeight: "bold",
                          color: "#007BFF",
                          fontSize: { xs: "1rem", md: "1.1rem" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {video.title}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#666",
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                          }}
                        >
                          {video.likedBy.length} Likes
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#666",
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                          }}
                        >
                          {video.viewedBy.length} Views
                        </Typography>
                      </Stack>
                    </Box>
                  </Card>
                ))
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Custom Snackbar for Error Messages */}
      <CustomSnackbar
        open={Boolean(errorMessage)}
        message={errorMessage}
        severity="error"
        onClose={() => setErrorMessage("")}
      />
    </Layout>
  );
};

export default PlaylistVideos;