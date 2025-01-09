import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Divider, CircularProgress } from "@mui/material";
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
import { toast } from "react-toastify";

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
  const[analytics,setAnalytics]=useState({})

  const[loading,setLoading]=useState(true)
  const getAnalytics=async()=>{
    try{
      const response=await axios.get("http://localhost:5000/users/get-analytics",{headers:{"Authorization":localStorage.getItem("token")}})
      console.log("analytics",response.data)
      if(response.data.success){
        setAnalytics(response.data.analytics)
        setLoading(false)

      }
      else{
        toast.error(response.data.message,{style:{fontFamily:"Velyra"}})

      }
    }
    catch(e){
      toast.error(e.response?e.response.data.message:e.message,{style:{fontFamily:"Velyra"}})
    }
  }
  useEffect(()=>{
    getAnalytics()
  },[])
  if(loading){
    return(
      <DashboardLayout>
      
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={35} thickness={10} />
      </Box>
    </DashboardLayout>)
  }
  else{

  return (
    <DashboardLayout>
    <Box>
      
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
      height: "150px", // Set a fixed height
      display: "flex", // Center content
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
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
        sx={{ fontFamily: "Velyra", fontWeight: "bold", textAlign: "center" }}
      >
        {analytics.totalViews}
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
      height: "150px", // Set a fixed height
      display: "flex", // Center content
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
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
        sx={{ fontFamily: "Velyra", fontWeight: "bold", textAlign: "center" }}
      >
        {analytics.totalComments}
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
      height: "150px", // Set a fixed height
      display: "flex", // Center content
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        sx={{ fontFamily: "Velyra", color: "#FF4D4D", textAlign: "center" }} // Change color to red
      >
        Most Liked Video
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontFamily: "Velyra", fontWeight: "bold", textAlign: "center" }}
      >
        {analytics.mostLikedVideo.title} ({analytics.mostLikedVideo.likes} Likes)
      </Typography>
    </CardContent>
  </Card>
</Grid>

      </Grid>

  
      <Grid container spacing={4}>
        
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}
          >
            Views Over Time
          </Typography>
          <Bar
  data={{
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Views",
        data: analytics.viewsOverTime.data,
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
            sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}
          >
            Top Performing Videos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box>
            {analytics.topPerformingVideos.map(
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
                    {video.title}
                  </Typography>
                  <Typography sx={{ fontFamily: "Velyra", color: "#6C757D" }}>
                    {video.views} views
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
}
};

export default Analytics;
