import React, { useState, useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Dashboard");

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileDrawer = () => setSidebarOpen(!isSidebarOpen);

  // Suppress ResizeObserver error
  useEffect(() => {
    const observerErrorHandler = (error) => {
      if (
        error.message &&
        error.message.includes("ResizeObserver loop limit exceeded")
      ) {
        error.preventDefault();
      }
    };
    window.addEventListener("error", observerErrorHandler);

    return () => {
      window.removeEventListener("error", observerErrorHandler);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh", // Ensures the layout always fills the screen height
        overflow: "hidden", // Prevent scrollbars triggering ResizeObserver
      }}
    >
      <CssBaseline />

      <DashboardSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        isMobileOpen={isSidebarOpen}
        toggleMobileDrawer={toggleMobileDrawer}
      />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          marginLeft: isCollapsed ? { xs: "0", md: "80px" } : { xs: "0", md: "280px" },
          transition: "margin 0.3s ease",
          overflow: "hidden", // Prevent layout shifting
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
