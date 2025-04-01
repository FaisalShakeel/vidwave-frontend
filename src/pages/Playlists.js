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
import { useNavigate } from "react-router-dom";
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
      const response = await axios.get("http://localhost:5000/playlists/getmyplaylists", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setUserPlaylists(response.data.playlists);
      } else {
        throw new Error("Failed to fetch your playlists. Please try again later.");
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
        `http://localhost:5000/playlists/update-playlist/${playlistId}`,
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
      const response = await axios.delete(`http://localhost:5000/playlists/delete-playlist/${playlistId}`, {
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
        minHeight: "80vh",
        background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
        padding: 2,
      }}
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: "24px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 8px 32px rgba(0, 123, 255, 0.2)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            mb: 2,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
            boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
          }}
        >
          <LockIcon sx={{ fontSize: 40, color: "#ffffff" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Velyra",
            fontWeight: "bold",
            color: "#007BFF",
            mb: 2,
            textShadow: "0 2px 4px rgba(0, 123, 255, 0.1)",
          }}
        >
          Please Log In
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Velyra",
            color: "#555",
            mb: 3,
            fontSize: "1.1rem",
          }}
        >
          You need to be logged in to view your playlists. Sign in to manage your collections!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            fontFamily: "Velyra",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
            borderRadius: "12px",
            padding: "12px 28px",
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0, 123, 255, 0.4)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );

  return (
    <Layout>
      <ToastContainer />
      <Box
        sx={{
          padding: { xs: "16px", sm: "24px", md: "32px" },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
            p: 2,
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 20px rgba(0, 123, 255, 0.1)",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <PlaylistPlayIcon
            sx={{
              fontSize: 40,
              color: "#007BFF",
              background: "rgba(0, 123, 255, 0.1)",
              p: 1,
              borderRadius: "12px",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Velyra",
              fontWeight: "bold",
              color: "#007BFF",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0, 123, 255, 0.1)",
            }}
          >
            My Playlists
          </Typography>
        </Box>

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
              size={60}
              thickness={5}
              sx={{
                color: "#007BFF",
                animationDuration: "800ms",
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
                p: 4,
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 20px rgba(0, 123, 255, 0.1)",
                textAlign: "center",
                maxWidth: "600px",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Velyra",
                  color: "#666",
                  fontWeight: "medium",
                  mb: 2,
                }}
              >
                You haven't created any playlists yet!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/create-playlist")}
                sx={{
                  fontFamily: "Velyra",
                  background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontSize: "1rem",
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
            <Grid container spacing={3} sx={{ width: "100%", maxWidth: "1200px" }}>
              {userPlaylists.map((playlist, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => {
                      navigate(`/playlist/${playlist._id}/videos`);
                      setPlaylistId(playlist._id);
                    }}
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                      background: "rgba(255, 255, 255, 0.9)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0, 123, 255, 0.2)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Velyra",
                            fontWeight: "bold",
                            color: "#007BFF",
                            flexGrow: 1,
                            wordBreak: "break-word",
                          }}
                        >
                          {playlist.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                          }}
                        >
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
                              borderRadius: "8px",
                              "&:hover": {
                                backgroundColor: "rgba(0, 123, 255, 0.2)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" sx={{ color: "#007BFF" }} />
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
                              borderRadius: "8px",
                              "&:hover": {
                                backgroundColor: "rgba(255, 0, 0, 0.2)",
                              },
                            }}
                          >
                            <DeleteIcon
                              fontSize="small"
                              sx={{
                                color: isDeleting && playlistId === playlist._id ? "#aaa" : "#f44336",
                              }}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Velyra",
                          color: "#666",
                          flexGrow: 1,
                        }}
                      >
                        {playlist.description || "No description available"}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#666",
                            fontWeight: "medium",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <PlaylistPlayIcon fontSize="small" />
                          {playlist.videos.length} videos
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/playlist/${playlist._id}/videos`);
                          }}
                          sx={{
                            fontFamily: "Velyra",
                            borderRadius: "12px",
                            borderColor: "#007BFF",
                            color: "#007BFF",
                            "&:hover": {
                              backgroundColor: "rgba(0, 123, 255, 0.1)",
                              borderColor: "#0056b3",
                            },
                          }}
                        >
                          View
                        </Button>
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
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0, 123, 255, 0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Velyra",
              textAlign: "center",
              fontWeight: "bold",
              color: "#007BFF",
              background: "linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 123, 255, 0.05) 100%)",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              py: 3,
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
                gap: 3,
                mt: 2,
                py: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel
                  shrink
                  sx={{
                    fontFamily: "Velyra",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#007BFF",
                  }}
                >
                  Title
                </InputLabel>
                <Input
                  value={playlistTitle}
                  inputProps={{ style: { fontFamily: "Velyra" } }}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                  fullWidth
                  sx={{
                    "&:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.2)" },
                    "&:hover:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.4)" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                    borderRadius: "8px",
                    px: 1,
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
                    fontSize: "18px",
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
                  rows={4}
                  fullWidth
                  sx={{
                    "&:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.2)" },
                    "&:hover:before": { borderBottom: "2px solid rgba(0, 123, 255, 0.4)" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                    fontFamily: "Velyra",
                    borderRadius: "8px",
                    px: 1,
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
                borderRadius: "12px",
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
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
                borderRadius: "12px",
                px: 3,
                py: 1,
                boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 12px rgba(0, 123, 255, 0.4)",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#aaa",
                },
              }}
            >
              {isUpdatingPlaylist ? (
                <>
                  <CircularProgress size={20} sx={{ color: "inherit", mr: 1 }} />
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