import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  CircularProgress,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Chip,
} from "@mui/material";
import { ArrowBack, CloudUpload, Edit } from "@mui/icons-material";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import DashboardLayout from "../components/DashboardLayout";
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import CustomSnackbar from "../components/CustomSnackbar";

const UploadVideo = () => {
  const navigate = useNavigate();

  // State declarations
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoCategory, setVideoCategory] = useState("Tech");
  const [selectedTags, setSelectedTags] = useState([]);
  const [videoLength, setVideoLength] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const predefinedTags = [
    "Technology", "Music", "Gaming", "Education",
    "Comedy", "Sports", "Travel", "Cooking",
    "Science", "Fitness", "Art", "Programming",
  ];

  // Tag handling functions
  const handleAddTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
      setInputValue("");
    }
  };

  const handleDeleteTag = (tagToRemove) => {
    setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  // File upload handler
  const handleFileChange = async (e, setFile, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    const fileRef = ref(storage, `${type}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    type === "thumbnail" ? setLoadingThumbnail(true) : setLoadingVideo(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        setErrorMessage("Error uploading file.");
        type === "thumbnail" ? setLoadingThumbnail(false) : setLoadingVideo(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          if (type === "thumbnail") {
            setThumbnailURL(url);
            setLoadingThumbnail(false);
          } else {
            setVideoURL(url);
            setLoadingVideo(false);

            const videoElement = document.createElement("video");
            videoElement.src = url;
            videoElement.addEventListener("loadedmetadata", () => {
              const duration = Math.floor(videoElement.duration);
              setVideoLength(`${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`);
            });
          }
        });
      }
    );
  };

  // Video upload handler
  const handleUpload = async () => {
    if (!videoTitle || !videoDescription || !videoCategory || selectedTags.length === 0 || !thumbnailURL || !videoURL) {
      setErrorMessage(
        !videoTitle || !videoDescription || !videoCategory
          ? "Please fill out all fields"
          : selectedTags.length === 0
          ? "Please add at least one tag"
          : !thumbnailURL
          ? "Please upload a thumbnail!"
          : "Please upload a video!"
      );
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }

    setUploading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/videos/upload-video`,
        {
          title: videoTitle,
          description: videoDescription,
          category: videoCategory,
          tags: selectedTags,
          thumbnailUrl: thumbnailURL,
          url: videoURL,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      if (response.data.success) {
        setSuccessMessage("Successfully Uploaded!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 1200);
      }
    } catch (e) {
      setErrorMessage(e.response ? e.response.data.message : e.message);
      setTimeout(() => setErrorMessage(""), 1500);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
        <Button
          startIcon={<ArrowBack />}
          sx={{ fontFamily: "Velyra", color: "#007BFF", mb: 3 }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 4 }}>
            Upload Your Video
          </Typography>

          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink sx={{ fontFamily: "Velyra", fontSize: "18px", fontWeight: "bold" }}>
              Video Title
            </InputLabel>
            <Input
              value={videoTitle}
              inputProps={{ style: { fontFamily: "Velyra" } }}
              onChange={(e) => setVideoTitle(e.target.value)}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink sx={{ fontFamily: "Velyra", fontSize: "18px", fontWeight: "bold" }}>
              Video Description
            </InputLabel>
            <Input
              value={videoDescription}
              sx={{ fontFamily: "Velyra" }}
              onChange={(e) => setVideoDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel sx={{ fontFamily: "Velyra", fontSize: "18px", fontWeight: "bold" }}>Category</InputLabel>
            <Select
              defaultValue="Tech"
              value={videoCategory}
              onChange={(e) => setVideoCategory(e.target.value)}
              sx={{
                fontFamily: "Velyra",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                borderBottom: "2px solid #007BFF",
                "&:hover": { borderBottom: "2px solid #007BFF" },
                "& .MuiSelect-icon": { color: "#007BFF" },
                paddingBottom: "8px",
                backgroundColor: "transparent",
              }}
            >
              {["Tech", "Comedy", "Education", "Gaming", "Sports", "News", "Music", "Other"].map((category) => (
                <MenuItem key={category} value={category} sx={{ fontFamily: "Velyra" }}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ fontFamily: "Velyra" }}>
            <Typography
              sx={{ fontFamily: "Velyra", fontSize: "18px", fontWeight: "bold", mb: 2 }}
            >
              Video Tags
            </Typography>
            <Box
              sx={{
                minHeight: "50px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "8px",
                marginBottom: "16px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  sx={{
                    backgroundColor: "#D3E8FF",
                    color: "#007BFF",
                    fontFamily: "Velyra",
                    fontWeight: "bold",
                  }}
                  deleteIcon={<X size={16} />}
                />
              ))}
            </Box>
            <TextField
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type to select or add tags"
              fullWidth
              variant="standard"
              InputProps={{ style: { fontFamily: "Velyra" } }}
              sx={{
                "& .MuiInput-underline:before": { borderBottom: "2px solid #007BFF" },
                "&:hover .MuiInput-underline:before": { borderBottom: "2px solid #0056b3" },
                fontFamily: "Velyra",
              }}
            />
          </Box>

          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink sx={{ fontFamily: "Velyra", fontWeight: "bold", fontSize: "18px" }}>
              Video Duration
            </InputLabel>
            <Input
              value={videoLength}
              inputProps={{ style: { fontFamily: "Velyra" } }}
              disabled
              fullWidth
            />
          </FormControl>

          {/* Thumbnail Upload */}
          <Box
            sx={{
              border: "2px dashed #007BFF",
              padding: 3,
              textAlign: "center",
              borderRadius: "15px",
              position: "relative",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold", fontFamily: "Velyra" }}
            >
              {thumbnailURL ? "Thumbnail" : "Upload Thumbnail"}
            </Typography>
            {loadingThumbnail ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <CircularProgress size={40} thickness={7} sx={{ color: "#007BFF" }} />
              </Box>
            ) : thumbnailURL ? (
              <Box sx={{ position: "relative", textAlign: "center", margin: "0 auto", maxWidth: "100%" }}>
                <img
                  src={thumbnailURL}
                  style={{
                    width: "100%",
                    maxHeight: "350px",
                    borderRadius: "15px",
                    objectFit: "cover",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <IconButton
                  onClick={() => document.getElementById("thumbnail-upload").click()}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "#ffffff",
                    border: "1px solid #007BFF",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <Edit sx={{ color: "#007BFF" }} />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={() => document.getElementById("thumbnail-upload").click()}
                sx={{
                  color: "#007BFF",
                  fontSize: "48px",
                  padding: "10px",
                  "&:hover": { backgroundColor: "#f0f8ff" },
                }}
              >
                <CloudUpload sx={{ fontSize: "60px" }} />
              </IconButton>
            )}
            <Input
              type="file"
              accept="image/*"
              id="thumbnail-upload"
              onChange={(e) => handleFileChange(e, setThumbnailFile, "thumbnail")}
              sx={{ display: "none" }}
            />
          </Box>

          {/* Video Upload */}
          <Box
            sx={{
              border: "2px dashed #007BFF",
              padding: 3,
              textAlign: "center",
              borderRadius: "15px",
              position: "relative",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold", fontFamily: "Velyra" }}
            >
              {videoURL ? "Video" : "Upload Video"}
            </Typography>
            {loadingVideo ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <CircularProgress size={40} thickness={7} sx={{ color: "#007BFF" }} />
              </Box>
            ) : videoURL ? (
              <Box sx={{ position: "relative", textAlign: "center", margin: "0 auto", maxWidth: "100%" }}>
                <video
                  src={videoURL}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "350px",
                    borderRadius: "15px",
                    objectFit: "cover",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <IconButton
                  onClick={() => document.getElementById("video-upload").click()}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "#ffffff",
                    border: "1px solid #007BFF",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <Edit sx={{ color: "#007BFF" }} />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={() => document.getElementById("video-upload").click()}
                sx={{
                  color: "#007BFF",
                  fontSize: "48px",
                  padding: "10px",
                  "&:hover": { backgroundColor: "#f0f8ff" },
                }}
              >
                <CloudUpload sx={{ fontSize: "60px" }} />
              </IconButton>
            )}
            <Input
              type="file"
              accept="video/*"
              id="video-upload"
              onChange={(e) => handleFileChange(e, setVideoFile, "video")}
              sx={{ display: "none" }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{ backgroundColor: "#007BFF", color: "#fff", mt: 3 }}
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload Video"}
          </Button>

          {/* Custom Snackbars */}
          <CustomSnackbar
            open={Boolean(errorMessage)}
            message={errorMessage}
            severity="error"
            onClose={() => setErrorMessage("")}
          />
          <CustomSnackbar
            open={Boolean(successMessage)}
            message={successMessage}
            severity="success"
            onClose={() => setSuccessMessage("")}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default UploadVideo;