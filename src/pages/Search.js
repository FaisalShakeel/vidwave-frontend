import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Button, Input, MenuItem, Select, Avatar } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import Layout from "../components/Layout";

const Search = ({ query = "" }) => {
  const [activeTab, setActiveTab] = useState(0); // 0: Videos, 1: People
  const [searchQuery, setSearchQuery] = useState(query);
  const [filters, setFilters] = useState({ date: "", views: "", likes: "", comments: "", subscribers: "" });
  const [results, setResults] = useState([]); // Simulating search results

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFilters({}); // Reset filters when switching tabs
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderFilters = () => {
    if (activeTab === 0) {
      // Video Filters
      return (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Select
            value={filters.date || ""}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>Filter by Date</MenuItem>
            <MenuItem value="24 hours" sx={{ fontFamily: "Velyra" }}>Last 24 Hours</MenuItem>
            <MenuItem value="7 days" sx={{ fontFamily: "Velyra" }}>Last Week</MenuItem>
            <MenuItem value="30 days" sx={{ fontFamily: "Velyra" }}>Last 30 Days</MenuItem>
            <MenuItem value="all time" sx={{ fontFamily: "Velyra" }}>All Time</MenuItem>
          </Select>
          <Select
            value={filters.views || ""}
            onChange={(e) => handleFilterChange("views", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>Filter by Views</MenuItem>
            <MenuItem value="high" sx={{ fontFamily: "Velyra" }}>Most Views</MenuItem>
            <MenuItem value="low" sx={{ fontFamily: "Velyra" }}>Least Views</MenuItem>
          </Select>
          <Select
            value={filters.likes || ""}
            onChange={(e) => handleFilterChange("likes", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>Filter by Likes</MenuItem>
            <MenuItem value="high" sx={{ fontFamily: "Velyra" }}>Most Likes</MenuItem>
            <MenuItem value="low" sx={{ fontFamily: "Velyra" }}>Least Likes</MenuItem>
          </Select>
        </Box>
      );
    } else {
      // People Filters
      return (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Select
            value={filters.subscribers || ""}
            onChange={(e) => handleFilterChange("subscribers", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>Filter by Subscribers</MenuItem>
            <MenuItem value="low to high" sx={{ fontFamily: "Velyra" }}>Lowest to Highest</MenuItem>
            <MenuItem value="high to low" sx={{ fontFamily: "Velyra" }}>Highest to Lowest</MenuItem>
          </Select>
        </Box>
      );
    }
  };

  const renderResults = () => {
    if (!searchQuery) {
      return <Typography sx={{ fontFamily: "Velyra" }}>No Results Found</Typography>;
    }

    if (activeTab === 0) {
      return results.length > 0 ? (
        results.map((video, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mt: 2 }}>
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: "120px", borderRadius: "8px" }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {video.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {video.views} views
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography sx={{ fontFamily: "Velyra" }}>No Videos Found</Typography>
      );
    } else {
      return results.length > 0 ? (
        results.map((person, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
            <Avatar src={person.avatar} alt={person.name} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {person.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {person.subscribers} subscribers
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography sx={{ fontFamily: "Velyra" }}>No People Found</Typography>
      );
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 2, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          sx={{ fontFamily: "Velyra", color: "#007BFF", mb: 2 }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>

        {/* Search Input */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <SearchIcon sx={{ color: "#ccc" }} />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            fullWidth
            disableUnderline
            sx={{
              fontFamily: "Velyra",
              borderBottom: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 2, "& .MuiTab-root": { fontFamily: "Velyra", fontWeight: "bold" } }}
        >
          <Tab label="Videos" />
          <Tab label="People" />
        </Tabs>

        {/* Filters */}
        {renderFilters()}

        {/* Results */}
        <Box sx={{ mt: 4 }}>{renderResults()}</Box>
      </Box>
    </Layout>
  );
};

export default Search;
