import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    Select,
    MenuItem,
    styled,
    Grid,
    CircularProgress,
} from "@mui/material";
import BaseDrawer from "./BaseDrawer";
import { updateSchoolAdmin, type SchoolAdmin, type AdminUpdatePayload } from "../../api/school";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface AddAdminDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    admin?: SchoolAdmin | null;
    schoolId: number;
}

export interface AdminFormData {
    name: string;
    email: string;
    mobile_number: string;
    status: string;
}

const FormField = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

const FormLabel = styled(Typography)({
    fontSize: "15px",
    fontWeight: 500,
    color: "#121318",
});

const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        fontSize: "14px",
        backgroundColor: "#FFFFFF",
    },
    "& .MuiInputBase-input::placeholder": {
        color: "#9CA3AF",
        fontWeight: 400,
        fontSize: "14px",
        opacity: 1,
    },
});

const AddAdminDrawer: React.FC<AddAdminDrawerProps> = ({
    open,
    onClose,
    onSubmit,
    admin,
    schoolId
}) => {
    // Note: schoolId is available for future use (e.g. if a separate create admin API requires it)
    console.log("AddAdminDrawer for school:", schoolId);
    const [formData, setFormData] = useState<AdminFormData>({
        name: "",
        email: "",
        mobile_number: "",
        status: "Active",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (admin) {
                setFormData({
                    name: admin.name || "",
                    email: admin.email || "",
                    mobile_number: admin.mobile_number || "",
                    status: admin.is_active ? "Active" : "Inactive",
                });
            } else {
                setFormData({
                    name: "",
                    email: "",
                    mobile_number: "",
                    status: "Active",
                });
            }
            setErrors({});
        }
    }, [open, admin]);

    const handleChange = (field: keyof AdminFormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
    ) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof AdminFormData, string>> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
        if (!formData.status) newErrors.status = "Status is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                if (admin) {
                    // Update mode
                    const payload: AdminUpdatePayload = {
                        name: formData.name,
                        email: formData.email,
                        status: formData.status,
                        mobile_number: formData.mobile_number,
                    };
                    await updateSchoolAdmin(admin.school_admin_id, payload);
                    notifySuccess("Admin updated successfully");
                } else {
                    // Create mode - if there's no separate create admin API, we might need to use registerSchool with placeholder data or wait for instructions
                    // For now, assuming update is the priority as per curl provided
                    notifyError("Create admin functionality not yet implemented in API");
                    setLoading(false);
                    return;
                }

                onSubmit?.();
                onClose();
            } catch (error: any) {
                notifyError(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <BaseDrawer open={open} onClose={onClose} title={admin ? "Edit Admin" : "Add Admin"} width={500}>
            <Stack spacing={4}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Admin Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter admin name"
                                value={formData.name}
                                onChange={handleChange("name")}
                                variant="outlined"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Email Address <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={handleChange("email")}
                                variant="outlined"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Phone Number <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter phone number"
                                value={formData.mobile_number}
                                onChange={handleChange("mobile_number")}
                                variant="outlined"
                                fullWidth
                                error={!!errors.mobile_number}
                                helperText={errors.mobile_number}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Status <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <Select
                                value={formData.status}
                                onChange={handleChange("status") as any}
                                variant="outlined"
                                fullWidth
                                displayEmpty
                                sx={{
                                    borderRadius: '12px',
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: errors.status ? "#d32f2f" : undefined
                                    }
                                }}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                            {errors.status && <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>{errors.status}</Typography>}
                        </FormField>
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{
                    marginTop: "15px",
                    borderTop: "1px solid #1214191A",
                    paddingTop: "15px",
                }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                        sx={{
                            borderColor: "#D1D4DE",
                            color: "#121318",
                            textTransform: "none",
                            minWidth: "120px",
                            "&:hover": {
                                borderColor: "#D1D4DE",
                                backgroundColor: "#F9FAFB",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                            minWidth: "140px",
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : (admin ? "Update Admin" : "Create Admin")}
                    </Button>
                </Stack>
            </Stack>
        </BaseDrawer>
    );
};

export default AddAdminDrawer;
