import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Input,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const[profilePhotoUrl,setProfilePhotoUrl]=useState("")
  const[username,setUsername]=useState("")
  const[email,setEmail]=useState("")
  const[bio,setBio]=useState("")
  const[currentPassword,setCurrentPassword]=useState("")
  const[newPassword,setNewPassword]=useState("")
  const[loading,setLoading]=useState(true)
  const[isSavingChanges,setIsSavingChanges]=useState(false)
  const[isChangingPassword,setIsChangingPassword]=useState(false)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profilePhotos/${file.name}`);
    setUploading(true);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProfilePhotoUrl(downloadURL);
        setUploading(false);
      }
    );
  };
  const getProfileBasicInfo=async()=>{
    try{
      const response=await axios.get("http://localhost:5000/users/getprofile-basicinfo",{headers:{"Authorization":localStorage.getItem("token")}})
      if(response.data.success){
        console.log("Profile Basic Info",response.data)
setProfilePhotoUrl(response.data.user.profilePhotoUrl)
setUsername(response.data.user.name)
setEmail(response.data.user.EMailAddress)
setBio(response.data.user.bio)
      }
      else{
        toast.error(response.data.message,{style:{fontFamily:"Velyra"}})
      }
    }
    catch(e){
      toast.error(e.response?e.response.data.message:e.message,{style:{fontFamily:"Velyra"}})
    }
    finally{
      setLoading(false)
    }
  }
  const updateProfile=async()=>{
    setIsSavingChanges(true)
    try{
      const response=await axios.put("http://localhost:5000/users/update-profile",{username,bio,profilePhotoUrl},{headers:{"Authorization":localStorage.getItem("token")}})
      if(response.data.success){
        toast.success(response.data.message,{style:{fontFamily:"Velyra"}})
      }
      else{
        toast.error(response.data.message,{style:{fontFamily:"Velyra"}})
      }

    }
    catch(e){
      toast.error(e.response?e.response.data.message:e.message,{style:{fontFamily:"Velyra"}})
    }
    finally{
      setIsSavingChanges(false)
    }
  }
  const changePassword=async()=>{
    setIsChangingPassword(true)
    try{
      const response=await axios.put("http://localhost:5000/users/change-password",{currentPassword,newPassword},{headers:{"Authorization":localStorage.getItem("token")}})
      if(response.data.success){
        toast.success(response.data.message,{style:{fontFamily:"Velyra"}})
      }
      else{
        toast.error(response.data.message,{style:{fontFamily:"Velyra"}})
      }

    }
    catch(e){
      toast.error(e.response?e.response.data.message:e.message,{style:{fontFamily:"Velyra"}})
    }
    finally{
      setIsChangingPassword(false)
    }
  }
  useEffect(()=>{
    getProfileBasicInfo()

  },[])
  if(loading){
    return(
      <DashboardLayout>
      
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress size={35} thickness={10} />
      </Box>
    </DashboardLayout>
    )
  }
  else{

  return (

    <DashboardLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ 
            fontFamily: "Velyra", 
            fontWeight: "bold", 
            mb: 4
          }}
        >
          Settings
        </Typography>
        <ToastContainer/>

        <Box sx={{ width: "100%" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 4 }}
          >
            <Tab sx={{ fontFamily: "Velyra",fontWeight:"bold" }} label="Profile Information" />
            <Tab sx={{ fontFamily: "Velyra",fontWeight:"bold" }} label="Change Password" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ width: "100%" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Box position="relative" display="inline-block">
                    <Avatar
                      src={profilePhotoUrl}
                      sx={{
                        width: 120,
                        height: 120,
                        margin: "auto",
                        border: "1px solid white",
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                        backgroundColor: "#007BFF",
                        color: "white",
                        "&:hover": { backgroundColor: "#0056b3" },
                      }}
                      component="label"
                    >
                      <Edit />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ 
                    fontFamily: "Velyra",
                    fontSize: "0.875rem",
                    color: "#555",
                    mb: 1
                  }}>
                    Username
                  </Typography>
                  <Input
                    placeholder="Username"
                    sx={{
                      width: "100%",
                      padding: "0.5rem",
                      fontSize: "1rem",
                      borderBottom: "2px solid #007BFF",
                      fontFamily: "Velyra"
                    }}
                    disableUnderline
                    onChange={(e)=>{
                      setUsername(e.target.value)
                    }}
                    value={username}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ 
                    fontFamily: "Velyra",
                    fontSize: "0.875rem",
                    color: "#555",
                    mb: 1
                  }}>
                    Email
                  </Typography>
                  <Input
                    placeholder="Email"
                    sx={{
                      width: "100%",
                      padding: "0.5rem",
                      fontSize: "1rem",
                      borderBottom: "2px solid #007BFF",
                      fontFamily: "Velyra"
                    }}
                    disableUnderline
                   value={email}
                    readOnly

                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ 
                    fontFamily: "Velyra",
                    fontSize: "0.875rem",
                    color: "#555",
                    mb: 1
                  }}>
                    Bio
                  </Typography>
                  <Input
                    placeholder="Bio"
                    sx={{
                      width: "100%",
                      padding: "0.5rem",
                      fontSize: "1rem",
                      borderBottom: "2px solid #007BFF",
                      fontFamily: "Velyra"
                    }}
                    onChange={(e)=>{
                      setBio(e.target.value)
                    }}
                    disableUnderline
                    value={bio}
                    multiline
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={updateProfile}
                disabled={isSavingChanges}
                sx={{
                  mt: 3,
                  fontFamily: "Velyra",
                  width:"200px",
                height:"50px",
                  padding: "0.5rem 2rem",
                  backgroundColor: "#007BFF",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
              {isSavingChanges?<CircularProgress style={{height:20,width:20,color:"blue"}} thickness={10}/>:"Save Changes"}
              </Button>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ width: "100%" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ 
                    fontFamily: "Velyra",
                    fontSize: "0.875rem",
                    color: "#555",
                    mb: 1
                  }}>
                    Current Password
                  </Typography>
                  <Input
                    placeholder="Current Password"
                    type="password"
                    onChange={(e)=>{
                      setCurrentPassword(e.target.value)
                    }}
                    sx={{
                      width: "100%",
                      padding: "0.5rem",
                      fontSize: "1rem",
                      borderBottom: "2px solid #007BFF",
                      fontFamily: "Velyra"
                    }}
                    disableUnderline
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ 
                    fontFamily: "Velyra",
                    fontSize: "0.875rem",
                    color: "#555",
                    mb: 1
                  }}>
                    New Password
                  </Typography>
                  <Input
                  onChange={(e)=>{
                    setNewPassword(e.target.value)
                  }}
                    placeholder="New Password"
                    type="password"
                    sx={{
                      width: "100%",
                      padding: "0.5rem",
                      fontSize: "1rem",
                      borderBottom: "2px solid #007BFF",
                      fontFamily: "Velyra"
                    }}
                    disableUnderline
                  />
                </Grid>
              </Grid>
              <Button
              disabled={isChangingPassword}
              onClick={changePassword}
                variant="contained"
                color="primary"
                
                sx={{
                  width:"200px",
                height:"50px",
                  mt: 3,
                  fontFamily: "Velyra",
                  padding: "0.5rem 2rem",
                  backgroundColor: "#007BFF",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
               {isChangingPassword?<CircularProgress style={{height:20,width:20,color:"blue"}} thickness={10}/>:"Save Changes"}
              </Button>
            </Box>
          )}

          <Modal
            open={uploading}
            onClose={() => {}}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "2rem",
                textAlign: "center",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                width: "400px",
              }}
            >
              <CircularProgress sx={{ color: "#007BFF", marginBottom: "1rem" }} size={30} thickness={8} />
              <Typography
                sx={{
                  fontFamily: "Velyra",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Uploading Profile Photo
              </Typography>
            </Box>
          </Modal>
        </Box>
      </Box>
    </DashboardLayout>
  
  );
}
};

export default Settings;