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
import { updateCategory, type UpdateCategoryPayload, type Category } from "../../api/category";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface EditCategoryDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    category: Category | null;
}

export interface EditCategoryFormData {
    categoryName: string;
    visibility: string;
    categoryStatus: string;
}

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

const StyledSelect = styled(Select)({
    borderRadius: "12px",
    fontSize: "14px",
    backgroundColor: "#FFFFFF",
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D1D4DE",
    },
});

// Mock data for dropdowns
const visibilityOptions = ["Public", "Private"];
const statusOptions = ["Active", "Inactive"];

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

const EditCategoryDrawer: React.FC<EditCategoryDrawerProps> = ({
    open,
    onClose,
    onSubmit,
    category,
}) => {
    const [formData, setFormData] = useState<EditCategoryFormData>({
        categoryName: "",
        visibility: "",
        categoryStatus: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category && open) {
            setFormData({
                categoryName: category.name || "",
                visibility: category.visibility ? "Private" : "Public",
                categoryStatus: category.is_active ? "Active" : "Inactive",
            });
        }
    }, [category, open]);

    const handleChange = (field: keyof EditCategoryFormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
    ) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.categoryName || !formData.visibility || !formData.categoryStatus) {
            notifyError("Please fill in all required fields");
            return;
        }

        if (!category) return;

        setLoading(true);
        try {
            const payload: UpdateCategoryPayload = {
                name: formData.categoryName,
                visibility: formData.visibility === "Private",
                is_active: formData.categoryStatus === "Active",
            };

            await updateCategory(category.category_id, payload);
            notifySuccess("Category updated successfully");
            onSubmit?.();
            onClose();
        } catch (error) {
            notifyError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseDrawer open={open} onClose={onClose} title="Edit Category" width={600}>
            <Stack spacing={4}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Category Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter category name"
                                value={formData.categoryName}
                                onChange={handleChange("categoryName")}
                                variant="outlined"
                                fullWidth
                                error={!formData.categoryName && loading}
                            />
                        </FormField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Visibility <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledSelect
                                value={formData.visibility}
                                onChange={handleChange("visibility")}
                                variant="outlined"
                                fullWidth
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select visibility
                                </MenuItem>
                                {visibilityOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </StyledSelect>
                        </FormField>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Category Status <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledSelect
                                value={formData.categoryStatus}
                                onChange={handleChange("categoryStatus")}
                                variant="outlined"
                                fullWidth
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select status
                                </MenuItem>
                                {statusOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </StyledSelect>
                        </FormField>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{
                        marginTop: "24px",
                        borderTop: "1px solid #1214191A",
                        paddingTop: "15px",
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                        sx={{
                            borderColor: "#121318",
                            color: "#121318",
                            textTransform: "none",
                            "&:hover": {
                                borderColor: "#121318",
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
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Update Category"}
                    </Button>
                </Stack>
            </Stack>
        </BaseDrawer>
    );
};

export default EditCategoryDrawer;
