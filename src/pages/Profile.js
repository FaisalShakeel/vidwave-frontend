import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ErrorDisplay from "../components/ErrorDisplay";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState({});
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [decodedUser, setDecodedUser] = useState({});
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const token = localStorage.getItem("token");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const alreadySubscribed = () => {
    if (!user || !Array.isArray(user.followers)) return false;
    return user.followers.includes(decodedUser.id);
  };

  const subscribeToChannel = async () => {
    setIsSubscribing(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/follow`,
        { followingId: user._id },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        const message = response.data.message.trim().toLowerCase();

        if (message === "followed the user successfully") {
          setUser((prevUser) => ({
            ...prevUser,
            followers: [...(prevUser.followers || []), decodedUser.id],
          }));
        } else if (message === "unfollowed the user successfully") {
          setUser((prevUser) => ({
            ...prevUser,
            followers: (prevUser.followers || []).filter((id) => id !== decodedUser.id),
          }));
        }
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/profile/${id}`);
      if (response.data.success) {
        setUser(response.data.user);
        setVideos(response.data.videos);
        setPlaylists(response.data.playlists);
      } else {
        setError(response.data.message || "Failed to load profile.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while fetching the profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        setDecodedUser(decodedToken);
        setIsMe(decodedToken.id === id);
      } else {
        setIsMe(false);
      }
    } catch (e) {
      console.error("Error while decoding token:", e);
      setIsMe(false);
    }
  }, [token, id]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      const isSubscribed = alreadySubscribed();
      setHasSubscribed(isSubscribed);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9ff",
          }}
        >
          <CircularProgress size={30} thickness={6} sx={{ color: "#007BFF" }} />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchProfile} />;
  }

  return (
    <Layout>
      <Box
        sx={{
          width: { xs: "90%", md: "90%" },
          maxWidth: "1000px",
          margin: "0 auto",
          padding: { xs: 1, md: 2 },
          fontFamily: "Velyra",
          backgroundColor: "#f8f9ff",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <ToastContainer />

        {/* Back Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0,123,255,0.1)",
            padding: "6px 12px",
            width: "fit-content",
            cursor: "pointer",
            transition: "box-shadow 0.3s",
            "&:hover": { boxShadow: "0px 4px 12px rgba(0,123,255,0.2)" },
          }}
          onClick={() => navigate(-1)}
        >
          <IconButton>
            <ArrowBackIcon sx={{ color: "#007BFF", fontSize: 20 }} />
          </IconButton>
          <Typography
            sx={{
              ml: 0.5,
              fontSize: "0.95rem",
              fontWeight: "bold",
              fontFamily: "Velyra",
              color: "#007BFF",
            }}
          >
            Back
          </Typography>
        </Box>

        {/* User Info Section */}
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 2px 10px rgba(0,123,255,0.1)",
            p: 2,
            width: "100%",
            maxWidth: { xs: "90%", md: "98%" },
          }}
        >
          <Avatar
            src={user.profilePhotoUrl}
            alt={user.name}
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Velyra",
                fontWeight: "bold",
                textAlign: { xs: "center", md: "inherit" },
                color: "#007BFF",
                fontSize: "1.25rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name || "Unknown User"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                ml:{xs:4,md:0},
                fontFamily: "Velyra",
                color: "#666",
                fontSize: "0.75rem",
              }}
            >
              {user.followers?.length || 0} Followers
            </Typography>
          </Box>
          {isMe ? (
            <Button
              variant="outlined"
              onClick={() => navigate("/studio/settings")}
              sx={{
                textTransform: "capitalize",
                fontFamily: "Velyra",
                fontWeight: "bold",
                mr: { md: 2 },
                width: "120px",
                height: "36px",
                borderRadius: "6px",
                borderColor: "#007BFF",
                color: "#007BFF",
                fontSize: "0.85rem",
                "&:hover": {
                  borderColor: "#0056b3",
                  backgroundColor: "#F0F7FF",
                },
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              disabled={isSubscribing || !token}
              onClick={subscribeToChannel}
              variant="contained"
              sx={{
                textTransform: "capitalize",
                fontFamily: "Velyra",
                fontWeight: "bold",
                mr: { md: 2 },
                width: "125px",
                height: "45px",
                borderRadius: "50px",
                backgroundColor: hasSubscribed ? "#007BFF" : "#007BFF",
                fontSize: "0.85rem",
                
              }}
            >
              {isSubscribing ? (
                <CircularProgress style={{ width: "16px", height: "16px", color: "#fff" }} thickness={10} />
              ) : hasSubscribed ? (
                "Subscribed"
              ) : (
                "Subscribe"
              )}
            </Button>
          )}
        </Paper>

        {/* Tabs Section */}
        <Paper
          elevation={2}
          sx={{
            mt: 2,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0,123,255,0.1)",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              fontFamily: "Velyra",
              "& .MuiTab-root": {
                fontWeight: "bold",
                textTransform: "capitalize",
                fontFamily: "Velyra",
                color: "#666",
                fontSize: "0.95rem",
                "&.Mui-selected": { color: "#007BFF" },
              },
              "& .MuiTabs-indicator": { backgroundColor: "#007BFF" },
            }}
          >
            <Tab label="Videos" />
            <Tab label="Playlists" />
            <Tab label="About" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 2, maxWidth: "100%" }}>
          {/* Videos Tab */}
          {activeTab === 0 && (
            <Grid container spacing={2}>
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      sx={{
                        p: 1,
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 8px rgba(0,123,255,0.1)",
                        height: "240px",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0px 4px 12px rgba(0,123,255,0.2)",
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/watch/${video._id}`)}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "6px 6px 0 0",
                        }}
                      />
                      <Box sx={{ mt: 1, flexGrow: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Velyra",
                            fontWeight: "bold",
                            color: "#007BFF",
                            fontSize: "0.95rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {video.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 0.5,
                          fontFamily: "Velyra",
                          color: "#666",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            fontSize: "0.75rem",
                          }}
                        >
                          {video.viewedBy.length} views
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            fontSize: "0.75rem",
                          }}
                        >
                          {video.likedBy.length} likes
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: "100%", textAlign: "center", py: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Velyra",
                      color: "#666",
                      fontSize: "1rem",
                    }}
                  >
                    No videos available.
                  </Typography>
                </Box>
              )}
            </Grid>
          )}

          {/* Playlists Tab */}
          {activeTab === 1 && (
            <Grid container spacing={2}>
              {playlists.length > 0 ? (
                playlists.map((playlist, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 8px rgba(0,123,255,0.1)",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0px 4px 12px rgba(0,123,255,0.2)",
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/playlist/${playlist._id}/videos`)}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Velyra",
                          fontWeight: "bold",
                          color: "#007BFF",
                          textAlign: "center",
                          fontSize: "1rem",
                        }}
                      >
                        {playlist.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Velyra",
                          color: "#666",
                          textAlign: "center",
                          mt: 0.5,
                          fontSize: "0.75rem",
                        }}
                      >
                        {playlist.videos.length}{" "}
                        {playlist.videos.length === 1 ? "video" : "videos"}
                      </Typography>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: "100%", textAlign: "center", py: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Velyra",
                      color: "#666",
                      fontSize: "1rem",
                    }}
                  >
                    No playlists available.
                  </Typography>
                </Box>
              )}
            </Grid>
          )}

          {/* About Tab */}
          {activeTab === 2 && (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0px 2px 8px rgba(0,123,255,0.1)",
                maxWidth: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Velyra",
                  fontWeight: "bold",
                  color: "#007BFF",
                  mb: 1,
                  fontSize: "1rem",
                }}
              >
                About
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Velyra",
                  color: "#333",
                  fontSize: "0.95rem",
                }}
              >
                {user.bio || "No bio available."}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontFamily: "Velyra",
                  color: "#666",
                  fontSize: "0.75rem",
                }}
              >
                Joined: {user.joinedOn ? new Date(user.joinedOn).toLocaleDateString() : "Unknown"}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Profile;