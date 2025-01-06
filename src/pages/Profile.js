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
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const Profile = () => {
  
  const {id}=useParams()
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const[user,setUser]=useState({})
  const[videos,setVideos]=useState([])
  const[playlists,setPlaylists]=useState([])
  const[loading,setLoading]=useState(true)
  const[isMe,setIsMe]=useState(false)
  const[decodedUser,setDecodedUser]=useState({})
  const token=localStorage.getItem("token")
  const[hasSubscribed,setHasSubscribed]=useState(false)
  const[isSubscribing,setIsSubscribing]=useState(false)
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const alreadySubscribed = () => {
      if (!user) {
          console.log("UploadedBy is not defined");
          return false;
      }
  
      
  
      // Ensure followers exists and is an array
      if (!Array.isArray(user.followers)) {
          console.log("Followers is not an array or undefined");
          return false;
      }
  

  
      const isSubscribed = user.followers.includes(decodedUser.id);
      console.log("Is Subscribed:", isSubscribed);
  
      return isSubscribed;
  };
  const subscribeToChannel = async () => {
    setIsSubscribing(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/users/follow",
        { followingId: user._id },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
  
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontFamily: "Velyra" } });
  
        // Normalize the message for consistent checks
        const message = response.data.message.trim().toLowerCase();
  
        if (message === "followed the user successfully") {
          console.log("Subscribing");
          setUser((prevUser) => {
            const updatedUser = { ...prevUser };
            const currentFollowers = updatedUser.followers || [];
            updatedUser.followers = [...currentFollowers, decodedUser.id]; // Add UID to followers
            return updatedUser;
          });
        } else if (message === "unfollowed the user successfully") {
          console.log("Unsubscribing");
          setUser((prevUser) => {
            const updatedUser = { ...prevUser };
            const currentFollowers = updatedUser.followers || [];
            updatedUser.followers = currentFollowers.filter((id) => id !== decodedUser.id); // Remove UID from followers
            return updatedUser;
          });
        }
      }
    } catch (e) {
      toast.error(
        e.response ? e.response.data.message : e.message,
        { style: { fontFamily: "Velyra" } }
      );
    } finally {
      setIsSubscribing(false);
    }
  };
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/users/getprofile/${id}`);
      console.log("Profile Data",response.data)
      if (response.data.success) {
        setUser(response.data.user)
        setVideos(response.data.videos)
        setPlaylists(response.data.playlists)
        setLoading(false)
      } else {
        toast.error(response.data.message || "Failed to load profile.", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.", {
        position: "top-right",
      });
    } 
  };

  useEffect(()=>{
    try{
     const decodedToken= jwtDecode(token)
     setDecodedUser(decodedToken)
     setIsMe(decodedToken.id==id)
    }
    catch(e){
      console.error("Erorr while decoding")
    }
    
  },[token])
  useEffect(()=>{
    if(user){
     const isSubscribed= alreadySubscribed()
     setHasSubscribed(isSubscribed)
    }
  },[user])
  

  useEffect(() => {
    fetchProfile();
  }, [id]);
  if(loading){
    return(
      <Layout>
    <Box style={{height:"100%",minHeight:"100%",width:"100%",maxWidth:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>

                <CircularProgress size={40} thickness={7} />
          

    </Box>
    </Layout>
    )
  }
  else{

  return (
   <Layout> <Box
   sx={{
    width: {xs:"100%",md:"95%"}, // Ensures it takes full width of its container
    maxWidth: "100%", // Prevents overflow beyond visible screen
    boxSizing: "border-box", // Includes padding and border in width calculations
    padding: 2,
    mr:{md:10},

    fontFamily: "Velyra",
    overflow: "hidden", // Prevents overflow of child elements
  }}
    >
      <ToastContainer/>
      {/* Back Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 2,
          padding: "8px 16px",
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
        }}
        onClick={() => navigate(-1)}
      >
        <IconButton>
          <ArrowBackIcon sx={{ color: "#007BFF", fontSize: 24 }} />
        </IconButton>
        <Typography
          sx={{
            ml: 1,
            fontSize: 16,
            fontWeight: "bold",
            fontFamily: "Velyra",
            color: "#007BFF",
          }}
        >
          Back
        </Typography>
      </Box>

      {/* User Info Section */}
      <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" }, // Stacks on small screens, rows on larger ones
    alignItems: "center",
    gap: 2, // Space between child elements
    backgroundColor: "#ffffff", // White background
    borderRadius: 2, // Rounded corners
    boxShadow: 3, // Subtle shadow effect
    p: 3, // Padding inside the box
    width: "100%", // Ensure it does not exceed the parent’s width
    maxWidth: "100%", // Prevent potential overflow issues
    boxSizing: "border-box", // Includes padding and border in width calculations
    overflow: "hidden", // Avoid overflow content
  }}
>
  <Avatar
    src={user.profilePhotoUrl}
    alt={user.name}
    sx={{
      width: 80, // Adjusted to fit better
      height: 80,
      flexShrink: 0, // Prevent avatar from shrinking
    }}
  />
  <Box
    sx={{
      flexGrow: 1, // Ensures the text area takes remaining space
      minWidth: 0, // Prevents text content from expanding parent
      overflow: "hidden", // Hides overflowing text
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontFamily: "Velyra",
        fontWeight: "bold",
        whiteSpace: "nowrap", // Prevents wrapping for long names
        overflow: "hidden", // Hides long text
        textOverflow: "ellipsis", // Adds "..." for overflow
      }}
    >
      {user.name}
    </Typography>
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{ mt: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
    >
      {user.followers.length}
    </Typography>
  </Box>
 {isMe?<>
 </>:  <Button
 disabled={isSubscribing}
 onClick={subscribeToChannel}
    variant="contained"
    color="primary"
    sx={{
      textTransform: "capitalize",
      fontFamily: "Velyra",
      fontWeight: "bold",
      width:"150px",
      height:"50px",
      flexShrink: 0, // Prevent button from shrinking
    }}
  >
    {
      isSubscribing?<CircularProgress style={{width:"20px",height:"20px"}} thickness={10}/>:hasSubscribed?"Subscribed":"Subscribe"
    }
  
  </Button>
 }

</Box>


      {/* Tabs Section */}
      <Box
        sx={{
          mt: 4,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%", // Ensure tabs container takes full width
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            fontFamily: "Velyra",
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "capitalize",
              fontFamily: "Velyra",
            },
          }}
        >
          <Tab label="Videos" />
          <Tab label="Playlists" />
          <Tab label="About" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          overflow:"hidden",
          mt: 4,
          maxWidth:"100%",
          width: "100%", // Full width for smaller devices
        }}
      >
        {/* Videos Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {videos.map((video, index) => (
              <Grid onClick={()=>{
                navigate(`/watch/${video._id}`)
              }} item xs={12} md={6} lg={4} key={index}>
  <Paper
    sx={{
      p: 2,
      backgroundColor: "#ffffff",
      borderRadius: 2,
      boxShadow: 3,
      overflow: "hidden", // Ensures content stays inside
      height: "300px", // Fixed height for uniformity
      display: "flex",
      flexDirection: "column", // Arranges content vertically
      justifyContent: "space-between", // Space between sections
      "&:hover": { boxShadow: 6 },
    }}
  >
    <img
      src={video.thumbnailUrl}
      alt={video.title}
      style={{
        width: "100%",
        height: "150px", // Ensures consistent height for the thumbnail
        objectFit: "cover", // Ensures the image fills the space without distortion
        borderRadius: "8px 8px 0 0", // Rounded top corners only
      }}
    />
    <Box sx={{ mt: 2, flexGrow: 1 }}>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "Velyra",
          fontWeight: "bold",
          color: "#007BFF",
        }}
      >
        {video.title}
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 1,
        fontFamily: "Velyra", // Applied to both views and likes
      }}
    >
      <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "textSecondary" }}>
        {video.viewedBy.length} views
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "textSecondary" }}>
        {video.likedBy.length} likes
      </Typography>
    </Box>
  </Paper>
</Grid>

            ))}
          </Grid>
        )}

        {/* Playlists Tab */}
        {activeTab === 1 && (
          <Grid container spacing={3} sx={{overflow:"hidden"}}>
            {playlists.map((playlist, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
  <Paper
    sx={{
      p: 3, // Increased padding for more spacing
      backgroundColor: "#ffffff",
      borderRadius: 1, // Softer rounded corners
      boxShadow: 4,
      mb:1,
      transition: "transform 0.3s, box-shadow 0.3s", // Smooth transition for hover effect
      "&:hover": {
        boxShadow: 8, // Larger shadow on hover
        transform: "translateY(-5px)", // Subtle lift effect
      },
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontFamily: "Velyra, sans-serif", // Applying Velyra font
        fontWeight: "bold",
        color: "#007BFF",
        marginBottom: "12px", // Space below title
        textAlign: "center", // Center-align the title
        lineHeight: 1.5,
      }}
    >
      {playlist.title}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: "Velyra, sans-serif", // Ensuring Velyra is used here as well
        color: "#757575", // Slightly lighter color for contrast
        fontSize: "1rem", // Slightly larger font size for better readability
        fontWeight: "500", // Medium weight for clarity
        textAlign: "center", // Center-align the video count
        lineHeight: 1.4,
      }}
    >
      {playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}
    </Typography>
  </Paper>
</Grid>

            ))}
          </Grid>
        )}

        {/* About Tab */}
        {activeTab === 2 && (
          <Box
            sx={{
              p: 2,
              backgroundColor: "#ffffff",
              borderRadius: 2,
              boxShadow: 3,
              width: "100%", // Ensure it does not exceed the parent’s width
    maxWidth: "100%", // Prevent potential overflow issues
    boxSizing: "border-box", // Includes padding and border in width calculations
    overflow: "hidden", // Avoid overflow content
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Velyra",
                fontWeight: "bold",
                color: "#007BFF",
                mb: 2,
              }}
            >
              About
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Velyra" }}>
              {user.bio}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 2, fontFamily: "Velyra" }}
            >
              Joined: {user.joinedOn}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
    </Layout>
  );
}
};

export default Profile;
