import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
} from "@mui/material";
import { AccountCircle, VideoLibrary, Logout } from "@mui/icons-material";
import {
  Menu as MenuIcon,
  Notifications,
  Add,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useSearchQuery } from "../contexts/SearchQueryContext";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate=useNavigate()
  const [decodedUser,setDecodedUser]=useState({})
  const token=localStorage.getItem("token")

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const{searchQuery,setSearchQuery}=useSearchQuery()
  useEffect(()=>{
    try{
     const decodedToken= jwtDecode(localStorage.getItem("token"))
     setDecodedUser(decodedToken)

    }
    catch(e){
      console.error("Error while decoding the user")

    }
  },[token])

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        zIndex: 1200,
        padding: { xs: "0 10px", sm: "0 20px" },
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 80 }}>
        {/* Sidebar Toggle (Visible on smaller devices) */}
        <IconButton
          edge="start"
          color="primary"
          onClick={toggleSidebar}
          sx={{ marginRight: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo / Project Name */}
        <Typography
          variant="h5"
          sx={{
            color: "#007BFF",
            fontWeight: "bold",
            fontFamily: "Velyra, sans-serif",
            flexGrow: { xs: 1, md: 0 },
          }}
        >
          Vidwave
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f1f5fc",
            borderRadius: 50,
            width: { xs: "auto", sm: "40%" },
            padding: { xs: 0, sm: "4px 8px" },
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Search Field (Hidden on smaller devices) */}
          <InputBase
          value={searchQuery}
            placeholder="Search…"
            onChange={(e)=>{
              setSearchQuery(e.target.value)
            }}
            sx={{
              display: { xs: "none", sm: "flex" },
              fontFamily: "Velyra, sans-serif",
              color: "#333",
              flexGrow: 1,
              borderRadius: "50px",
              px: 2,
            }}
          />
          <IconButton onClick={()=>{
            navigate(`/search/?query=${searchQuery}`)
          }} color="primary">
            <Search />
          </IconButton>
        </Box>

        {/* Action Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Notifications */}
          <IconButton color="primary">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Add Action */}
          <IconButton onClick={()=>{
            navigate("/studio/upload-video")
          }} color="primary">
            <Add />
          </IconButton>

          {/* Profile Menu */}
          <IconButton onClick={handleMenuOpen}>
            <img
            height={30}
            width={30}
              src={decodedUser?decodedUser.profilePhotoUrl:"https://via.placeholder.com/32"}
              alt="Profile"
              style={{ borderRadius: "50%" }}
            />
          </IconButton>

          <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      sx={{
        mt: 2,
        "& .MuiPaper-root": {
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          padding: "10px 0",
        },
      }}
    >
      <MenuItem
  onClick={() => {
    navigate(`/profile/${decodedUser?.id}`);
  }}
  sx={{
    fontFamily: "Velyra, sans-serif",
    color: "#007BFF",
    padding: "10px 20px",
  }}
>
  <ListItemIcon
    sx={{
      minWidth: "40px", // Ensures consistent spacing for icons
      color: "#007BFF",
    }}
  >
    {decodedUser?.name ? (
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "#E0F7FA", // Light blue background
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#007BFF", // Same as the text color
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        {decodedUser.name.charAt(0).toUpperCase()}
      </div>
    ) : (
      <AccountCircle />
    )}
  </ListItemIcon>
  My Profile
</MenuItem>

      <MenuItem
        onClick={()=>{
          navigate("/studio/dashboard")
        }}
        sx={{
          fontFamily: "Velyra, sans-serif",
          color: "#007BFF",
          padding: "10px 20px",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: "40px",
            color: "#007BFF",
          }}
        >
          <VideoLibrary />
        </ListItemIcon>
        Go to Studio
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        sx={{
          fontFamily: "Velyra, sans-serif",
          color: "#FF3D00",
          padding: "10px 20px",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: "40px",
            color: "#FF3D00",
          }}
        >
          <Logout />
        </ListItemIcon>
        Sign Out
      </MenuItem>
    </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
