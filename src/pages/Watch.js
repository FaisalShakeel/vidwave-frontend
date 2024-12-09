import React, { useState } from "react";
import { Box, Typography, Button, Avatar, Input, Collapse, Paper } from "@mui/material";
import { ThumbUp, SaveAlt, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Layout from "../components/Layout";

const Watch = () => {
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate(); // Hook to navigate

  const handleExpandReplies = (index) => {
    setExpandedComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNewCommentChange = (e) => setNewComment(e.target.value);

  const videoData = {
    title: "How to Build a YouTube Clone in React",
    views: "1.5M views",
    creator: {
      name: "CodeWithMe",
      avatar: "https://via.placeholder.com/100",
      subscribers: "250K subscribers",
    },
    comments: [
      {
        user: "JohnDoe",
        text: "Great tutorial, really helped me build my own app!",
        replies: [
          { user: "JaneSmith", text: "I agree, this was super helpful!" },
        ],
      },
      {
        user: "MikeRoss",
        text: "Looking forward to more tutorials like this!",
        replies: [
          { user: "SarahLee", text: "Same here, I learned a lot from this one." },
        ],
      },
    ],
    relatedVideos: [
      {
        title: "React Hooks Explained",
        views: "500K views",
        thumbnail: "https://via.placeholder.com/150",
      },
      {
        title: "Material UI 101",
        views: "350K views",
        thumbnail: "https://via.placeholder.com/150",
      },
    ],
  };

  return (
    <Layout>
      {/* Back Button */}
      <Box sx={{ padding: 2,overflowX:"hidden" }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)} // Navigate to the previous page
          sx={{
            fontFamily: "Velyra",
            fontSize: "16px",
            textTransform: "capitalize",
            color: "#007BFF",
          }}
        >
          Back
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { lg: "row", xs: "column" },
          gap: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: 2,
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {/* Video Section */}
          <Box sx={{ backgroundColor: "#ffffff", borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
            <Box
              component="iframe"
              width="100%"
              height="500px"
              src="https://www.youtube.com/embed/tgbNymZ7vqY"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>
                {videoData.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {videoData.views}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button startIcon={<ThumbUp />} sx={{ mr: 2, fontFamily: "Velyra" }} color="primary">
                  Like
                </Button>
                <Button startIcon={<SaveAlt />} sx={{ fontFamily: "Velyra" }} color="primary">
                  Save
                </Button>
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
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Avatar
              src={videoData.creator.avatar}
              alt={videoData.creator.name}
              sx={{ width: 56, height: 56 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                {videoData.creator.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "Velyra" }}>
                {videoData.creator.subscribers}
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

          {/* Comment Input */}
          <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <Input
              placeholder="Add a comment..."
              fullWidth
              disableUnderline
              sx={{
                fontFamily: "Velyra",
                borderBottom: "1px solid #ccc",
                fontSize: "16px",
              }}
              value={newComment}
              onChange={handleNewCommentChange}
            />
            <Button sx={{ fontFamily: "Velyra", color: "#007BFF" }}>Comment</Button>
          </Box>

          {/* Comments Section */}
          <Box sx={{ mt: 4 }}>
            {videoData.comments.map((comment, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <Paper sx={{ padding: 2, mb: 1 }}>
                  <Typography variant="body1" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                    {comment.user}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Velyra" }}>
                    {comment.text}
                  </Typography>
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
                </Paper>

                {/* Replies */}
                <Collapse in={expandedComments[index]}>
                  {comment.replies.map((reply, idx) => (
                    <Box key={idx} sx={{ pl: 4, mt: 1 }}>
                      <Paper sx={{ padding: 2 }}>
                        <Typography variant="body1" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                          {reply.user}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: "Velyra" }}>
                          {reply.text}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Collapse>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Related Videos Section */}
        <Box
          sx={{
            width: { lg: "400px", xs: "100%" },
            mt: { xs: 4, lg: 0 },
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 3,
            padding: 2,
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>
            Related Videos
          </Typography>
          {videoData.relatedVideos.map((video, index) => (
            <Box key={index} sx={{ mt: 2, display: "flex", gap: 2 }}>
              <img src={video.thumbnail} alt={video.title} width="120px" style={{ borderRadius: "10px" }} />
              <Box>
                <Typography variant="body2" sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>
                  {video.title}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "gray" }}>
                  {video.views}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default Watch;
