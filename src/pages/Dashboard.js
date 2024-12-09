import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import DashboardLayout from "../components/DashboardLayout";
const Dashboard = () => {
  const stats = [
    { title: "Total Views", value: "10,245" },
    { title: "Subscribers", value: "1,256" },
    { title: "Videos Uploaded", value: "24" },
  ];

  const recentUploads = [
    { title: "My First Video", views: "1,204" },
    { title: "React Tutorial", views: "856" },
    { title: "CSS Tricks", views: "452" },
  ];

  return (
    <DashboardLayout>
    <Box>
      {/* Stats Section */}
      <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 3 }}>
        Welcome to your Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} md={4} key={stat.title}>
            <Card
              sx={{
                backgroundColor: "#F4F8FB",
                border: "1px solid #D1E3F8",
                boxShadow: "none",
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: "Velyra", color: "#007BFF" }}>
                  {stat.title}
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Uploads */}
      <Typography variant="h5" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}>
        Recent Uploads
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {recentUploads.map((upload, index) => (
          <Box
            key={index}
            sx={{
              padding: 2,
              backgroundColor: "#F4F8FB",
              border: "1px solid #D1E3F8",
              borderRadius: "12px",
            }}
          >
            <Typography variant="h6" sx={{ fontFamily: "Velyra" }}>
              {upload.title}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Velyra", color: "#6C757D" }}>
              {upload.views} views
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
