import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import DashboardSidebar from "./DashboardSidebar";
import { Route, Routes, useLocation } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Dashboard");

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileDrawer = () => setSidebarOpen(!isSidebarOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <DashboardSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        isMobileOpen={isSidebarOpen}
        toggleMobileDrawer={toggleMobileDrawer}
      />

      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          marginLeft: { xs: 0, sm: 0, md: isCollapsed ? "80px" : "280px" },
          transition: "margin 0.3s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
