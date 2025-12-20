import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Grid,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import BaseDrawer from "./BaseDrawer";
import { DeleteIcon } from "../icons/CommonIcons";

interface CreateBundleDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: BundleFormData) => void;
  schoolName?: string;
}

export interface BundleFormData {
  bundleName: string;
  schoolName: string;
  grade: string;
  secondLanguage: string;
  categories: CategoryData[];
}

export interface CategoryData {
  id: string;
  category: string;
  bundleContents: string;
  products: ProductData[];
}

export interface ProductData {
  id: string;
  productName: string;
  productImage?: string;
  quantity: number;
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
const gradeOptions = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const languageOptions = ["Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati"];
const categoryOptions = ["Notebooks", "Pens", "Pencils", "Books", "Art Supplies", "Lab Equipment"];
const bundleContentsOptions = ["Standard Bundle", "Premium Bundle", "Custom Bundle"];

// Mock product data
const mockProducts: ProductData[] = [
  {
    id: "1",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    quantity: 1,
  },
  {
    id: "2",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    quantity: 1,
  },
];

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

const CreateBundleDrawer: React.FC<CreateBundleDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  schoolName = "",
}) => {
  const [formData, setFormData] = useState<BundleFormData>({
    bundleName: "",
    schoolName: schoolName,
    grade: "",
    secondLanguage: "",
    categories: [
      {
        id: "1",
        category: "",
        bundleContents: "",
        products: [],
      },
    ],
  });

  const handleChange = (field: keyof BundleFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (categoryId: string, field: keyof CategoryData) => (
    event: { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      ),
    }));
  };

  const handleAddCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: Date.now().toString(),
          category: "",
          bundleContents: "",
          products: [],
        },
      ],
    }));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
    }));
  };

  const handleAddProducts = (categoryId: string) => {
    // When bundle contents is selected, add mock products
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, products: [...mockProducts] }
          : cat
      ),
    }));
  };

  const handleDeleteProduct = (categoryId: string, productId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, products: cat.products.filter((p) => p.id !== productId) }
          : cat
      ),
    }));
  };

  const handleQuantityChange = (categoryId: string, productId: string, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
            ...cat,
            products: cat.products.map((p) =>
              p.id === productId
                ? { ...p, quantity: Math.max(1, p.quantity + delta) }
                : p
            ),
          }
          : cat
      ),
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };



  return (
    <BaseDrawer open={open} onClose={onClose} title="Create School Bundle" width={900}>
      <Stack spacing={4}>
        {/* General Bundle Information */}
        <Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Bundle Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledTextField
                  placeholder="Enter full name"
                  value={formData.bundleName}
                  onChange={handleChange("bundleName")}
                  variant="outlined"
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  School Name <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.schoolName}
                  onChange={handleChange("schoolName")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select school
                  </MenuItem>
                  <MenuItem value={schoolName}>{schoolName}</MenuItem>
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Grade <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.grade}
                  onChange={handleChange("grade")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Grade
                  </MenuItem>
                  {gradeOptions.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Second Language <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.secondLanguage}
                  onChange={handleChange("secondLanguage")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select language
                  </MenuItem>
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
          </Grid>
        </Box>

        {/* Bundle Items */}
        <Box>
          <Typography variant="sb16" sx={{ marginBottom: "10px !important", display: "flex" }}>
            Bundle Items
          </Typography>
          {formData.categories.map((category, index) => (
            <Box
              key={category.id}
              sx={{
                marginBottom: "24px",
                padding: "15px",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: "16px" }}>
                <Typography variant="sb16">
                  Categories {index + 1}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteCategory(category.id)}
                  sx={{
                    color: "#EF4444",
                    padding: "4px",
                    "&:hover": {
                      backgroundColor: "#FFF0EE",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>

              <Grid container spacing={3} sx={{ marginBottom: "16px" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField>
                    <FormLabel>
                      Category <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                    </FormLabel>
                    <StyledSelect
                      value={category.category}
                      onChange={handleCategoryChange(category.id, "category")}
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
                      Sub Category <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                    </FormLabel>
                    <StyledSelect
                      value={category.category}
                      onChange={handleCategoryChange(category.id, "category")}
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
                <Grid size={{ xs: 12 }}>
                  <FormField>
                    <FormLabel>
                      Bundle contents <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                    </FormLabel>
                    <StyledSelect
                      value={category.bundleContents}
                      onChange={(e) => {
                        handleCategoryChange(category.id, "bundleContents")(e);
                        if (e.target.value) {
                          handleAddProducts(category.id);
                        }
                      }}
                      variant="outlined"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select products
                      </MenuItem>
                      {bundleContentsOptions.map((content) => (
                        <MenuItem key={content} value={content}>
                          {content}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormField>
                </Grid>
              </Grid>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: "unset !important",
                  border: "unset !important",
                  backgroundColor: "unset !important",
                  boxShadow: "unset !important",
                  padding: "unset !important",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "#FFFFFF",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#121318",
                          borderBottom: "1px solid #E5E7EB",
                          padding: "12px 16px",
                        }}
                      >
                        Product Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: "#FFFFFF",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#121318",
                          borderBottom: "1px solid #E5E7EB",
                          padding: "12px 16px",
                        }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: "#FFFFFF",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#121318",
                          borderBottom: "1px solid #E5E7EB",
                          padding: "12px 16px",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.products.map((product,) => (
                      <TableRow
                        key={product.id}
                      //   sx={{
                      //     backgroundColor: "#121318",
                      //     "&:hover": {
                      //       backgroundColor: "#121318",
                      //     },
                      //   }}
                      >
                        <TableCell
                          sx={{
                            borderBottom: "1px solid #2A2A2A",
                            padding: "12px 16px",
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            {product.productImage && (
                              <img
                                src={product.productImage}
                                alt={product.productName}
                                style={{
                                  width: "25px",
                                  height: "35px",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                            <Typography
                              variant="m16"
                            >
                              {product.productName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: "1px solid #2A2A2A",
                            padding: "12px 16px",
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(category.id, product.id, -1)}>
                              <Remove sx={{ fontSize: "16px", color: "#121318" }} />
                            </IconButton>
                            <TextField
                              type="number"
                              value={product.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                setFormData((prev) => ({
                                  ...prev,
                                  categories: prev.categories.map((cat) =>
                                    cat.id === category.id
                                      ? {
                                        ...cat,
                                        products: cat.products.map((p) =>
                                          p.id === product.id ? { ...p, quantity: Math.max(1, value) } : p
                                        ),
                                      }
                                      : cat
                                  ),
                                }));
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  padding: "8px",
                                },
                                min: 1,
                              }}
                              sx={{
                                width: "60px",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  height: "32px",
                                  boxShadow: "none !important",
                                  border: "1px solid#1213181A",
                                },
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(category.id, product.id, 1)}
                            >
                              <Add sx={{ fontSize: "16px", color: "#121318" }} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "1px solid #2A2A2A",
                            padding: "12px 16px",
                          }}
                        >
                          <IconButton
                            onClick={() => handleDeleteProduct(category.id, product.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddCategory}
            sx={{
              borderColor: "#CFCDCD66",
              color: "#787E91",
              textTransform: "none",
              width: "100%",
              //   marginTop: "16px",
              "&:hover": {
                borderColor: "#CFCDCD66",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Add Another Category
          </Button>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: "24px", borderTop: "1px solid #1214191A", paddingTop: "15px" }}>
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
            Create Bundle
          </Button>
        </Stack>
      </Stack>
    </BaseDrawer>
  );
};

export default CreateBundleDrawer;

