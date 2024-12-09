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
            xs: 0,
            md: isSidebarCollapsed ? "80px" : "280px",
            lg: isSidebarCollapsed ? "80px" : "320px",
            xl: isSidebarCollapsed ? "80px" : "350px"
          },
          transition: "margin-left 0.3s ease",
          overflowY: "auto",  // Ensure the content can scroll
          height: "100vh",
          overflowX:"hidden"
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto",overflowX:"hidden" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
