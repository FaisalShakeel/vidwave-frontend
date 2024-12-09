import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Drawer,
  Typography
} from "@mui/material";
import { Home, CloudUpload, Analytics, Settings, Menu as MenuIcon, Close } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom"; // For routing

const DashboardSidebar = ({ isCollapsed, toggleSidebar, selectedOption, setSelectedOption, isMobileOpen, toggleMobileDrawer }) => {
  const location = useLocation(); // Tracks the current route

  const menuItems = [
    { text: "Dashboard", icon: <Home />, route: "/studio/dashboard" },
    { text: "Uploads", icon: <CloudUpload />, route: "/studio/uploads" },
    { text: "Analytics", icon: <Analytics />, route: "/studio/analytics" },
    { text: "Settings", icon: <Settings />, route: "/studio/settings" },
  ];

  // Logic to handle selected option based on current route
  const getSelectedOption = () => {
    if (location.pathname === "/studio/upload-video") {
      return "Uploads"; // Handle special case for /studio/upload-video
    }
    const selectedItem = menuItems.find((item) => location.pathname.startsWith(item.route));
    return selectedItem ? selectedItem.text : "";
  };

  const currentSelectedOption = getSelectedOption();

  const sidebarContent = (collapsed) => (
    <List sx={{ paddingLeft: 0 }}>
      {menuItems.map((item, index) => (
        <Tooltip title={collapsed ? item.text : ""} placement="right" key={index}>
          <ListItem
            button
            component={Link} // Use Link to navigate between routes
            to={item.route}
            onClick={() => setSelectedOption(item.text)}
            sx={{
              marginBottom: 2,
              borderRadius: "50px",
              backgroundColor: currentSelectedOption === item.text ? "#007BFF" : "transparent",
              color: currentSelectedOption === item.text ? "#FFFFFF" : "#007BFF",
              "&:hover": {
                backgroundColor: "#CCE7FF",
                color: "#007BFF",
              },
              padding: collapsed ? "8px" : "12px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "padding 0.3s ease",
              alignItems: "center",
            }}
          >
            <ListItemIcon
              sx={{
                color: currentSelectedOption === item.text ? "#FFFFFF" : "#007BFF",
                justifyContent: "center",
                minWidth: collapsed ? "40px" : "45px",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.text}
                sx={{ cursor: "default" }}
                primaryTypographyProps={{
                  fontFamily: "Velyra",
                  fontWeight: currentSelectedOption === item.text ? "bold" : "normal",
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
          width: isCollapsed ? "80px" : "280px",
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

      {/* Drawer for Small Devices */}
      <Drawer
        anchor="left"
        open={isMobileOpen}
        onClose={toggleMobileDrawer}
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "280px",
            boxSizing: "border-box",
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
            <IconButton onClick={toggleMobileDrawer}>
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

      {/* Toggle Icon for XS and SM */}
      <IconButton
        sx={{
          display: { xs: isMobileOpen ? "none" : "block", sm: isMobileOpen ? "none" : "block", md: "none" },
          position: "absolute", // Absolute positioning
          top: "16px",
          left: "16px",
          zIndex: 1300,
          backgroundColor: "transparent", // No background color
          color: "#000000", // Icon color black
          "&:hover": {
            backgroundColor: "transparent", // No hover effect
          },
        }}
        onClick={toggleMobileDrawer}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default DashboardSidebar;
