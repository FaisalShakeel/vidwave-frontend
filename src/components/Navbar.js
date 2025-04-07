import React from "react";
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
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
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
import { useAuth } from "../contexts/AuthContext"; // Import the useAuth hook

const Navbar = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const { isAuthenticated, decodedUser, logout } = useAuth(); // Use AuthContext
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    navigate("/login");
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        zIndex: 1200,
        padding: { xs: "0 8px", sm: "0 16px" },
        borderRadius: 0,
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: 60, sm: 70, md: 80 },
          padding: { xs: "0 4px", sm: "0 8px", md: "0 16px" },
        }}
      >
        <IconButton
          edge="start"
          color="primary"
          onClick={toggleSidebar}
          sx={{
            marginRight: { xs: 0.5, sm: 1 },
            padding: { xs: 0.5, sm: 0.75 },
            display: { md: "none" },
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
        </IconButton>

        {!isXsScreen && (
          <Typography
            variant="h5"
            sx={{
              color: "#007BFF",
              fontWeight: "bold",
              fontFamily: "Velyra, sans-serif",
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              flexGrow: { xs: 0, md: 0 },
              display: { xs: "flex", md: "flex" },
              marginRight: { xs: 1, sm: 2 },
            }}
          >
            Vidwave
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f5f8ff",
            borderRadius: 50,
            flexGrow: 1,
            maxWidth: { xs: "70%", sm: "50%", md: "40%" },
            height: { xs: 32, sm: 36, md: 40 },
            padding: { xs: "2px 4px", sm: "4px 8px" },
            border: "1px solid #e0e7ff",
          }}
        >
          <InputBase
            value={searchQuery}
            placeholder="Search…"
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              display: "flex",
              fontFamily: "Velyra, sans-serif",
              color: "#333",
              flexGrow: 1,
              borderRadius: "50px",
              px: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
            }}
          />
          <IconButton
            onClick={() => navigate(`/search/?query=${searchQuery}`)}
            color="primary"
            size={isXsScreen ? "small" : "medium"}
            sx={{ padding: { xs: 0.5, sm: 0.75 } }}
          >
            <Search sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1, md: 2 } }}>
          {isAuthenticated && (
            <>
              <IconButton
                onClick={() => navigate("/notifications")}
                color="primary"
                size={isXsScreen ? "small" : "medium"}
                sx={{ padding: { xs: 0.5, sm: 0.75 } }}
              >
                <Notifications sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }} />
              </IconButton>

              <IconButton
                onClick={() => navigate("/studio/upload-video")}
                color="primary"
                size={isXsScreen ? "small" : "medium"}
                sx={{ padding: { xs: 0.5, sm: 0.75 } }}
              >
                <Add sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }} />
              </IconButton>
            </>
          )}

          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  padding: { xs: 0.5, sm: 0.75 },
                  transition: "all 0.2s ease",
                }}
              >
                <Avatar
                  src={decodedUser?.profilePhotoUrl || "https://via.placeholder.com/40"}
                  alt="Profile"
                  sx={{
                    width: isXsScreen ? 32 : 40,
                    height: isXsScreen ? 32 : 40,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                disableScrollLock
                sx={{
                  mt: 1.5,
                  "& .MuiPaper-root": {
                    borderRadius: "20px",
                    background: "#ffffff",
                    border: "1px solid #e0e7ff",
                    minWidth: { xs: "260px", sm: "300px" },
                    padding: 0,
                    boxShadow: "0 8px 32px rgba(0, 123, 255, 0.15)",
                    overflow: "visible",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: -8,
                      right: 18,
                      width: 16,
                      height: 16,
                      backgroundColor: "#ffffff",
                      transform: "rotate(45deg)",
                      borderLeft: "1px solid #e0e7ff",
                      borderTop: "1px solid #e0e7ff",
                    },
                  },
                  "& .MuiList-root": {
                    padding: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #007BFF 0%, #007BFF 100%)",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    padding: { xs: "20px 24px", sm: "24px 28px" },
                    position: "relative",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    overflow: "hidden",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Avatar
                    src={decodedUser?.profilePhotoUrl || "https://via.placeholder.com/80"}
                    alt="Profile"
                    sx={{
                      width: { xs: 70, sm: 80 },
                      height: { xs: 70, sm: 80 },
                      border: "4px solid rgba(255, 255, 255, 0.9)",
                      marginBottom: 1.5,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                      fontWeight: 700,
                      fontFamily: "Velyra, sans-serif",
                      letterSpacing: "0.5px",
                      mb: 0.5,
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {decodedUser?.name || "User"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Velyra, sans-serif",
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      opacity: 0.9,
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    {decodedUser?.EMailAddress || "user@example.com"}
                  </Typography>
                </Box>

                <Box sx={{ padding: "16px 0", background: "#ffffff" }}>
                  <MenuItem
                    onClick={() => {
                      navigate(`/profile/${decodedUser?.id}`);
                      handleMenuClose();
                    }}
                    sx={{
                      fontFamily: "Velyra, sans-serif",
                      color: "#007BFF",
                      padding: { xs: "12px 24px", sm: "14px 28px" },
                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                      "&:hover": {
                        background: "#F0F7FF",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: "36px", sm: "40px" },
                        color: "inherit",
                      }}
                    >
                      <AccountCircle sx={{ fontSize: { xs: "1.3rem", sm: "1.4rem" } }} />
                    </ListItemIcon>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 600, fontFamily: "Velyra" }}>
                        My Profile
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          color: "#668CFF",
                        }}
                      >
                        View and edit your profile
                      </Typography>
                    </Box>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      navigate("/studio/dashboard");
                      handleMenuClose();
                    }}
                    sx={{
                      fontFamily: "Velyra, sans-serif",
                      color: "#007BFF",
                      padding: { xs: "12px 24px", sm: "14px 28px" },
                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                      "&:hover": {
                        background: "#F0F7FF",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: "36px", sm: "40px" },
                        color: "inherit",
                      }}
                    >
                      <VideoLibrary sx={{ fontSize: { xs: "1.3rem", sm: "1.4rem" } }} />
                    </ListItemIcon>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 600, fontFamily: "Velyra" }}>
                        Creator Studio
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          color: "#668CFF",
                        }}
                      >
                        Manage your content
                      </Typography>
                    </Box>
                  </MenuItem>

                  <Divider sx={{ margin: "8px 16px", borderColor: "#E0E7FF" }} />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      fontFamily: "Velyra, sans-serif",
                      color: "#FF3333",
                      padding: { xs: "12px 24px", sm: "14px 28px" },
                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                      "&:hover": {
                        background: "#FFF0F0",
                        color: "#CC0000",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: "36px", sm: "40px" },
                        color: "inherit",
                      }}
                    >
                      <Logout sx={{ fontSize: { xs: "1.3rem", sm: "1.4rem" } }} />
                    </ListItemIcon>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 600, fontFamily: "Velyra" }}>
                        Sign Out
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Velyra",
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          color: "#FF6666",
                        }}
                      >
                        Logout from your account
                      </Typography>
                    </Box>
                  </MenuItem>
                </Box>
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
                padding: { xs: "4px 12px", sm: "6px 20px" },
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "0.95rem" },
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