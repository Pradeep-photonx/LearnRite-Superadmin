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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import BaseDrawer from "./BaseDrawer";
import { getCategoryList, getSubCategoryList, type Category, type SubCategory } from "../../api/category";
import { getBrandList, type Brand } from "../../api/brand";
import { createProduct, type CreateProductPayload } from "../../api/product";
import { notifyError, notifySuccess } from "../../utils/toastUtils";
import { fileToBase64, compressImage } from "../../utils/fileUtils";


interface CreateProductDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductFormData) => void;
}

export interface ProductFormData {
  productName: string;
  // productSKU: string;
  category: string;
  productType: string;
  brand: string;
  productDescription: string;
  mrp: string;
  sellingPrice: string;
  discountPercentage: string;
  stockQuantity: string;
  status: string;

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

const CreateProductDrawer: React.FC<CreateProductDrawerProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    // productSKU: "",
    category: "",
    productType: "",
    brand: "",
    productDescription: "",
    mrp: "",
    sellingPrice: "",
    discountPercentage: "",
    stockQuantity: "",
    status: "",

    images: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const currentImagesCount = formData.images?.length || 0;

      if (currentImagesCount + fileArray.length > 5) {
        notifyError("You can only upload a maximum of 5 images.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...fileArray],
      }));

      // Create previews
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await getCategoryList();
      setCategories(data.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubCategories = async (categoryId: number) => {
    try {
      setLoadingSubCategories(true);
      const data = await getSubCategoryList(categoryId);
      setSubCategories(data.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const data = await getBrandList();
      setBrands(data.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchBrands();
    }
  }, [open]);

  useEffect(() => {
    if (formData.category) {
      fetchSubCategories(Number(formData.category));
      // Reset subcategory when category changes
      setFormData(prev => ({ ...prev, productType: "" }));
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  useEffect(() => {
    const mrp = parseFloat(formData.mrp);
    const sellingPrice = parseFloat(formData.sellingPrice);

    if (!isNaN(mrp) && !isNaN(sellingPrice) && mrp > 0) {
      const discount = ((mrp - sellingPrice) / mrp) * 100;
      setFormData((prev) => ({
        ...prev,
        discountPercentage: discount > 0 ? discount.toFixed(2) : "0.00",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        discountPercentage: "",
      }));
    }
  }, [formData.mrp, formData.sellingPrice]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.productName || !formData.category || !formData.productType || !formData.productDescription || !formData.mrp || !formData.sellingPrice || !formData.stockQuantity || !formData.status) {

      notifyError("Please fill in all required fields");
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      notifyError("Please upload at least one product image.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Compress images aggressively (0.4 quality, 800px max width) and then convert to base64
      const compressedImages = await Promise.all((formData.images || []).map(file => compressImage(file, 0.4, 800)));

      const base64Images = await Promise.all(compressedImages.map(file => fileToBase64(file)));

      // Diagnostic logging for payload size
      const imageSizes = base64Images.map(img => (img.length / 1024).toFixed(2) + " KB");
      const totalSize = (JSON.stringify(base64Images).length / 1024).toFixed(2);
      console.log("Image sizes:", imageSizes);
      console.log("Total images size:", totalSize + " KB");

      const payload: CreateProductPayload = {
        category_id: Number(formData.category),
        sub_category_id: Number(formData.productType),
        brand_id: Number(formData.brand),
        name: formData.productName,
        description: formData.productDescription,
        image1: base64Images[0] || "",
        image2: base64Images[1] || "",
        image3: base64Images[2] || "",
        image4: base64Images[3] || "",
        image5: base64Images[4] || "",
        mrp: Number(formData.mrp),
        selling_price: Number(formData.sellingPrice),
        discount_percentage: Number(formData.discountPercentage),
        stock_quantity: Number(formData.stockQuantity),
        is_active: formData.status === "Active",
      };

      console.log("Final Payload Size (approx):", (JSON.stringify(payload).length / 1024).toFixed(2) + " KB");




      await createProduct(payload);
      notifySuccess("Product created successfully");

      if (onSubmit) {
        onSubmit(formData);
      }
      onClose();
    } catch (error: any) {
      notifyError(error.response?.data?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
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
            {/* <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid> */}
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
                    {loadingCategories ? "Loading categories..." : "Select Category"}
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.category_id} value={cat.category_id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Sub Category <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.productType}
                  onChange={handleChange("productType")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    {loadingSubCategories ? "Loading subcategories..." : "Select Sub Category"}
                  </MenuItem>
                  {subCategories.map((sub) => (
                    <MenuItem key={sub.sub_category_id} value={sub.sub_category_id.toString()}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Brand <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.brand}
                  onChange={handleChange("brand")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    {loadingBrands ? "Loading brands..." : "Select Brand"}
                  </MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.brand_id} value={brand.brand_id.toString()}>
                      {brand.name}
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
        <Box sx={{ margin: "15px 0px 0px 0px !important" }}>
          <Typography variant="sb16" sx={{ marginBottom: "8px", color: "#121318" }}>
            Product Images (Min 1, Max 5) <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
          </Typography>

          <Box
            sx={{
              border: "2px dashed #D1D4DE",
              borderRadius: "8px",
              padding: "40px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              cursor: imagePreviews.length >= 5 ? "default" : "pointer",
              marginTop: "10px",
              backgroundColor: "#FFFFFF",
              opacity: imagePreviews.length >= 5 ? 0.6 : 1,
              "&:hover": {
                backgroundColor: imagePreviews.length >= 5 ? "#FFFFFF" : "#F9FAFB",
              },
            }}
            onClick={() => imagePreviews.length < 5 && document.getElementById("product-images-upload")?.click()}
          >
            <input
              id="product-images-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
              disabled={imagePreviews.length >= 5}
            />
            <Box
              sx={{
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="32" height="32" rx="4" stroke="#9CA3AF" strokeWidth="2" fill="none" />
                <circle cx="14" cy="14" r="2" fill="#9CA3AF" />
                <path d="M8 28L16 20L24 28L32 20L40 28V36H8V28Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <Typography variant="r14" sx={{ color: "#121318" }}>
                {imagePreviews.length >= 5 ? "Maximum images reached" : "Upload Product Images"}
              </Typography>
              {imagePreviews.length < 5 && (
                <Typography variant="r14" sx={{ color: "#2C65F9", textDecoration: "underline" }}>
                  Click to browse
                </Typography>
              )}
            </Box>
          </Box>

          {/* Previews Grid Below the upload field */}
          <Grid container spacing={2} sx={{ marginTop: "16px" }}>
            {imagePreviews.map((preview, index) => (
              <Grid size={{ xs: "auto" }} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #D1D4DE",
                  }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        color: "#EF4444",
                      },
                      padding: "2px",
                      "& .MuiSvgIcon-root": {
                        fontSize: "14px",
                      },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
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
              <Grid size={{ xs: 12, md: 5 }}>
                <FormField>
                  <FormLabel>
                    MRP <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                  </FormLabel>
                  <StyledTextField
                    type="number"
                    placeholder="Enter mrp"
                    value={formData.mrp}
                    onChange={handleChange("mrp")}
                    variant="outlined"
                    fullWidth
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <FormField>
                  <FormLabel>
                    Selling Price <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                  </FormLabel>
                  <StyledTextField
                    type="number"
                    placeholder="Enter selling price"
                    value={formData.sellingPrice}
                    onChange={handleChange("sellingPrice")}
                    variant="outlined"
                    fullWidth
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormField>
                  <FormLabel>
                    Discount (%) <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                  </FormLabel>
                  <StyledTextField
                    placeholder="0.00"
                    value={formData.discountPercentage}
                    variant="outlined"
                    fullWidth
                    disabled
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        backgroundColor: "#F3F4F6",
                        borderRadius: "12px",
                      }
                    }}
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
                      Select Status
                    </MenuItem>
                    {statusOptions.map((status) => (
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
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              minWidth: "120px",
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
          </Button>
        </Stack>
      </Stack>
    </BaseDrawer>
  );
};

export default CreateProductDrawer;

