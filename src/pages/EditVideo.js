import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  CircularProgress,
  Snackbar,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
  Alert,
  Paper,
} from "@mui/material";
import { ArrowBack, CloudUpload, Edit } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import DashboardLayout from "../components/DashboardLayout";
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ErrorDisplay from "../components/ErrorDisplay";

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoCategory, setVideoCategory] = useState("Tech");
  const [videoLength, setVideoLength] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [videoDuration, setVideoDuration] = useState(null);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const predefinedTags = [
    "Technology",
    "Music",
    "Gaming",
    "Education",
    "Comedy",
    "Sports",
    "Travel",
    "Cooking",
    "Science",
    "Fitness",
    "Art",
    "Programming",
  ];

  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestedTags, setSuggestedTags] = useState(predefinedTags);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      setIsAuthenticated(false);
      return false;
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setInputValue("");
      setSuggestedTags(predefinedTags.filter((t) => !selectedTags.includes(t) && t !== tag));
    }
  };

  const handleDeleteTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setSuggestedTags([...suggestedTags, tagToRemove]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = predefinedTags.filter(
      (tag) => tag.toLowerCase().includes(value.toLowerCase()) && !selectedTags.includes(tag)
    );
    setSuggestedTags(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmedTag = inputValue.trim();
      handleAddTag(trimmedTag);
    }
  };

  const handleFileChange = async (e, setFile, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    const fileRef = ref(storage, `${type}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    if (type === "thumbnail") setLoadingThumbnail(true);
    if (type === "video") setLoadingVideo(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        setErrorMessage("Error uploading file.");
        if (type === "thumbnail") setLoadingThumbnail(false);
        if (type === "video") setLoadingVideo(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          if (type === "thumbnail") {
            setThumbnailURL(url);
            setLoadingThumbnail(false);
          }
          if (type === "video") {
            setVideoURL(url);
            setLoadingVideo(false);

            const videoElement = document.createElement("video");
            videoElement.src = url;

            videoElement.addEventListener("loadedmetadata", () => {
              const duration = Math.floor(videoElement.duration);
              setVideoDuration(duration);
              const formattedTime = formatTime(duration);
              setVideoLength(formattedTime);
            });

            const formatTime = (durationInSeconds) => {
              const minutes = Math.floor(durationInSeconds / 60);
              const seconds = durationInSeconds % 60;
              return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            };
          }
        });
      }
    );
  };

  const getVideoDetails = async () => {
    if (!checkAuthentication()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/videos/getvideo/${id}?token=${localStorage.getItem("token")}`);
      if (response.data.success) {
        setVideoTitle(response.data.video.title);
        setVideoCategory(response.data.video.category);
        setVideoDescription(response.data.video.description);
        setSelectedTags(response.data.video.tags || []);
        setVideoURL(response.data.video.url);
        setThumbnailURL(response.data.video.thumbnailUrl);
      } else {
        throw new Error(response.data.message || "Failed to fetch video details.");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message || "An error occurred while fetching video details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!videoTitle || !videoDescription || !videoCategory) {
      setErrorMessage("Please fill out all fields");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }
    if (selectedTags.length === 0) {
      setErrorMessage("Please add at least one tag");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }
    if (!thumbnailURL) {
      setErrorMessage("Please upload a thumbnail!");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }
    if (!videoURL) {
      setErrorMessage("Please upload a video!");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }
    setUploading(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/videos/update-video",
        {
          videoId: id,
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
        setSuccessMessage("Successfully Updated!");
        setTimeout(() => navigate(-1), 1000);
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

  useEffect(() => {
    getVideoDetails();
  }, [id]);

  const renderLoginPrompt = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f8f9ff",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 20px rgba(0,123,255,0.1)",
        }}
      >
        <LockIcon sx={{ fontSize: 60, color: "#007BFF", mb: 2 }} />
        <Typography
          variant="h5"
          sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF", mb: 2 }}
        >
          Please Log In
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontFamily: "Velyra", color: "#666", mb: 3 }}
        >
          You need to be logged in to edit your video. Sign in to continue!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            fontFamily: "Velyra",
            fontWeight: "bold",
            backgroundColor: "#007BFF",
            borderRadius: "8px",
            padding: "10px 20px",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Log In
        </Button>
      </Paper>
    </Box>
  );

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", backgroundColor: "#f8f9ff" }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size={35} thickness={10} sx={{ color: "#007BFF" }} />
          </Box>
        )}

        {/* Authentication Check */}
        {!loading && !isAuthenticated && renderLoginPrompt()}

        {/* Error State */}
        {!loading && isAuthenticated && error && (
          <ErrorDisplay
            error={error}
            onRetry={getVideoDetails}
          />
        )}

        {/* Edit Video Content */}
        {!loading && isAuthenticated && !error && (
          <>
            <Button
              startIcon={<ArrowBack />}
              sx={{ fontFamily: "Velyra", color: "#007BFF", mb: 3, "&:hover": { color: "#0056b3" } }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 4, color: "#007BFF" }}>
                Edit Your Video
              </Typography>

              <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
                <InputLabel shrink sx={{ fontFamily: "Velyra", fontSize: "18px", fontWeight: "bold", color: "#007BFF" }}>
                  Video Title
                </InputLabel>
                <Input
                  value={videoTitle}
                  inputProps={{ style: { fontFamily: "Velyra" } }}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  fullWidth
                  sx={{ "&:before": { borderBottom: "2px solid #007BFF" }, "&:hover:not(.Mui-disabled):before": { borderBottom: "2px solid #0056b3" } }}
                />
              </FormControl>

              <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
                <InputLabel shrink sx={{ fontFamily: "Velyra", fontSize: "18px", fontWeight: "bold", color: "#007BFF" }}>
                  Video Description
                </InputLabel>
                <Input
                  value={videoDescription}
                  sx={{ fontFamily: "Velyra", "&:before": { borderBottom: "2px solid #007BFF" }, "&:hover:not(.Mui-disabled):before": { borderBottom: "2px solid #0056b3" } }}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
                <InputLabel sx={{ fontFamily: "Velyra", fontSize: "18px", fontWeight: "bold", color: "#007BFF" }}>
                  Category
                </InputLabel>
                <Select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  sx={{
                    fontFamily: "Velyra",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    borderBottom: "2px solid #007BFF",
                    "&:hover": { borderBottom: "2px solid #0056b3" },
                    "& .MuiSelect-icon": { color: "#007BFF" },
                    paddingBottom: "8px",
                    backgroundColor: "transparent",
                  }}
                >
                  <MenuItem value="Tech" sx={{ fontFamily: "Velyra" }}>Tech</MenuItem>
                  <MenuItem value="Comedy" sx={{ fontFamily: "Velyra" }}>Comedy</MenuItem>
                  <MenuItem value="Education" sx={{ fontFamily: "Velyra" }}>Education</MenuItem>
                  <MenuItem value="Gaming" sx={{ fontFamily: "Velyra" }}>Gaming</MenuItem>
                  <MenuItem value="Sports" sx={{ fontFamily: "Velyra" }}>Sports</MenuItem>
                  <MenuItem value="News" sx={{ fontFamily: "Velyra" }}>News</MenuItem>
                  <MenuItem value="Music" sx={{ fontFamily: "Velyra" }}>Music</MenuItem>
                  <MenuItem value="Other" sx={{ fontFamily: "Velyra" }}>Other</MenuItem>
                </Select>
              </FormControl>

              <div className="w-full font-velyra">
                <Box mb={4}>
                  <Box mb={2}>
                    <label className="block text-gray-700 text-lg font-bold mb-2" style={{ fontFamily: "Velyra", color: "#007BFF" }}>
                      Video Tags
                    </label>
                  </Box>
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
                        sx={{ backgroundColor: "#D3E8FF", color: "#007BFF", fontFamily: "Velyra", fontWeight: "bold" }}
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
                  {inputValue && suggestedTags.length > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        zIndex: 10,
                        width: "100%",
                        backgroundColor: "white",
                        boxShadow: 2,
                        borderRadius: "8px",
                        marginTop: "4px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {suggestedTags.map((tag) => (
                        <MenuItem
                          key={tag}
                          onClick={() => handleAddTag(tag)}
                          sx={{ padding: "8px", fontFamily: "Velyra" }}
                        >
                          {tag}
                        </MenuItem>
                      ))}
                    </Box>
                  )}
                </Box>
              </div>

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
                  sx={{ marginBottom: 2, fontWeight: "bold", fontFamily: "Velyra", color: "#007BFF" }}
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
                  sx={{ marginBottom: 2, fontWeight: "bold", fontFamily: "Velyra", color: "#007BFF" }}
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
                onClick={handleUpdate}
                sx={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  mt: 3,
                  fontFamily: "Velyra",
                  "&:hover": { backgroundColor: "#0056b3" },
                  "&:disabled": { backgroundColor: "#cccccc" },
                }}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Update Video"}
              </Button>

              {errorMessage && (
                <Snackbar open={true} autoHideDuration={2000}>
                  <Alert severity="error" sx={{ fontFamily: "Velyra" }}>
                    {errorMessage}
                  </Alert>
                </Snackbar>
              )}
              {successMessage && (
                <Snackbar open={true} autoHideDuration={2000}>
                  <Alert severity="success" sx={{ fontFamily: "Velyra" }}>
                    {successMessage}
                  </Alert>
                </Snackbar>
              )}
            </Box>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default EditVideo;