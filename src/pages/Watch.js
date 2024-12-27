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
  TextField,
  Divider,
  FormControl,
  InputLabel
} from "@mui/material";
import ReactPlayer from'react-player';
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { 
  ThumbUp, 
  SaveAlt, 
  ArrowBack, 
  PlaylistAdd,
  Add,
  Folder
} from "@mui/icons-material";
import VideoJS from "react-video-js-player";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
const Watch = () => {
  const { id } = useParams();
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [video, setVideo] = useState({});
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [uploadedBy, setUploadedBy] = useState({});
  const [loading, setLoading] = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(true); // New state for playlist loading
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [newPlaylistDialogOpen, setNewPlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false); // Track play state
  const navigate = useNavigate();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [selectedPlaylistName, setSelectedPlaylistName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);
  
  const handleExpandReplies = (index) => {
    setExpandedComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  
  const isAlreadySaved = () => {
    if (userPlaylists.length === 0) return false; // If playlists are empty, return immediately.
  
    const _isSaved = userPlaylists.some((playlist) => {
      if (playlist.videos.includes(id)) {
        setSelectedPlaylistId(playlist._id);
        setSelectedPlaylistName(playlist.title);
        return true;
      }
      return false;
    });
  
    setIsSaved(_isSaved);
    return _isSaved;
  };
  
  const handleNewCommentChange = (e) => setNewComment(e.target.value);
  
  const handleSaveClick = () => {
    setPlaylistDialogOpen(true);
    fetchUserPlaylists();
  };
  
  const fetchUserPlaylists = async () => {
    setPlaylistsLoading(true); // Set playlistsLoading to true while fetching
    try {
      const response = await axios.get("http://localhost:5000/playlists/getmyplaylists", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setUserPlaylists(response.data.playlists);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setPlaylistsLoading(false); // Set playlistsLoading to false after fetching
    }
  };
  
  const handleCreateNewPlaylist = async () => {
    setIsCreatingPlaylist(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/playlists/create",
        {
          title: newPlaylistName,
          description: newPlaylistDescription,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
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
      console.error("Error creating playlist:", error);
      toast.error(error.response ? error.response.data.message : error.message,{style:{fontFamily:"Velyra"}});
    } finally {
      setIsCreatingPlaylist(false);
    }
  };
  
  const handleAddToPlaylist = async (playlistId) => {
    setIsSaving(true);
    setIsUnsaving(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/playlists/addtoplaylist`,
        {
          videoId: id,
          playlistId,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
        setPlaylistDialogOpen(false);
        setIsSaved(!isSaved);
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
        setPlaylistDialogOpen(false);
      }
    } catch (e) {
      console.error("Error adding to playlist:", e);
      toast.error(e.response ? e.response.data.message : e.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setIsSaving(false);
      setIsUnsaving(false);
    }
  };
  
  const getVideoDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/videos/getvideo/${id}?token=${localStorage.getItem("token")}`
      );
      if (response.data.success) {
        setVideo(response.data.video);
        setUploadedBy(response.data.uploadedBy);
        setRelatedVideos(response.data.relevantVideos);
      } else {
        setError(response.data.message);
      }
      setLoading(false);
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
      setLoading(false);
    }
  };
  
  // Run isAlreadySaved only when playlists are loaded
  useEffect(() => {
    if (!playlistsLoading) {
      isAlreadySaved();
    }
  }, [playlistsLoading, userPlaylists]);
  
  useEffect(() => {
    getVideoDetails();
    fetchUserPlaylists();
  }, [id]);
  

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={40} thickness={7} />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "red" }}>
            Error: {error}
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
<Box sx={{ padding: 2, overflowX: "hidden" }}>
  <ToastContainer/>
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

  <Box
    sx={{
      display: "flex",
      flexDirection: { md: "row", xs: "column" },
      gap: 2,
      maxWidth: "1600px",
      margin: "0 auto",
      padding: 0,
    }}
  >
    {/* Main Content */}
    <Box sx={{
      flex: 1,
      width: "100%", // Make sure it takes the full width on all devices
      margin: { xs: 0, md: "auto" }, // Ensure margin is removed on smaller devices
    }}>
      
            {/* Video Section */}
            <Box sx={{ 
              backgroundColor: "#ffffff", 
              borderRadius: "16px", 
              boxShadow: 3, 
              overflow: "hidden",
              width: "100%"
            }}>
{/* Video Section */}

<Box
      sx={{
        backgroundColor: "#000",
        borderRadius: "16px",
        boxShadow: 3,
        overflow: "hidden",
        width: "100%",
        maxWidth: "900px",
        aspectRatio: "16/9",
        mx: "auto",
        position: "relative",
        border: "2px solid white",
      }}
    >
      {video?.url ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Show thumbnail when not playing */}
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

          {/* React Player */}
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
          <CircularProgress />
        </Box>
      )}
    </Box>


              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" fontFamily="Velyra">
                  {video.viewedBy?.length || 0} Views
                </Typography>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Button
                    startIcon={<ThumbUp />}
                    sx={{ mr: 2, fontFamily: "Velyra", '&:hover': { backgroundColor: "#e7f3ff" } }}
                    color="primary"
                  >
                    Like {video.likedBy?.length || 0}
                  </Button>
                  <Button
                  disabled={isUnsaving}
                    startIcon={<SaveAlt />}
                    sx={{ fontFamily: "Velyra", '&:hover': { backgroundColor: "#e7f3ff" } }}
                    color="primary"
                    onClick={()=>{
                      if(isSaved){
                        handleAddToPlaylist(selectedPlaylistId)
                      }
                      else{
                        handleSaveClick()
                      }
                    }}
                  >
                    {isSaved?isUnsaving?"Unsaving":"Unsave":"Save"}
                  </Button>
                </Box>

                {/* Video Description Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ fontFamily: "Velyra" }}>
                    <strong>Description: </strong>
                    {showFullDescription ? video.description : `${video.description?.slice(0, 200)}...`}
                  </Typography>
                  <Button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    sx={{ fontFamily: "Velyra", color: "#007BFF", mt: 1, textTransform: "none" }}
                  >
                    {showFullDescription ? "Show Less" : "Show More"}
                  </Button>
                </Box>

                {/* Tags Section */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: "Velyra" }}>
                    <strong>Tags: </strong>
                  </Typography>
                  {video.tags?.length > 0 ? (
                    video.tags.map((tag, index) => (
                      <Chip
                      key={index}
                      label={tag}
                      sx={{ 
                        marginRight: 1, 
                        marginBottom: 1, 
                        fontFamily: "Velyra", 
                        bgcolor: "#26c6da",  // Darker shade of cyan
                        color: "#fff"  // Explicitly set text color to white
                      }}
                      color="primary"
                    />
                    
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "Velyra" }}>
                      No Tags Available
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Creator Info Section */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#ffffff",
                p: 3,
                borderRadius: "16px",
                boxShadow: 2,
              }}
            >
              <Avatar
                src={uploadedBy.profilePhotoUrl}
                alt={uploadedBy.name}
                sx={{ width: 56, height: 56 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                  {uploadedBy.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "Velyra" }}>
                  {uploadedBy.followers?.length || 0} Followers
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontFamily: "Velyra", textTransform: "capitalize" }}
              >
                Subscribe
              </Button>
            </Box>

            {/* Comments Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "Velyra", mb: 2 }}>
                Comments
              </Typography>
              
              {/* Comment Input */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Input
                  placeholder="Add a comment..."
                  fullWidth
                  multiline
                  rows={2}
                  sx={{
                    fontFamily: "Velyra",
                    padding: "8px",
                    borderRadius: "8px",
                    backgroundColor: "#f5f5f5",
                  }}
                  value={newComment}
                  onChange={handleNewCommentChange}
                />
                <Button 
                  variant="contained"
                  sx={{ 
                    fontFamily: "Velyra", 
                    height: "40px",
                    textTransform: "none"
                  }}
                >
                  Comment
                </Button>
              </Box>

              {video.comments?.length > 0 ? (
                video.comments.map((comment, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Paper sx={{ padding: 2, mb: 1, borderRadius: "12px" }}>
                      <Typography variant="body1" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                        {comment.user}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "Velyra", my: 1 }}>
                        {comment.text}
                      </Typography>
                      {comment.replies?.length > 0 && (
                        <Button
                          onClick={() => handleExpandReplies(index)}
                          sx={{
                            fontFamily: "Velyra",
                            fontSize: "14px",
                            color: "#007BFF",
                            mt: 1,
                          }}
                        >
                          {comment.replies.length} Replies
                        </Button>
                      )}
                    </Paper>

                    {/* Replies */}
                    <Collapse in={expandedComments[index]}>
                      {comment.replies?.map((reply, idx) => (
                        <Box key={idx} sx={{ pl: 4, mt: 1 }}>
                          <Paper sx={{ padding: 2, borderRadius: "12px" }}>
                            <Typography variant="body1" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                              {reply.user}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: "Velyra", mt: 1 }}>
                              {reply.text}
                            </Typography>
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
                    color: "text.secondary",
                    fontFamily: "Velyra",
                    py: 4
                  }}
                >
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </Box>
          </Box>

          {/* Related Videos Section */}
          <Box
            sx={{
              width: { md: "38%", xs: "95%" },
              mt: { xs: 4, md: 0 },
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: 3,
              padding: 2,
              height: "fit-content",
            }}
          >
            <Typography variant="h6" sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF", mb: 2 }}>
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
                    '&:hover': {
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px"
                    }
                  }}
                  onClick={() => navigate(`/watch/${video._id}`)}
                >
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    style={{ 
                      width: "170px", 
                      height: "90px", 
                      borderRadius: "8px",
                      objectFit: "cover"
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: "Velyra", 
                        fontWeight: "bold",
                        color: "#007BFF",
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {video.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "gray", mt: 1 }}>
                      {video.viewedBy.length} Views
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography 
                variant="body1" 
                sx={{ 
                  textAlign: "center", 
                  color: "text.secondary",
                  fontFamily: "Velyra",
                  py: 4
                }}
              >
                No related videos available
              </Typography>
            )}
          </Box>
        </Box>

        {/* Save to Playlist Dialog */}
        <Dialog 
          open={playlistDialogOpen} 
          onClose={() => setPlaylistDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: "Velyra" }}>
            Save to Playlist
          </DialogTitle>
          <DialogContent>
          <List
  sx={{
    width: '100%',
    maxHeight: '400px', // Set a maximum height for scrolling
    overflowY: 'auto', // Enable vertical scrolling
    '&::-webkit-scrollbar': {
      width: '6px', // Thin scrollbar
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d3d3d3', // Light gray scrollbar thumb
      borderRadius: '10px', // Rounded scrollbar
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#b0b0b0', // Slightly darker on hover
    },
  }}
>
  {userPlaylists.map((playlist) => {
    const isSelected =
      playlist.title === selectedPlaylistName &&
      playlist._id === selectedPlaylistId;

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
          borderRadius: '8px',
          backgroundColor: isSelected ? '#add8e6' : 'transparent', // Slightly darker light blue for selected
          color: isSelected ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: isSelected ? '#add8e6' : '#f5f5f5',
          },
          transition: 'background-color 0.3s, color 0.3s',
          padding: '12px',
          fontWeight: isSelected ? 'bold' : 'normal',
          display: 'flex',
          justifyContent: 'space-between', // Align items to left and right
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <Folder sx={{ color: isSelected ? 'white' : 'inherit' }} />
          </ListItemIcon>
          <ListItemText
            primary={playlist.title}
            secondary={
              <Typography
                variant="body2"
                sx={{
                  color: isSelected ? 'white' : 'inherit',
                  fontFamily: 'Velyra',
                }}
              >
                {truncatedDescription || 'No description available'}
              </Typography>
            }
            primaryTypographyProps={{
              fontFamily: 'Velyra',
              fontWeight: isSelected ? 'bold' : 'normal',
            }}
            secondaryTypographyProps={{
              fontFamily: 'Velyra',
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            alignSelf: 'center',
            color: isSelected ? 'white' : '#666',
            fontFamily: 'Velyra',
          }}
        >
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
              sx={{
                fontFamily: "Velyra",
                color: "#007BFF",
                '&:hover': {
                  backgroundColor: "#e7f3ff"
                }
              }}
            >
              Create new playlist
            </Button>
          </DialogContent>
          <DialogActions>
            <Button
            disabled={isSaving} 
              onClick={() =>{
              if(selectedPlaylistId && selectedPlaylistName){
              handleAddToPlaylist(selectedPlaylistId)

              }
              else{
              setPlaylistDialogOpen(false)
              }
              }}
              sx={{ fontFamily: "Velyra" }}
            >
            {selectedPlaylistId && selectedPlaylistName?isSaving?"Saving":"Save":"Cancel"}
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
  <DialogTitle
    sx={{
      fontFamily: "Velyra",
      textAlign: "center", // Center align the title
      fontWeight: "bold",
    }}
  >
    Create New Playlist
  </DialogTitle>

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
      fontWeight: "bold",
    }}
  >
    Create New Playlist
  </DialogTitle>

  <DialogContent>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3, // Spacing between fields
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
            color: "#007BFF", // Darker blue color
          }}
        >
          Title
        </InputLabel>
        <Input
          value={newPlaylistName}
          inputProps={{ style: { fontFamily: "Velyra" } }}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          fullWidth
          sx={{
            "&:before": {
              borderBottom: "3px solid black", // Always bold black
            },
            "&:hover:before": {
              borderBottom: "3px solid black",
            },
            "&:after": {
              borderBottom: "3px solid #007BFF", // Focus state
            },
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
            color: "#007BFF", // Darker blue color
          }}
        >
          Description
        </InputLabel>
        <Input
          value={newPlaylistDescription}
          onChange={(e) => setNewPlaylistDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          sx={{
            "&:before": {
              borderBottom: "3px solid black", // Always bold black
            },
            "&:hover:before": {
              borderBottom: "3px solid black",
            },
            "&:after": {
              borderBottom: "3px solid #007BFF", // Focus state
            },
            fontFamily: "Velyra",
          }}
        />
      </FormControl>
    </Box>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => setNewPlaylistDialogOpen(false)}
      sx={{ fontFamily: "Velyra" }}
    >
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleCreateNewPlaylist();
      }}
      variant="contained"
      disabled={isCreatingPlaylist}
      sx={{
        fontFamily: "Velyra",
        backgroundColor: "#007BFF", // Darker blue
        "&:hover": {
          backgroundColor: "#0056b3", // Even darker on hover
        },
      }}
    >
      {isCreatingPlaylist ? "Creating" : "Create"}
    </Button>
  </DialogActions>
</Dialog>


  <DialogActions>
    <Button
      onClick={() => setNewPlaylistDialogOpen(false)}
      sx={{ fontFamily: "Velyra" }}
    >
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleCreateNewPlaylist();
      }}
      variant="contained"
      disabled={isCreatingPlaylist}
      sx={{
        fontFamily: "Velyra",
        backgroundColor: "lightblue",
        "&:hover": {
          backgroundColor: "dodgerblue",
        },
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