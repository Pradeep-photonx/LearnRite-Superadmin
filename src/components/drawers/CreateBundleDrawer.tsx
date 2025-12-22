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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import BaseDrawer from "./BaseDrawer";
import { DeleteIcon } from "../icons/CommonIcons";
import { getSchoolList, type School } from "../../api/school";
import { getCategoryList, getSubCategoryList, type Category, type SubCategory } from "../../api/category";
import { getProductList, type ProductListRow } from "../../api/product";
import { createBundle, type CreateBundlePayload } from "../../api/bundle";
import { getClassList, type Class } from "../../api/class";
import { getLanguageList, type Language } from "../../api/language";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface CreateBundleDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: BundleFormData) => void;
  schoolName?: string;
}

export interface BundleFormData {
  bundleName: string;
  school_id: string;
  class_id: string;
  cl_id: string;
  categories: CategoryData[];
}

export interface CategoryData {
  id: string;
  category: string;
  subCategory: string;
  products: ProductData[];
}

export interface ProductData {
  id: string;
  product_id: number;
  productName: string;
  productImage?: string;
  quantity: number;
  is_mandatory: number;
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

// Dropdown options

// No mock products needed anymore

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
}) => {
  const [formData, setFormData] = useState<BundleFormData>({
    bundleName: "",
    school_id: "",
    class_id: "",
    cl_id: "",
    categories: [
      {
        id: "1",
        category: "",
        subCategory: "",
        products: [],
      },
    ],
  });

  const [schools, setSchools] = useState<School[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState<Record<string, SubCategory[]>>({});
  const [productsMap, setProductsMap] = useState<Record<string, ProductListRow[]>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [schoolsData, categoriesData, classesData, languagesData] = await Promise.all([
        getSchoolList(),
        getCategoryList(),
        getClassList(),
        getLanguageList(),
      ]);
      setSchools(schoolsData.rows);
      setCategories(categoriesData.rows);
      setClasses(classesData.rows);
      setLanguages(languagesData.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  const fetchSubCategories = async (categoryId: string) => {
    if (!categoryId || subCategoriesMap[categoryId]) return;
    try {
      const data = await getSubCategoryList(Number(categoryId));
      setSubCategoriesMap(prev => ({ ...prev, [categoryId]: data.rows }));
    } catch (error) {
      notifyError(error);
    }
  };

  const fetchProducts = async (categoryId: string, subCategoryId: string) => {
    const key = `${categoryId}-${subCategoryId}`;
    if (!subCategoryId || productsMap[key]) return;
    try {
      const data = await getProductList();
      // Filter products by category and subcategory
      const filteredProducts = data.rows.filter(row =>
        row.Category.category_id === Number(categoryId) &&
        row.Category.SubCategory.sub_category_id === Number(subCategoryId)
      );
      setProductsMap(prev => ({ ...prev, [key]: filteredProducts }));
    } catch (error) {
      notifyError(error);
    }
  };

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
    const value = event.target.value as string;
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, [field]: value, ...(field === "category" ? { subCategory: "", products: [] } : { products: [] }) } : cat
      ),
    }));

    if (field === "category") {
      fetchSubCategories(value);
    } else if (field === "subCategory") {
      const cat = formData.categories.find(c => c.id === categoryId);
      if (cat) {
        fetchProducts(cat.category, value);
      }
    }
  };

  const handleAddCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: Date.now().toString(),
          category: "",
          subCategory: "",
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

  const handleAddProduct = (categoryId: string, productId: string) => {
    const category = formData.categories.find(c => c.id === categoryId);
    if (!category) return;

    const key = `${category.category}-${category.subCategory}`;
    const productRow = productsMap[key]?.find(row => row.Category.SubCategory.Product.product_id === Number(productId));
    if (!productRow) return;

    const product = productRow.Category.SubCategory.Product;

    if (category.products.find(p => p.product_id === product.product_id)) {
      notifyError("Product already added to this category section");
      return;
    }

    const newProduct: ProductData = {
      id: Date.now().toString(),
      product_id: product.product_id,
      productName: product.name,
      productImage: product.images?.[0] || "",
      quantity: 1,
      is_mandatory: 1,
    };

    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, products: [...cat.products, newProduct] }
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

  const handleMandatoryChange = (categoryId: string, productId: string, isMandatory: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
            ...cat,
            products: cat.products.map((p) =>
              p.id === productId ? { ...p, is_mandatory: isMandatory ? 1 : 0 } : p
            ),
          }
          : cat
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.bundleName || !formData.school_id || !formData.class_id || !formData.cl_id) {
      notifyError("Please fill in all required bundle details");
      return;
    }

    const allProducts = formData.categories.flatMap(cat =>
      cat.products.map(p => ({
        product_id: p.product_id,
        quantity: p.quantity,
        is_mandatory: p.is_mandatory
      }))
    );

    if (allProducts.length === 0) {
      notifyError("Please add at least one product to the bundle");
      return;
    }

    const payload: CreateBundlePayload = {
      class_id: Number(formData.class_id),
      cl_id: Number(formData.cl_id),
      school_id: Number(formData.school_id),
      name: formData.bundleName,
      products: allProducts,
    };

    try {
      setIsSubmitting(true);
      await createBundle(payload);
      notifySuccess("Bundle created successfully");
      if (onSubmit) {
        onSubmit(formData);
      }
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      setIsSubmitting(false);
    }
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
                  value={formData.school_id}
                  onChange={handleChange("school_id")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select school
                  </MenuItem>
                  {schools.map((school) => (
                    <MenuItem key={school.school_id} value={school.school_id.toString()}>
                      {school.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Class<Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.class_id}
                  onChange={handleChange("class_id")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Class
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.class_id} value={cls.class_id.toString()}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField>
                <FormLabel>
                  Languages <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                </FormLabel>
                <StyledSelect
                  value={formData.cl_id}
                  onChange={handleChange("cl_id")}
                  variant="outlined"
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select language
                  </MenuItem>
                  {languages.map((lang) => (
                    <MenuItem key={lang.cl_id} value={lang.cl_id.toString()}>
                      {lang.language}
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
                        {loading ? "Loading categories..." : "Select category"}
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
                      value={category.subCategory}
                      onChange={handleCategoryChange(category.id, "subCategory")}
                      variant="outlined"
                      fullWidth
                      displayEmpty
                      disabled={!category.category}
                    >
                      <MenuItem value="" disabled>
                        {!category.category ? "Select Category first" : "Select sub category"}
                      </MenuItem>
                      {(subCategoriesMap[category.category] || []).map((sub) => (
                        <MenuItem key={sub.sub_category_id} value={sub.sub_category_id.toString()}>
                          {sub.name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormField>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormField>
                    <FormLabel>
                      Products <Typography component="span" sx={{ color: "#EF4444" }}>*</Typography>
                    </FormLabel>
                    <StyledSelect
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddProduct(category.id, e.target.value as string);
                        }
                      }}
                      variant="outlined"
                      fullWidth
                      displayEmpty
                      disabled={!category.subCategory}
                    >
                      <MenuItem value="" disabled>
                        {!category.subCategory ? "Select Sub Category first" : "Add products"}
                      </MenuItem>
                      {(productsMap[`${category.category}-${category.subCategory}`] || [])
                        .filter(row => row.Category.SubCategory.sub_category_id === Number(category.subCategory))
                        .map((row) => (
                          <MenuItem key={row.Category.SubCategory.Product.product_id} value={row.Category.SubCategory.Product.product_id.toString()}>
                            {row.Category.SubCategory.Product.name}
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
                                  border: "1px solid #1213181A",
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
                          <FormControlLabel control={<Checkbox
                            checked={product.is_mandatory === 1}
                            onChange={(e) => handleMandatoryChange(category.id, product.id, e.target.checked)}
                            sx={{
                              color: "#D96200",
                              borderRadius: "4px",
                              padding: "0px 10px 0px 0px",
                              '&.Mui-checked': {
                                color: "#D96200",
                                borderRadius: "4px",
                              },
                            }}
                          />} label="Mandatory" />
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
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              minWidth: "120px",
            }}
          >
            {isSubmitting ? "Creating..." : "Create Bundle"}
          </Button>
        </Stack>
      </Stack>
    </BaseDrawer >
  );
};

export default CreateBundleDrawer;

