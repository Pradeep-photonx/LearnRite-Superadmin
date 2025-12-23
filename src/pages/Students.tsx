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
    InputBase,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { ImportIcon, MoreActionsIcon } from "../components/icons/CommonIcons";
import { AddStudentDrawer, EditStudentDrawer } from "../components/drawers";
import { getAdmissionList, deleteAdmission, type Admission } from "../api/admission";
import { format } from "date-fns";
import { notifyError, notifySuccess } from "../utils/toastUtils";
import { CircularProgress } from "@mui/material";
import ConfirmDeleteStudentModal from "../components/modals/ConfirmDeleteStudentModal";
import StudentDetailsModal from "../components/modals/StudentDetailsModal";

const Students: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
    const [isAddStudentDrawerOpen, setIsAddStudentDrawerOpen] = useState(false);
    const [isEditStudentDrawerOpen, setIsEditStudentDrawerOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Admission | null>(null);
    const [admissions, setAdmissions] = useState<Admission[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const data = await getAdmissionList();
            setAdmissions(data.rows || []);
        } catch (error) {
            notifyError(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAdmissions();
    }, []);

    const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, student: Admission) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedStudent(student);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
    };

    const handleEditClick = () => {
        setIsEditStudentDrawerOpen(true);
        handleActionMenuClose();
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
        handleActionMenuClose();
    };

    const handleViewDetailsClick = () => {
        setIsDetailsModalOpen(true);
        handleActionMenuClose();
    };

    const handleDeleteConfirm = async () => {
        if (!selectedStudent) return;
        setDeleteLoading(true);
        try {
            await deleteAdmission(selectedStudent.admission_id);
            notifySuccess("Student deleted successfully");
            fetchAdmissions();
            setIsDeleteModalOpen(false);
        } catch (error) {
            notifyError(error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filter admissions based on search query
    const displayAdmissions = React.useMemo(() => {
        const query = searchQuery.toLowerCase();
        return admissions.filter((item) => {
            return (
                item.admission_id.toLowerCase().includes(query) ||
                item.student_name.toLowerCase().includes(query) ||
                (typeof item.class === 'string' ? item.class : (item.class as any)?.name || item.Class?.class || item.Class?.name || "").toLowerCase().includes(query)
            );
        });
    }, [admissions, searchQuery]);

    return (
        <Box>
            {/* Header Section */}
            <Stack spacing={3} sx={{ marginBottom: "20px" }}>
                <Typography variant="sb20">Students</Typography>

                {/* Search and Filter Section */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    alignItems="center"
                    sx={{ marginBottom: "20px" }}
                >
                    {/* Search Bar */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #D1D4DE",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            flex: 1,
                            maxWidth: "280px",
                            height: "48px",
                            backgroundColor: "#FFFFFF",
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                left: "16px",
                                display: "flex",
                                alignItems: "center",
                                color: "#787E91",
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.99822 1.33325C6.09461 1.33333 5.20413 1.54949 4.40105 1.96371C3.59798 2.37793 2.90561 2.9782 2.38171 3.71442C1.8578 4.45065 1.51756 5.30148 1.38935 6.19595C1.26115 7.09041 1.34872 8.00257 1.64473 8.85631C1.94075 9.71005 2.43665 10.4806 3.09104 11.1037C3.74543 11.7269 4.53935 12.1844 5.40656 12.4383C6.27377 12.6922 7.18911 12.735 8.07623 12.5632C8.96335 12.3914 9.79651 12.0099 10.5062 11.4506L12.9409 13.8853C13.0666 14.0067 13.235 14.0739 13.4098 14.0724C13.5846 14.0709 13.7518 14.0007 13.8754 13.8771C13.999 13.7535 14.0691 13.5863 14.0707 13.4115C14.0722 13.2367 14.005 13.0683 13.8836 12.9426L11.4489 10.5079C12.1075 9.67233 12.5177 8.66819 12.6323 7.6104C12.7469 6.55262 12.5614 5.48393 12.097 4.52665C11.6327 3.56936 10.9081 2.76216 10.0064 2.19741C9.1047 1.63266 8.06219 1.33318 6.99822 1.33325ZM2.66488 6.99992C2.66488 5.85065 3.12143 4.74845 3.93409 3.93579C4.74674 3.12313 5.84895 2.66659 6.99822 2.66659C8.14749 2.66659 9.24969 3.12313 10.0623 3.93579C10.875 4.74845 11.3316 5.85065 11.3316 6.99992C11.3316 8.14919 10.875 9.25139 10.0623 10.064C9.24969 10.8767 8.14749 11.3333 6.99822 11.3333C5.84895 11.3333 4.74674 10.8767 3.93409 10.064C3.12143 9.25139 2.66488 8.14919 2.66488 6.99992Z" fill="#1F2026" />
                            </svg>

                            {/* <SearchIcon sx={{ fontSize: "20px" }} /> */}
                        </Box>
                        <InputBase
                            placeholder="Search by Student ID, name, or class"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flex: 1,
                                fontSize: "14px",
                                fontWeight: 500,
                                paddingLeft: "25px",
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#787E91",
                                    opacity: 1,
                                },
                            }}
                        />
                    </Box>

                    {/* Select Filter Button */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<ImportIcon />}
                            sx={{
                                borderColor: "#121318",
                                color: "text.secondary",
                                textTransform: "none",
                                "&:hover": {
                                    borderColor: "#121318",
                                    backgroundColor: "#F9FAFB",
                                },
                            }}
                        >
                            Import Excel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add sx={{ fontSize: "20px" }} />}
                            onClick={() => setIsAddStudentDrawerOpen(true)}
                        >
                            Add Students
                        </Button>

                    </Stack>

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
                        <TableRow>
                            <TableCell>Admission Number</TableCell>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell>Created on</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={32} />
                                    <Typography variant="r14" color="text.secondary" sx={{ mt: 2 }}>
                                        Loading students...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : displayAdmissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography variant="r14" color="text.secondary">
                                        No students found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : displayAdmissions.map((admission: Admission) => (
                            <TableRow key={admission.id}>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            cursor: "pointer",
                                            color: "#121318",
                                            "&:hover": {
                                                textDecoration: "underline",
                                            }
                                        }}
                                        onClick={() => {
                                            setSelectedStudent(admission);
                                            setIsDetailsModalOpen(true);
                                        }}
                                    >
                                        {admission.admission_id}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{admission.student_name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {typeof admission.class === 'string'
                                            ? admission.class
                                            : (admission.class as any)?.name ||
                                            admission.Class?.class ||
                                            admission.Class?.name ||
                                            "no class"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {admission.createdAt ? format(new Date(admission.createdAt), "dd MMM yyyy") : "-"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={admission.is_active ? "Active" : "Inactive"}
                                        size="small"
                                        sx={{
                                            backgroundColor:
                                                admission.is_active ? "#D5F8E7" : "#FFF0EE",
                                            color: admission.is_active ? "#17B168" : "#EB291B",
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
                                        onClick={(e) => handleActionMenuOpen(e, admission)}
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
                <MenuItem onClick={handleViewDetailsClick}>
                    <Typography variant="r14">View Details</Typography>
                </MenuItem>
                <MenuItem onClick={handleEditClick}>
                    <Typography variant="r14">Edit</Typography>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <Typography variant="r14" sx={{ color: "#E24600" }}>
                        Delete
                    </Typography>
                </MenuItem>
            </Menu>

            <AddStudentDrawer
                open={isAddStudentDrawerOpen}
                onClose={() => setIsAddStudentDrawerOpen(false)}
                onSubmit={() => {
                    fetchAdmissions();
                }}
            />

            <EditStudentDrawer
                open={isEditStudentDrawerOpen}
                onClose={() => setIsEditStudentDrawerOpen(false)}
                admission={selectedStudent}
                onUpdate={() => {
                    fetchAdmissions();
                }}
            />

            <ConfirmDeleteStudentModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                studentName={selectedStudent?.student_name || ""}
                loading={deleteLoading}
            />

            <StudentDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                admissionId={selectedStudent?.admission_id || null}
            />
        </Box>
    );
};

export default Students;
