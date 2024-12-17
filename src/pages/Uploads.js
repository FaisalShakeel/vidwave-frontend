import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,Button, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";

const Uploads = () => {
  const navigate=useNavigate()
  const uploads = [
    { title: "React Basics", views: "1,234", date: "2024-01-01" },
    { title: "MUI Components", views: "987", date: "2024-01-15" },
    { title: "Firebase Integration", views: "765", date: "2024-02-01" },
  ];

  return (
    <DashboardLayout>
    <Box>
      <Typography variant="h4" sx={{ fontFamily: "Velyra", fontWeight: "bold", mb: 3 }}>
        My Uploads
      </Typography>
      <Box sx={{display:"flex",flexDirection:"row",justifyContent:"end"}}>
      <Button
      onClick={()=>{
        navigate("/studio/upload-video")
      }}
      variant="contained"
      startIcon={<CloudUploadIcon />}
      sx={{
        backgroundColor: "#007BFF", // Blue background
        color: "#FFFFFF", // White text
        
        borderRadius: "50px", // Rounded corners
        textTransform: "none", // Disable uppercase text
        padding: "10px 24px", // Padding for a better look
        fontWeight: "bold", // Bold text
        boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)", // Subtle shadow
        "&:hover": {
          backgroundColor: "#0056b3", // Darker blue on hover
          boxShadow: "0px 6px 12px rgba(0, 86, 179, 0.4)", // Slightly enhanced shadow
        },
      }}
    >
      Upload
    </Button>
    </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Views</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        {/* <TableBody>
          {uploads.map((upload, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontFamily: "Velyra" }}>{upload.title}</TableCell>
              <TableCell sx={{ fontFamily: "Velyra" }}>{upload.views}</TableCell>
              <TableCell sx={{ fontFamily: "Velyra" }}>{upload.date}</TableCell>
              <TableCell>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
                <IconButton color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody> */}
      </Table>
    </Box>
    </DashboardLayout>
  );
};

export default Uploads;
