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
import { MoreActionsIcon } from "../components/icons/CommonIcons";
import { getSchoolList, deleteSchool } from "../api/school";
import type { School } from "../api/school";
import AddSchoolDrawer, { type SchoolFormData } from "../components/drawers/AddSchoolDrawer";
import EditSchoolDrawer from "../components/drawers/EditSchoolDrawer";
import SchoolDetailView from "../components/drawers/SchoolDetailView";
// Unused import schoolLogo removed
import { notifyError, notifySuccess } from "../utils/toastUtils";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import { format } from "date-fns";

const Schools: React.FC = () => {
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<{ id: string | number; name: string }>({
    id: "all",
    name: "All Schools",
  });
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [isAddSchoolDrawerOpen, setIsAddSchoolDrawerOpen] = useState(false);
  const [isEditSchoolDrawerOpen, setIsEditSchoolDrawerOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolToEdit, setSchoolToEdit] = useState<School | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Separate state for the school activated via correct action menu
  const [activeMenuSchool, setActiveMenuSchool] = useState<School | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch schools on component mount
  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const data = await getSchoolList();
        setSchools(data.rows);
      } catch (error) {
        notifyError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterSelect = (id: string | number, name: string) => {
    setSelectedFilter({ id, name });
    setFilterAnchor(null);
  };

  const displaySchools = React.useMemo(() => {
    return selectedFilter.id === "all"
      ? schools
      : schools.filter((school) => school.school_id === Number(selectedFilter.id));
  }, [schools, selectedFilter]);

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, school: School) => {
    event.stopPropagation(); // Stop row click
    setActionMenuAnchor(event.currentTarget);
    setActiveMenuSchool(school);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActiveMenuSchool(null);
  };

  const handleEditSchool = () => {
    if (activeMenuSchool) {
      setSchoolToEdit(activeMenuSchool);
      setIsEditSchoolDrawerOpen(true);
    }
    handleActionMenuClose();
  };

  const handleCloseEditSchoolDrawer = () => {
    setIsEditSchoolDrawerOpen(false);
    setSchoolToEdit(null);
  };

  const handleDeleteClick = () => {
    if (activeMenuSchool) {
      setSchoolToDelete(activeMenuSchool);
      setIsDeleteModalOpen(true);
    }
    handleActionMenuClose();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSchoolToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (schoolToDelete) {
      try {
        setIsDeleting(true);
        await deleteSchool(schoolToDelete.school_id);
        notifySuccess("School deleted successfully");
        handleCloseDeleteModal();
        refreshSchools();
      } catch (error) {
        notifyError(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const refreshSchools = async () => {
    try {
      setLoading(true);
      const data = await getSchoolList();
      setSchools(data.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
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
    refreshSchools();
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
            {selectedFilter.name}
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
              onClick={() => handleFilterSelect("all", "All Schools")}
              selected={selectedFilter.id === "all"}
            >
              <Typography variant="r14">All Schools</Typography>
            </MenuItem>
            {schools.map((school) => (
              <MenuItem
                key={school.school_id}
                onClick={() => handleFilterSelect(school.school_id, school.name)}
                selected={selectedFilter.id === school.school_id}
              >
                <Typography variant="r14">{school.name}</Typography>
              </MenuItem>
            ))}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              displaySchools.map((school: School) => (
                <TableRow
                  key={school.school_id}
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
                        src={school.image}
                        // alt={school.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      <Typography>{school.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography>{school.branch}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{school.school_admin_name || "-"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{school.total_bundles}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography >{format(new Date(school.createdAt), "dd MMM yyyy")}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={school.is_active ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        backgroundColor:
                          school.is_active ? "#D5F8E7" : "#FFF0EE",
                        color: school.is_active ? "#17B168" : "#EB291B",
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
                      onClick={(e) => handleActionMenuOpen(e, school)}
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
              ))
            )}
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
        {/* <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14">View Details</Typography>
        </MenuItem> */}
        <MenuItem onClick={handleEditSchool}>
          <Typography variant="r14">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
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

      <EditSchoolDrawer
        open={isEditSchoolDrawerOpen}
        onClose={handleCloseEditSchoolDrawer}
        school={schoolToEdit}
        onSubmit={refreshSchools}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete School"
        description={`Are you sure you want to delete ${schoolToDelete?.name}? This action cannot be undone.`}
        loading={isDeleting}
      />
    </Box>
  );
};

export default Schools;
