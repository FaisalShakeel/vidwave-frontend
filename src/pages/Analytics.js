import React from "react";
import { Box, Typography, Grid, Card, CardContent, Divider } from "@mui/material";
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
  // Chart Data
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Views",
        data: [500, 1200, 900, 1500, 2000, 1800],
        backgroundColor: "#007BFF",
      },
    ],
  };

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Subscribers",
        data: [100, 150, 200, 300],
        borderColor: "#28A745",
        borderWidth: 2,
        fill: true,
        backgroundColor: "rgba(40, 167, 69, 0.2)",
      },
    ],
  };

  const doughnutChartData = {
    labels: ["18-24", "25-34", "35-44", "45+"],
    datasets: [
      {
        label: "Audience Demographics",
        data: [40, 30, 20, 10],
        backgroundColor: ["#007BFF", "#6C757D", "#FFC107", "#DC3545"],
      },
    ],
  };

  return (
    <DashboardLayout>
    <Box>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 4 }}
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
              boxShadow: "none",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Velyra", color: "#007BFF" }}
              >
                Total Views
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Velyra", fontWeight: "bold" }}
              >
                45,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#F4F8FB",
              border: "1px solid #D1E3F8",
              boxShadow: "none",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Velyra", color: "#28A745" }}
              >
                New Subscribers
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Velyra", fontWeight: "bold" }}
              >
                1,200
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#F4F8FB",
              border: "1px solid #D1E3F8",
              boxShadow: "none",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Velyra", color: "#FFC107" }}
              >
                Average Watch Time
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Velyra", fontWeight: "bold" }}
              >
                5 mins 32 secs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Views Over Time (Bar Chart) */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}
          >
            Views Over Time
          </Typography>
          <Bar data={barChartData} options={{ responsive: true }} />
        </Grid>

        {/* Subscribers Growth (Line Chart) */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}
          >
            Subscribers Growth
          </Typography>
          <Line data={lineChartData} options={{ responsive: true }} />
        </Grid>

        {/* Audience Demographics (Doughnut Chart) */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}
          >
            Audience Demographics
          </Typography>
          <Doughnut data={doughnutChartData} options={{ responsive: true }} />
        </Grid>

        {/* Additional Section */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}
          >
            Top Performing Videos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box>
            {["React Tutorial", "CSS Tricks", "Firebase Crash Course"].map(
              (video, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 1,
                    borderBottom: "1px solid #D1E3F8",
                  }}
                >
                  <Typography
                    sx={{ fontFamily: "Velyra", fontWeight: "bold" }}
                  >
                    {video}
                  </Typography>
                  <Typography sx={{ fontFamily: "Velyra", color: "#6C757D" }}>
                    {Math.floor(Math.random() * 5000) + 1000} views
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
    </DashboardLayout>
  );
};

export default Analytics;
