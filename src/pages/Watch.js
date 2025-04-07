import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Input,
  Collapse,
  Paper,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import ReactPlayer from "react-player";
import { jwtDecode } from "jwt-decode";
import {
  ThumbUp,
  SaveAlt,
  ArrowBack,
  PlaylistAdd,
  Add,
  Folder,
  Close,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import ErrorDisplay from "../components/ErrorDisplay";
import CustomSnackbar from "../components/CustomSnackbar";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const commentInputRef = useRef(null);

  // State declarations
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [video, setVideo] = useState({});
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [uploadedBy, setUploadedBy] = useState({});
  const [loading, setLoading] = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [newPlaylistDialogOpen, setNewPlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [selectedPlaylistName, setSelectedPlaylistName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [UID, setUID] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [replyingToName, setReplyingToName] = useState("");
  const [commentId, setCommentId] = useState("");
  const [isMe, setIsMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Snackbar states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Authentication check
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIsMe(false);
      return false;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsMe(false);
        return false;
      }
      setIsAuthenticated(true);
      setUID(decodedToken.id);
      return true;
    } catch (e) {
      setIsAuthenticated(false);
      setIsMe(false);
      return false;
    }
  };

  const handleExpandReplies = (index) => {
    setExpandedComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const hasSubscribed = () => {
    if (!uploadedBy || !Array.isArray(uploadedBy.followers)) return false;
    return uploadedBy.followers.includes(UID);
  };

  const isAlreadyLiked = (likedBy) => {
    try {
      return likedBy ? likedBy.includes(UID) : false;
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
    }
  };

  useEffect(() => {
    if (video?.likedBy && isAuthenticated) {
      setIsLikeLoading(true);
      setIsLiked(isAlreadyLiked(video.likedBy));
      setIsLikeLoading(false);
    }
  }, [video, isAuthenticated]);

  const isAlreadySaved = () => {
    if (userPlaylists.length === 0 || !isAuthenticated) return false;
    const _isSaved = userPlaylists.some((playlist) => {
      const videoExists = playlist.videos.some((v) => v._id === id);
      if (videoExists) {
        setSelectedPlaylistId(playlist._id);
        setSelectedPlaylistName(playlist.title);
        return true;
      }
      return false;
    });
    setIsSaved(_isSaved);
    return _isSaved;
  };

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      setInfoMessage("Please log in to save videos.");
      setTimeout(() => setInfoMessage(""), 2000);
      return;
    }
    setPlaylistDialogOpen(true);
  };

  const replyToComment = async () => {
    if (!isAuthenticated) {
      setInfoMessage("Please log in to comment.");
      setTimeout(() => setInfoMessage(""), 2000);
      return;
    }
    setIsCommenting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/videos/reply-to-comment`,
        { videoId: id, commentId, replyText: newComment },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 2000);
        setVideo(response.data.video);
        setReplyingToName("");
        setNewComment("");
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      }
    } catch (e) {
      setErrorMessage(e.response ? e.response.data.message : e.message);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsCommenting(false);
    }
  };

  const addComment = async () => {
    if (!isAuthenticated) {
      setInfoMessage("Please log in to comment.");
      setTimeout(() => setInfoMessage(""), 2000);
      return;
    }
    setIsCommenting(true);
    try {
      const response = await axios.post(
        `${[process.env.REACT_APP_API_BASE_URL]}/videos/add-comment`,
        { videoId: id, comment: newComment },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 2000);
        setVideo(response.data.video);
        setNewComment("");
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      }
    } catch (e) {
      setErrorMessage(e.response ? e.response.data.message : e.message);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsCommenting(false);
    }
  };

  const likeVideo = async () => {
    if (!isAuthenticated) {
      setInfoMessage("Please log in to like videos.");
      setTimeout(() => setInfoMessage(""), 2000);
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/videos/like-video`,
        { videoId: id },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 2000);
        setIsLiked((prev) => !prev);
        setVideo((prevVideo) => {
          const updatedVideo = { ...prevVideo };
          const currentLikedBy = updatedVideo.likedBy || [];
          if (!currentLikedBy.includes(UID)) {
            updatedVideo.likedBy = [...currentLikedBy, UID];
          } else {
            updatedVideo.likedBy = currentLikedBy.filter((id) => id !== UID);
          }
          return updatedVideo;
        });
      }
    } catch (e) {
      setErrorMessage(e.response ? e.response.data.message : e.message);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsLiking(false);
    }
  };

  const fetchUserPlaylists = async () => {
    if (!isAuthenticated) return;
    setPlaylistsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/playlists/my-playlists`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setUserPlaylists(response.data.playlists);
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      }
    } catch (error) {
      if (error.response?.data.message !== "No playlists found.") {
        setErrorMessage(error.response ? error.response.data.message : error.message);
        setTimeout(() => setErrorMessage(""), 2000);
      }
    } finally {
      setPlaylistsLoading(false);
    }
  };

  const handleCreateNewPlaylist = async () => {
    if (!isAuthenticated) {
      setInfoMessage("Please log in to create playlists.");
      setTimeout(() => setInfoMessage(""), 2000);
      return;
    }
    setIsCreatingPlaylist(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/playlists/create`,
        { title: newPlaylistName, description: newPlaylistDescription },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 2000);
        setNewPlaylistDialogOpen(false);
        setPlaylistDialogOpen(false);
        setNewPlaylistName("");
        setUserPlaylists([...userPlaylists, response.data.playlist]);
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : error.message);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!isAuthenticated) {
      setInfoMessage("Please log in to save videos.");
      setTimeout(() => setInfoMessage(""), 2000);
      return;
    }
    setIsSaving(true);
    setIsUnsaving(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/playlists/add-to-playlist`,
        { video, playlistId },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 2000);
        setPlaylistDialogOpen(false);
        setIsSaved(!isSaved);
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      }
    } catch (e) {
      setErrorMessage(e.response ? e.response.data.message : e.message);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsSaving(false);
      setIsUnsaving(false);
    }
  };

  const subscribeToChannel = async () => {
    if (!isAuthenticated) {
      setInfoMessage("Please log in to subscribe.");
      setTimeout(() => setInfoMessage(""), 2000);
      return;
    }
    setIsSubscribing(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/follow`,
        { followingId: uploadedBy._id },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 2000);
        const message = response.data.message.trim().toLowerCase();
        if (message === "followed the user successfully") {
          setUploadedBy((prev) => ({
            ...prev,
            followers: [...(prev.followers || []), UID],
          }));
        } else if (message === "unfollowed the user successfully") {
          setUploadedBy((prev) => ({
            ...prev,
            followers: (prev.followers || []).filter((id) => id !== UID),
          }));
        }
      }
    } catch (e) {
      setErrorMessage(e.response ? e.response.data.message : e.message);
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsSubscribing(false);
    }
  };

  const getVideoDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/videos/video-details/${id}${token ? `?token=${token}` : ""}`
      );
      if (response.data.success) {
        setVideo(response.data.video);
        setUploadedBy(response.data.uploadedBy);
        setRelatedVideos(response.data.relevantVideos);
      } else {
        setError(response.data.message || "Failed to load video details.");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : "An error occurred while fetching the video.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
    getVideoDetails();
    if (isAuthenticated) fetchUserPlaylists();
  }, [id]);

  useEffect(() => {
    if (uploadedBy && isAuthenticated) {
      setIsMe(uploadedBy._id === UID);
      setAlreadySubscribed(hasSubscribed());
    } else {
      setIsMe(false);
    }
  }, [uploadedBy, UID, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPlaylists();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!playlistsLoading && isAuthenticated) {
      isAlreadySaved();
    }
  }, [playlistsLoading, userPlaylists]);

  const handleReplyClick = (name, id) => {
    setReplyingToName(name);
    setCommentId(id);
    commentInputRef.current?.scrollIntoView({ behavior: "smooth" });
    commentInputRef.current?.focus();
  };

  const clearReply = () => {
    setReplyingToName("");
    setCommentId("");
    setNewComment("");
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={getVideoDetails} />;
  }

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={30} thickness={6} sx={{ color: "#007BFF" }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ padding: { xs: 1, md: 2 }, overflowX: "hidden", backgroundColor: "#f8f9ff" }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            fontFamily: "Velyra",
            fontSize: "0.95rem",
            textTransform: "capitalize",
            color: "#007BFF",
            mb: 1,
            "&:hover": { backgroundColor: "#e7f3ff" },
          }}
        >
          Back
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            gap: 2,
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                boxShadow: "0px 2px 10px rgba(0,123,255,0.1)",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#000",
                  borderRadius: "12px 12px 0 0",
                  width: "100%",
                  maxWidth: "800px",
                  aspectRatio: "16/9",
                  mx: "auto",
                  position: "relative",
                }}
              >
                {video?.url ? (
                  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                    {!isPlaying && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${video.thumbnailUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          zIndex: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => setIsPlaying(true)}
                      />
                    )}
                    <ReactPlayer
                      url={video.url}
                      playing={isPlaying}
                      controls
                      width="100%"
                      height="100%"
                      style={{ borderRadius: "12px", zIndex: 2 }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#000",
                    }}
                  >
                    <CircularProgress sx={{ color: "#007BFF" }} />
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Velyra",
                    fontWeight: "bold",
                    color: "#007BFF",
                    fontSize: "1.25rem",
                  }}
                >
                  {video.title || ""}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Velyra",
                    color: "#666",
                    fontSize: "0.75rem",
                  }}
                >
                  {video.viewedBy?.length || 0} Views • {moment(video.createdAt).fromNow()}
                </Typography>

                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button
                    disabled={!isAuthenticated || isLiking}
                    onClick={likeVideo}
                    startIcon={<ThumbUp />}
                    variant={isLiked ? "contained" : "outlined"}
                    sx={{
                      fontFamily: "Velyra",
                      color: isLiked ? "#fff" : "#007BFF",
                      backgroundColor: isLiked ? "#007BFF" : "transparent",
                      borderColor: "#007BFF",
                      borderRadius:"50px",
                      fontSize: "0.85rem",
                      padding: "4px 8px",
                      "&:hover": {
                        backgroundColor: isLiked ? "#0056b3" : "#e7f3ff",
                        borderColor: "#007BFF",
                      },
                    }}
                  >
                    {isLiking ? "Processing..." : isLiked ? "Liked" : "Like"} (
                    {video.likedBy?.length || 0})
                  </Button>
                  <Button
                    disabled={!isAuthenticated || isUnsaving}
                    startIcon={<SaveAlt />}
                    variant={isSaved ? "contained" : "outlined"}
                    sx={{
                      fontFamily: "Velyra",
                      color: isSaved ? "#fff" : "#007BFF",
                      backgroundColor: isSaved ? "#007BFF" : "transparent",
                      borderColor: "#007BFF",
                      borderRadius:"50px",
                      fontSize: "0.85rem",
                      padding: "4px 8px",
                      "&:hover": {
                        backgroundColor: isSaved ? "#0056b3" : "#e7f3ff",
                        borderColor: "#007BFF",
                      },
                    }}
                    onClick={() =>
                      isSaved ? handleAddToPlaylist(selectedPlaylistId) : handleSaveClick()
                    }
                  >
                    {isSaved ? (isUnsaving ? "Unsaving" : "Saved") : "Save"}
                  </Button>
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Velyra",
                      color: "#333",
                      fontSize: "0.95rem",
                    }}
                  >
                    <strong>Description: </strong>
                    {showFullDescription
                      ? video.description && video.description.trim() !== ""
                        ? video.description
                        : "No description available"
                      : video.description && video.description.trim() !== ""
                      ? `${video.description.slice(0, 150)}...`
                      : "No description available"}
                  </Typography>
                  {video.description?.length > 150 && (
                    <Button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      sx={{
                        fontFamily: "Velyra",
                        color: "#007BFF",
                        mt: 0.5,
                        textTransform: "none",
                        fontSize: "0.75rem",
                        borderRadius:"50px"
                      }}
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Velyra",
                      color: "#333",
                      fontSize: "0.75rem",
                    }}
                  >
                    <strong>Tags: </strong>
                  </Typography>
                  {video.tags?.length > 0 ? (
                    video.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        sx={{
                          mr: 0.5,
                          mb: 0.5,
                          fontFamily: "Velyra",
                          bgcolor: "#007BFF",
                          color: "#fff",
                          fontSize: "0.65rem",
                          padding: "2px 4px",
                          "&:hover": { bgcolor: "#0056b3" },
                        }}
                      />
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Velyra",
                        color: "#666",
                        fontSize: "0.75rem",
                      }}
                    >
                      No Tags Available
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 2px 10px rgba(0,123,255,0.1)",
              }}
            >
              <Avatar
                onClick={() => navigate(`/profile/${uploadedBy._id}`)}
                src={uploadedBy.profilePhotoUrl}
                alt={uploadedBy.name}
                sx={{ width: 40, height: 40, cursor: "pointer" }}
              />
              <Box
                onClick={() => navigate(`/profile/${uploadedBy._id}`)}
                sx={{ flexGrow: 1, cursor: "pointer" }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Velyra",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                  }}
                >
                  {uploadedBy.name || "Unknown"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Velyra",
                    color: "#666",
                    fontSize: "0.75rem",
                  }}
                >
                  {uploadedBy.followers?.length || 0} Followers
                </Typography>
              </Box>
              {!isMe && (
                <Button
                  onClick={subscribeToChannel}
                  variant="contained"
                  disabled={!isAuthenticated || isSubscribing}
                  sx={{
                    fontFamily: "Velyra",
                    textTransform: "capitalize",
                    height: "36px",
                    width: "120px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    borderRadius:"50px",
                    fontSize: "0.85rem",
                    "&:hover": { backgroundColor: isAuthenticated ? "#0056b3" : "#007BFF" },
                  }}
                >
                  {isSubscribing ? (
                    <CircularProgress style={{ color: "#fff", height: "14px", width: "14px" }} thickness={10} />
                  ) : alreadySubscribed ? (
                    "Subscribed"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              )}
            </Paper>

            <Paper
              elevation={2}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: "50px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 2px 10px rgba(0,123,255,0.1)",
                maxHeight: "450px",
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "7px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "lightgray", borderRadius: "20px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "lightgray", borderRadius: "10px" },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Velyra",
                  mb: 1,
                  color: "#007BFF",
                  fontSize: "1rem",
                }}
              >
                Comments ({video.comments?.length || 0})
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }} ref={commentInputRef}>
                <Box sx={{ position: "relative", width: "100%" }}>
                  <Input
                    placeholder={
                      replyingToName ? `Replying to @${replyingToName}` : "Add a comment..."
                    }
                    fullWidth
                    multiline
                    rows={2}
                    value={replyingToName ? `@${replyingToName}: ${newComment}` : newComment}
                    onChange={(e) => setNewComment(e.target.value.replace(`@${replyingToName}: `, ""))}
                    sx={{
                      fontFamily: "Velyra",
                      padding: "8px",
                      borderRadius: "6px",
                      backgroundColor: "#f5f5f5",
                      fontSize: "0.95rem",
                      "&:focus": { backgroundColor: "#fff", boxShadow: "0 0 5px #007BFF" },
                    }}
                    disabled={!isAuthenticated}
                  />
                  {replyingToName && (
                    <IconButton
                      onClick={clearReply}
                      sx={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        color: "#007BFF",
                      }}
                    >
                      <Close />
                    </IconButton>
                  )}
                </Box>
                <Button
                  disabled={!isAuthenticated || isCommenting}
                  onClick={() => (replyingToName ? replyToComment() : addComment())}
                  variant="contained"
                  sx={{
                    fontFamily: "Velyra",
                    height: "40px",
                    width: "95px",
                    textTransform: "none",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    borderRadius:"50px",
                    fontSize: "0.85rem",
                  }}
                >
                  {isCommenting ? (
                    <CircularProgress style={{ color: "#fff", height: "14px", width: "14px" }} thickness={10} />
                  ) : (
                    "Comment"
                  )}
                </Button>
              </Box>

              {video.comments?.length > 0 ? (
                video.comments.map((comment, index) => (
                  <Box key={index} sx={{ mt: 1 }}>
                    <Paper sx={{ padding: 1, borderRadius: "8px", backgroundColor: "#fafafa" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src={comment.profilePhotoUrl} alt={comment.name} sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "Velyra",
                              fontWeight: "bold",
                              fontSize: "0.95rem",
                            }}
                          >
                            {comment.name || "Anonymous"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "Velyra",
                              color: "#666",
                              fontSize: "0.65rem",
                            }}
                          >
                            {moment(new Date(comment.date).toLocaleString()).fromNow()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Velyra",
                          my: 0.5,
                          fontSize: "0.85rem",
                        }}
                      >
                        {comment.text}
                      </Typography>
                      <Button
                        onClick={() => handleReplyClick(comment.name, comment._id)}
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: "0.75rem",
                          color: "#007BFF",
                        }}
                        disabled={!isAuthenticated}
                      >
                        Reply
                      </Button>
                      {comment.replies?.length > 0 && (
                        <Button
                          onClick={() => handleExpandReplies(index)}
                          sx={{
                            fontFamily: "Velyra",
                            fontSize: "0.75rem",
                            color: "#007BFF",
                          }}
                        >
                          {comment.replies.length} Replies
                        </Button>
                      )}
                    </Paper>

                    <Collapse in={expandedComments[index]}>
                      {comment.replies?.map((reply, idx) => (
                        <Box key={idx} sx={{ pl: 3, mt: 0.5 }}>
                          <Paper sx={{ padding: 1, borderRadius: "8px", backgroundColor: "#f0f0f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar src={reply.profilePhotoUrl} alt={reply.name} sx={{ width: 24, height: 24 }} />
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontFamily: "Velyra",
                                    fontWeight: "bold",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {reply.name || "Anonymous"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontFamily: "Velyra",
                                    color: "#666",
                                    fontSize: "0.65rem",
                                  }}
                                >
                                  {moment(new Date(reply.date).toLocaleString()).fromNow()}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "Velyra",
                                mt: 0.5,
                                fontSize: "0.85rem",
                              }}
                            >
                              {reply.text}
                            </Typography>
                            <Button
                              onClick={() => handleReplyClick(reply.name, comment._id)}
                              sx={{
                                fontFamily: "Velyra",
                                fontSize: "0.75rem",
                                color: "#007BFF",
                              }}
                              disabled={!isAuthenticated}
                            >
                              Reply
                            </Button>
                          </Paper>
                        </Box>
                      ))}
                    </Collapse>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontFamily: "Velyra",
                    py: 2,
                    fontSize: "0.95rem",
                  }}
                >
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </Paper>
          </Box>

          <Paper
            elevation={2}
            sx={{
              width: { md: "35%", xs: "100%" },
              mt: { xs: 2, md: 0 },
              p: 1,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 2px 10px rgba(0,123,255,0.1)",
              height: "fit-content",
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
              Related Videos
            </Typography>
            {relatedVideos.length > 0 ? (
              relatedVideos.map((video, index) => (
                <Box
                  key={index}
                  sx={{
                    mt: 1,
                    display: "flex",
                    gap: 1,
                    cursor: "pointer",
                    p: 0.5,
                    borderRadius: "6px",
                    "&:hover": { backgroundColor: "#e7f3ff" },
                  }}
                  onClick={() => navigate(`/watch/${video._id}`)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={{
                      width: "140px",
                      height: "80px",
                      borderRadius: "6px",
                      objectFit: "cover",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Velyra",
                        fontWeight: "bold",
                        color: "#007BFF",
                        fontSize: "0.85rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {video.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Velyra",
                        color: "#666",
                        mt: 0.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {video.viewedBy.length} Views • {moment(video.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  color: "#666",
                  fontFamily: "Velyra",
                  py: 2,
                  fontSize: "0.95rem",
                }}
              >
                No related videos available
              </Typography>
            )}
          </Paper>
        </Box>

        <Dialog open={playlistDialogOpen} onClose={() => setPlaylistDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontFamily: "Velyra", color: "#007BFF", fontSize: "1rem" }}>
            Save to Playlist
          </DialogTitle>
          <DialogContent>
            <List
              sx={{
                width: "100%",
                maxHeight: "350px",
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#007BFF", borderRadius: "8px" },
              }}
            >
              {userPlaylists.map((playlist) => {
                const isSelected = playlist.title === selectedPlaylistName && playlist._id === selectedPlaylistId;
                const truncatedDescription =
                  playlist.description?.length > 80
                    ? `${playlist.description.substring(0, 80)}...`
                    : playlist.description;

                return (
                  <ListItem
                    key={playlist.id}
                    button
                    onClick={() => {
                      setSelectedPlaylistName(playlist.title);
                      setSelectedPlaylistId(playlist._id);
                    }}
                    sx={{
                      borderRadius: "6px",
                      backgroundColor: isSelected ? "#e7f3ff" : "transparent",
                      "&:hover": { backgroundColor: isSelected ? "#e7f3ff" : "#f5f5f5" },
                      transition: "background-color 0.3s",
                      padding: "8px",
                    }}
                  >
                    <ListItemIcon>
                      <Folder sx={{ color: isSelected ? "#007BFF" : "#666" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={playlist.title}
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Velyra",
                            color: "#666",
                            fontSize: "0.75rem",
                          }}
                        >
                          {truncatedDescription || "No description available"}
                        </Typography>
                      }
                      primaryTypographyProps={{
                        fontFamily: "Velyra",
                        fontWeight: isSelected ? "bold" : "normal",
                        fontSize: "0.95rem",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Velyra",
                        color: "#666",
                        fontSize: "0.65rem",
                      }}
                    >
                      {playlist.videos.length} videos
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
            <Divider sx={{ my: 1 }} />
            <Button
              startIcon={<Add />}
              onClick={() => {
                setPlaylistDialogOpen(false);
                setNewPlaylistDialogOpen(true);
              }}
              sx={{
                fontFamily: "Velyra",
                color: "#007BFF",
                fontSize: "0.85rem",
                "&:hover": { backgroundColor: "#e7f3ff" },
              }}
              disabled={!isAuthenticated}
            >
              Create new playlist
            </Button>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isSaving}
              onClick={() => {
                if (selectedPlaylistId && selectedPlaylistName) {
                  handleAddToPlaylist(selectedPlaylistId);
                } else {
                  setPlaylistDialogOpen(false);
                }
              }}
              sx={{
                fontFamily: "Velyra",
                color: "#007BFF",
                fontSize: "0.85rem",
              }}
            >
              {selectedPlaylistId && selectedPlaylistName ? (isSaving ? "Saving" : "Save") : "Cancel"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={newPlaylistDialogOpen}
          onClose={() => setNewPlaylistDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontFamily: "Velyra",
              textAlign: "center",
              color: "#007BFF",
              fontSize: "1rem",
            }}
          >
            Create New Playlist
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel shrink sx={{ fontFamily: "Velyra", color: "#007BFF", fontSize: "0.95rem" }}>
                  Title
                </InputLabel>
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  fullWidth
                  sx={{
                    fontFamily: "Velyra",
                    fontSize: "0.95rem",
                    "&:before": { borderBottom: "2px solid #007BFF" },
                    "&:hover:before": { borderBottom: "2px solid #0056b3" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                  }}
                  disabled={!isAuthenticated}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel shrink sx={{ fontFamily: "Velyra", color: "#007BFF", fontSize: "0.95rem" }}>
                  Description
                </InputLabel>
                <Input
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    fontFamily: "Velyra",
                    fontSize: "0.95rem",
                    "&:before": { borderBottom: "2px solid #007BFF" },
                    "&:hover:before": { borderBottom: "2px solid #0056b3" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                  }}
                  disabled={!isAuthenticated}
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setNewPlaylistDialogOpen(false)}
              sx={{
                fontFamily: "Velyra",
                color: "#007BFF",
                fontSize: "0.85rem",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewPlaylist}
              variant="contained"
              disabled={!isAuthenticated || isCreatingPlaylist}
              sx={{
                fontFamily: "Velyra",
                backgroundColor: "#007BFF",
                color: "#fff",
                fontSize: "0.85rem",
                borderRadius:"50px",
                "&:hover": { backgroundColor: isAuthenticated ? "#0056b3" : "#007BFF" },
              }}
            >
              {isCreatingPlaylist ? "Creating" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Custom Snackbars */}
        <CustomSnackbar
          open={Boolean(successMessage)}
          message={successMessage}
          severity="success"
          onClose={() => setSuccessMessage("")}
        />
        <CustomSnackbar
          open={Boolean(errorMessage)}
          message={errorMessage}
          severity="error"
          onClose={() => setErrorMessage("")}
        />
        <CustomSnackbar
          open={Boolean(infoMessage)}
          message={infoMessage}
          severity="info"
          onClose={() => setInfoMessage("")}
        />
      </Box>
    </Layout>
  );
};

export default Watch;