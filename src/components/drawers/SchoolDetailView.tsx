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
    Tabs,
    Tab,
} from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import type { School } from "../../api/school";
import { getBundleList, deleteBundle, type Bundle } from "../../api/bundle";
import { getSchoolDetail, getSchoolAdminList, type SchoolAdmin } from "../../api/school";
import { MoreActionsIcon, StudyIcon } from "../icons/CommonIcons";
import schoolLogo from "../../assets/images/delhi-public-school.png";
import CreateBundleDrawer from "./CreateBundleDrawer";
import EditBundleDrawer from "./EditBundleDrawer";
import AddAdminDrawer from "./AddAdminDrawer";
import BundleDetailsModal from "../modals/BundleDetailsModal";
import ConfirmDeleteBundleModal from "../modals/ConfirmDeleteBundleModal";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface SchoolDetailViewProps {
    school: School;
    onBack: () => void;
}

const SchoolDetailView: React.FC<SchoolDetailViewProps> = ({ school, onBack }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
    const [isCreateBundleDrawerOpen, setIsCreateBundleDrawerOpen] = useState(false);
    const [isBundleDetailsDrawerOpen, setIsBundleDetailsDrawerOpen] = useState(false);
    const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
    const [isEditBundleDrawerOpen, setIsEditBundleDrawerOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [detailedSchool, setDetailedSchool] = useState<School | null>(null);
    const [schoolAdmins, setSchoolAdmins] = useState<SchoolAdmin[]>([]);
    const [adminsLoading, setAdminsLoading] = useState(false);
    const [schoolBundles, setSchoolBundles] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddAdminDrawerOpen, setIsAddAdminDrawerOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<SchoolAdmin | null>(null);
    const [adminActionMenuAnchor, setAdminActionMenuAnchor] = useState<null | HTMLElement>(null);

    const fetchDetailedInfo = async () => {
        setLoading(true);
        try {
            const [detailRes, bundlesRes] = await Promise.all([
                getSchoolDetail(school.school_id),
                getBundleList()
            ]);
            setDetailedSchool(detailRes.row);
            // Filter bundles for this school
            setSchoolBundles(bundlesRes.rows.filter(b => b.school_id === school.school_id));
        } catch (error) {
            console.error("Failed to fetch school details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        setAdminsLoading(true);
        try {
            const res = await getSchoolAdminList(school.school_id);
            setSchoolAdmins(res.rows || []);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
            notifyError(error);
        } finally {
            setAdminsLoading(false);
        }
    };

    React.useEffect(() => {
        setDetailedSchool(null);
        setSchoolAdmins([]);
        fetchDetailedInfo();
    }, [school.school_id]);

    React.useEffect(() => {
        if (activeTab === 1 && schoolAdmins.length === 0) {
            fetchAdmins();
        }
    }, [activeTab, school.school_id]);

    const currentSchool = detailedSchool || school;

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

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

    const handleCreateAdmin = () => {
        setSelectedAdmin(null);
        setIsAddAdminDrawerOpen(true);
    };

    const handleEditAdmin = (admin: SchoolAdmin) => {
        setSelectedAdmin(admin);
        setIsAddAdminDrawerOpen(true);
        handleAdminActionMenuClose();
    };

    const handleCloseAddAdminDrawer = () => {
        setIsAddAdminDrawerOpen(false);
        setSelectedAdmin(null);
    };

    const handleAdminActionMenuOpen = (event: React.MouseEvent<HTMLElement>, admin: SchoolAdmin) => {
        setAdminActionMenuAnchor(event.currentTarget);
        setSelectedAdmin(admin);
    };

    const handleAdminActionMenuClose = () => {
        setAdminActionMenuAnchor(null);
    };

    const handleSubmitAdmin = () => {
        fetchAdmins();
    };

    const handleCloseCreateBundleDrawer = () => {
        setIsCreateBundleDrawerOpen(false);
    };

    const handleSubmitBundle = async () => {
        // Refresh the list after successful creation or edit
        await fetchDetailedInfo();
    };

    const handleBundleNameClick = (bundle: Bundle) => {
        setSelectedBundle(bundle);
        setIsBundleDetailsDrawerOpen(true);
    };

    const handleCloseBundleDetailsDrawer = () => {
        setIsBundleDetailsDrawerOpen(false);
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

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
        handleActionMenuClose();
    };

    const handleDeleteConfirm = async () => {
        if (!selectedBundle) return;
        setIsDeleting(true);
        try {
            await deleteBundle(selectedBundle.bundle_id);
            notifySuccess("Bundle deleted successfully");
            await fetchDetailedInfo();
            setIsDeleteModalOpen(false);
            setSelectedBundle(null);
        } catch (error) {
            notifyError(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const getSchoolName = (bundle: Bundle): string => {
        return bundle.School?.name || "N/A";
    };

    const getClassName = (bundle: Bundle): string => {
        return bundle.Class?.name || "N/A";
    };

    return (
        <Box>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={onBack}
                sx={{
                    color: "#121318",
                    textTransform: "none",
                    marginBottom: "20px",
                    padding: "8px 0",
                    "&:hover": {
                        backgroundColor: "transparent",
                    },
                }}
            >
                Back
            </Button>

            {/* Top Section */}
            <Box
                sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                    border: "1px solid #CFCDCD4D",
                    boxShadow: "0px 0px 30px 0px #0000000F",
                }}
            >
                <Stack justifyContent="space-between" alignItems="flex-start" spacing={3}
                    sx={{
                        background: "linear-gradient(98.42deg, #2C65F9 10.23%, #2C55C1 80.76%)",
                        borderRadius: "12px",
                        padding: "20px",
                    }}
                >
                    {/* Left Section: Board Tag, School Name, Location, Bundles & Admins */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        {/* Board Tag */}
                        <Stack sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            gap: "10px",
                            width: "100%",
                        }}>
                            {currentSchool.board && (
                                <Chip
                                    icon={<StudyIcon />}
                                    label={currentSchool.board}
                                    size="small"
                                    sx={{
                                        backgroundColor: "#FFFFFF1A",
                                        backdropFilter: "blur(10px)",
                                        color: "#FFFFFF",
                                        fontWeight: 400,
                                        fontSize: "12px",
                                        padding: "4px 8px",
                                        height: "auto",
                                        display: "flex",
                                        gap: "4px",
                                        alignSelf: "flex-start",
                                        "& .MuiChip-icon": {
                                            marginLeft: "4px",
                                        },
                                        "& .MuiChip-label": {
                                            padding: "0 4px",
                                            fontSize: "15px !important",
                                        }
                                    }}
                                />
                            )}

                            {/* School Name */}
                            <Typography variant="m24" color="#FFFFFF" marginTop="10px !important">
                                {currentSchool.name}
                            </Typography>

                            {/* Location */}
                            {currentSchool.address && (
                                <Typography variant="r14" color="#FFFFFF">
                                    {currentSchool.address}
                                </Typography>
                            )}
                        </Stack>
                        {/* Right Section: School Logo */}
                        <Box sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            width: "93px",
                            height: "88px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                        }}>
                            <img
                                src={currentSchool.image || schoolLogo}
                                alt={currentSchool.name}
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "contain",
                                    borderRadius: "8px"
                                }}
                            />
                        </Box>

                    </Stack>
                    {/* Bundles & Admins Heading with Create Bundle Button */}
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    sx={{ marginTop: "20px !important" }}
                >
                    <Typography variant="sb20">
                        Bundles & Admins
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {activeTab === 0 && (
                            <Button
                                variant="contained"
                                startIcon={<Add sx={{ fontSize: "20px" }} />}
                                onClick={handleCreateBundle}
                            >
                                Create Bundle
                            </Button>
                        )}
                        {activeTab === 1 && (
                            <Button
                                variant="contained"
                                startIcon={<Add sx={{ fontSize: "20px" }} />}
                                onClick={handleCreateAdmin}
                            >
                                Create Admin
                            </Button>
                        )}
                    </Stack>
                </Stack>
                {/* Tabs Section */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "20px" }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#121318",
                                minHeight: "48px",
                                marginTop: "10px !important",
                                "&:focus": {
                                    outline: "none !important",
                                },
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#2C65F9",
                                height: "3px",
                            },
                        }}
                    >
                        <Tab label="Bundles" />
                        <Tab label="Admins" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                {activeTab === 0 && (
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            borderRadius: "unset !important",
                            border: "unset !important",
                            backgroundColor: "unset !important",
                            boxShadow: "unset !important",
                            padding: "unset !important",
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="r14" color="text.secondary">
                                                Loading bundles...
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : schoolBundles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="r14" color="text.secondary">
                                                No bundles found for this school
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    schoolBundles.map((bundle: Bundle) => (
                                        <TableRow key={bundle.bundle_id}>
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
                                                    <Typography>
                                                        {bundle.name}
                                                    </Typography>
                                                    <Typography variant="m12" color="#787E91">
                                                        ID : {bundle.bundle_id}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{getSchoolName(bundle)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{getClassName(bundle)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{bundle.total_products}</Typography>
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
                                            <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActionMenuOpen(e, bundle);
                                                    }}
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
                )}

                {activeTab === 1 && (
                    <Box sx={{ padding: "20px 0" }}>
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                borderRadius: "unset !important",
                                border: "unset !important",
                                backgroundColor: "unset !important",
                                boxShadow: "unset !important",
                                padding: "unset !important",
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Admin Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone Number</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {adminsLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="r14" color="text.secondary">
                                                    Loading admins...
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (schoolAdmins && schoolAdmins.length > 0) ? (
                                        schoolAdmins.map((admin) => (
                                            <TableRow key={admin.school_admin_id}>
                                                <TableCell>
                                                    <Typography>{admin.name}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{admin.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{admin.mobile_number || "-"}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={admin.is_active ? "Active" : "Inactive"}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: admin.is_active ? "#D5F8E7" : "#FFF0EE",
                                                            color: admin.is_active ? "#17B168" : "#EB291B",
                                                            borderRadius: "12px",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleAdminActionMenuOpen(e, admin)}
                                                    >
                                                        <MoreActionsIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="r14" color="text.secondary">
                                                    No admins found for this school
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>


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
                    setIsBundleDetailsDrawerOpen(true);
                    handleActionMenuClose();
                }}>
                    <Typography variant="r14">View Details</Typography>
                </MenuItem>
                <MenuItem onClick={handleEditBundle}>
                    <Typography variant="r14">Edit</Typography>
                </MenuItem>
                <MenuItem onClick={handleOpenDeleteModal}>
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
                schoolName={currentSchool.name}
            />

            {/* Bundle Details Drawer */}
            <BundleDetailsModal
                open={isBundleDetailsDrawerOpen}
                onClose={handleCloseBundleDetailsDrawer}
                bundle={selectedBundle}
                school={currentSchool}
                onEdit={handleEditBundle}
            />

            {/* Edit Bundle Drawer */}
            <EditBundleDrawer
                open={isEditBundleDrawerOpen}
                onClose={handleCloseEditBundleDrawer}
                onSubmit={handleSubmitBundle}
                bundle={selectedBundle}
            />

            {/* Confirm Delete Bundle Modal */}
            <ConfirmDeleteBundleModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                bundleName={selectedBundle?.name || ""}
                loading={isDeleting}
            />

            {/* Admin Action Menu */}
            <Menu
                anchorEl={adminActionMenuAnchor}
                open={Boolean(adminActionMenuAnchor)}
                onClose={handleAdminActionMenuClose}
                PaperProps={{
                    sx: {
                        marginTop: "8px",
                        borderRadius: "8px",
                        minWidth: "160px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                }}
            >
                <MenuItem onClick={() => selectedAdmin && handleEditAdmin(selectedAdmin)}>
                    <Typography variant="r14">Edit</Typography>
                </MenuItem>
                <MenuItem onClick={handleAdminActionMenuClose}>
                    <Typography variant="r14" sx={{ color: "#E24600" }}>
                        Delete
                    </Typography>
                </MenuItem>
            </Menu>

            {/* Add/Edit Admin Drawer */}
            <AddAdminDrawer
                open={isAddAdminDrawerOpen}
                onClose={handleCloseAddAdminDrawer}
                admin={selectedAdmin}
                schoolId={school.school_id}
                onSubmit={handleSubmitAdmin}
            />
        </Box>
    );
};

export default SchoolDetailView;

