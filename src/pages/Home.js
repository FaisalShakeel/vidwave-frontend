import React from "react";
import Layout from "../components/Layout";
import { Grid, Card, CardContent, Typography, Box, Avatar, Divider, Chip } from "@mui/material";

const HomePage = () => {
  // Simulating some video data with more descriptive titles
  const categories = ["Trending", "Music", "Gaming", "Sports", "News", "Comedy", "Tech"];
  const videos = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: [
      "Intro to React",
      "What Is Coding",
      "How to Learn JavaScript",
      "CSS Flexbox Explained",
      "Understanding Node.js",
      "Mastering Python",
      "Web Development Tips",
      "The Future of AI",
      "Exploring Machine Learning",
      "JavaScript for Beginners",
      "Top 10 Programming Languages",
      "How to Build a Portfolio"
    ][i],
    thumbnail: "https://via.placeholder.com/250x140",
    views: `${(Math.random() * 10000).toFixed(0)} views`,
    likes: `${(Math.random() * 500).toFixed(0)} likes`,
    uploader: "Faisal Shakeel",
    uploaderAvatar: "https://via.placeholder.com/50",
    timeAgo: `${(Math.random() * 60).toFixed(0)} minutes ago`,
  }));

  const [selectedCategory, setSelectedCategory] = React.useState("Trending");

  return (
    <Layout>
      {/* Category Selection Section */}
      <Box sx={{ padding: 2, backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  cursor: "pointer",
                  fontFamily: "Velyra",
                  backgroundColor: selectedCategory === category ? "#0077ff" : "#f1f5fc",
                  color: selectedCategory === category ? "#fff" : "#333",
                  ":hover": { backgroundColor: "#0077ff", color: "#fff" },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Video Grid Section */}
      <Grid container spacing={3} sx={{ padding: 3, backgroundColor: "#fff" }}>
        {videos.map((video) => (
          <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={video.id}>
            <Card
              sx={{
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
                ":hover": {
                  transform: "scale(1.05)",
                  transition: "0.3s ease",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "12px 12px 0 0",
                }}
              />
              <CardContent sx={{ padding: 2, flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Velyra",
                    color: "#333",
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {video.title}
                </Typography>

                {/* Video Information */}
                <Box sx={{ marginTop: 2 }}>
                  {/* Avatar and Username */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={video.uploaderAvatar}
                        sx={{ width: 50, height: 50, marginRight: 2 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "Velyra", color: "#555", fontSize: "0.800rem" }}
                      >
                        {video.uploader}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Views and Likes */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "Velyra", color: "#555", fontSize: "0.875rem" }}
                    >
                      {video.views}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "Velyra", color: "#555", fontSize: "0.875rem" }}
                    >
                      {video.likes}
                    </Typography>
                  </Box>

                  {/* Time Posted */}
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Velyra",textAlign:"center", color: "#555", fontSize: "0.875rem", marginTop: 1 }}
                  >
                    {video.timeAgo}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default HomePage;
