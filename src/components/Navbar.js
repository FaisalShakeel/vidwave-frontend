import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
  Button,
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
  const navigate = useNavigate();
  const [decodedUser, setDecodedUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("token");
  const { searchQuery, setSearchQuery } = useSearchQuery();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        } else {
          setDecodedUser(decodedToken);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Error while decoding the user");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        zIndex: 1200,
        padding: { xs: "0 10px", sm: "0 20px" },
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 80 }}>
        <IconButton
          edge="start"
          color="primary"
          onClick={toggleSidebar}
          sx={{ marginRight: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

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
          <InputBase
            value={searchQuery}
            placeholder="Search…"
            onChange={(e) => {
              setSearchQuery(e.target.value);
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
          <IconButton
            onClick={() => {
              navigate(`/search/?query=${searchQuery}`);
            }}
            color="primary"
          >
            <Search />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated && (
            <>
              <IconButton
                onClick={() => {
                  navigate("/notifications");
                }}
                color="primary"
              >
                <Notifications />
              </IconButton>

              <IconButton
                onClick={() => {
                  navigate("/studio/upload-video");
                }}
                color="primary"
              >
                <Add />
              </IconButton>
            </>
          )}

          {isAuthenticated ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <img
                  height={40}
                  width={40}
                  src={
                    decodedUser?.profilePhotoUrl ||
                    "https://via.placeholder.com/40"
                  }
                  alt="Profile"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                  mt: 1,
                  "& .MuiPaper-root": {
                    borderRadius: "16px",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    background: "linear-gradient(145deg, #f9fafb 0%, #f1f3f9 100%)",
                    border: "1px solid rgba(0,123,255,0.1)",
                    minWidth: "260px",
                    padding: "12px 0",
                    overflow: "visible",
                  },
                }}
              >
                {/* User Info Header */}
                <Box 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    marginBottom: '8px',
                  }}
                >
                  <img
                    height={56}
                    width={56}
                    src={
                      decodedUser?.profilePhotoUrl ||
                      "https://via.placeholder.com/56"
                    }
                    alt="Profile"
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: '16px',
                    }}
                  />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '18px', 
                        fontWeight: 600, 
                        color: '#007BFF',
                        fontFamily: "Velyra, sans-serif",
                      }}
                    >
                      {decodedUser?.name || 'User'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6B7280', 
                        fontFamily: "Velyra, sans-serif",
                      }}
                    >
                      {decodedUser?.email || 'user@example.com'}
                    </Typography>
                  </Box>
                </Box>

                <MenuItem
                  onClick={() => {
                    navigate(`/profile/${decodedUser?.id}`);
                    handleMenuClose();
                  }}
                  sx={{
                    fontFamily: "Velyra, sans-serif",
                    color: "#007BFF",
                    padding: "12px 20px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(0,123,255,0.05)",
                      color: "#0056b3",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "40px",
                      color: "#007BFF",
                    }}
                  >
                    <AccountCircle />
                  </ListItemIcon>
                  My Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/studio/dashboard");
                    handleMenuClose();
                  }}
                  sx={{
                    fontFamily: "Velyra, sans-serif",
                    color: "#007BFF",
                    padding: "12px 20px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(0,123,255,0.05)",
                      color: "#0056b3",
                    },
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
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                    handleMenuClose();
                  }}
                  sx={{
                    fontFamily: "Velyra, sans-serif",
                    color: "#FF3D00",
                    padding: "12px 20px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255,61,0,0.05)",
                      color: "#d32f2f",
                    },
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
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: "#007BFF",
                borderRadius: "20px",
                textTransform: "none",
                fontFamily: "Velyra, sans-serif",
                padding: "6px 20px",
                "&:hover": {
                  backgroundColor: "#0066CC",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;