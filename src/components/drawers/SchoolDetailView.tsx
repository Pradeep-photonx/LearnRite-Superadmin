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
import type { School } from "../../utilities/schoolsData";
import { bundlesData } from "../../utilities/bundlesData";
import type { Bundle } from "../../utilities/bundlesData";
import { MoreActionsIcon, StudyIcon } from "../icons/CommonIcons";
import schoolLogo from "../../assets/images/delhi-public-school.png";
import CreateBundleDrawer, { type BundleFormData } from "./CreateBundleDrawer";
import BundleDetailsDrawer from "../modals/BundleDetailsDrawer";

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

    const schoolBundles = bundlesData.filter((bundle) => bundle.schoolId === school.id);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setActionMenuAnchor(event.currentTarget);
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

    const handleSubmitBundle = (data: BundleFormData) => {
        // Handle bundle submission
        console.log("Bundle data:", data);
        // You can add API call here to save the bundle data
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
        // Handle edit bundle action
        console.log("Edit bundle:", selectedBundle);
        // You can open the create bundle drawer in edit mode here
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
                            {school.board && (
                                <Chip
                                    icon={<StudyIcon />}
                                    label={school.board}
                                    size="small"
                                    sx={{
                                        backgroundColor: "#FFFFFF1A",
                                        backdropFilter: "blur(10px)",
                                        color: "#FFFFFF",
                                        fontWeight: 400,
                                        fontSize: "12px",
                                        height: "28px",
                                        alignSelf: "flex-start",
                                        "& .MuiChip-icon": {
                                            marginLeft: "8px",
                                        },
                                    }}
                                />
                            )}

                            {/* School Name */}
                            <Typography variant="m24" color="#FFFFFF" marginTop="10px !important">
                                {school.schoolName}
                            </Typography>

                            {/* Location */}
                            {school.location && (
                                <Typography variant="r14" color="#FFFFFF">
                                    {school.location}
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
                                src={schoolLogo}
                                alt={school.schoolName}
                                style={{
                                    width: "53px",
                                    height: "64px",
                                }}
                            >
                            </img>
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
                    <Button
                        variant="contained"
                        startIcon={<Add sx={{ fontSize: "20px" }} />}
                        onClick={handleCreateBundle}
                    >
                        Create Bundle
                    </Button>
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
                                    <TableCell>Second Language</TableCell>
                                    <TableCell>Total items</TableCell>
                                    <TableCell>Created on</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schoolBundles.map((bundle: Bundle) => (
                                    <TableRow key={bundle.id}>
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
                                                    {bundle.bundleName}
                                                </Typography>
                                                <Typography variant="m12" color="#787E91">
                                                    ID : {bundle.bundleId}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{bundle.secondLanguage}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{bundle.totalItems}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{bundle.createdOn}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="r16" sx={{ fontWeight: 500 }}>
                                                {bundle.price}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={bundle.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        bundle.status === "Active" ? "#D5F8E7" : "#FFF0EE",
                                                    color: bundle.status === "Active" ? "#17B168" : "#EB291B",
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
                                                    handleActionMenuOpen(e);
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {activeTab === 1 && (
                    <Box
                        sx={{
                            borderRadius: "unset !important",
                            border: "unset !important",
                            backgroundColor: "unset !important",
                            boxShadow: "unset !important",
                            padding: "unset !important",
                        }}
                    >
                        <Typography variant="r16" sx={{ color: "#6B7280" }}>
                            Admins content will be displayed here
                        </Typography>
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

            {/* Create Bundle Drawer */}
            <CreateBundleDrawer
                open={isCreateBundleDrawerOpen}
                onClose={handleCloseCreateBundleDrawer}
                onSubmit={handleSubmitBundle}
                schoolName={school.schoolName}
            />

            {/* Bundle Details Drawer */}
            <BundleDetailsDrawer
                open={isBundleDetailsDrawerOpen}
                onClose={handleCloseBundleDetailsDrawer}
                bundle={selectedBundle}
                school={school}
                onEdit={handleEditBundle}
            />
        </Box>
    );
};

export default SchoolDetailView;

