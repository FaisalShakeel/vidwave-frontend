import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";

const Uploads = () => {
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

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Views</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontFamily: "Velyra", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
        </TableBody>
      </Table>
    </Box>
    </DashboardLayout>
  );
};

export default Uploads;
