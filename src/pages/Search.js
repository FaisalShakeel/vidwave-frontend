import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Input,
  MenuItem,
  Select,
  Avatar,
  IconButton,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "../components/Layout";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSearchQuery } from "../contexts/SearchQueryContext";
import ErrorDisplay from "../components/ErrorDisplay";

const Search = () => {
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const [activeTab, setActiveTab] = useState(0); // 0: Videos, 1: People
  

  const [filters, setFilters] = useState({ date: "", views: "", likes: "", subscribers: "" });
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Start as false, only true during fetch
  const [error, setError] = useState(null); // Add error state
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFilters({}); // Reset filters when switching tabs
    setResults([]);
    setCurrentPage(1);
    setError(null); // Clear error when switching tabs
    if (searchQuery) handleSearch(); // Trigger search if query exists
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleSearch = async () => {
    if (!searchQuery) return; // Don't search if query is empty
    setLoading(true);
    setError(null); // Reset error before new request
    try {
      const response = await axios.post("http://localhost:5000/videos/search", {
        query: searchQuery,
        filters,
        tab: activeTab,
        page: currentPage,
        limit: 5, // 5 records per page
      });
      setResults(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setError(errorMessage || "An error occurred while fetching search results.");
    
      setResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debouncedQuery after delay
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Cleanup timeout when searchQuery changes
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      navigate(`/search/?query=${debouncedQuery}`);
    }
  }, [debouncedQuery, navigate]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [currentPage, filters]);

  const renderFilters = () => {
    if (activeTab === 0) {
      // Video Filters
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: { xs: "center", sm: "center", md: "start" },
            alignItems: { xs: "center", sm: "center", md: "start" },
            gap: 2,
            mt: 2,
          }}
        >
          <Select
            value={filters.date || ""}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>
              Filter by Date
            </MenuItem>
            <MenuItem value="24 hours" sx={{ fontFamily: "Velyra" }}>
              Last 24 Hours
            </MenuItem>
            <MenuItem value="7 days" sx={{ fontFamily: "Velyra" }}>
              Last Week
            </MenuItem>
            <MenuItem value="30 days" sx={{ fontFamily: "Velyra" }}>
              Last 30 Days
            </MenuItem>
            <MenuItem value="all time" sx={{ fontFamily: "Velyra" }}>
              All Time
            </MenuItem>
          </Select>
          <Select
            value={filters.views || ""}
            onChange={(e) => handleFilterChange("views", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>
              Filter by Views
            </MenuItem>
            <MenuItem value="high" sx={{ fontFamily: "Velyra" }}>
              Most Views
            </MenuItem>
            <MenuItem value="low" sx={{ fontFamily: "Velyra" }}>
              Least Views
            </MenuItem>
          </Select>
          <Select
            value={filters.likes || ""}
            onChange={(e) => handleFilterChange("likes", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>
              Filter by Likes
            </MenuItem>
            <MenuItem value="high" sx={{ fontFamily: "Velyra" }}>
              Most Likes
            </MenuItem>
            <MenuItem value="low" sx={{ fontFamily: "Velyra" }}>
              Least Likes
            </MenuItem>
          </Select>
        </Box>
      );
    } else {
      // People Filters
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            gap: 2,
            mt: 2,
          }}
        >
          <Select
            value={filters.subscribers || ""}
            onChange={(e) => handleFilterChange("subscribers", e.target.value)}
            displayEmpty
            sx={{ width: "200px", borderBottom: "1px solid #ccc", fontFamily: "Velyra" }}
          >
            <MenuItem value="" sx={{ fontFamily: "Velyra", color: "#007BFF", fontWeight: "bold" }}>
              Filter by Subscribers
            </MenuItem>
            <MenuItem value="low to high" sx={{ fontFamily: "Velyra" }}>
              Lowest to Highest
            </MenuItem>
            <MenuItem value="high to low" sx={{ fontFamily: "Velyra" }}>
              Highest to Lowest
            </MenuItem>
          </Select>
        </Box>
      );
    }
  };

  const renderResults = () => {
    if (!searchQuery) {
      return (
        <Typography sx={{ fontFamily: "Velyra", textAlign: "center", mt: 2 }}>
          Please enter a search query to see results.
        </Typography>
      );
    }

    if (error) {
      return <ErrorDisplay error={error} onRetry={handleSearch} />;
    }

    return loading ? (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 4 }}>
        <CircularProgress thickness={7} sx={{ height: "40px", width: "40px", color: "#007BFF" }} />
      </Box>
    ) : results.length > 0 ? (
      results.map((item, index) => (
        <Box
          onClick={() => {
            if (activeTab === 0) {
              navigate(`/watch/${item._id}`);
            } else {
              navigate(`/profile/${item._id}`);
            }
          }}
          key={index}
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            p: 2,
            borderRadius: "8px",
            boxShadow: 1,
            alignItems: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f5f5f5" },
            "@media (min-width: 768px)": {
              gap: 4,
              p: 3,
            },
          }}
        >
          {activeTab === 0 ? (
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              style={{
                width: "120px",
                borderRadius: "8px",
                "@media (min-width: 768px)": { width: "160px" },
              }}
            />
          ) : (
            <Avatar
              src={item.profilePhotoUrl}
              alt={item.name}
              sx={{
                width: 56,
                height: 56,
                "@media (min-width: 768px)": { width: 72, height: 72 },
              }}
            />
          )}
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontFamily: "Velyra",
                fontSize: "1rem",
                color: "#007BFF",
                "@media (min-width: 768px)": { fontSize: "1.2rem" },
              }}
            >
              {activeTab === 0 ? item.title : item.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Velyra",
                color: "textSecondary",
                fontSize: "0.9rem",
                "@media (min-width: 768px)": { fontSize: "1rem" },
              }}
            >
              {activeTab === 0
                ? `${item.viewsCount} views • ${item.likesCount} likes`
                : `${item.followersCount} subscribers`}
            </Typography>
          </Box>
        </Box>
      ))
    ) : (
      <Typography
        variant="body1"
        sx={{
          fontFamily: "Velyra",
          mt: 2,
          textAlign: "center",
        }}
      >
        No results found.
      </Typography>
    );
  };

  return (
    <Layout>
      <Box sx={{ padding: 2, maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f8f9ff" }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          sx={{ fontFamily: "Velyra", color: "#007BFF", mb: 2 }}
          onClick={() => navigate("/", { replace: true })}
        >
          Back
        </Button>
        <ToastContainer />

        {/* Search Input */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, position: "relative" }}>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            fullWidth
            disableUnderline
            sx={{
              fontFamily: "Velyra",
              borderBottom: "1px solid #ccc",
              fontSize: "16px",
              paddingRight: "40px",
              width: { xs: "100%", sm: "80%" },
              backgroundColor: "#fff",
              borderRadius: "4px",
              padding: "8px",
            }}
          />
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              const searchParams = new URLSearchParams(location.search);
              searchParams.set("query", searchQuery);
              navigate(`/search/?query=${searchQuery}`);
              handleSearch();
            }}
            sx={{
              position: "absolute",
              right: "10px",
              color: "#007BFF",
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 2,
            "& .MuiTab-root": { fontFamily: "Velyra", fontWeight: "bold", color: "#666" },
            "& .Mui-selected": { color: "#007BFF" },
            "& .MuiTabs-indicator": { backgroundColor: "#007BFF" },
          }}
        >
          <Tab label="Videos" />
          <Tab label="People" />
        </Tabs>

        {/* Filters */}
        {renderFilters()}

        {/* Results */}
        <Box sx={{ mt: 4 }}>{renderResults()}</Box>

        {/* Pagination */}
        {results.length > 0 && searchQuery && !error && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          />
        )}
      </Box>
    </Layout>
  );
};

export default Search;