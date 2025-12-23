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
import { getClassList, type Class } from "../../api/class";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface AddStudentDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: StudentFormData) => void;
}

export interface StudentFormData {
    name: string;
    class_id: string;
    admission_number: string;
    parent_name: string;
    parent_mobile: string;
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

const AddStudentDrawer: React.FC<AddStudentDrawerProps> = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<StudentFormData>({
        name: "",
        class_id: "",
        admission_number: "",
        parent_name: "",
        parent_mobile: "",
        status: "Active",
    });

    const [classes, setClasses] = useState<Class[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await getClassList();
                setClasses(response.rows);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            }
        };

        if (open) {
            fetchClasses();
            setFormData({
                name: "",
                class_id: "",
                admission_number: "",
                parent_name: "",
                parent_mobile: "",
                status: "Active",
            });
            setErrors({});
        }
    }, [open]);

    const handleChange = (field: keyof StudentFormData) => (
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
        const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

        if (!formData.name.trim()) newErrors.name = "Student Name is required";
        if (!formData.class_id) newErrors.class_id = "Class is required";
        if (!formData.admission_number.trim()) newErrors.admission_number = "Admission Number is required";
        if (!formData.parent_name.trim()) newErrors.parent_name = "Parent Name is required";
        if (!formData.parent_mobile.trim()) {
            newErrors.parent_mobile = "Parent Mobile Number is required";
        } else if (!/^\d{10}$/.test(formData.parent_mobile)) {
            newErrors.parent_mobile = "Invalid mobile number (10 digits)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                // API call placeholder
                console.log("Submitting student data:", formData);

                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 500));

                notifySuccess("Student added successfully");
                onSubmit?.(formData);
                onClose();
            } catch (error) {
                notifyError(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <BaseDrawer open={open} onClose={onClose} title="Add Student" width={500}>
            <Stack spacing={4}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
                        <FormField>
                            <FormLabel>
                                Student Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter student name"
                                value={formData.name}
                                onChange={handleChange("name")}
                                variant="outlined"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
                        <FormField>
                            <FormLabel>
                                Class <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <Select
                                value={formData.class_id}
                                onChange={handleChange("class_id") as any}
                                variant="outlined"
                                fullWidth
                                displayEmpty
                                error={!!errors.class_id}
                                sx={{
                                    borderRadius: '12px',
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: errors.class_id ? "#d32f2f" : undefined
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>Select Class</MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls.class_id} value={cls.class_id.toString()}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.class_id && <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>{errors.class_id}</Typography>}
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
                        <FormField>
                            <FormLabel>
                                Admission Number <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter admission number"
                                value={formData.admission_number}
                                onChange={handleChange("admission_number")}
                                variant="outlined"
                                fullWidth
                                error={!!errors.admission_number}
                                helperText={errors.admission_number}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
                        <FormField>
                            <FormLabel>
                                Parent Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter parent name"
                                value={formData.parent_name}
                                onChange={handleChange("parent_name")}
                                variant="outlined"
                                fullWidth
                                error={!!errors.parent_name}
                                helperText={errors.parent_name}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
                        <FormField>
                            <FormLabel>
                                Parent Mobile Number <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter mobile number"
                                value={formData.parent_mobile}
                                onChange={handleChange("parent_mobile")}
                                variant="outlined"
                                fullWidth
                                error={!!errors.parent_mobile}
                                helperText={errors.parent_mobile}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
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
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Add Student"}
                    </Button>
                </Stack>
            </Stack>
        </BaseDrawer>
    );
};

export default AddStudentDrawer;
