import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  CircularProgress,
  Snackbar,
  Autocomplete,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { ArrowBack, CloudUpload, Edit } from "@mui/icons-material";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import Layout from "../components/Layout";
import DashboardLayout from "../components/DashboardLayout";
import {X} from 'lucide-react'
import axios from 'axios'
import { useNavigate } from "react-router";

const UploadVideo = () => {
  const navigate=useNavigate()
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoCategory, setVideoCategory] = useState("Tech");
  const [videoTags, setVideoTags] = useState([]);
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
  const [newTag, setNewTag] = useState('');
 
  const predefinedTags = [
    'Technology', 'Music', 'Gaming', 'Education', 
    'Comedy', 'Sports', 'Travel', 'Cooking', 
    'Science', 'Fitness', 'Art', 'Programming'
  ];
  
  
    const [selectedTags, setSelectedTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestedTags, setSuggestedTags] = useState(predefinedTags);
  
    const handleAddTag = (tag) => {
      // Prevent duplicate tags
      if (tag && !selectedTags.includes(tag)) {
        setSelectedTags([...selectedTags, tag]);
        setInputValue('');
        // Reset suggestions to all tags except already selected
        setSuggestedTags(
          predefinedTags.filter(t => !selectedTags.includes(t) && t !== tag)
        );
      }
    };
  
    const handleDeleteTag = (tagToRemove) => {
      const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
      setSelectedTags(updatedTags);
      // Add back the removed tag to suggestions
      setSuggestedTags([...suggestedTags, tagToRemove]);
    };
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
  
      // Filter suggestions based on input
      const filtered = predefinedTags.filter(
        tag => 
          tag.toLowerCase().includes(value.toLowerCase()) && 
          !selectedTags.includes(tag)
      );
      setSuggestedTags(filtered);
    };
  
    const handleKeyDown = (e) => {
      // Add tag when user presses Enter
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        // If it's a completely new tag
        const trimmedTag = inputValue.trim();
        handleAddTag(trimmedTag);
      }
    }
  

  

  
  useEffect(() => {
    // Focus the input when the component is mounted
    const inputField = document.getElementById('tag-input');
    if (inputField) {
      inputField.focus();
    }
  }, []);
  

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

            // Calculate video duration
            const videoElement = document.createElement("video");
videoElement.src = url;

videoElement.addEventListener("loadedmetadata", () => {
  const duration = Math.floor(videoElement.duration); // Total duration in seconds
  setVideoDuration(duration);
  
  const formattedTime = formatTime(duration);
  setVideoLength(formattedTime);
});

// Function to format time into "MM:SS" format
const formatTime = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60); // Calculate minutes
  const seconds = durationInSeconds % 60; // Remaining seconds
  return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Format as "MM:SS"
};
          }
        });
      }
    );
  };

  const handleUpload = async() => {
    if (!videoTitle || !videoDescription || !videoCategory) {
      setErrorMessage("Please fill out all fields");
      setTimeout(()=>{
        setErrorMessage("")
      },1500)
      return;
    }
    if(selectedTags.length==0){
      setErrorMessage("Please Add At Least One Tag")
      setTimeout(()=>{
        setErrorMessage("")
      },1500)
      return ;
    }
    if(thumbnailURL.length==0)
    {
      setErrorMessage("Please Upload  Thumbnail!")
      setTimeout(()=>{
        setErrorMessage("")
      },1500)
      return ;
    }
    if(videoURL.length==0){
      setErrorMessage("Please Upload Video!")
      setTimeout(()=>{
        setErrorMessage("")
      },1500)
      return ;
    }
    setUploading(true);
    try{
      console.log("API Calling")
      const response=await axios.post("http://localhost:5000/videos/upload-video",{title:videoTitle,description:videoDescription,category:videoCategory,tags:selectedTags,thumbnailUrl:thumbnailURL,url:videoURL},{headers:{"Authorization":localStorage.getItem("token")}})
      console.log("Reponese",response.data)
      if(response.data.success){
        setSuccessMessage("Successfully Uploaded!")
        setTimeout(()=>{
          navigate("/")
        },1000)
      }
      else{
        setErrorMessage(response.data.message)
        setTimeout(()=>{
          setErrorMessage("")
        },1200)
      }
    
    }
    catch(e){
      setErrorMessage(e.response?e.response.data.message:e.message)
      setTimeout(()=>{
        setErrorMessage("")
      },1500)

    }
    finally{
      setUploading(false)
    }
  }


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
            <InputLabel shrink sx={{fontFamily:"Velyra",fontSize:"18px",fontWeight:"bold"}}>Video Title</InputLabel>
            <Input value={videoTitle} inputProps={{style:{fontFamily:"Velyra"}}} onChange={(e) => setVideoTitle(e.target.value)} fullWidth />
          </FormControl>

          <FormControl fullWidth sx={{ fontFamily: "Velyra", }}>
            <InputLabel shrink sx={{fontFamily:"Velyra",fontSize:"18px",fontWeight:"bold"}}>Video Description</InputLabel>
            <Input
              value={videoDescription}
              sx={{fontFamily:"Velyra"}}
              onChange={(e) => setVideoDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
  <InputLabel sx={{fontFamily:"Velyra",fontSize:"18px",fontWeight:"bold"}}>Category</InputLabel>
  <Select
    defaultValue={"Tech"}
    value={videoCategory}
    onChange={(e) => setVideoCategory(e.target.value)}
    sx={{
      fontFamily:"Velyra",
      // Remove all default borders
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      // Style for the root select element
      "&:hover .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      // Add only bottom border
      borderBottom: "2px solid #007BFF",
      "&:hover": {
        borderBottom: "2px solid #007BFF",
      },
      // Style for the dropdown icon
      "& .MuiSelect-icon": {
        color: "#007BFF",
      },
      // Ensure input text padding and appearance
      paddingBottom: "8px",
      backgroundColor: "transparent",
    }}
    InputProps={{
      disableUnderline: false,
    }}

  >
    <MenuItem value="Tech" sx={{fontFamily:"Velyra"}}>Tech</MenuItem>
    <MenuItem value="Comedy" sx={{fontFamily:"Velyra"}}>Comedy</MenuItem>
    <MenuItem value="Education" sx={{fontFamily:"Velyra"}}>Education</MenuItem>
    <MenuItem value="Gaming" sx={{fontFamily:"Velyra"}}>Gaming</MenuItem>
    <MenuItem value="Sports" sx={{fontFamily:"Velyra"}}>Sports</MenuItem>
    <MenuItem value="News" sx={{fontFamily:"Velyra"}}>News</MenuItem>
    <MenuItem value="Music" sx={{fontFamily:"Velyra"}}>Music</MenuItem>
    <MenuItem value="Other" sx={{fontFamily:"Velyra"}}>Other</MenuItem>
  </Select>
</FormControl>
<div className="w-full font-velyra">
      <Box mb={4}>
        <Box mb={2}>
          <label className="block text-gray-700 text-lg font-bold mb-2" style={{fontFamily:"Velyra"}}>
            Video Tags
          </label>
        </Box>

        {/* Tags Display Area */}
        <Box
          sx={{
            minHeight: '50px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {selectedTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              sx={{
                backgroundColor: '#D3E8FF',
                color: '#007BFF',
                fontFamily: 'Velyra',
                fontWeight: 'bold',
              }}
              deleteIcon={<X size={16} />}
            />
          ))}
        </Box>

        {/* Input */}
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type to select or add tags"
          fullWidth
          variant="standard"
          InputProps={{
            style: { fontFamily: 'Velyra' },
          }}
          sx={{
            '& .MuiInput-underline:before': {
              borderBottom: '2px solid #007BFF',
            },
            '&:hover .MuiInput-underline:before': {
              borderBottom: '2px solid #0056b3',
            },
            fontFamily: 'Velyra',
          }}
        />

        {/* Suggestions Dropdown */}
        {inputValue && suggestedTags.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              backgroundColor: 'white',
              boxShadow: 2,
              borderRadius: '8px',
              marginTop: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {suggestedTags.map((tag) => (
              <MenuItem
                key={tag}
                onClick={() => handleAddTag(tag)}
                sx={{ padding: '8px', fontFamily: 'Velyra' }}
              >
                {tag}
              </MenuItem>
            ))}
          </Box>
        )}
      </Box>
    </div>
      
          <FormControl fullWidth sx={{ fontFamily: "Velyra" }}>
            <InputLabel shrink sx={{fontFamily:"Velyra",fontWeight:"bold",fontSize:"18px"}}>Video Duration</InputLabel>
            <Input value={videoLength} inputProps={{style:{fontFamily:"Velyra"}}} disabled  fullWidth />
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
    margin: "0 auto",  // Center the box
  }}
>
  {/* Title */}
  <Typography
    variant="h6"
    sx={{
      marginBottom: 2,
      fontWeight: "bold",
      fontFamily: "Velyra",
    }}
  >
    {thumbnailURL ? "Thumbnail" : "Upload Thumbnail"}
  </Typography>

  {/* Loading Animation */}
  {loadingThumbnail ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <CircularProgress size={40} thickness={7} sx={{ color: "#007BFF" }} />
    </Box>
  ) : thumbnailURL ? (
    // Thumbnail Display
    <Box
      sx={{
        position: "relative",
        textAlign: "center",
        margin: "0 auto",
        maxWidth: "100%",
      }}
    >
      <img
        src={thumbnailURL}
        
        style={{
          width: "100%",
           // Ensures video is not too large
          maxHeight: "350px", // Prevents excessive height
          borderRadius: "15px",
          objectFit: "cover",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      
      {/* Edit Icon */}
      <IconButton
        onClick={() => document.getElementById("thumbnail-upload").click()}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#ffffff",
          border: "1px solid #007BFF",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <Edit sx={{ color: "#007BFF" }} />
      </IconButton>
    </Box>
  ) : (
    // Upload Icon
    <IconButton
      onClick={() => document.getElementById("thumbnail-upload").click()}
      sx={{
        color: "#007BFF",
        fontSize: "48px",
        padding: "10px",
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      }}
    >
      <CloudUpload sx={{ fontSize: "60px" }} />
    </IconButton>
  )}

  {/* File Input */}
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
    margin: "0 auto",  // Center the box
  }}
>
  {/* Title */}
  <Typography
    variant="h6"
    sx={{
      marginBottom: 2,
      fontWeight: "bold",
      fontFamily: "Velyra",
    }}
  >
    {videoURL ? "Video" : "Upload Video"}
  </Typography>

  {/* Loading Animation */}
  {loadingVideo ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <CircularProgress size={40} thickness={7} sx={{ color: "#007BFF" }} />
    </Box>
  ) : videoURL ? (
    // Video Display
    <Box
      sx={{
        position: "relative",
        textAlign: "center",
        margin: "0 auto",
        maxWidth: "100%",
      }}
    >
      <video
        src={videoURL}
        controls
        style={{
          width: "100%",
           // Ensures video is not too large
          maxHeight: "350px", // Prevents excessive height
          borderRadius: "15px",
          objectFit: "cover",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
    
      {/* Edit Icon */}
      <IconButton
        onClick={() => document.getElementById("video-upload").click()}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#ffffff",
          border: "1px solid #007BFF",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <Edit sx={{ color: "#007BFF" }} />
      </IconButton>
    </Box>
  ) : (
    // Upload Icon
    <IconButton
      onClick={() => document.getElementById("video-upload").click()}
      sx={{
        color: "#007BFF",
        fontSize: "48px",
        padding: "10px",
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      }}
    >
      <CloudUpload sx={{ fontSize: "60px" }} />
    </IconButton>
  )}

  {/* File Input */}
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

          {errorMessage && <Snackbar open={true} severity autoHideDuration={2000} >
            <Alert severity="error" sx={{fontFamily:"Velyra"}}>
 {errorMessage}
            </Alert>
            </Snackbar>}
          {successMessage && <Snackbar open={true} autoHideDuration={2000} >
            <Alert severity="success" sx={{fontFamily:"Velyra"}}>
              {successMessage}

            </Alert>
            </Snackbar>}
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default UploadVideo;
