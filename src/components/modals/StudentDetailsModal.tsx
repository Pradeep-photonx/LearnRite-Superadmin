import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Stack,
    IconButton,
    Grid,
    CircularProgress,
    Divider,
} from "@mui/material";
import { CloseIcon } from "../icons/CommonIcons";
import { getAdmissionDetails, type Admission } from "../../api/admission";
import { notifyError } from "../../utils/toastUtils";
import { format } from "date-fns";

interface StudentDetailsModalProps {
    open: boolean;
    onClose: () => void;
    admissionId: string | null;
}

const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="r14" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            {label}
        </Typography>
        <Typography variant="m16" color="text.primary">
            {value || "-"}
        </Typography>
    </Box>
);

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ open, onClose, admissionId }) => {
    const [student, setStudent] = useState<Admission | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!admissionId) return;
            setLoading(true);
            try {
                const data = await getAdmissionDetails(admissionId);
                setStudent(data);
            } catch (error) {
                notifyError(error);
            } finally {
                setLoading(false);
            }
        };

        if (open && admissionId) {
            fetchDetails();
        } else {
            setStudent(null);
        }
    }, [open, admissionId]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    padding: "20px",
                    maxWidth: "600px",
                    width: "100%",
                },
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, borderBottom: "1px solid #E0E0E0", width: "100%", paddingBottom: "10px" }}>
                <DialogTitle variant="sb20" sx={{ p: 0, fontWeight: 600, }}>
                    Student Details
                </DialogTitle>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress size={40} />
                    </Box>
                ) : student ? (
                    <Stack spacing={3}>
                        <Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Admission ID" value={student.admission_id} />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Student Name" value={student.student_name} />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Class" value={typeof student.class === 'string' ? student.class : (student.class as any)?.name || student.Class?.name || "-"} />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Status" value={
                                        <Typography
                                            sx={{
                                                color: student.is_active ? "#17B168" : "#EB291B",
                                                fontWeight: 600,
                                                fontSize: "14px"
                                            }}
                                        >
                                            {student.is_active ? "Active" : "Inactive"}
                                        </Typography>
                                    } />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="sb16" sx={{ mb: 2, display: "block" }}>Parent Information</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Parent Name" value={student.parent_name} />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Mobile Number" value={student.parent_mobile_number} />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="sb16" sx={{ mb: 2, display: "block" }}>Info</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Created At" value={student.createdAt ? format(new Date(student.createdAt), "dd MMM yyyy, hh:mm a") : "-"} />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <DetailItem label="Last Updated" value={student.updatedAt ? format(new Date(student.updatedAt), "dd MMM yyyy, hh:mm a") : "-"} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                ) : (
                    <Typography align="center" sx={{ py: 4 }}>No data found</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StudentDetailsModal;
