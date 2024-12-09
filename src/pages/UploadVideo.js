import React, { useState } from "react";
import { Box, Typography, Button, Input, CircularProgress, Snackbar, FormControl, InputLabel, IconButton } from "@mui/material";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import Layout from "../components/Layout";
import DashboardLayout from "../components/DashboardLayout";

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoTags, setVideoTags] = useState("");
  const [videoLength, setVideoLength] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [videoDuration, setVideoDuration] = useState(null);

  const handleFileChange = (e, setFile, type) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      if (type === "video") {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(file);
        videoElement.onloadedmetadata = () => {
          setVideoDuration(videoElement.duration); // Store video duration
        };
      }
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !thumbnailFile || !videoTitle || !videoDescription || !videoCategory || !videoTags || !videoLength) {
      setErrorMessage("Please fill out all fields and select files.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload Thumbnail
      const thumbnailRef = ref(storage, `thumbnails/${thumbnailFile.name}`);
      const thumbnailUploadTask = uploadBytesResumable(thumbnailRef, thumbnailFile);

      thumbnailUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          throw error;
        },
        async () => {
          const thumbnailUrl = await getDownloadURL(thumbnailUploadTask.snapshot.ref);

          // Upload Video
          const videoRef = ref(storage, `videos/${videoFile.name}`);
          const videoUploadTask = uploadBytesResumable(videoRef, videoFile);

          videoUploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              throw error;
            },
            async () => {
              const videoUrl = await getDownloadURL(videoUploadTask.snapshot.ref());

              // After successful upload, show message
              setUploading(false);
              setSuccessMessage("Video and Thumbnail uploaded successfully!");

              // You can save the URLs and additional details to your database here

              // Reset the form after success
              setVideoFile(null);
              setThumbnailFile(null);
              setVideoTitle("");
              setVideoDescription("");
              setVideoCategory("");
              setVideoTags("");
              setVideoLength("");
              setUploadProgress(0);
            }
          );
        }
      );
    } catch (error) {
      setUploading(false);
      setErrorMessage("Error uploading files. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          sx={{ fontFamily: "Velyra", color: "#007BFF", mb: 3 }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>

        {/* Upload Form */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 4 }}>
            Upload Your Video
          </Typography>

          {/* Video Title */}
          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink htmlFor="video-title" sx={{ fontFamily: "Velyra" }}>
              Video Title
            </InputLabel>
            <Input
              id="video-title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              fullWidth
              sx={{
                fontFamily: "Velyra",
                '& .MuiInputBase-root': {
                  borderBottom: "2px solid #007BFF",
                  borderRadius: "0",
                },
              }}
              inputProps={{ style: { fontFamily: "Velyra" } }}
            />
          </FormControl>

          {/* Video Description */}
          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink htmlFor="video-description" sx={{ fontFamily: "Velyra" }}>
              Video Description
            </InputLabel>
            <Input
              id="video-description"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={{
                fontFamily: "Velyra",
                '& .MuiInputBase-root': {
                  borderBottom: "2px solid #007BFF",
                  borderRadius: "0",
                },
              }}
              inputProps={{ style: { fontFamily: "Velyra" } }}
            />
          </FormControl>

          {/* Category Select */}
          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink htmlFor="video-category" sx={{ fontFamily: "Velyra" }}>
              Category
            </InputLabel>
            <Input
              id="video-category"
              value={videoCategory}
              onChange={(e) => setVideoCategory(e.target.value)}
              fullWidth
              sx={{
                fontFamily: "Velyra",
                '& .MuiInputBase-root': {
                  borderBottom: "2px solid #007BFF",
                  borderRadius: "0",
                },
              }}
              inputProps={{ style: { fontFamily: "Velyra" } }}
            />
          </FormControl>

          {/* Tags Input */}
          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink htmlFor="video-tags" sx={{ fontFamily: "Velyra" }}>
              Video Tags (comma separated)
            </InputLabel>
            <Input
              id="video-tags"
              value={videoTags}
              onChange={(e) => setVideoTags(e.target.value)}
              fullWidth
              sx={{
                fontFamily: "Velyra",
                '& .MuiInputBase-root': {
                  borderBottom: "2px solid #007BFF",
                  borderRadius: "0",
                },
              }}
              inputProps={{ style: { fontFamily: "Velyra" } }}
            />
          </FormControl>

          {/* Video Length */}
          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink htmlFor="video-length" sx={{ fontFamily: "Velyra" }}>
              Video Length (in minutes)
            </InputLabel>
            <Input
              id="video-length"
              value={videoLength}
              onChange={(e) => setVideoLength(e.target.value)}
              fullWidth
              sx={{
                fontFamily: "Velyra",
                '& .MuiInputBase-root': {
                  borderBottom: "2px solid #007BFF",
                  borderRadius: "0",
                },
              }}
              inputProps={{ style: { fontFamily: "Velyra" } }}
            />
          </FormControl>

          {/* Thumbnail Upload Section */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, border: "2px dashed #007BFF", padding: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Upload Thumbnail</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
              <IconButton onClick={() => document.getElementById("thumbnail-upload").click()} sx={{ fontSize: "48px", color: "#007BFF", mb: 2 }}>
                <CloudUpload />
              </IconButton>
              <Input
                type="file"
                accept="image/*"
                id="thumbnail-upload"
                onChange={(e) => handleFileChange(e, setThumbnailFile, "thumbnail")}
                sx={{ display: "none" }}
              />
              {thumbnailFile && (
                <Typography variant="body2" sx={{ fontFamily: "Velyra" }}>
                  Selected: {thumbnailFile.name}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Video Upload Section */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, border: "2px dashed #007BFF", padding: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Upload Video</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
              <IconButton onClick={() => document.getElementById("video-upload").click()} sx={{ fontSize: "48px", color: "#007BFF", mb: 2 }}>
                <CloudUpload />
              </IconButton>
              <Input
                type="file"
                accept="video/*"
                id="video-upload"
                onChange={(e) => handleFileChange(e, setVideoFile, "video")}
                sx={{ display: "none" }}
              />
              {videoFile && (
                <Typography variant="body2" sx={{ fontFamily: "Velyra" }}>
                  Selected: {videoFile.name}
                </Typography>
              )}
              {uploadProgress > 0 && (
                <CircularProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />
              )}
            </Box>
          </Box>

          {/* Upload Button */}
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{ fontFamily: "Velyra", backgroundColor: "#007BFF", color: "#fff", fontWeight: "bold", mt: 3 }}
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload Video"}
          </Button>

          {/* Error and Success Messages */}
          {errorMessage && <Snackbar open={true} message={errorMessage} />}
          {successMessage && <Snackbar open={true} message={successMessage} />}
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default UploadVideo;
