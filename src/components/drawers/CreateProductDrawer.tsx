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
} from "@mui/material";
import BaseDrawer from "./BaseDrawer";

interface CreateProductDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductFormData) => void;
}

export interface ProductFormData {
  productName: string;
  productSKU: string;
  category: string;
  productType: string;
  productDescription: string;
  price: string;
  discountPrice: string;
  stockQuantity: string;
  stockStatus: string;
  images?: File[];
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
  "& .MuiInputBase-inputMultiline": {
    minHeight: "100px",
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
const categoryOptions = ["Notebooks", "Pens", "Pencils", "Books", "Art Supplies", "Lab Equipment"];
const productTypeOptions = ["Physical", "Digital", "Service"];
const stockStatusOptions = ["In stock", "low stock", "Out of stock"];

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

const CreateProductDrawer: React.FC<CreateProductDrawerProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    productSKU: "",
    category: "",
    productType: "",
    productDescription: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    stockStatus: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (field: keyof ProductFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...fileArray],
      }));

      // Create previews
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  // const handleRemoveImage = (index: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     images: prev.images?.filter((_, i) => i !== index) || [],
  //   }));
  //   setImagePreviews((prev) => {
  //     const newPreviews = [...prev];
  //     URL.revokeObjectURL(newPreviews[index]);
  //     return newPreviews.filter((_, i) => i !== index);
  //   });
  // };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };



  return (
    <BaseDrawer open={open} onClose={onClose} title="Create Product" width={900}>
      <Stack spacing={4}>
        {/* Product Details Section */}
        <Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Product Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={handleChange("productName")}
                  variant="outlined"
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Product SKU <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="example@gmail.com"
                  value={formData.productSKU}
                  onChange={handleChange("productSKU")}
                  variant="outlined"
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Category <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.category}
                  onChange={handleChange("category")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select category
                  </MenuItem>
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Product Type <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.productType}
                  onChange={handleChange("productType")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select product type
                  </MenuItem>
                  {productTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField>
                <FormLabel>
                  Product Description <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="Enter product description"
                  value={formData.productDescription}
                  onChange={handleChange("productDescription")}
                  variant="outlined"
                  fullWidth
                />
              </FormField>
            </Grid>
          </Grid>
        </Box>

        {/* Images Section */}
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
              padding: "40px 20px",
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
              onChange={handleImageUpload}
            />
            {imagePreviews.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <img
                  src={imagePreviews[0]}
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

        {/* Pricing & Stock Section */}
        <Box>
          <Typography variant="sb16"
            sx={{
              display: "flex",
              marginBottom: "16px",
              padding: "0px 0px 10px 0px",
              borderBottom: "1px solid #E5E7EB",
            }}>
            Pricing & stock
          </Typography>
          <Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormField>
                  <FormLabel>
                    Price <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                  </FormLabel>
                  <StyledTextField
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange("price")}
                    variant="outlined"
                    fullWidth
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormField>
                  <FormLabel>
                    Discount Price <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                  </FormLabel>
                  <StyledTextField
                    placeholder="Enter discounted price"
                    value={formData.discountPrice}
                    onChange={handleChange("discountPrice")}
                    variant="outlined"
                    fullWidth
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormField>
                  <FormLabel>
                    Stock Quantity <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                  </FormLabel>
                  <StyledTextField
                    placeholder="Enter available quantity"
                    value={formData.stockQuantity}
                    onChange={handleChange("stockQuantity")}
                    variant="outlined"
                    fullWidth
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormField>
                  <FormLabel>
                    Stock Status <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                  </FormLabel>
                  <StyledSelect
                    value={formData.stockStatus}
                    onChange={handleChange("stockStatus")}
                    variant="outlined"
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Visibility
                    </MenuItem>
                    {stockStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormField>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{
            marginTop: "44px !important",
            borderTop: "1px solid #1214191A",
            paddingTop: "15px",
            display: "flex",
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
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
            sx={{
              textTransform: "none",
            }}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>
    </BaseDrawer>
  );
};

export default CreateProductDrawer;

