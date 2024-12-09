import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Drawer,
  Tooltip,
} from "@mui/material";
import {
  Home,
  ThumbUp,
  VideoLibrary,
  PlaylistPlay,
  History,
  Close,
  Menu as MenuIcon,
  Bookmark,
} from "@mui/icons-material";

const Sidebar = ({ isCollapsed, toggleSidebar, selectedOption, setSelectedOption }) => {
  const menuItems = [
    { text: "Home", icon: <Home /> },
    { text: "Liked Videos", icon: <ThumbUp /> },
    { text: "Playlists", icon: <PlaylistPlay /> },
    { text: "Your Videos", icon: <VideoLibrary /> },
    { text: "Saved Videos", icon: <Bookmark /> },
    { text: "History", icon: <History /> },
  ];

  const sidebarContent = (collapsed) => (
    <List sx={{ paddingLeft: 0 }}>
      {menuItems.map((item, index) => (
        <Tooltip
          title={collapsed ? item.text : ""}
          placement="right"
          key={index}
        >
          <ListItem
            button
            onClick={() => setSelectedOption(item.text)}
            sx={{
              marginBottom: 2,
              borderRadius: "50px",
              backgroundColor: selectedOption === item.text ? "#007BFF" : "transparent",
              color: selectedOption === item.text ? "#FFFFFF" : "#007BFF",
              "&:hover": {
                backgroundColor: "#CCE7FF",
                color: "#007BFF",
              },
              padding: collapsed ? "8px" : "12px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "padding 0.3s ease",
              alignItems: "center",
              marginLeft: 0, // Ensure no space on the left side
            }}
          >
            <ListItemIcon
              sx={{
                color: selectedOption === item.text ? "#FFFFFF" : "#007BFF",
                justifyContent: "center",
                minWidth: collapsed ? "40px" : "45px",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.text}
                sx={{cursor:"default"}}
                primaryTypographyProps={{
                  fontFamily: "Velyra",
                  fontWeight: selectedOption === item.text ? "bold" : "normal",
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      ))}
    </List>
  );

  return (
    <>
      {/* Persistent Sidebar for Larger Devices */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: {
            md: isCollapsed ? "80px" : "280px",
            lg: isCollapsed ? "80px" : "320px",
            xl: isCollapsed ? "80px" : "350px",
          },
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          transition: "width 0.3s ease",
          height: "100vh",
          borderRadius: 2,
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: isCollapsed ? "center" : "flex-end",
            padding: "8px",
            alignItems: "center",
            height: "64px",
          }}
        >
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
          }}
        >
          {sidebarContent(isCollapsed)}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isCollapsed}
        onClose={toggleSidebar}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "280px",
            boxSizing: "border-box",
            paddingLeft: 0, // Ensure no space on the left side
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#007BFF", fontWeight: "bold" }}>
              Vidwave
            </Typography>
            <IconButton onClick={toggleSidebar}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
            }}
          >
            {sidebarContent(false)} {/* Always show text in mobile drawer */}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
