import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const Dashboard = () => {
  const[statistics,setStatistics]=useState({})
  const[loading,setLoading]=useState(true)

  const getDashboardStatistics=async()=>{
    setLoading(true)
    try{
      const response=await axios.get("http://localhost:5000/users/get-dashboardstatistics",{headers:{"Authorization":localStorage.getItem("token")}})
      if(response.data.success)
      {
      setStatistics(response.data.statistics)
      
      setLoading(false)

      }
      else{
    toast.error(response.data.success,{style:{fontFamily:"Velyra"}})

      }
    }
    catch(e){
    toast.error(e.response?e.response.data.message:e.message,{style:{fontFamily:"Velyra"}})
    }
  }
  useEffect(()=>{
    getDashboardStatistics()
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
      {/* Stats Section */}
      <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 3 }}>
        Welcome to your Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statistics.generalStats.map((stat) => (
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

     
      <Typography variant="h5" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 2 }}>
        Recent Uploads
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {statistics.recentUploads.map((upload, index) => (
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
}
};

export default Dashboard;
