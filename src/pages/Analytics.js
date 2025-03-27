import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ErrorDisplay from "../components/ErrorDisplay";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const getAnalytics = async () => {
    if (!checkAuthentication()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/users/get-analytics", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      } else {
        throw new Error("Failed to fetch analytics data. Please try again later.");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message || "An error occurred while fetching analytics.");
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalytics();
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
          You need to be logged in to view your analytics. Sign in to see your performance stats!
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
            onRetry={getAnalytics}
          />
        )}

        {/* Analytics Content */}
        {!loading && isAuthenticated && !error && (
          <>
            <Typography
              variant="h4"
              sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 4, color: "#007BFF" }}
            >
              Analytics
            </Typography>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#F4F8FB",
                    border: "1px solid #D1E3F8",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    height: "150px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0px 6px 15px rgba(0,123,255,0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "Velyra", color: "#007BFF", textAlign: "center" }}
                    >
                      Total Views
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: "Velyra", fontWeight: "bold", textAlign: "center", color: "#333" }}
                    >
                      {analytics.totalViews || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#F4F8FB",
                    border: "1px solid #D1E3F8",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    height: "150px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0px 6px 15px rgba(0,123,255,0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "Velyra", color: "#28A745", textAlign: "center" }}
                    >
                      Total Comments
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: "Velyra", fontWeight: "bold", textAlign: "center", color: "#333" }}
                    >
                      {analytics.totalComments || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#F4F8FB",
                    border: "1px solid #D1E3F8",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    height: "150px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0px 6px 15px rgba(0,123,255,0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "Velyra", color: "#FF4D4D", textAlign: "center" }}
                    >
                      Most Liked Video
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: "Velyra", fontWeight: "bold", textAlign: "center", color: "#333" }}
                    >
                      {analytics.mostLikedVideo
                        ? `${analytics.mostLikedVideo.title} (${analytics.mostLikedVideo.likes} Likes)`
                        : "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Charts and Lists */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2, color: "#007BFF" }}
                >
                  Views Over Time
                </Typography>
                <Bar
                  data={{
                    labels: analytics.viewsOverTime?.labels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [
                      {
                        label: "Views",
                        data: analytics.viewsOverTime?.data || [0, 0, 0, 0, 0, 0],
                        backgroundColor: "#007BFF",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        labels: {
                          font: {
                            family: "Velyra",
                          },
                        },
                      },
                      tooltip: {
                        bodyFont: {
                          family: "Velyra",
                        },
                        titleFont: {
                          family: "Velyra",
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            family: "Velyra",
                          },
                        },
                      },
                      y: {
                        ticks: {
                          font: {
                            family: "Velyra",
                          },
                        },
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2, color: "#007BFF" }}
                >
                  Top Performing Videos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  {analytics.topPerformingVideos && analytics.topPerformingVideos.length > 0 ? (
                    analytics.topPerformingVideos.map((video, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: 1,
                          borderBottom: "1px solid #D1E3F8",
                          "&:hover": { backgroundColor: "#F4F8FB" },
                        }}
                      >
                        <Typography sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#333" }}>
                          {video.title}
                        </Typography>
                        <Typography sx={{ fontFamily: "Velyra", color: "#6C757D" }}>
                          {video.views} views
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ fontFamily: "Velyra", color: "#666", textAlign: "center", py: 2 }}>
                      No top performing videos yet.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Analytics;