import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Button, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ErrorDisplay from "../components/ErrorDisplay";

const Dashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({});
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

  const getDashboardStatistics = async () => {
    if (!checkAuthentication()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/users/get-dashboardstatistics", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.success) {
        setStatistics(response.data.statistics);
      } else {
        throw new Error("Failed to fetch dashboard statistics. Please try again later.");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message || "An error occurred while fetching dashboard statistics.");
      toast.error(e.response ? e.response.data.message : e.message, { style: { fontFamily: "Velyra" } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardStatistics();
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
          You need to be logged in to view your dashboard. Sign in to see your stats and uploads!
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
      <ToastContainer />
      <Box sx={{ padding: 3, backgroundColor: "#f8f9ff", minHeight: "100vh" }}>
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
            onRetry={getDashboardStatistics}
          />
        )}

        {/* Dashboard Content */}
        {!loading && isAuthenticated && !error && (
          <>
            {/* Stats Section */}
            <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 3, color: "#007BFF" }}>
              Welcome to your Dashboard
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statistics.generalStats && statistics.generalStats.length > 0 ? (
                statistics.generalStats.map((stat) => (
                  <Grid item xs={12} md={4} key={stat.title}>
                    <Card
                      sx={{
                        backgroundColor: "#F4F8FB",
                        border: "1px solid #D1E3F8",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0px 6px 15px rgba(0,123,255,0.2)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontFamily: "Velyra", color: "#007BFF" }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h5" sx={{ fontFamily: "Velyra", fontWeight: "bold", color: "#333" }}>
                          {stat.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Velyra", color: "#666", textAlign: "center", width: "100%", mt: 2 }}
                >
                  No statistics available yet.
                </Typography>
              )}
            </Grid>

            {/* Recent Uploads Section */}
            <Typography variant="h5" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2, color: "#007BFF" }}>
              Recent Uploads
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {statistics.recentUploads && statistics.recentUploads.length > 0 ? (
                statistics.recentUploads.map((upload, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: 2,
                      backgroundColor: "#F4F8FB",
                      border: "1px solid #D1E3F8",
                      borderRadius: "12px",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0px 4px 10px rgba(0,123,255,0.1)",
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontFamily: "Velyra", color: "#333" }}>
                      {upload.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#6C757D" }}>
                      {upload.views} views
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Velyra", color: "#666", textAlign: "center", py: 2 }}
                >
                  No recent uploads yet.
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;