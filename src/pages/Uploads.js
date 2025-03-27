import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import ConfirmationModal from "../components/ConfirmationModel";
import DeletingModal from "../components/DeletingModel";
import ErrorDisplay from "../components/ErrorDisplay";

const Uploads = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmationModelOpen, setIsConfirmationModelOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState("");

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

  const getMyVideos = async () => {
    if (!checkAuthentication()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/videos/get-myvideos", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setVideos(response.data.videos);
      } else {
        throw new Error("Failed to fetch your videos. Please try again later.");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message || "An error occurred while fetching your videos.");
     
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/videos/delete-video/${selectedVideoId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        toast.success("Successfully Deleted!", { style: { fontFamily: "Velyra" } });
        setVideos(videos.filter((video) => video._id !== selectedVideoId));
      } else {
        toast.error(response.data.message, { style: { fontFamily: "Velyra" } });
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmationModelOpen(false);
    setIsDeleting(true);
    handleDelete();
  };

  const handleClose = () => {
    setIsConfirmationModelOpen(false);
  };

  useEffect(() => {
    getMyVideos();
  }, []);

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
          You need to be logged in to view your uploads. Sign in to manage your videos!
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
      <Box sx={{ padding: 3, backgroundColor: "#f8f9ff", minHeight: "100vh" }}>
        <ToastContainer />
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
            onRetry={getMyVideos}
          />
        )}

        {/* Uploads Content */}
        {!loading && isAuthenticated && !error && (
          <>
            <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 3, color: "#007BFF" }}>
              My Uploads
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", mb: 3 }}>
              <Button
                onClick={() => navigate("/studio/upload-video")}
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#007BFF",
                  color: "#FFFFFF",
                  borderRadius: "50px",
                  textTransform: "none",
                  padding: "10px 24px",
                  fontWeight: "bold",
                  fontFamily: "Velyra",
                  boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)",
                  "&:hover": {
                    backgroundColor: "#0056b3",
                    boxShadow: "0px 6px 12px rgba(0, 86, 179, 0.4)",
                  },
                }}
              >
                Upload
              </Button>
            </Box>

            {videos.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>Title</TableCell>
                    <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>Views</TableCell>
                    <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>Date</TableCell>
                    <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#007BFF" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {videos.map((video, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#F4F8FB" },
                      }}
                    >
                      <TableCell
                        onClick={() => navigate(`/watch/${video._id}`)}
                        sx={{ fontFamily: "Velyra", color: "#333" }}
                      >
                        {video.title}
                      </TableCell>
                      <TableCell
                        onClick={() => navigate(`/watch/${video._id}`)}
                        sx={{ fontFamily: "Velyra", color: "#666" }}
                      >
                        {video.viewedBy.length}
                      </TableCell>
                      <TableCell
                        onClick={() => navigate(`/watch/${video._id}`)}
                        sx={{ fontFamily: "Velyra", color: "#666" }}
                      >
                        {new Date(video.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => navigate(`/studio/edit-video/${video._id}`)}
                          color="primary"
                          sx={{ "&:hover": { color: "#0056b3" } }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedVideoId(video._id);
                            setIsConfirmationModelOpen(true);
                          }}
                          color="error"
                          sx={{ "&:hover": { color: "#c62828" } }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography
                variant="h6"
                sx={{ fontFamily: "Velyra", color: "#666", textAlign: "center", mt: 4 }}
              >
                You haven’t uploaded any videos yet!
              </Typography>
            )}
            <ConfirmationModal
              open={isConfirmationModelOpen}
              handleClose={handleClose}
              handleConfirm={handleConfirm}
            />
            <DeletingModal open={isDeleting} />
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Uploads;