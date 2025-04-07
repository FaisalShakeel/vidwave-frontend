import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
    
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [decodedUser, setDecodedUser] = useState(null);

  // Check authentication status on mount and when token changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            // Token expired
            setIsAuthenticated(false);
            setDecodedUser(null);
            localStorage.removeItem("token");
          } else {
            // Token valid
            setDecodedUser(decodedToken);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error("Error decoding token:", e);
          setIsAuthenticated(false);
          setDecodedUser(null);
          localStorage.removeItem("token");
        }
      } else {
        setIsAuthenticated(false);
        setDecodedUser(null);
      }
    };

    // Initial check
    checkAuthStatus();

    // Optional: Add an event listener for storage changes (e.g., if token is updated in another tab)
    window.addEventListener("storage", checkAuthStatus);

    // Cleanup listener
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []); // Empty dependency array ensures this runs only on mount

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setDecodedUser(null);
  };

  // Function to handle login (you can call this when a user logs in)
  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decodedToken = jwtDecode(token);
      setDecodedUser(decodedToken);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Error decoding token on login:", e);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setDecodedUser(null);
    }
  };

  // Value provided to the context consumers
  const value = {
    isAuthenticated,
    decodedUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};