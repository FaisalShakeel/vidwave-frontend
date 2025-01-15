import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Card, CardContent,Input,InputLabel,DialogTitle,FormControl,Dialog,DialogContent,DialogActions, Grid, Button, Stack } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../components/Layout";
import { useNavigate } from "react-router";
const Playlists = () => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const navigate=useNavigate()
  const[playlistId,setPlaylistId]=useState("")
  const[playlistTitle,setPlaylistTitle]=useState("")
  const[playlistDescription,setPlaylistDescription]=useState("")
  const[isUpdatingPlaylist,setIsUpdatingPlaylist]=useState("")
  const[playlistDialogOpen,setPlaylistDialogOpen]=useState(false)
  const[isDeleting,setIsDeleting]=useState(false)
  // Fetch playlists
  const handleUpdatePlaylist = async () => {
    console.log("Updating Playlist");
    setIsUpdatingPlaylist(true);
    console.log(playlistId);
  
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
  
        // Update the userPlaylists state
        setUserPlaylists((prevPlaylists) =>
          prevPlaylists.map((playlist) =>
            playlist._id === playlistId
              ? { ...playlist, title: playlistTitle, description: playlistDescription }
              : playlist
          )
        );
  setPlaylistId("")
        setPlaylistDialogOpen(false);
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast.error(
        error.response ? error.response.data.message : error.message,
        { style: { fontFamily: "Velyra" } }
      );
    } finally {
      setIsUpdatingPlaylist(false);
    }
  };
  
  const fetchUserPlaylists = async () => {
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
      console.error("Error fetching playlists:", error);
      toast.error(error.response?.data?.message || error.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setPlaylistsLoading(false);
    }
  };

  // Delete a playlist
  const handleDelete = async (playlistId) => {
    setIsDeleting(true)
    try {
      const response = await axios.delete(`http://localhost:5000/playlists/delete-playlist/${playlistId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        toast.success("Playlist deleted successfully.", { style: { fontFamily: "Velyra" } });
        setUserPlaylists(userPlaylists.filter((playlist)=>{return(playlist._id!=playlistId)})) // Refresh playlists after deletion
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(error.response?.data?.message || error.message, { style: { fontFamily: "Velyra" } });
    }
    finally{
        setIsDeleting(false)
    }
  };

  

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  return (
    <Layout>
        <ToastContainer/>
    <Box
      sx={{
        padding: { xs: "16px", sm: "24px" },
        
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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

      {playlistsLoading ? (
               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                 <CircularProgress size={40} thickness={7} />
               </Box>
      ) : userPlaylists.length === 0 ? (
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
          No Playlists Found
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ width: "100%", maxWidth: "800px" }}>
          {userPlaylists.map((playlist, index) => (
            <Grid item xs={12} key={index}>
<Card
  onClick={() => {
    navigate(`/playlist/${playlist._id}/videos`);
    setPlaylistId(playlist._id)
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
        color: "#6C757D",
      }}
    >
      {playlist.description}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: "Velyra",
        color: "#6C757D",
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
          e.stopPropagation(); // Prevent card's onClick from being triggered
         setPlaylistTitle(playlist.title)
         setPlaylistDescription(playlist.description)
         setPlaylistId(playlist._id)
          setPlaylistDialogOpen(true)
        }}
        sx={{
          textTransform: "none",
          fontFamily: "Velyra",
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
          e.stopPropagation(); // Prevent card's onClick from being triggered
         setPlaylistId(playlist._id)
          handleDelete(playlist._id);
        }}
        sx={{
          textTransform: "none",
          fontFamily: "Velyra",
        }}
      >
       {isDeleting && playlistId==playlist._id?"Deleting":"Delete"}
      </Button>
    </Stack>
  </CardContent>
</Card>

            </Grid>
          ))}
        </Grid>
      )}
              <Dialog
  open={playlistDialogOpen}
  onClose={() => setPlaylistDialogOpen(false)}
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
    {playlistTitle}
  </DialogTitle>

  <Dialog
  open={playlistDialogOpen}
  onClose={() => setPlaylistDialogOpen(false)}
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
 Edit Playlist Here
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
          value={playlistTitle}
          inputProps={{ style: { fontFamily: "Velyra" } }}
          onChange={(e) => setPlaylistTitle(e.target.value)}
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
          value={playlistDescription}
          onChange={(e) => setPlaylistDescription(e.target.value)}
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
      onClick={() => setPlaylistDialogOpen(false)}
      sx={{ fontFamily: "Velyra" }}
    >
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleUpdatePlaylist();
      }}
      variant="contained"
      disabled={isUpdatingPlaylist}
      sx={{
        fontFamily: "Velyra",
        backgroundColor: "#007BFF", // Darker blue
        "&:hover": {
          backgroundColor: "#0056b3", // Even darker on hover
        },
      }}
    >
      {isUpdatingPlaylist ? "Updating" : "Update"}
    </Button>
  </DialogActions>
</Dialog>


  
</Dialog>
    </Box>
    </Layout>
  );
};

export default Playlists;
