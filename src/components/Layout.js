import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Home");

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f9ff" }}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      {/* Main Content */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column",
          ml: { 
            xs: 0,  // For small screens, no margin left
            md: isSidebarCollapsed ? "80px" : "280px",
            lg: isSidebarCollapsed ? "80px" : "320px",
            xl: isSidebarCollapsed ? "80px" : "350px"
          },
          mr: { 
            xs: 0,  // No right margin on smaller screens
            lg: "20px",  // Add some space on the right side for large devices
            xl: "30px"   // More space on extra-large devices
          },
          transition: "margin-left 0.3s ease",
          overflowY: "auto",  // Ensure the content can scroll vertically
          overflowX: "hidden",  // Hide horizontal scrollbar
          minHeight: "100vh",  // Ensure the content can grow beyond the screen height
          width: "100%"  // Make sure the content width spans the full width
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 0, md: 3 }, // No padding on smaller devices
            overflowY: "auto", 
            width: "100%" // Ensure it takes full width on smaller screens
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
