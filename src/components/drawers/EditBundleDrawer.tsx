import React, { useState, useEffect } from "react";
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
import { updateBundle, type Bundle, type UpdateBundlePayload } from "../../api/bundle";
import { getClassList, type Class } from "../../api/class";
import { getLanguageList, type Language } from "../../api/language";
import { notifyError, notifySuccess } from "../../utils/toastUtils";

interface EditBundleDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    bundle: Bundle | null;
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

const EditBundleDrawer: React.FC<EditBundleDrawerProps> = ({
    open,
    onClose,
    onSubmit,
    bundle,
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchInitialData = async () => {
        try {
            const [schoolsData, categoriesData, classesData, languagesData, productsData] = await Promise.all([
                getSchoolList(),
                getCategoryList(),
                getClassList(),
                getLanguageList(),
                getProductList(),
            ]);
            setSchools(schoolsData.rows);
            setCategories(categoriesData.rows);
            setClasses(classesData.rows);
            setLanguages(languagesData.rows);

            const allProductsList = productsData.rows;

            if (bundle) {
                const baseFormData = {
                    bundleName: bundle.name,
                    school_id: bundle.school_id.toString(),
                    class_id: bundle.class_id.toString(),
                    cl_id: bundle.cl_id.toString(),
                };

                // Pre-populate grouped bundles if they exist (legacy or if added to bundle object)
                if ((bundle as any).allProducts) {
                    const categorySections: Record<string, CategoryData> = {};
                    const uniqueCats = new Set<string>();
                    const uniqueSections = new Set<string>();

                    (bundle as any).allProducts.forEach((bp: any) => {
                        const productRow = allProductsList.find(row => row.Category.SubCategory.Product.product_id === bp.product_id);
                        if (productRow) {
                            const catId = productRow.Category.category_id.toString();
                            const subCatId = productRow.Category.SubCategory.sub_category_id.toString();
                            const sectionKey = `${catId}-${subCatId}`;

                            if (!categorySections[sectionKey]) {
                                categorySections[sectionKey] = {
                                    id: sectionKey,
                                    category: catId,
                                    subCategory: subCatId,
                                    products: []
                                };
                            }

                            categorySections[sectionKey].products.push({
                                id: bp.product_id.toString(),
                                product_id: bp.product_id,
                                productName: productRow.Category.SubCategory.Product.name,
                                productImage: productRow.Category.SubCategory.Product.images?.[0] || "",
                                quantity: bp.quantity,
                                is_mandatory: bp.is_mandatory ? 1 : 0
                            });

                            uniqueCats.add(catId);
                            uniqueSections.add(sectionKey);
                        }
                    });

                    // Load all necessary subcategories and products for the maps
                    const subCatData: Record<string, SubCategory[]> = {};
                    const productDataMap: Record<string, ProductListRow[]> = {};

                    await Promise.all(Array.from(uniqueCats).map(async (catId) => {
                        const data = await getSubCategoryList(Number(catId));
                        subCatData[catId] = data.rows;
                    }));

                    Array.from(uniqueSections).forEach(key => {
                        const [catId, subCatId] = key.split("-");
                        productDataMap[key] = allProductsList.filter(row =>
                            row.Category.category_id === Number(catId) &&
                            row.Category.SubCategory.sub_category_id === Number(subCatId)
                        );
                    });

                    setSubCategoriesMap(subCatData);
                    setProductsMap(productDataMap);

                    setFormData({
                        ...baseFormData,
                        categories: Object.values(categorySections).length > 0
                            ? Object.values(categorySections)
                            : [{ id: "1", category: "", subCategory: "", products: [] }]
                    });
                } else {
                    // Just set basic info if no products are provided in the list
                    setFormData(prev => ({
                        ...prev,
                        ...baseFormData,
                        categories: [{ id: "1", category: "", subCategory: "", products: [] }]
                    }));
                }
            }
        } catch (error) {
            notifyError(error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchInitialData();
        }
    }, [open, bundle]);

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
        if (!bundle) return;
        if (!formData.class_id || !formData.cl_id) {
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

        const payload: UpdateBundlePayload = {
            new_school_id: Number(formData.school_id),
            name: formData.bundleName,
            products: allProducts,
        };

        try {
            setIsSubmitting(true);
            await updateBundle(bundle.bundle_id, payload);
            notifySuccess("Bundle updated successfully");
            if (onSubmit) {
                onSubmit();
            }
            onClose();
        } catch (error) {
            notifyError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseDrawer open={open} onClose={onClose} title="Edit School Bundle" width={900}>
            <Stack spacing={4}>
                <Box>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormField>
                                <FormLabel>Bundle Name (Read Only)</FormLabel>
                                <StyledTextField
                                    value={formData.bundleName}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                />
                            </FormField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormField>
                                <FormLabel>School Name (Read Only)</FormLabel>
                                <StyledSelect
                                    value={formData.school_id}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                >
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
                                    Class (Read Only)
                                </FormLabel>
                                <StyledSelect
                                    value={formData.class_id}
                                    onChange={handleChange("class_id")}
                                    variant="outlined"
                                    fullWidth
                                    displayEmpty
                                    disabled
                                >
                                    <MenuItem value="" disabled>Select Class</MenuItem>
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
                                    Languages (Read Only)
                                </FormLabel>
                                <StyledSelect
                                    value={formData.cl_id}
                                    onChange={handleChange("cl_id")}
                                    variant="outlined"
                                    fullWidth
                                    displayEmpty
                                    disabled
                                >
                                    <MenuItem value="" disabled>Select language</MenuItem>
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
                                <Typography variant="sb16">Category Section {index + 1}</Typography>
                                <IconButton
                                    onClick={() => handleDeleteCategory(category.id)}
                                    sx={{ color: "#EF4444", "&:hover": { backgroundColor: "#FFF0EE" } }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>

                            <Grid container spacing={3} sx={{ marginBottom: "16px" }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormField>
                                        <FormLabel>Category</FormLabel>
                                        <StyledSelect
                                            value={category.category}
                                            onChange={handleCategoryChange(category.id, "category")}
                                            variant="outlined"
                                            fullWidth
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Select category</MenuItem>
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
                                        <FormLabel>Sub Category</FormLabel>
                                        <StyledSelect
                                            value={category.subCategory}
                                            onChange={handleCategoryChange(category.id, "subCategory")}
                                            variant="outlined"
                                            fullWidth
                                            displayEmpty
                                            disabled={!category.category}
                                        >
                                            <MenuItem value="" disabled>Select sub category</MenuItem>
                                            {(subCategoriesMap[category.category] || []).map((sub) => (
                                                <MenuItem key={sub.sub_category_id} value={sub.sub_category_id.toString()}>
                                                    {sub.name}
                                                </MenuItem>
                                            ))}
                                        </StyledSelect>
                                    </FormField>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FormField>
                                        <FormLabel>Add Products</FormLabel>
                                        <StyledSelect
                                            value=""
                                            onChange={(e) => handleAddProduct(category.id, e.target.value as string)}
                                            variant="outlined"
                                            fullWidth
                                            displayEmpty
                                            disabled={!category.subCategory}
                                        >
                                            <MenuItem value="" disabled>Add products</MenuItem>
                                            {(productsMap[`${category.category}-${category.subCategory}`] || [])
                                                .map((row) => (
                                                    <MenuItem key={row.Category.SubCategory.Product.product_id} value={row.Category.SubCategory.Product.product_id.toString()}>
                                                        {row.Category.SubCategory.Product.name}
                                                    </MenuItem>
                                                ))}
                                        </StyledSelect>
                                    </FormField>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: "transparent" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 500 }}>Product Name</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 500 }}>Quantity</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {category.products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        {product.productImage && (
                                                            <img src={product.productImage} alt="" style={{ width: "25px", height: "35px", objectFit: "contain" }} />
                                                        )}
                                                        <Typography variant="m16">{product.productName}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                                        <IconButton size="small" onClick={() => handleQuantityChange(category.id, product.id, -1)}>
                                                            <Remove sx={{ fontSize: "16px" }} />
                                                        </IconButton>
                                                        <TextField
                                                            value={product.quantity}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 1;
                                                                handleQuantityChange(category.id, product.id, val - product.quantity);
                                                            }}
                                                            inputProps={{ style: { textAlign: "center", padding: "2px" } }}
                                                            sx={{ width: "50px", height: "30px" }}
                                                        />
                                                        <IconButton size="small" onClick={() => handleQuantityChange(category.id, product.id, 1)}>
                                                            <Add sx={{ fontSize: "16px" }} />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <FormControlLabel
                                                        control={<Checkbox checked={product.is_mandatory === 1} onChange={(e) => handleMandatoryChange(category.id, product.id, e.target.checked)} />}
                                                        label="Mandatory"
                                                    />
                                                    <IconButton onClick={() => handleDeleteProduct(category.id, product.id)}>
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
                        fullWidth
                        sx={{ textTransform: "none", color: "#787E91", borderColor: "#CFCDCD66" }}
                    >
                        Add Another Category Section
                    </Button>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ borderTop: "1px solid #1214191A", paddingTop: "15px" }}>
                    <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none" }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        sx={{ textTransform: "none", minWidth: "120px" }}
                    >
                        {isSubmitting ? "Updating..." : "Update Bundle"}
                    </Button>
                </Stack>
            </Stack>
        </BaseDrawer>
    );
};

export default EditBundleDrawer;
