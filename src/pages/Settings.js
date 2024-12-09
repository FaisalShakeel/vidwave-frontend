import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Input,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/system";
import DashboardLayout from "../components/DashboardLayout";

const StyledInput = styled(Input)(({ theme }) => ({
  fontFamily: "Velyra",
  borderBottom: "2px solid #007BFF",
  marginBottom: "1rem",
  width: "100%",
}));

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Settings updated!", { emailNotifications, smsNotifications });
  };

  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const toggleSmsNotifications = () => {
    setSmsNotifications(!smsNotifications);
  };

  return (
    <DashboardLayout>
    <Box
      sx={{
        backgroundColor: "#F9F9F9",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Velyra",
          marginBottom: "2rem",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        Settings
      </Typography>
      <form onSubmit={handleFormSubmit}>
        {/* Profile Information Section */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Velyra",
            color: "#555",
            marginBottom: "1rem",
          }}
        >
          Profile Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledInput
              placeholder="First Name"
              disableUnderline
              defaultValue="John"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              placeholder="Last Name"
              disableUnderline
              defaultValue="Doe"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              placeholder="Email Address"
              disableUnderline
              defaultValue="johndoe@example.com"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              placeholder="Phone Number"
              disableUnderline
              defaultValue="+123456789"
            />
          </Grid>
        </Grid>

        {/* Change Password Section */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Velyra",
            color: "#555",
            marginTop: "2rem",
            marginBottom: "1rem",
          }}
        >
          Change Password
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledInput
              placeholder="Current Password"
              type="password"
              disableUnderline
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              placeholder="New Password"
              type="password"
              disableUnderline
            />
          </Grid>
        </Grid>

        {/* Notification Preferences Section */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Velyra",
            color: "#555",
            marginTop: "2rem",
            marginBottom: "1rem",
          }}
        >
          Notification Preferences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={emailNotifications}
                  onChange={toggleEmailNotifications}
                  color="primary"
                />
              }
              label="Receive Email Notifications"
              sx={{ fontFamily: "Velyra", marginBottom: "1rem" }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={smsNotifications}
                  onChange={toggleSmsNotifications}
                  color="primary"
                />
              }
              label="Receive SMS Notifications"
              sx={{ fontFamily: "Velyra", marginBottom: "1rem" }}
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            marginTop: "2rem",
            fontFamily: "Velyra",
            padding: "0.5rem 2rem",
            backgroundColor: "#007BFF",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Save Changes
        </Button>
      </form>
    </Box>
    </DashboardLayout>
  );
};

export default Settings;
