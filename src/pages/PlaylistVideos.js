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
        `http://localhost:5000/playlists/get-playlist/${id}`,
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
          backgroundColor: "#F9FAFB",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: "16px", md: "24px" },
          mt: { xs: 1, md: -3 },
        }}
      >
        {/* Back Button */}
        <Box sx={{ width: "100%", maxWidth: "1000px", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              fontFamily: "Velyra",
              fontSize: "16px",
              textTransform: "none",
              color: "#007BFF",
              "&:hover": { backgroundColor: "#E7F3FF" },
              borderRadius: "50px",
              padding: "6px 16px",
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
            <CircularProgress size={40} thickness={6} sx={{ color: "#007BFF" }} />
          </Box>
        ) : !playlist ? (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Velyra",
              textAlign: "center",
              color: "#6C757D",
              fontWeight: "medium",
              mt: 4,
            }}
          >
            Playlist not found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0px 6px 20px rgba(0, 123, 255, 0.1)",
              width: "100%",
              maxWidth: "1000px",
              minHeight: "80vh",
              overflow: "hidden",
            }}
          >
            {/* Playlist Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
                color: "#FFFFFF",
                padding: "24px",
                textAlign: "center",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Velyra",
                  fontWeight: "bold",
                  fontSize: { xs: "24px", md: "32px" },
                }}
              >
                {playlist.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Velyra",
                  mt: 1,
                  fontSize: "16px",
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
                  fontSize: "14px",
                  opacity: 0.8,
                }}
              >
                {playlist.videos.length} {playlist.videos.length === 1 ? "Video" : "Videos"}
              </Typography>
            </Box>

            <Divider sx={{ bgcolor: "rgba(0, 123, 255, 0.2)" }} />

            {/* Playlist Content */}
            <Box
              sx={{
                flex: 1,
                padding: "24px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#007BFF",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#F1F5F9",
                  borderRadius: "4px",
                },
              }}
            >
              {playlist.videos.length === 0 ? (
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Velyra",
                    color: "#6C757D",
                    fontWeight: "medium",
                    textAlign: "center",
                    mt: 4,
                    fontSize: "18px",
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
                      p: 2,
                      borderRadius: "12px",
                      boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.1)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0px 8px 24px rgba(0, 123, 255, 0.2)",
                        backgroundColor: "#F9FAFB",
                      },
                    }}
                    onClick={() => navigate(`/watch/${video._id}`)}
                  >
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: "100px", md: "140px" },
                        height: { xs: "60px", md: "80px" },
                        backgroundImage: `url(${video.thumbnailUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                        mr: 2,
                      }}
                    />
                    {/* Video Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Velyra",
                          fontWeight: "bold",
                          color: "#333",
                          fontSize: { xs: "16px", md: "18px" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {video.title}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#6C757D",
                            fontSize: "14px",
                          }}
                        >
                          {video.likedBy.length} Likes
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#6C757D",
                            fontSize: "14px",
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