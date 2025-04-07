import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Input,
  InputLabel,
  DialogTitle,
  FormControl,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ErrorDisplay from "../components/ErrorDisplay";

const Playlists = () => {
  const navigate = useNavigate();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playlistId, setPlaylistId] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isUpdatingPlaylist, setIsUpdatingPlaylist] = useState(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchUserPlaylists = async () => {
    if (!checkAuthentication()) {
      setPlaylistsLoading(false);
      return;
    }

    setPlaylistsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/playlists/my-playlists`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setUserPlaylists(response.data.playlists);
      } else {
        setError("Failed to fetch your playlists. Please try again later.");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || "An error occurred while fetching playlists.");
    } finally {
      setPlaylistsLoading(false);
    }
  };

  const handleUpdatePlaylist = async () => {
    setIsUpdatingPlaylist(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/playlists/update-playlist/${playlistId}`,
        {
          title: playlistTitle,
          description: playlistDescription,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setUserPlaylists((prevPlaylists) =>
          prevPlaylists.map((playlist) =>
            playlist._id === playlistId
              ? { ...playlist, title: playlistTitle, description: playlistDescription }
              : playlist
          )
        );
        setPlaylistId("");
        setPlaylistDialogOpen(false);
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsUpdatingPlaylist(false);
    }
  };

  const handleDelete = async (playlistId) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/playlists/delete-playlist/${playlistId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        toast.success("Playlist deleted successfully.", { style: { fontFamily: "Velyra" } });
        setUserPlaylists(userPlaylists.filter((playlist) => playlist._id !== playlistId));
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  
  
  const renderLoginPrompt = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Adjusted to match the previous full-height design
        width: "100%",
        background: "linear-gradient(135deg, #f5f7ff 0%, #e9f0ff 100%)", // Updated to match previous gradient
        padding: 0, // Removed padding to fill the screen
        margin: 0,
        mt:{md:-11},
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "900px", // Matching the reduced width from the previous code
          height: "80vh",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Left side - Branding Area */}
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #0062E6 0%, #33A8FF 100%)",
            display: { xs: "none", md: "flex" }, // Hidden on mobile
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
            Your Playlists
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
            Sign in to access and manage your playlists effortlessly.
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
                Please Log In
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
                Sign in to access and manage your playlists effortlessly!
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
                <Typography
                
                  style={{
                    fontFamily: "Velyra",
                    color: "#007BFF",
                    fontWeight: "700", // Bold
                    textDecoration: "none",
                    display:"inline-block",
                    cursor:"pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={()=>{navigate("/create-account")}}
                >
                  Sign up
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  return (
    <Layout>
      <ToastContainer />
      <Box
        sx={{
          padding: { xs: "12px", sm: "20px", md: "32px" },
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Simplified "My Playlists" Title */}
       {isAuthenticated &&<Typography
          variant="h4"
          sx={{
            fontFamily: "Velyra",
            fontWeight: 900,
            color: "#007BFF",
            mb: 4,
            textAlign: "center",
          }}
        >
          My Playlists ({userPlaylists.length})
        </Typography>
}

        {playlistsLoading && (
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
        )}

        {!playlistsLoading && !isAuthenticated && renderLoginPrompt()}

        {!playlistsLoading && isAuthenticated && error && (
          <ErrorDisplay error={error} onRetry={fetchUserPlaylists} />
        )}

        {!playlistsLoading && isAuthenticated && !error && (
          userPlaylists.length === 0 ? (
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.97)",
                boxShadow: "0 8px 24px rgba(0, 123, 255, 0.15)",
                textAlign: "center",
                maxWidth: "600px",
                width: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 10px 30px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Velyra",
                  color: "#666",
                  fontWeight: "medium",
                  mb: 2,
                  fontSize: "1.1rem",
                }}
              >
                No Playlists Yet!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/create-playlist")}
                sx={{
                  fontFamily: "Velyra",
                  background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
                  borderRadius: "12px",
                  padding: "8px 24px",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0, 123, 255, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create Your First Playlist
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ width: "100%", maxWidth: "1200px" }}>
              {userPlaylists.map((playlist, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    onClick={() => {
                      navigate(`/playlist/${playlist._id}/videos`);
                      setPlaylistId(playlist._id);
                    }}
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 6px 20px rgba(0, 123, 255, 0.15)",
                      background: "rgba(255, 255, 255, 0.98)",
                      display: "flex",
                      alignItems: "center",
                      p: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 30px rgba(0, 123, 255, 0.25)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        p: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <PlaylistPlayIcon
                          sx={{
                            fontSize: 36,
                            color: "#007BFF",
                            background: "rgba(0, 123, 255, 0.1)",
                            p: 1,
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "Velyra",
                              fontWeight: "bold",
                              color: "#007BFF",
                              fontSize: "1.1rem",
                            }}
                          >
                            {playlist.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Velyra",
                              color: "#666",
                              mt: 0.5,
                              fontSize: "0.85rem",
                            }}
                          >
                            {playlist.description || "No description available"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Velyra",
                              color: "#888",
                              mt: 0.5,
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <PlaylistPlayIcon fontSize="small" />
                            {playlist.videos.length} videos
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/playlist/${playlist._id}/videos`);
                          }}
                          sx={{
                            fontFamily: "Velyra",
                            borderRadius: "10px",
                            borderColor: "#007BFF",
                            color: "#007BFF",
                            px: 2,
                            py: 0.5,
                            fontSize: "0.85rem",
                            "&:hover": {
                              backgroundColor: "rgba(0, 123, 255, 0.1)",
                              borderColor: "#0056b3",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          View Playlist
                        </Button>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaylistTitle(playlist.title);
                            setPlaylistDescription(playlist.description);
                            setPlaylistId(playlist._id);
                            setPlaylistDialogOpen(true);
                          }}
                          sx={{
                            backgroundColor: "rgba(0, 123, 255, 0.1)",
                            borderRadius: "10px",
                            p: 1,
                            "&:hover": {
                              backgroundColor: "rgba(0, 123, 255, 0.2)",
                            },
                          }}
                        >
                          <EditIcon sx={{ color: "#007BFF", fontSize: 20 }} />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaylistId(playlist._id);
                            handleDelete(playlist._id);
                          }}
                          disabled={isDeleting && playlistId === playlist._id}
                          sx={{
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                            borderRadius: "10px",
                            p: 1,
                            "&:hover": {
                              backgroundColor: "rgba(255, 0, 0, 0.2)",
                            },
                          }}
                        >
                          <DeleteIcon
                            sx={{
                              color: isDeleting && playlistId === playlist._id ? "#aaa" : "#f44336",
                              fontSize: 20,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}

        {/* Edit Playlist Dialog */}
        <Dialog
          open={playlistDialogOpen}
          onClose={() => setPlaylistDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0, 123, 255, 0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Velyra",
              textAlign: "center",
              fontWeight: "bold",
              color: "#007BFF",
              py: 2.5,
              fontSize: "1.2rem",
            }}
          >
            Edit Playlist
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2.5,
                mt: 2,
                py: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel
                  shrink
                  sx={{
                    fontFamily: "Velyra",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#007BFF",
                  }}
                >
                  Title
                </InputLabel>
                <Input
                  value={playlistTitle}
                  inputProps={{ style: { fontFamily: "Velyra", fontSize: "0.9rem" } }}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                  fullWidth
                  sx={{
                    "&:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.3)" },
                    "&:hover:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.5)" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                    borderRadius: "10px",
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: "rgba(0, 123, 255, 0.05)",
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  shrink
                  sx={{
                    fontFamily: "Velyra",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#007BFF",
                  }}
                >
                  Description
                </InputLabel>
                <Input
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    "&:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.3)" },
                    "&:hover:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.5)" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                    fontFamily: "Velyra",
                    fontSize: "0.9rem",
                    borderRadius: "10px",
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: "rgba(0, 123, 255, 0.05)",
                  }}
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid rgba(0, 123, 255, 0.1)",
            }}
          >
            <Button
              onClick={() => setPlaylistDialogOpen(false)}
              sx={{
                fontFamily: "Velyra",
                color: "#666",
                borderRadius: "10px",
                px: 3,
                py: 0.75,
                fontSize: "0.85rem",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePlaylist}
              variant="contained"
              disabled={isUpdatingPlaylist}
              sx={{
                fontFamily: "Velyra",
                background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
                borderRadius: "10px",
                px: 3,
                py: 0.75,
                fontSize: "0.85rem",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0, 123, 255, 0.4)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#aaa",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              {isUpdatingPlaylist ? (
                <>
                  <CircularProgress size={18} sx={{ color: "inherit", mr: 1 }} />
                  Updating...
                </>
              ) : (
                "Update Playlist"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Playlists;