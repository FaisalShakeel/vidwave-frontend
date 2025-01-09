import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,Button, IconButton, CircularProgress } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModel";
import DeletingModal from "../components/DeletingModel";

const Uploads = () => {
  const navigate=useNavigate()
  const[videos,setVideos]=useState([])
  const[loading,setLoading]=useState(true)
 const[isDeleting,setIsDeleting]=useState(false)
 const[isConfirmationModelOpen,setIsConfirmationModelOpen]=useState(false)
 const[selectedVideoId,setSelectedVideoId]=useState("")
 const handleConfirm=()=>{
  setIsConfirmationModelOpen(false)
  setIsDeleting(true)
  handleDelete()
 }
 const handleClose=()=>{
  setIsConfirmationModelOpen(false)
 }
  const getMyVideos=async()=>{
    try{
      const response=await axios.get("http://localhost:5000/videos/get-myvideos",{headers:{"Authorization":localStorage.getItem("token")}})
      console.log("My Videos",response.data)
      if(response.data.success){
        setVideos(response.data.videos)
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
  const handleDelete=async()=>{
  
    
    try{
      const response=await axios.delete(`http://localhost:5000/videos/delete-video/${selectedVideoId}`,{headers:{"Authorization":localStorage.getItem("token")}})
      if(response.data.success){
       toast.success("Successfully Deleted!",{style:{fontFamily:"Velyra"}})
       setVideos(videos.filter((video)=>{return(video._id!=selectedVideoId)}))
      }
      else{
        toast.error(response.data.message,{style:{fontFamily:"Velyra"}})
      }
    }
    catch(e){
      toast.error(e.response?e.response.data.message:e.message,{style:{fontFamily:"Velyra"}})

    }
    finally{
      setIsDeleting(false)
    }
  }
  useEffect(()=>{
    getMyVideos()
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
      <ToastContainer/>
      <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 3 }}>
        My Uploads
      </Typography>
      <Box sx={{display:"flex",flexDirection:"row",justifyContent:"end"}}>
      <Button
      onClick={()=>{
        navigate("/studio/upload-video")
      }}
      variant="contained"
      startIcon={<CloudUploadIcon />}
      sx={{
        backgroundColor: "#007BFF", // Blue background
        color: "#FFFFFF", // White text
        
        borderRadius: "50px", // Rounded corners
        textTransform: "none", // Disable uppercase text
        padding: "10px 24px", // Padding for a better look
        fontWeight: "bold", // Bold text
        boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)", // Subtle shadow
        "&:hover": {
          backgroundColor: "#0056b3", // Darker blue on hover
          boxShadow: "0px 6px 12px rgba(0, 86, 179, 0.4)", // Slightly enhanced shadow
        },
      }}
    >
      Upload
    </Button>
    </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Views</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
         <TableBody>
          {videos.map((video, index) => (
            <TableRow key={index} sx={{cursor:"pointer"}}>
              <TableCell onClick={()=>{
                navigate(`/watch/${video._id}`)
              }} sx={{ fontFamily: "Velyra" }}>{video.title}</TableCell>
              <TableCell onClick={()=>{
                navigate(`/watch/${video._id}`)
              }} sx={{ fontFamily: "Velyra" }}>{video.viewedBy.length}</TableCell>
              <TableCell onClick={()=>{
                navigate(`/watch/${video._id}`)
              }} sx={{ fontFamily: "Velyra" }}>
  {new Date(video.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</TableCell>

              <TableCell>
                <IconButton onClick={()=>{
                  navigate(`/studio/edit-video/${video._id}`)
                }} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={()=>{
                  setSelectedVideoId(video._id)
                  setIsConfirmationModelOpen(true)
                }} color="error">
                  <Delete  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmationModal open={isConfirmationModelOpen} handleClose={handleClose} handleConfirm={handleConfirm}/>
      <DeletingModal open={isDeleting}/>
    </Box> 
    </DashboardLayout>
  );
}
};

export default Uploads;
