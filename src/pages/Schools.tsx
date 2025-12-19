import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import { schoolsData } from "../utilities/schoolsData";
import type { School } from "../utilities/schoolsData";
import { MoreActionsIcon } from "../components/icons/CommonIcons";
import AddSchoolDrawer, { type SchoolFormData } from "../components/drawers/AddSchoolDrawer";
import SchoolDetailView from "../components/drawers/SchoolDetailView";
import schoolLogo from "../assets/images/delhi-public-school.png";

const Schools: React.FC = () => {
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState("All Schools");
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [isAddSchoolDrawerOpen, setIsAddSchoolDrawerOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setFilterAnchor(null);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleAddSchool = () => {
    setIsAddSchoolDrawerOpen(true);
  };

  const handleCloseAddSchoolDrawer = () => {
    setIsAddSchoolDrawerOpen(false);
  };

  const handleSubmitSchool = (data: SchoolFormData) => {
    // Handle form submission
    console.log("School data:", data);
    // You can add API call here to save the school data
  };

  const handleSchoolClick = (school: School) => {
    setSelectedSchool(school);
  };

  const handleBackToList = () => {
    setSelectedSchool(null);
  };

  // If a school is selected, show the detail view
  if (selectedSchool) {
    return <SchoolDetailView school={selectedSchool} onBack={handleBackToList} />;
  }

  return (
    <Box>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "15px" }}
      >
        <Typography variant="sb20">Schools</Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Filter Dropdown */}
          <Button
            variant="outlined"
            onClick={handleFilterOpen}
            endIcon={<KeyboardArrowDown />}
            sx={{
              borderColor: "#121318",
              color: "#121318",
              "&:hover": {
                borderColor: "#121318",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            {selectedFilter}
          </Button>

          {/* Add School Button */}
          <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: "20px" }} />}
            onClick={handleAddSchool}
          >
            Add Schools
          </Button>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                marginTop: "8px",
                borderRadius: "8px",
                minWidth: "180px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem
              onClick={() => handleFilterSelect("All Schools")}
              selected={selectedFilter === "All Schools"}
            >
              <Typography variant="r14">All Schools</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect("Active Schools")}
              selected={selectedFilter === "Active Schools"}
            >
              <Typography variant="r14">Delhi Public Schools</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterSelect("Inactive Schools")}
              selected={selectedFilter === "Inactive Schools"}
            >
              <Typography variant="r14">Mumbai Public Schools</Typography>
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>

      {/* Table Section */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid #CFCDCD4D",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 30px 0px #0000000F",
          padding: "20px",

        }}
      >
        <Table>
          <TableHead>
            <TableRow
            >
              <TableCell>School Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Admin Name</TableCell>
              <TableCell>Total Bundles</TableCell>
              <TableCell>Created on</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schoolsData.map((school: School) => (
              <TableRow
                key={school.id}
                onClick={() => handleSchoolClick(school)}
                sx={{
                  cursor: "pointer",
                  // "&:hover": {
                  //   backgroundColor: "#F9FAFB",
                  // },
                }}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <img
                      style={{ width: "40px", height: "45px", }}
                      src={school.logo || schoolLogo}
                      alt={school.schoolName}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <Typography>{school.schoolName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography>{school.branch}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{school.adminName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{school.totalBundles}</Typography>
                </TableCell>
                <TableCell>
                  <Typography >{school.createdOn}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={school.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        school.status === "Active" ? "#D5F8E7" : "#FFF0EE",
                      color: school.status === "Active" ? "#17B168" : "#EB291B",
                      fontWeight: 500,
                      fontSize: "14px",
                      borderRadius: "12px",
                      "& .MuiChip-label": {
                        padding: "6px 10px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    onClick={handleActionMenuOpen}
                    sx={{
                      color: "#121318",
                      padding: "4px",
                      "&:focus": {
                        outline: "none !important",
                      },
                    }}
                  >
                    <MoreActionsIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            marginTop: "8px",
            borderRadius: "8px",
            minWidth: "160px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14" sx={{ color: "#E24600" }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      {/* Add School Drawer */}
      <AddSchoolDrawer
        open={isAddSchoolDrawerOpen}
        onClose={handleCloseAddSchoolDrawer}
        onSubmit={handleSubmitSchool}
      />
    </Box>
  );
};

export default Schools;
