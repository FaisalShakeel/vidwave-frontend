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
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
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
        backgroundColor: "#f8f9ff",
        padding: 2,
      }}
    >
      <Box
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
          You need to be logged in to view your playlists. Sign in to manage your collections!
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
      </Box>
    </Box>
  );

  return (
    <Layout>
      <ToastContainer />
      <Box
        sx={{
          padding: { xs: "16px", sm: "24px" },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f8f9ff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Velyra",
            fontWeight: "bold",
            marginBottom: 3,
            color: "#007BFF",
            textAlign: "center",
          }}
        >
          My Playlists
        </Typography>

        {playlistsLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size={40} thickness={7} sx={{ color: "#007BFF" }} />
          </Box>
        )}

        {!playlistsLoading && !isAuthenticated && renderLoginPrompt()}

        {!playlistsLoading && isAuthenticated && error && (
          <ErrorDisplay
            error={error}
            onRetry={fetchUserPlaylists}
          />
        )}

        {!playlistsLoading && isAuthenticated && !error && (
          userPlaylists.length === 0 ? (
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Velyra",
                textAlign: "center",
                color: "#666",
                fontWeight: "medium",
                marginTop: "20px",
              }}
            >
              You haven’t created any playlists yet!
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ width: "100%", maxWidth: "800px" }}>
              {userPlaylists.map((playlist, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    onClick={() => {
                      navigate(`/playlist/${playlist._id}/videos`);
                      setPlaylistId(playlist._id);
                    }}
                    sx={{
                      borderRadius: "8px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Velyra",
                          fontWeight: "bold",
                          color: "#007BFF",
                        }}
                      >
                        {playlist.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Velyra",
                          color: "#666",
                        }}
                      >
                        {playlist.description || "No description available"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Velyra",
                          color: "#666",
                          fontWeight: "medium",
                        }}
                      >
                        Videos: {playlist.videos.length}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaylistTitle(playlist.title);
                            setPlaylistDescription(playlist.description);
                            setPlaylistId(playlist._id);
                            setPlaylistDialogOpen(true);
                          }}
                          sx={{
                            textTransform: "none",
                            fontFamily: "Velyra",
                            backgroundColor: "#007BFF",
                            "&:hover": { backgroundColor: "#0056b3" },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaylistId(playlist._id);
                            handleDelete(playlist._id);
                          }}
                          sx={{
                            textTransform: "none",
                            fontFamily: "Velyra",
                          }}
                        >
                          {isDeleting && playlistId === playlist._id ? "Deleting" : "Delete"}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}

        {/* Edit Playlist Dialog */}
        <Dialog open={playlistDialogOpen} onClose={() => setPlaylistDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              fontFamily: "Velyra",
              textAlign: "center",
              fontWeight: "bold",
              color: "#007BFF",
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
                    "&:before": { borderBottom: "2px solid #666" },
                    "&:hover:before": { borderBottom: "2px solid #666" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
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
                    "&:before": { borderBottom: "2px solid #666" },
                    "&:hover:before": { borderBottom: "2px solid #666" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                    fontFamily: "Velyra",
                  }}
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setPlaylistDialogOpen(false)}
              sx={{ fontFamily: "Velyra", color: "#007BFF" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePlaylist}
              variant="contained"
              disabled={isUpdatingPlaylist}
              sx={{
                fontFamily: "Velyra",
                backgroundColor: "#007BFF",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              {isUpdatingPlaylist ? "Updating" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Playlists;