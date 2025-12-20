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
import { createCategory, type CreateCategoryPayload } from "../../api/category";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface CreateCategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export interface CategoryFormData {
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

const CreateCategoryDrawer: React.FC<CreateCategoryDrawerProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    visibility: "",
    categoryStatus: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CategoryFormData) => (
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

    setLoading(true);
    try {
      const payload: CreateCategoryPayload = {
        name: formData.categoryName,
        visibility: formData.visibility === "Private",
        is_active: formData.categoryStatus === "Active",
      };

      await createCategory(payload);
      notifySuccess("Category created successfully");
      onSubmit?.();
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDrawer open={open} onClose={onClose} title="Create Category" width={600}>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Category"}
          </Button>
        </Stack>
      </Stack>
    </BaseDrawer>
  );
};

export default CreateCategoryDrawer;
