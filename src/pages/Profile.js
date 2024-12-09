import React, { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const userProfile = {
    avatar: "https://via.placeholder.com/150",
    name: "CodeWithMe",
    subscribers: "250K subscribers",
    bio: "Welcome to my coding channel! I share tutorials, tips, and tricks to help you become a better developer.",
    joinedDate: "January 10, 2020",
    videos: [
      {
        title: "Build a YouTube Clone with React",
        views: "1.5M views",
        thumbnail: "https://via.placeholder.com/150",
      },
      {
        title: "Master Material UI",
        views: "500K views",
        thumbnail: "https://via.placeholder.com/150",
      },
    ],
    playlists: [
      {
        title: "React Tutorials",
        videoCount: 15,
        thumbnail: "https://via.placeholder.com/150",
      },
      {
        title: "Material UI Basics",
        videoCount: 8,
        thumbnail: "https://via.placeholder.com/150",
      },
    ],
  };

  return (
   <Layout> <Box
      sx={{
        maxWidth: { xs: "100%", lg: "1200px" },
        margin: "0 auto",
        padding: 2,
        fontFamily: "Velyra",
        width: "100%", // Ensures full width on all screens
      }}
    >
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
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
          width: "100%", // Full width for smaller devices
        }}
      >
        <Avatar
          src={userProfile.avatar}
          alt={userProfile.name}
          sx={{ width: 100, height: 100 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontFamily: "Velyra", fontWeight: "bold" }}
          >
            {userProfile.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {userProfile.subscribers}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "capitalize",
            fontFamily: "Velyra",
            fontWeight: "bold",
          }}
        >
          Subscribe
        </Button>
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
          mt: 4,
          width: "100%", // Full width for smaller devices
        }}
      >
        {/* Videos Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {userProfile.videos.map((video, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  />
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
                  <Typography variant="body2" color="textSecondary">
                    {video.views}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Playlists Tab */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            {userProfile.playlists.map((playlist, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Velyra",
                      fontWeight: "bold",
                      color: "#007BFF",
                    }}
                  >
                    {playlist.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {playlist.videoCount} videos
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
              width: "100%",
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
              {userProfile.bio}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 2, fontFamily: "Velyra" }}
            >
              Joined: {userProfile.joinedDate}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
    </Layout>
  );
};

export default Profile;
