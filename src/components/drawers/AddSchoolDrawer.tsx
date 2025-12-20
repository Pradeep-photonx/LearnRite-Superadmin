import React, { useState } from "react";
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
import { registerSchool } from "../../api/school";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface AddSchoolDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: SchoolFormData) => void;
}

export interface SchoolFormData {
  schoolName: string;
  branch: string;
  board: string;
  adminName: string;
  email: string;
  mobileNumber: string;
  status: string;
  role: string;
  admissionCheck: boolean;
  sendInviteEmail: boolean;
  logo?: File | null;
  address: string;
  admission_id: boolean;
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


const AddSchoolDrawer: React.FC<AddSchoolDrawerProps> = ({
  open,
  onClose,
  onSubmit, // Optional, can be used for parent refresh
}) => {
  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: "",
    branch: "",
    board: "",
    adminName: "",
    email: "",
    mobileNumber: "",
    status: "",
    role: "Admin",
    admissionCheck: true,
    sendInviteEmail: true,
    logo: null,
    address: "",
    admission_id: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SchoolFormData, string>>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (field: keyof SchoolFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
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
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SchoolFormData, string>> = {};

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }
    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }
    if (!formData.board) {
      newErrors.board = "Board is required";
    }
    if (!formData.adminName.trim()) {
      newErrors.adminName = "Admin name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    if (!formData.logo && !logoPreview) {
      // Assuming logo is required as per validtion
      // If logic differs, remove this.
    }

    setErrors(newErrors);
    console.log("Validation Errors:", newErrors);
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
    if (validateForm()) {
      setLoading(true);
      setApiError(null);

      try {
        let imageBase64 = "";
        if (formData.logo) {
          imageBase64 = await convertFileToBase64(formData.logo);
        } else if (logoPreview) {
          // In case of edit or preserved state, logic might be needed
          imageBase64 = logoPreview;
        }

        const payload = {
          school_name: formData.schoolName,
          branch: formData.branch,
          board: formData.board,
          fullname: formData.adminName,
          email: formData.email,
          mobile_number: formData.mobileNumber,
          status: formData.status,
          image: imageBase64,
          address: formData.address || "",
          admission_id: formData.admission_id,
        };

        console.log("Registering School Payload:", payload);
        const response = await registerSchool(payload);
        console.log("Registration Success:", response);
        notifySuccess("School registered successfully");

        onSubmit?.(formData);

        // Reset form
        setFormData({
          schoolName: "",
          branch: "",
          board: "",
          adminName: "",
          email: "",
          mobileNumber: "",
          status: "",
          role: "Admin",
          admissionCheck: true,
          sendInviteEmail: true,
          logo: null,
          address: "",
          admission_id: false,
        });
        setLogoPreview(null);
        setErrors({});
        onClose();

      } catch (error: any) {
        notifyError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      schoolName: "",
      branch: "",
      board: "",
      adminName: "",
      email: "",
      mobileNumber: "",
      status: "",
      role: "Admin",
      admissionCheck: true,
      sendInviteEmail: true,
      logo: null,
      address: "",
      admission_id: false,
    });
    setLogoPreview(null);
    setErrors({});
    setApiError(null);
    onClose();
  };



  // const StyledCheckbox = styled(Checkbox)({
  //   padding: "4px",
  //   color: "#D1D4DE",
  //   "&.Mui-checked": {
  //     color: "#FFFFFF",
  //     "& .MuiSvgIcon-root": {
  //       backgroundColor: "#FAB446",
  //       borderRadius: "4px",
  //       border: "none",
  //       "& path": {
  //         fill: "#FFFFFF",
  //         stroke: "#FFFFFF",
  //         strokeWidth: 2,
  //       },
  //     },
  //   },
  //   "& .MuiSvgIcon-root": {
  //     borderRadius: "4px",
  //     border: "1px solid #D1D4DE",
  //     width: "20px",
  //     height: "20px",
  //     transition: "all 0.2s ease-in-out",
  //     backgroundColor: "transparent",
  //   },
  //   "&:hover": {
  //     "& .MuiSvgIcon-root": {
  //       borderColor: "#FAB446",
  //     },
  //   },
  // });

  return (
    <BaseDrawer open={open} onClose={onClose} title="Add School" width={900}>
      <Stack spacing={4}>
        {apiError && (
          <Alert severity="error">{apiError}</Alert>
        )}

        {/* School Details Section */}
        <Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormField>
                <FormLabel>
                  School Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="Enter school name"
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
                  placeholder="Enter branch name"
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
                  placeholder="Enter board name"
                  value={formData.board}
                  onChange={handleChange("board")}
                  variant="outlined"
                  fullWidth
                  error={!!errors.board}
                  helperText={errors.board}
                />
              </FormField>
            </Grid>
          </Grid>
        </Box>

        {/* Admin Details Section */}
        <Box>
          <Typography variant="sb20" sx={{
            borderBottom: "1px solid #1213181A",
            paddingBottom: "10px",
            marginBottom: "20px",
            display: "flex",
          }}>
            Admin Details
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Admin Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="Enter admin name"
                  value={formData.adminName}
                  onChange={handleChange("adminName")}
                  variant="outlined"
                  fullWidth
                  error={!!errors.adminName}
                  helperText={errors.adminName}
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Phone Number<Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="Enter phone number or email"
                  value={formData.mobileNumber}
                  onChange={handleChange("mobileNumber")}
                  variant="outlined"
                  fullWidth
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
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
                    borderRadius: '12px',
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.status ? "#d32f2f" : undefined
                    }
                  }}
                >
                  <MenuItem value="" disabled>Select Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
                {errors.status && <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>{errors.status}</Typography>}
              </FormField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField>
                <FormLabel>
                  Address
                </FormLabel>
                <StyledTextField
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange("address")}
                  variant="outlined"
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField>
                <FormLabel>
                  Role <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="Enter role"
                  value={formData.role}
                  onChange={handleChange("role")}
                  variant="outlined"
                  disabled
                  fullWidth
                />
              </FormField>
            </Grid>

          </Grid>
        </Box>

        {/* Additional Options */}
        <Box sx={{ margin: "15px 0px 0px 0px !important" }}>
          <FormGroup sx={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <FormControlLabel control={<Checkbox
              checked={formData.admission_id}
              onChange={(e) => setFormData({ ...formData, admission_id: e.target.checked })}
              sx={{
                color: "#D96200",
                borderRadius: "4px",
                padding: "0px 05px 0px 10px",
                '&.Mui-checked': {
                  color: "#D96200",
                  borderRadius: "4px",
                },
              }}

            />} label="Admission Check" />
            {/* <FormControlLabel control={<Checkbox defaultChecked
          sx={{
            color: "#D96200",
            borderRadius: "4px",
            padding: "0px 05px 0px 10px",
            '&.Mui-checked': {
              color: "#D96200",
              borderRadius: "4px",
            },
          }}
          />} label="Send Invite Email" /> */}
          </FormGroup>
        </Box>

        {/* Logo Upload */}
        <Box sx={{
          margin: "15px 0px 0px 0px !important"
        }}>
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
              position: "relative",
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
            onClick={() => document.getElementById("logo-upload")?.click()}
          >
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleLogoUpload}
            />
            {logoPreview ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "150px",
                    borderRadius: "8px",
                  }}
                />
                <Typography
                  variant="r14"
                  sx={{ marginTop: "12px", color: "#2C65F9", cursor: "pointer", }}
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("logo-upload")?.click();
                  }}
                >
                  Click to change
                </Typography>
              </Box>
            ) : (
              <>
                {/* Picture/Image Icon */}
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

                {/* Text Content */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
                  <Typography
                    variant="r14"
                    sx={{
                      color: "#121318",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Upload School logo
                  </Typography>
                  <Typography
                    variant="r14"
                    component="span"
                    sx={{
                      color: "#2C65F9",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Click to browse
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{
          marginTop: "15px 0px 0px 0px !important",
          borderTop: "1px solid #1214191A",
          paddingTop: "15px",

        }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Admin"}
          </Button>
        </Stack>
      </Stack>
    </BaseDrawer>
  );
}; // End of AddSchoolDrawer component

export default AddSchoolDrawer;
