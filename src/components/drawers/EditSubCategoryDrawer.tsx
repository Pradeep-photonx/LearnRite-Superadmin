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
import { updateSubCategory, type UpdateSubCategoryPayload, type SubCategory } from "../../api/category";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface EditSubCategoryDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    subCategory: SubCategory | null;
}

export interface EditSubCategoryFormData {
    name: string;
    status: string;
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

const EditSubCategoryDrawer: React.FC<EditSubCategoryDrawerProps> = ({
    open,
    onClose,
    onSubmit,
    subCategory,
}) => {
    const [formData, setFormData] = useState<EditSubCategoryFormData>({
        name: "",
        status: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (subCategory && open) {
            console.log("EditSubCategoryDrawer - subCategory:", subCategory);
            setFormData({
                name: subCategory.name || "",
                status: subCategory.is_active ? "Active" : "Inactive",
            });
        }
    }, [subCategory, open]);

    const handleChange = (field: keyof EditSubCategoryFormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
    ) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.status) {
            notifyError("Please fill in all required fields");
            return;
        }

        if (!subCategory) {
            notifyError("No subcategory selected");
            return;
        }

        if (!subCategory.sub_category_id) {
            notifyError("Invalid subcategory ID");
            console.error("SubCategory object:", subCategory);
            return;
        }

        const subCategoryId = subCategory.sub_category_id;

        setLoading(true);
        try {
            const payload: UpdateSubCategoryPayload = {
                name: formData.name,
                is_active: formData.status === "Active",
            };

            await updateSubCategory(subCategoryId, payload);
            notifySuccess("Sub Category updated successfully");
            onSubmit?.();
            onClose();
        } catch (error) {
            notifyError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseDrawer open={open} onClose={onClose} title="Edit Sub Category" width={600}>
            <Stack spacing={4}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Sub Category Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter sub category name"
                                value={formData.name}
                                onChange={handleChange("name")}
                                variant="outlined"
                                fullWidth
                                error={!formData.name && loading}
                            />
                        </FormField>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Status <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledSelect
                                value={formData.status}
                                onChange={handleChange("status")}
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Update Sub Category"}
                    </Button>
                </Stack>
            </Stack>
        </BaseDrawer>
    );
};

export default EditSubCategoryDrawer;
