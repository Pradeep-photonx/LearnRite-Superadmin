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
  Card,
  CardContent,
} from "@mui/material";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import { MoreActionsIcon } from "../components/icons/CommonIcons";
import CreateBundleDrawer from "../components/drawers/CreateBundleDrawer";
import EditBundleDrawer from "../components/drawers/EditBundleDrawer";
import BundleDetailsModal from "../components/modals/BundleDetailsModal";
import { getBundleList, type Bundle } from "../api/bundle";
import { getSchoolList, type School } from "../api/school";
import { getClassList, type Class } from "../api/class";
import { notifyError } from "../utils/toastUtils";

const SchoolBundles: React.FC = () => {
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<{ id: string | number; name: string }>({
    id: "all",
    name: "All Schools",
  });
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [isCreateBundleDrawerOpen, setIsCreateBundleDrawerOpen] = useState(false);
  const [isEditBundleDrawerOpen, setIsEditBundleDrawerOpen] = useState(false);
  const [isBundleDetailsModalOpen, setIsBundleDetailsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<(Bundle & { allProducts?: Bundle[] }) | null>(null);

  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  const fetchData = async () => {
    try {
      const [bundlesRes, schoolsRes, classesRes] = await Promise.all([
        getBundleList(),
        getSchoolList(),
        getClassList(),
      ]);
      setBundles(bundlesRes.rows);
      setSchools(schoolsRes.rows);
      setClasses(classesRes.rows);
    } catch (error) {
      notifyError(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterSelect = (schoolId: string | number, schoolName: string) => {
    setSelectedFilter({ id: schoolId, name: schoolName });
    setFilterAnchor(null);
  };

  const displayBundles = React.useMemo(() => {
    const grouped = new Map<number, Bundle & { allProducts: Bundle[] }>();

    const filtered = selectedFilter.id === "all"
      ? bundles
      : bundles.filter((bundle) => bundle.school_id === Number(selectedFilter.id));

    filtered.forEach(b => {
      if (!grouped.has(b.class_bundle_id)) {
        grouped.set(b.class_bundle_id, { ...b, allProducts: [] });
      }
      grouped.get(b.class_bundle_id)!.allProducts.push(b);
    });

    return Array.from(grouped.values()).map(gb => {
      // Aggregating total price and item count
      const totalPrice = gb.allProducts.reduce((acc, p) => acc + (Number(p.total_price) || 0), 0);
      const totalItems = gb.allProducts.length;
      return {
        ...gb,
        total_bundle_price: totalPrice,
        total_items_count: totalItems
      };
    });
  }, [bundles, selectedFilter]);

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, bundle: Bundle) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedBundle(bundle);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleCreateBundle = () => {
    setIsCreateBundleDrawerOpen(true);
  };

  const handleCloseCreateBundleDrawer = () => {
    setIsCreateBundleDrawerOpen(false);
  };

  const handleSubmitBundle = async () => {
    // Refresh the list after successful creation
    await fetchData();
  };

  const handleBundleNameClick = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setIsBundleDetailsModalOpen(true);
  };

  const handleCloseBundleDetailsModal = () => {
    setIsBundleDetailsModalOpen(false);
    setSelectedBundle(null);
  };

  const handleEditBundle = () => {
    setIsEditBundleDrawerOpen(true);
    handleActionMenuClose();
  };

  const handleCloseEditBundleDrawer = () => {
    setIsEditBundleDrawerOpen(false);
    setSelectedBundle(null);
  };

  const getSchoolName = (schoolId: number): string => {
    return schools.find((s) => s.school_id === schoolId)?.name || "N/A";
  };

  const getClassName = (classId: number): string => {
    return classes.find((c) => c.class_id === classId)?.name || "N/A";
  };

  return (
    <Box>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "15px" }}
      >
        <Typography variant="sb20">School Bundles</Typography>

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

          {/* Create Bundle Button */}
          <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: "20px" }} />}
            onClick={handleCreateBundle}
          >
            Create Bundle
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

      {/* Dashboard Cards Section */}
      <Stack direction="row" spacing={3} sx={{ marginBottom: "24px" }}>
        {/* Total Bundles Card */}
        <Card
          sx={{
            flex: 1,
            borderRadius: "8px",
            boxShadow: "0px 0px 20px 0px #BFC2C833",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ padding: "20px" }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#D2E8FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22V11.3548M11 22C11.3404 22 11.6463 21.9428 12 21.8285M20 7V11.5" stroke="#2C65F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M7.32592 9.69138L4.40472 8.27785C2.80157 7.5021 2 7.11423 2 6.5C2 5.88577 2.80157 5.4979 4.40472 4.72215L7.32592 3.30862C9.12883 2.43621 10.0303 2 11 2C11.9697 2 12.8712 2.4362 14.6741 3.30862L17.5953 4.72215C19.1984 5.4979 20 5.88577 20 6.5C20 7.11423 19.1984 7.5021 17.5953 8.27785L14.6741 9.69138C12.8712 10.5638 11.9697 11 11 11C10.0303 11 9.12883 10.5638 7.32592 9.69138Z" stroke="#2C65F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5 12L7 13" stroke="#2C65F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M16 4L6 9" stroke="#2C65F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M20.1322 20.1589L22 22M21.2074 17.5964C21.2074 19.5826 19.594 21.1928 17.6037 21.1928C15.6134 21.1928 14 19.5826 14 17.5964C14 15.6102 15.6134 14 17.6037 14C19.594 14 21.2074 15.6102 21.2074 17.5964Z" stroke="#2C65F9" stroke-width="1.5" stroke-linecap="round" />
                </svg>


              </Box>
              <Stack spacing={0.5}>
                <Typography variant="m14" sx={{ color: "#6B7280" }}>
                  Total Bundles
                </Typography>
                <Typography variant="sb26">
                  {displayBundles.length}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Active Bundles Card */}
        <Card
          sx={{
            flex: 1,
            borderRadius: "8px",
            boxShadow: "0px 0px 20px 0px #BFC2C833",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ padding: "20px" }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#D8FDD2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 7V12M3 7C3 10.0645 3 16.7742 3 17.1613C3 18.5438 4.94564 19.3657 8.83693 21.0095C10.4002 21.6698 11.1818 22 12 22V11.3548" stroke="#1B8A52" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15 19C15 19 15.875 19 16.75 21C16.75 21 19.5294 16 22 15" stroke="#1B8A52" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z" stroke="#1B8A52" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M6 12L8 13" stroke="#1B8A52" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M17 4L7 9" stroke="#1B8A52" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>


              </Box>
              <Stack spacing={0.5}>
                <Typography variant="m14" sx={{ color: "#6B7280" }}>
                  Active Bundles
                </Typography>
                <Typography variant="sb26">
                  {displayBundles.filter((b) => b.is_active).length}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Total Schools Card */}
        <Card
          sx={{
            flex: 1,
            borderRadius: "8px",
            boxShadow: "0px 0px 20px 0px #BFC2C833",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ padding: "20px" }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#FBD8DC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12V16.3333C19 17.8847 19 18.6604 18.7877 19.2858C18.388 20.4633 17.4633 21.388 16.2858 21.7877C15.6604 22 14.8847 22 13.3333 22H10.6667C9.11529 22 8.3396 22 7.71424 21.7877C6.53668 21.388 5.61201 20.4633 5.21228 19.2858C5 18.6604 5 17.8847 5 16.3333V12Z" stroke="#8A1232" stroke-width="1.5" stroke-linejoin="round" />
                  <path d="M5 17C6.64996 15.17 9.17273 14 12 14C14.8273 14 17.35 15.17 19 17" stroke="#8A1232" stroke-width="1.5" stroke-linejoin="round" />
                  <path d="M11 10H13" stroke="#8A1232" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M9 6V5C9 4.06812 9 3.60218 9.15224 3.23463C9.35523 2.74458 9.74458 2.35523 10.2346 2.15224C10.6022 2 11.0681 2 12 2C12.9319 2 13.3978 2 13.7654 2.15224C14.2554 2.35523 14.6448 2.74458 14.8478 3.23463C15 3.60218 15 4.06812 15 5V6" stroke="#8A1232" stroke-width="1.5" />
                  <path d="M5 19H3.71429C2.76751 19 2 18.2325 2 17.2857V16C2 14.3431 3.34315 13 5 13" stroke="#8A1232" stroke-width="1.5" />
                  <path d="M19 19H20.2857C21.2325 19 22 18.2325 22 17.2857V16C22 14.3431 20.6569 13 19 13" stroke="#8A1232" stroke-width="1.5" />
                </svg>


              </Box>
              <Stack spacing={0.5}>
                <Typography variant="m14" sx={{ color: "#6B7280" }}>
                  Total Schools
                </Typography>
                <Typography variant="sb26">
                  {schools.length}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Out of Stock Card */}
        <Card
          sx={{
            flex: 1,
            borderRadius: "8px",
            boxShadow: "0px 0px 20px 0px #BFC2C833",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ padding: "20px" }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF0EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EB291B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 8V12.5" stroke="#EB291B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 15.9883V15.9983" stroke="#EB291B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>


              </Box>
              <Stack spacing={0.2}>
                <Typography variant="m14" color="text.secondary">
                  Out of Stock
                </Typography>
                <Typography variant="sb26">
                  1022
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
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
              <TableCell>Bundle Name</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayBundles.map((bundle) => (
              <TableRow key={bundle.class_bundle_id}>
                <TableCell>
                  <Stack
                    spacing={0.5}
                    onClick={() => handleBundleNameClick(bundle)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>
                      {bundle.name}
                    </Typography>
                    <Typography variant="m12" sx={{ color: "#787E91" }}>
                      ID : {bundle.class_bundle_id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography>{getSchoolName(bundle.school_id)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{getClassName(bundle.class_id)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{bundle.total_items_count}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="r16" sx={{ fontWeight: 500 }}>
                    ₹ {bundle.total_bundle_price}/-
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={bundle.is_active ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      backgroundColor:
                        bundle.is_active ? "#D5F8E7" : "#FFF0EE",
                      color: bundle.is_active ? "#17B168" : "#EB291B",
                      fontWeight: 500,
                      fontSize: "14px",
                      borderRadius: "12px",
                      "& .MuiChip-label": {
                        padding: "6px 10px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionMenuOpen(e, bundle)}
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
        <MenuItem onClick={() => {
          setIsBundleDetailsModalOpen(true);
          handleActionMenuClose();
        }}>
          <Typography variant="r14">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleEditBundle}>
          <Typography variant="r14">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14" sx={{ color: "#E24600" }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      {/* Create Bundle Drawer */}
      <CreateBundleDrawer
        open={isCreateBundleDrawerOpen}
        onClose={handleCloseCreateBundleDrawer}
        onSubmit={handleSubmitBundle}
      />

      {/* Bundle Details Modal */}
      <BundleDetailsModal
        open={isBundleDetailsModalOpen}
        onClose={handleCloseBundleDetailsModal}
        bundle={selectedBundle}
        school={selectedBundle ? schools.find(s => s.school_id === selectedBundle.school_id) || null : null}
        onEdit={handleEditBundle}
      />

      {/* Edit Bundle Drawer */}
      <EditBundleDrawer
        open={isEditBundleDrawerOpen}
        onClose={handleCloseEditBundleDrawer}
        onSubmit={handleSubmitBundle}
        bundle={selectedBundle}
      />
    </Box>
  );
};

export default SchoolBundles;
