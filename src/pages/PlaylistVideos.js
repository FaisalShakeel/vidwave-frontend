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
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import Layout from "../components/Layout";
import { 
    
    ArrowBack, 

  } from "@mui/icons-material";

const PlaylistVideos = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
 const navigate=useNavigate()
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
        toast.error(response.data.message, {
          style: { fontFamily: "Velyra" },
        });
      }
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      toast.error(
        error.response?.data?.message || error.message,
        { style: { fontFamily: "Velyra" } }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [id]);

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: "#F9FAFB",
          minHeight: "100%",
          display: "flex",
          flexDirection:"column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "5px",
          paddingRight:"5px",
          paddingTop:'1px',
          mt:{xs:1,md:-3}
        }}
      >
          <Button
    startIcon={<ArrowBack />}
    onClick={() => navigate(-1)}
    sx={{
      fontFamily: "Velyra",
      fontSize: "16px",
      textTransform: "capitalize",
      color: "#007BFF",
    }}
  >
    Back
  </Button>

        {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <CircularProgress size={40} thickness={7} />
                  </Box>
        ) : !playlist ? (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Velyra",
              textAlign: "center",
              color: "#6C757D",
              fontWeight: "medium",
              marginTop: "20px",
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
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              width: "100%",
              maxWidth: "1000px",
              height: "90vh",
            }}
          >
            {/* Playlist Header */}
            <Box
              sx={{
                backgroundColor: "white",
                color: "#007BFF",
                padding: "16px 24px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontFamily: "Velyra", fontWeight: "bold" }}
              >
                {playlist.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Velyra",
                  color: "black",
                  marginTop: "8px",
                }}
              >
                {playlist.description}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Velyra",
                  marginTop: "4px",
                  fontWeight: "medium",
                }}
              >
                {playlist.videos.length} Videos
              </Typography>
            </Box>
 <Divider sx={{color:"black"}}/>
            {/* Playlist Content */}
            <Box
              sx={{
                flex: 1,
                padding: "16px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#007BFF",
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
                    marginTop: "20px",
                  }}
                >
                  No Videos
                </Typography>
              ) : (
                playlist.videos.map((video, index) => (
                  <Card
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                      padding: 2,
                      borderRadius: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.01)",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: "120px",
                        height: "80px",
                        backgroundImage: `url(${video.thumbnailUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                        marginRight: 2,
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
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: "8px",
                        }}
                      >
                        {video.title}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#6C757D",
                          }}
                        >
                          {video.likedBy.length} Likes
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#6C757D",
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
    </Layout>
  );
};

export default PlaylistVideos;
