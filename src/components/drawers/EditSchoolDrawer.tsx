import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    styled,
    Grid,
    FormGroup,
    CircularProgress,
    Alert,
} from "@mui/material";
import BaseDrawer from "./BaseDrawer";
import { updateSchool, type School, type UpdateSchoolPayload } from "../../api/school";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface EditSchoolDrawerProps {
    open: boolean;
    onClose: () => void;
    school: School | null;
    onSubmit?: () => void;
}

export interface EditSchoolFormData {
    schoolName: string;
    branch: string;
    board: string;
    status: string;
    logo: File | null;
    address: string;
    admission_id: boolean;
    imagePreview: string | null;
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

const EditSchoolDrawer: React.FC<EditSchoolDrawerProps> = ({
    open,
    onClose,
    school,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<EditSchoolFormData>({
        schoolName: "",
        branch: "",
        board: "",
        status: "",
        logo: null,
        address: "",
        admission_id: false,
        imagePreview: null,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof EditSchoolFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        if (school && open) {
            setFormData({
                schoolName: school.name || "",
                branch: school.branch || "",
                board: school.board || "",
                status: school.is_active ? "Active" : "Inactive",
                logo: null,
                address: school.address || "",
                admission_id: school.admission_id || false,
                imagePreview: school.image || null,
            });
            setErrors({});
            setApiError(null);
        }
    }, [school, open]);

    const handleChange = (field: keyof EditSchoolFormData) => (
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

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                logo: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, imagePreview: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof EditSchoolFormData, string>> = {};

        if (!formData.schoolName.trim()) {
            newErrors.schoolName = "School name is required";
        }
        if (!formData.branch.trim()) {
            newErrors.branch = "Branch is required";
        }
        if (!formData.board) {
            newErrors.board = "Board is required";
        }
        if (!formData.status) {
            newErrors.status = "Status is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (validateForm() && school) {
            setLoading(true);
            setApiError(null);

            try {
                let imageBase64 = formData.imagePreview || "";
                if (formData.logo) {
                    imageBase64 = await convertFileToBase64(formData.logo);
                }

                const payload: UpdateSchoolPayload = {
                    name: formData.schoolName,
                    branch: formData.branch,
                    board: formData.board,
                    image: imageBase64,
                    address: formData.address,
                    is_active: formData.status === "Active",
                    admission_id: formData.admission_id,
                };

                await updateSchool(school.school_id, payload);
                notifySuccess("School updated successfully");
                onSubmit?.();
                onClose();
            } catch (error: any) {
                notifyError(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <BaseDrawer open={open} onClose={onClose} title="Edit School" width={900}>
            <Stack spacing={4}>
                {apiError && <Alert severity="error">{apiError}</Alert>}

                <Box>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <FormField>
                                <FormLabel>
                                    School Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                                </FormLabel>
                                <StyledTextField
                                    value={formData.schoolName}
                                    onChange={handleChange("schoolName")}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.schoolName}
                                    helperText={errors.schoolName}
                                />
                            </FormField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormField>
                                <FormLabel>
                                    Branch <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                                </FormLabel>
                                <StyledTextField
                                    value={formData.branch}
                                    onChange={handleChange("branch")}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.branch}
                                    helperText={errors.branch}
                                />
                            </FormField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormField>
                                <FormLabel>
                                    Board <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                                </FormLabel>
                                <StyledTextField
                                    value={formData.board}
                                    onChange={handleChange("board")}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.board}
                                    helperText={errors.board}
                                />
                            </FormField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
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
                                        borderRadius: "12px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: errors.status ? "#d32f2f" : undefined,
                                        },
                                    }}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                                {errors.status && (
                                    <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                        {errors.status}
                                    </Typography>
                                )}
                            </FormField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormField>
                                <FormLabel>Address</FormLabel>
                                <StyledTextField
                                    value={formData.address}
                                    onChange={handleChange("address")}
                                    variant="outlined"
                                    fullWidth
                                />
                            </FormField>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ margin: "15px 0px 0px 0px !important" }}>
                    <FormGroup sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.admission_id}
                                    onChange={(e) => setFormData({ ...formData, admission_id: e.target.checked })}
                                    sx={{
                                        color: "#D96200",
                                        borderRadius: "4px",
                                        padding: "0px 05px 0px 10px",
                                        "&.Mui-checked": {
                                            color: "#D96200",
                                            borderRadius: "4px",
                                        },
                                    }}
                                />
                            }
                            label="Admission Check"
                        />
                    </FormGroup>
                </Box>

                <Box sx={{ margin: "15px 0px 0px 0px !important" }}>
                    <Typography variant="sb16" sx={{ marginBottom: "8px", color: "#121318" }}>
                        Logo <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                    </Typography>
                    <Box
                        sx={{
                            border: "2px dashed #D1D4DE",
                            borderRadius: "8px",
                            padding: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            cursor: "pointer",
                            marginTop: "10px",
                            backgroundColor: "#FFFFFF",
                            "&:hover": { backgroundColor: "#F9FAFB" },
                        }}
                        onClick={() => document.getElementById("edit-logo-upload")?.click()}
                    >
                        <input
                            id="edit-logo-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleLogoUpload}
                        />
                        {formData.imagePreview ? (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img
                                    src={formData.imagePreview}
                                    alt="Logo preview"
                                    style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "8px" }}
                                />
                                <Typography variant="r14" sx={{ marginTop: "12px", color: "#2C65F9" }}>
                                    Click to change
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    width: "48px",
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        x="8"
                                        y="8"
                                        width="32"
                                        height="32"
                                        rx="4"
                                        stroke="#9CA3AF"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <circle
                                        cx="14"
                                        cy="14"
                                        r="2"
                                        fill="#9CA3AF"
                                    />
                                    <path
                                        d="M8 28L16 20L24 28L32 20L40 28V36H8V28Z"
                                        stroke="#9CA3AF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    />
                                </svg>
                            </Box>
                        )}
                    </Box>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ borderTop: "1px solid #1214191A", paddingTop: "15px" }}>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={loading}
                        sx={{ borderColor: "#D1D4DE", color: "#121318", textTransform: "none" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ textTransform: "none" }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Update School"}
                    </Button>
                </Stack>
            </Stack>
        </BaseDrawer>
    );
};

export default EditSchoolDrawer;
