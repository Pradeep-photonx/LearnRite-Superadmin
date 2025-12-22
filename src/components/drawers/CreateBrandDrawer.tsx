import React, { useState } from "react";
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
import { createBrand, type CreateBrandPayload } from "../../api/brand";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface CreateBrandDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export interface BrandFormData {
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

const statusOptions = ["Active", "Inactive"];

const CreateBrandDrawer: React.FC<CreateBrandDrawerProps> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<BrandFormData>({
        name: "",
        status: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof BrandFormData) => (
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

        setLoading(true);
        try {
            const payload: CreateBrandPayload = {
                name: formData.name,
                is_active: formData.status === "Active",
            };

            await createBrand(payload);
            notifySuccess("Brand created successfully");
            onSubmit();
            onClose();
            // Reset form
            setFormData({
                name: "",
                status: "",
            });
        } catch (error) {
            notifyError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseDrawer open={open} onClose={onClose} title="Add Brand" width={600}>
            <Stack spacing={4}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <FormField>
                            <FormLabel>
                                Brand Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                            </FormLabel>
                            <StyledTextField
                                placeholder="Enter brand name"
                                value={formData.name}
                                onChange={handleChange("name")}
                                variant="outlined"
                                fullWidth
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Brand"}
                    </Button>
                </Stack>
            </Stack>
        </BaseDrawer>
    );
};

export default CreateBrandDrawer;
