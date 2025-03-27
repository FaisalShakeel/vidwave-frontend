import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ReactPlayer from "react-player";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import {
  ThumbUp,
  SaveAlt,
  ArrowBack,
  PlaylistAdd,
  Add,
  Folder,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import ErrorDisplay from "../components/ErrorDisplay";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      const _isLiked = likedBy ? likedBy.includes(UID) : false;
      return _isLiked;
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
      toast.info("Please log in to save videos.", { style: { fontFamily: "Velyra" } });
      return;
    }
    setPlaylistDialogOpen(true);
    fetchUserPlaylists();
  };

  const replyToComment = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to comment.", { style: { fontFamily: "Velyra" } });
      return;
    }
    setIsCommenting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/videos/replytocomment",
        { videoId: id, commentId, replyText: newComment },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setVideo(response.data.video);
        setReplyingToName("");
        setNewComment("");
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const addComment = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to comment.", { style: { fontFamily: "Velyra" } });
      return;
    }
    setIsCommenting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/videos/addcomment",
        { videoId: id, comment: newComment },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setVideo(response.data.video);
        setNewComment("");
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const likeVideo = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to like videos.", { style: { fontFamily: "Velyra" } });
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/videos/likevideo",
        { videoId: id },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
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
      toast.error(e.response ? e.response.data.message : e.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsLiking(false);
    }
  };

  const fetchUserPlaylists = async () => {
    if (!isAuthenticated) return;
    setPlaylistsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/playlists/getmyplaylists", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setUserPlaylists(response.data.playlists);
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (error) {
      if (error.response?.data.message !== "No playlists found.") {
        toast.error(error.response ? error.response.data.message : error.message, {
          style: { fontFamily: "Velyra" },
        });
      }
    } finally {
      setPlaylistsLoading(false);
    }
  };

  const handleCreateNewPlaylist = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to create playlists.", { style: { fontFamily: "Velyra" } });
      return;
    }
    setIsCreatingPlaylist(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/playlists/create",
        { title: newPlaylistName, description: newPlaylistDescription },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setNewPlaylistDialogOpen(false);
        setPlaylistDialogOpen(false);
        setNewPlaylistName("");
        setUserPlaylists([...userPlaylists, response.data.playlist]);
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!isAuthenticated) {
      toast.info("Please log in to save videos.", { style: { fontFamily: "Velyra" } });
      return;
    }
    setIsSaving(true);
    setIsUnsaving(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/playlists/addtoplaylist`,
        { video, playlistId },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setPlaylistDialogOpen(false);
        setIsSaved(!isSaved);
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, {
        style: { fontFamily: "Velyra" },
      });
    } finally {
      setIsSaving(false);
      setIsUnsaving(false);
    }
  };

  const subscribeToChannel = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to subscribe.", { style: { fontFamily: "Velyra" } });
      return;
    }
    setIsSubscribing(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/users/follow",
        { followingId: uploadedBy._id },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
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
      toast.error(e.response ? e.response.data.message : e.message, {
        style: { fontFamily: "Velyra" },
      });
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
        `http://localhost:5000/videos/getvideo/${id}${token ? `?token=${token}` : ""}`
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
    if (!playlistsLoading && isAuthenticated) {
      isAlreadySaved();
    }
  }, [playlistsLoading, userPlaylists]);

  // Prioritize error display first
  if (error) {
    return <ErrorDisplay error={error} onRetry={getVideoDetails} />;
  }

  // Show loading spinner only if still loading and no error
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={40} thickness={7} sx={{ color: "#007BFF" }} />
        </Box>
      </Layout>
    );
  }
 

  // Render the main content only if no error and not loading
  return (
    <Layout>
      <Box sx={{ padding: { xs: 1, md: 2 }, overflowX: "hidden", backgroundColor: "#f8f9ff" }}>
        <ToastContainer />
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            fontFamily: "Velyra",
            fontSize: "16px",
            textTransform: "capitalize",
            color: "#007BFF",
            mb: 2,
            "&:hover": { backgroundColor: "#e7f3ff" },
          }}
        >
          Back
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            gap: 3,
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            {/* Video Section */}
            <Paper
              elevation={3}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 20px rgba(0,123,255,0.1)",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#000",
                  borderRadius: "16px 16px 0 0",
                  width: "100%",
                  maxWidth: "900px",
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
                      style={{ borderRadius: "16px", zIndex: 2 }}
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

              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}
                >
                  {video.title || ""}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#666" }}>
                  {video.viewedBy?.length || 0} Views • {moment(video.createdAt).fromNow()}
                </Typography>

                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    disabled={!isAuthenticated || isLiking}
                    onClick={likeVideo}
                    startIcon={<ThumbUp />}
                    variant="outlined"
                    sx={{
                      fontFamily: "Velyra",
                      color: isLiked ? "#007BFF" : "#333",
                      borderColor: isLiked ? "#007BFF" : "#ccc",
                      "&:hover": { backgroundColor: isAuthenticated ? "#e7f3ff" : "transparent", borderColor: "#007BFF" },
                    }}
                  >
                    {isLiking ? "Processing..." : isLiked ? "Liked" : "Like"} (
                    {video.likedBy?.length || 0})
                  </Button>
                  <Button
                    disabled={!isAuthenticated || isUnsaving}
                    startIcon={<SaveAlt />}
                    variant="outlined"
                    sx={{
                      fontFamily: "Velyra",
                      color: isSaved ? "#007BFF" : "#333",
                      borderColor: isSaved ? "#007BFF" : "#ccc",
                      "&:hover": { backgroundColor: isAuthenticated ? "#e7f3ff" : "transparent", borderColor: "#007BFF" },
                    }}
                    onClick={() =>
                      isSaved ? handleAddToPlaylist(selectedPlaylistId) : handleSaveClick()
                    }
                  >
                    {isSaved ? (isUnsaving ? "Unsaving" : "Saved") : "Save"}
                  </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ fontFamily: "Velyra", color: "#333" }}>
                    <strong>Description: </strong>
                    {showFullDescription
                      ? video.description && video.description.trim() !== ""
                        ? video.description
                        : "No description available"
                      : video.description && video.description.trim() !== ""
                      ? `${video.description.slice(0, 200)}...`
                      : "No description available"}
                  </Typography>
                  {video.description?.length > 200 && (
                    <Button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      sx={{ fontFamily: "Velyra", color: "#007BFF", mt: 1, textTransform: "none" }}
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#333" }}>
                    <strong>Tags: </strong>
                  </Typography>
                  {video.tags?.length > 0 ? (
                    video.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        sx={{
                          mr: 1,
                          mb: 1,
                          fontFamily: "Velyra",
                          bgcolor: "#007BFF",
                          color: "#fff",
                          "&:hover": { bgcolor: "#0056b3" },
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#666" }}>
                      No Tags Available
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Creator Info */}
            <Paper
              elevation={2}
              sx={{
                mt: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 20px rgba(0,123,255,0.1)",
              }}
            >
              <Avatar
                onClick={() => navigate(`/profile/${uploadedBy._id}`)}
                src={uploadedBy.profilePhotoUrl}
                alt={uploadedBy.name}
                sx={{ width: 56, height: 56, cursor: "pointer" }}
              />
              <Box
                onClick={() => navigate(`/profile/${uploadedBy._id}`)}
                sx={{ flexGrow: 1, cursor: "pointer" }}
              >
                <Typography variant="h6" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                  {uploadedBy.name || "Unknown"}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#666" }}>
                  {uploadedBy.followers?.length || 0} Followers
                </Typography>
              </Box>
              {!isMe && (
                <Button
                  onClick={subscribeToChannel}
                  variant="contained"
                  disabled={!isAuthenticated}
                  sx={{
                    fontFamily: "Velyra",
                    textTransform: "capitalize",
                    height: "43px",
                    width: "150px",
                    borderRadius: "8px",
                    backgroundColor: alreadySubscribed ? "#666" : "#007BFF",
                    "&:hover": { backgroundColor: isAuthenticated ? (alreadySubscribed ? "#555" : "#0056b3") : "#666" },
                  }}
                >
                  {isSubscribing ? (
                    <CircularProgress sx={{ color: "#fff", height: "18px", width: "18px" }} />
                  ) : alreadySubscribed ? (
                    "Subscribed"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              )}
            </Paper>

            {/* Comments Section */}
            <Paper
              elevation={2}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 20px rgba(0,123,255,0.1)",
                maxHeight: "550px",
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "#f0f0f0", borderRadius: "30px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#007BFF", borderRadius: "12px" },
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: "Velyra", mb: 2, color: "#007BFF" }}>
                Comments ({video.comments?.length || 0})
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
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
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f5f5f5",
                    "&:focus": { backgroundColor: "#fff", boxShadow: "0 0 5px #007BFF" },
                  }}
                  disabled={!isAuthenticated}
                />
                <Button
                  disabled={!isAuthenticated || isCommenting}
                  onClick={() => (replyingToName ? replyToComment() : addComment())}
                  variant="contained"
                  sx={{
                    fontFamily: "Velyra",
                    height: "40px",
                    width: "100px",
                    textTransform: "none",
                    backgroundColor: "#007BFF",
                    "&:hover": { backgroundColor: isAuthenticated ? "#0056b3" : "#007BFF" },
                  }}
                >
                  {isCommenting ? (
                    <CircularProgress sx={{ color: "#fff", height: "18px", width: "18px" }} />
                  ) : (
                    "Comment"
                  )}
                </Button>
              </Box>

              {video.comments?.length > 0 ? (
                video.comments.map((comment, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Paper sx={{ padding: 2, borderRadius: "12px", backgroundColor: "#fafafa" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={comment.profilePhotoUrl} alt={comment.name} sx={{ width: 40, height: 40 }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                            {comment.name || "Anonymous"}
                          </Typography>
                          <Typography variant="caption" sx={{ fontFamily: "Velyra", color: "#666" }}>
                            {moment(new Date(comment.date).toLocaleString()).fromNow()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: "Velyra", my: 1 }}>
                        {comment.text}
                      </Typography>
                      <Button
                        onClick={() => {
                          setReplyingToName(comment.name);
                          setCommentId(comment._id);
                        }}
                        sx={{ fontFamily: "Velyra", fontSize: "14px", color: "#007BFF" }}
                        disabled={!isAuthenticated}
                      >
                        Reply
                      </Button>
                      {comment.replies?.length > 0 && (
                        <Button
                          onClick={() => handleExpandReplies(index)}
                          sx={{ fontFamily: "Velyra", fontSize: "14px", color: "#007BFF" }}
                        >
                          {comment.replies.length} Replies
                        </Button>
                      )}
                    </Paper>

                    <Collapse in={expandedComments[index]}>
                      {comment.replies?.map((reply, idx) => (
                        <Box key={idx} sx={{ pl: 4, mt: 1 }}>
                          <Paper sx={{ padding: 2, borderRadius: "12px", backgroundColor: "#f0f0f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar src={reply.profilePhotoUrl} alt={reply.name} sx={{ width: 32, height: 32 }} />
                              <Box>
                                <Typography variant="body1" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                                  {reply.name || "Anonymous"}
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: "Velyra", color: "#666" }}>
                                  {moment(new Date(reply.date).toLocaleString()).fromNow()}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" sx={{ fontFamily: "Velyra", mt: 1 }}>
                              {reply.text}
                            </Typography>
                            <Button
                              onClick={() => {
                                setReplyingToName(reply.name);
                                setCommentId(comment._id);
                              }}
                              sx={{ fontFamily: "Velyra", fontSize: "14px", color: "#007BFF" }}
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
                  sx={{ textAlign: "center", color: "#666", fontFamily: "Velyra", py: 4 }}
                >
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Related Videos */}
          <Paper
            elevation={2}
            sx={{
              width: { md: "38%", xs: "100%" },
              mt: { xs: 3, md: 0 },
              p: 2,
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(0,123,255,0.1)",
              height: "fit-content",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF", mb: 2 }}
            >
              Related Videos
            </Typography>
            {relatedVideos.length > 0 ? (
              relatedVideos.map((video, index) => (
                <Box
                  key={index}
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    cursor: "pointer",
                    p: 1,
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#e7f3ff" },
                  }}
                  onClick={() => navigate(`/watch/${video._id}`)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={{ width: "170px", height: "90px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Velyra",
                        fontWeight: "bold",
                        color: "#007BFF",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {video.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#666", mt: 1 }}>
                      {video.viewedBy.length} Views • {moment(video.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "#666", fontFamily: "Velyra", py: 4 }}
              >
                No related videos available
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Save to Playlist Dialog */}
        <Dialog open={playlistDialogOpen} onClose={() => setPlaylistDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontFamily: "Velyra", color: "#007BFF" }}>Save to Playlist</DialogTitle>
          <DialogContent>
            <List
              sx={{
                width: "100%",
                maxHeight: "400px",
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#007BFF", borderRadius: "10px" },
              }}
            >
              {userPlaylists.map((playlist) => {
                const isSelected = playlist.title === selectedPlaylistName && playlist._id === selectedPlaylistId;
                const truncatedDescription =
                  playlist.description?.length > 100
                    ? `${playlist.description.substring(0, 100)}...`
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
                      borderRadius: "8px",
                      backgroundColor: isSelected ? "#e7f3ff" : "transparent",
                      "&:hover": { backgroundColor: isSelected ? "#e7f3ff" : "#f5f5f5" },
                      transition: "background-color 0.3s",
                      padding: "12px",
                    }}
                  >
                    <ListItemIcon>
                      <Folder sx={{ color: isSelected ? "#007BFF" : "#666" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={playlist.title}
                      secondary={
                        <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#666" }}>
                          {truncatedDescription || "No description available"}
                        </Typography>
                      }
                      primaryTypographyProps={{ fontFamily: "Velyra", fontWeight: isSelected ? "bold" : "normal" }}
                    />
                    <Typography variant="caption" sx={{ fontFamily: "Velyra", color: "#666" }}>
                      {playlist.videos.length} videos
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
            <Divider sx={{ my: 2 }} />
            <Button
              startIcon={<Add />}
              onClick={() => {
                setPlaylistDialogOpen(false);
                setNewPlaylistDialogOpen(true);
              }}
              sx={{ fontFamily: "Velyra", color: "#007BFF", "&:hover": { backgroundColor: "#e7f3ff" } }}
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
              sx={{ fontFamily: "Velyra", color: "#007BFF" }}
            >
              {selectedPlaylistId && selectedPlaylistName ? (isSaving ? "Saving" : "Save") : "Cancel"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create New Playlist Dialog */}
        <Dialog
          open={newPlaylistDialogOpen}
          onClose={() => setNewPlaylistDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: "Velyra", textAlign: "center", color: "#007BFF" }}>
            Create New Playlist
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel shrink sx={{ fontFamily: "Velyra", color: "#007BFF" }}>
                  Title
                </InputLabel>
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  fullWidth
                  sx={{
                    fontFamily: "Velyra",
                    "&:before": { borderBottom: "2px solid #007BFF" },
                    "&:hover:before": { borderBottom: "2px solid #0056b3" },
                    "&:after": { borderBottom: "2px solid #007BFF" },
                  }}
                  disabled={!isAuthenticated}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel shrink sx={{ fontFamily: "Velyra", color: "#007BFF" }}>
                  Description
                </InputLabel>
                <Input
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  sx={{
                    fontFamily: "Velyra",
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
            <Button onClick={() => setNewPlaylistDialogOpen(false)} sx={{ fontFamily: "Velyra", color: "#007BFF" }}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewPlaylist}
              variant="contained"
              disabled={!isAuthenticated || isCreatingPlaylist}
              sx={{
                fontFamily: "Velyra",
                backgroundColor: "#007BFF",
                "&:hover": { backgroundColor: isAuthenticated ? "#0056b3" : "#007BFF" },
              }}
            >
              {isCreatingPlaylist ? "Creating" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Watch;