import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";


import { Add, ArrowBack } from "@mui/icons-material";
import { MoreActionsIcon } from "../components/icons/CommonIcons";
import CreateProductDrawer, { type ProductFormData } from "../components/drawers/CreateProductDrawer";
import EditProductDrawer from "../components/drawers/EditProductDrawer";
import CreateCategoryDrawer from "../components/drawers/CreateCategoryDrawer";
import CreateSubCategoryDrawer from "../components/drawers/CreateSubCategoryDrawer";
import CreateBrandDrawer from "../components/drawers/CreateBrandDrawer";
import EditCategoryDrawer from "../components/drawers/EditCategoryDrawer";
import EditSubCategoryDrawer from "../components/drawers/EditSubCategoryDrawer";
import EditBrandDrawer from "../components/drawers/EditBrandDrawer";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import { getCategoryList, deleteCategory, getSubCategoryList, deleteSubCategory, type Category, type SubCategory } from "../api/category";
import { getBrandList, deleteBrand, type Brand } from "../api/brand";
import { getProductList, deleteProduct, type ProductListRow } from "../api/product";

import { notifyError, notifySuccess } from "../utils/toastUtils";


const Products: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [isCreateProductDrawerOpen, setIsCreateProductDrawerOpen] = useState(false);
  const [isEditProductDrawerOpen, setIsEditProductDrawerOpen] = useState(false);
  const [isCreateCategoryDrawerOpen, setIsCreateCategoryDrawerOpen] = useState(false);
  const [isCreateSubCategoryDrawerOpen, setIsCreateSubCategoryDrawerOpen] = useState(false);
  const [isEditCategoryDrawerOpen, setIsEditCategoryDrawerOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [subCategoryToEdit, setSubCategoryToEdit] = useState<SubCategory | null>(null);
  const [isEditSubCategoryDrawerOpen, setIsEditSubCategoryDrawerOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<SubCategory | null>(null);
  const [isDeleteSubCategoryModalOpen, setIsDeleteSubCategoryModalOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [isCreateBrandDrawerOpen, setIsCreateBrandDrawerOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [isEditBrandDrawerOpen, setIsEditBrandDrawerOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleteBrandModalOpen, setIsDeleteBrandModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductListRow[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [activeMenuProduct, setActiveMenuProduct] = useState<any | null>(null);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);


  // Helper function to create URL-friendly slug from category name
  const createSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoryList();
      setCategories(data.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
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

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getProductList();
      setProducts(data.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoadingProducts(false);
    }
  };


  React.useEffect(() => {
    if (activeTab === 0) {
      fetchCategories();
    } else if (activeTab === 1) {
      fetchProducts();
    } else if (activeTab === 2) {
      fetchBrands();
    }

  }, [activeTab]);

  // Restore selected category from URL on mount
  React.useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const category = categories.find(c => createSlug(c.name) === categorySlug);
      if (category && !selectedCategory) {
        handleCategoryClick(category);
      }
    }
  }, [categorySlug, categories]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };



  const [activeMenuCategory, setActiveMenuCategory] = useState<Category | null>(null);
  const [activeMenuSubCategory, setActiveMenuSubCategory] = useState<SubCategory | null>(null);
  const [activeMenuBrand, setActiveMenuBrand] = useState<Brand | null>(null);

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, category?: Category, subCategory?: SubCategory, brand?: Brand, product?: any) => {
    setActionMenuAnchor(event.currentTarget);
    if (category) {
      setActiveMenuCategory(category);
    }
    if (subCategory) {
      setActiveMenuSubCategory(subCategory);
    }
    if (brand) {
      setActiveMenuBrand(brand);
    }
    if (product) {
      setActiveMenuProduct(product);
    }
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActiveMenuCategory(null);
    setActiveMenuSubCategory(null);
    setActiveMenuBrand(null);
    setActiveMenuProduct(null);
  };

  const handleEditCategory = () => {
    if (activeMenuCategory) {
      setCategoryToEdit(activeMenuCategory);
      setIsEditCategoryDrawerOpen(true);
    }
    handleActionMenuClose();
  };

  const handleEditSubCategory = () => {
    if (activeMenuSubCategory) {
      setSubCategoryToEdit(activeMenuSubCategory);
      setIsEditSubCategoryDrawerOpen(true);
    }
    handleActionMenuClose();
  };

  const handleEditBrand = () => {
    if (activeMenuBrand) {
      setBrandToEdit(activeMenuBrand);
      setIsEditBrandDrawerOpen(true);
    }
    handleActionMenuClose();
  };

  const handleEditProduct = () => {
    if (activeMenuProduct) {
      setProductToEdit(activeMenuProduct);
      setIsEditProductDrawerOpen(true);
    }
    handleActionMenuClose();
  };

  const handleCloseEditCategoryDrawer = () => {
    setIsEditCategoryDrawerOpen(false);
    setCategoryToEdit(null);
  };

  const handleCloseEditSubCategoryDrawer = () => {
    setIsEditSubCategoryDrawerOpen(false);
    setSubCategoryToEdit(null);
  };

  const handleCloseEditBrandDrawer = () => {
    setIsEditBrandDrawerOpen(false);
    setBrandToEdit(null);
  };

  const handleDeleteBrandClick = () => {
    if (activeMenuBrand) {
      setBrandToDelete(activeMenuBrand);
      setIsDeleteBrandModalOpen(true);
    }
    handleActionMenuClose();
  };

  const handleDeleteProductClick = () => {
    if (activeMenuProduct) {
      setProductToDelete(activeMenuProduct);
      setIsDeleteProductModalOpen(true);
    }
    handleActionMenuClose();
  };

  const handleDeleteCategoryClick = () => {
    if (activeMenuCategory) {
      setCategoryToDelete(activeMenuCategory);
      setIsDeleteCategoryModalOpen(true);
    }
    handleActionMenuClose();
  };

  const handleDeleteSubCategoryClick = () => {
    if (activeMenuSubCategory) {
      setSubCategoryToDelete(activeMenuSubCategory);
      setIsDeleteSubCategoryModalOpen(true);
    }
    handleActionMenuClose();
  };

  const handleCloseDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleCloseDeleteSubCategoryModal = () => {
    setIsDeleteSubCategoryModalOpen(false);
    setSubCategoryToDelete(null);
  };

  const handleCloseDeleteBrandModal = () => {
    setIsDeleteBrandModalOpen(false);
    setBrandToDelete(null);
  };

  const handleCloseDeleteProductModal = () => {
    setIsDeleteProductModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        setIsDeleting(true);
        await deleteCategory(categoryToDelete.category_id);
        notifySuccess("Category deleted successfully");
        handleCloseDeleteCategoryModal();
        fetchCategories();
      } catch (error) {
        notifyError(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleConfirmDeleteSubCategory = async () => {
    if (!subCategoryToDelete) return;

    console.log("Full subCategoryToDelete object:", subCategoryToDelete);
    console.log("Available properties:", Object.keys(subCategoryToDelete));

    const subCategoryId = subCategoryToDelete.sub_category_id;
    console.log("Extracted subCategoryId:", subCategoryId);

    if (!subCategoryId) {
      notifyError("Invalid subcategory ID");
      console.error("SubCategory object:", subCategoryToDelete);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteSubCategory(subCategoryId);
      notifySuccess("Sub Category deleted successfully");
      if (selectedCategory) {
        handleCategoryClick(selectedCategory);
      }
      handleCloseDeleteSubCategoryModal();
    } catch (error) {
      notifyError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteBrand = async () => {
    if (brandToDelete) {
      try {
        setIsDeleting(true);
        await deleteBrand(brandToDelete.brand_id);
        notifySuccess("Brand deleted successfully");
        handleCloseDeleteBrandModal();
        fetchBrands();
      } catch (error) {
        notifyError(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        setIsDeleting(true);
        const productData = productToDelete.Category.SubCategory.Product;
        await deleteProduct(productData.product_id);
        notifySuccess("Product deleted successfully");
        handleCloseDeleteProductModal();
        fetchProducts();
      } catch (error) {
        notifyError(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setLoadingSubCategories(true);
    // Update URL with category slug
    const slug = createSlug(category.name);
    navigate(`/products/categories/${slug}`, { replace: true });
    try {
      const data = await getSubCategoryList(category.category_id);
      setSubCategories(data.rows);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSubCategories([]);
    // Navigate back to products page
    navigate('/products', { replace: true });
  };

  const handleAddProduct = () => {
    if (activeTab === 1) {
      setIsCreateProductDrawerOpen(true);
    } else if (activeTab === 2) {
      setIsCreateBrandDrawerOpen(true);
    } else if (selectedCategory) {
      setIsCreateSubCategoryDrawerOpen(true);
    } else {
      setIsCreateCategoryDrawerOpen(true);
    }
  };

  const handleCloseCreateProductDrawer = () => {
    setIsCreateProductDrawerOpen(false);
  };

  const handleCloseEditProductDrawer = () => {
    setIsEditProductDrawerOpen(false);
    setProductToEdit(null);
  };

  const handleCloseCreateCategoryDrawer = () => {
    setIsCreateCategoryDrawerOpen(false);
  };

  const handleCloseCreateSubCategoryDrawer = () => {
    setIsCreateSubCategoryDrawerOpen(false);
  };

  const handleCloseCreateBrandDrawer = () => {
    setIsCreateBrandDrawerOpen(false);
  };

  const handleSubmitProduct = (_data: ProductFormData) => {
    fetchProducts();
  };


  const handleSubmitCategory = () => {
    fetchCategories();
  };

  const handleSubmitSubCategory = () => {
    // Refresh subcategories for the selected category
    if (selectedCategory) {
      handleCategoryClick(selectedCategory);
    }
  };

  const handleUpdateCategory = () => {
    fetchCategories();
  }

  const handleUpdateSubCategory = () => {
    if (selectedCategory) {
      handleCategoryClick(selectedCategory);
    }
  };

  const handleSubmitBrand = () => {
    fetchBrands();
  };

  const handleUpdateBrand = () => {
    fetchBrands();
  };

  const handleUpdateProduct = () => {
    fetchProducts();
  };

  return (
    <Box sx={{
      padding: "20px",
      background: "#FFFFFF",
      borderRadius: "12px",
      boxShadow: "0px 0px 30px 0px #0000000F",
    }}>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ marginBottom: "14px" }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {selectedCategory && (
            <IconButton
              onClick={handleBackToCategories}
              sx={{
                padding: 0,
                color: "#121318",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="sb20" sx={{ marginBottom: "0" }}>
            {selectedCategory ? selectedCategory.name : "Products & Categories"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">

          {activeTab === 1 ? (
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: "20px" }} />}
              onClick={handleAddProduct}
              sx={{
                textTransform: "none",
              }}
            >
              Add Products
            </Button>
          ) : selectedCategory ? (
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: "20px" }} />}
              onClick={handleAddProduct}
              sx={{
                textTransform: "none",
              }}
            >
              Add Sub Categories
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: "20px" }} />}
              onClick={handleAddProduct}
              sx={{
                textTransform: "none",
              }}
            >
              Add Categories
            </Button>
          )}
        </Stack>
      </Stack>


      {/* Tabs */}
      {!selectedCategory && (
        <Box sx={{ borderBottom: 1, borderColor: "divider", }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                // width: "100%",
                fontSize: "16px",
                fontWeight: 500,
                color: "#121318",
                minHeight: "48px",
                padding: "0 16px",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#2C65F9",
                height: "3px",
              },
            }}
          >
            <Tab label="Categories" />
            <Tab label="Products" />
            <Tab label="Brands" />
          </Tabs>
        </Box>
      )}

      {/* Tab Content */}
      {activeTab === 1 && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "unset !important",
            backgroundColor: "unset !important",
            boxShadow: "unset !important",
            padding: "0",
            marginTop: "20px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sub Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>MRP</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {loadingProducts ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">Loading Products...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">No Products Found</TableCell>
                </TableRow>
              ) : (
                products.map((row: ProductListRow) => {
                  const product = row.Category.SubCategory.Product;
                  const categoryName = row.Category.name;
                  const subCategoryName = row.Category.SubCategory.name;

                  return (
                    <TableRow key={product.product_id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          {product.images && product.images.length > 0 && (
                            <img
                              src={product.images[0]}
                              // alt={product.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                          )}

                          <Typography sx={{ fontWeight: 500 }}>
                            {product.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography>{categoryName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{subCategoryName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{product.stock_quantity}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{product.mrp}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{product.selling_price}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{product.discount_percentage}%</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_active ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            backgroundColor:
                              product.is_active
                                ? "#D5F8E7"
                                : "#FFF0EE",
                            color:
                              product.is_active
                                ? "#17B168"
                                : "#EB291B",
                            fontWeight: 500,
                            fontSize: "14px",
                            borderRadius: "12px",
                            textTransform: "capitalize",
                            "& .MuiChip-label": {
                              padding: "6px 10px",
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, undefined, undefined, undefined, row)}
                          sx={{
                            color: "#121318",
                            padding: "4px",
                            "&:focus": {
                              outline: "none !important",
                            },
                          }}
                        >
                          <MoreActionsIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}


            </TableBody>
          </Table>
        </TableContainer>
      )}


      {activeTab === 0 && !selectedCategory && (
        <Box
        >

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "unset !important",
              backgroundColor: "unset !important",
              boxShadow: "unset !important",
              padding: "0",
              marginTop: "20px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Total Products</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Loading...</TableCell>
                  </TableRow>
                ) : (
                  categories.map((category: Category) => (
                    <TableRow key={category.category_id}>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            cursor: 'pointer',
                            // color: '#2C65F9',
                            // '&:hover': {
                            //   textDecoration: 'underline'
                            // }
                          }}
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{category.products_count}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{category.visibility ? "Private" : "Public"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.is_active ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            backgroundColor:
                              category.is_active
                                ? "#D5F8E7"
                                : "#FFF0EE",
                            color:
                              category.is_active
                                ? "#17B168"
                                : "#EB291B",
                            fontWeight: 500,
                            fontSize: "14px",
                            borderRadius: "12px",
                            textTransform: "capitalize",
                            "& .MuiChip-label": {
                              padding: "6px 10px",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, category)}
                          sx={{
                            color: "#121318",
                            padding: "4px",
                            "&:focus": {
                              outline: "none !important",
                            },
                          }}
                        >
                          <MoreActionsIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      )}

      {activeTab === 0 && selectedCategory && (
        <Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "unset !important",
              backgroundColor: "unset !important",
              boxShadow: "unset !important",
              padding: "0",
              marginTop: "20px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sub Category Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingSubCategories ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Loading...</TableCell>
                  </TableRow>
                ) : subCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No Sub Categories Found</TableCell>
                  </TableRow>
                ) : (
                  subCategories.map((subCategory: SubCategory) => (
                    <TableRow key={subCategory.sub_category_id}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>
                          {subCategory.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={subCategory.is_active ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            backgroundColor:
                              subCategory.is_active
                                ? "#D5F8E7"
                                : "#FFF0EE",
                            color:
                              subCategory.is_active
                                ? "#17B168"
                                : "#EB291B",
                            fontWeight: 500,
                            fontSize: "14px",
                            borderRadius: "12px",
                            textTransform: "capitalize",
                            "& .MuiChip-label": {
                              padding: "6px 10px",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, undefined, subCategory)}
                          sx={{
                            color: "#121318",
                            padding: "4px",
                            "&:focus": {
                              outline: "none !important",
                            },
                          }}
                        >
                          <MoreActionsIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Brands Tab */}
      {activeTab === 2 && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "unset !important",
            backgroundColor: "unset !important",
            boxShadow: "unset !important",
            padding: "0",
            marginTop: "20px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Brand Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingBrands ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Brands Found
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand) => (
                  <TableRow key={brand.brand_id}>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={brand.is_active ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          color: brand.is_active ? "#17B168" : "#EB291B",
                          backgroundColor: brand.is_active ? "#D5F8E7" : "#FFF0EE",
                          borderRadius: "12px",
                          textTransform: "capitalize",
                          "& .MuiChip-label": {
                            padding: "6px 10px",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionMenuOpen(e, undefined, undefined, brand)}
                        sx={{
                          color: "#121318",
                          padding: "4px",
                          "&:focus": {
                            outline: "none !important",
                          },
                        }}
                      >
                        <MoreActionsIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            marginTop: "8px",
            borderRadius: "8px",
            minWidth: "160px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <MenuItem onClick={activeMenuBrand ? handleEditBrand : (activeMenuSubCategory ? handleEditSubCategory : (activeMenuProduct ? handleEditProduct : handleEditCategory))}>
          <Typography variant="r14">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={activeMenuBrand ? handleDeleteBrandClick : (activeMenuSubCategory ? handleDeleteSubCategoryClick : (activeMenuProduct ? handleDeleteProductClick : handleDeleteCategoryClick))}>
          <Typography variant="r14" sx={{ color: "#E24600" }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      {/* Edit Category Drawer */}
      <EditCategoryDrawer
        open={isEditCategoryDrawerOpen}
        onClose={handleCloseEditCategoryDrawer}
        onSubmit={handleUpdateCategory}
        category={categoryToEdit}
      />

      {/* Edit Sub Category Drawer */}
      <EditSubCategoryDrawer
        open={isEditSubCategoryDrawerOpen}
        onClose={handleCloseEditSubCategoryDrawer}
        onSubmit={handleUpdateSubCategory}
        subCategory={subCategoryToEdit}
      />

      <DeleteConfirmationModal
        open={isDeleteCategoryModalOpen}
        onClose={handleCloseDeleteCategoryModal}
        onConfirm={handleConfirmDeleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete ${categoryToDelete?.name}? This action cannot be undone.`}
        loading={isDeleting}
      />

      <DeleteConfirmationModal
        open={isDeleteSubCategoryModalOpen}
        onClose={handleCloseDeleteSubCategoryModal}
        onConfirm={handleConfirmDeleteSubCategory}
        title="Delete Sub Category"
        description={`Are you sure you want to delete ${subCategoryToDelete?.name}? This action cannot be undone.`}
        loading={isDeleting}
      />

      <DeleteConfirmationModal
        open={isDeleteBrandModalOpen}
        onClose={handleCloseDeleteBrandModal}
        onConfirm={handleConfirmDeleteBrand}
        title="Delete Brand"
        description={`Are you sure you want to delete ${brandToDelete?.name}? This action cannot be undone.`}
        loading={isDeleting}
      />

      {/* Create Product Drawer */}
      <CreateProductDrawer
        open={isCreateProductDrawerOpen}
        onClose={handleCloseCreateProductDrawer}
        onSubmit={handleSubmitProduct}
      />

      {/* Edit Product Drawer */}
      <EditProductDrawer
        open={isEditProductDrawerOpen}
        onClose={handleCloseEditProductDrawer}
        product={productToEdit?.Category?.SubCategory?.Product || null}
        onSubmit={handleUpdateProduct}
      />

      {/* Create Category Drawer */}
      <CreateCategoryDrawer
        open={isCreateCategoryDrawerOpen}
        onClose={handleCloseCreateCategoryDrawer}
        onSubmit={handleSubmitCategory}
      />

      {/* Create Sub Category Drawer */}
      <CreateSubCategoryDrawer
        open={isCreateSubCategoryDrawerOpen}
        onClose={handleCloseCreateSubCategoryDrawer}
        onSubmit={handleSubmitSubCategory}
        parentCategory={selectedCategory}
      />

      {/* Create Brand Drawer */}
      <CreateBrandDrawer
        open={isCreateBrandDrawerOpen}
        onClose={handleCloseCreateBrandDrawer}
        onSubmit={handleSubmitBrand}
      />

      {/* Edit Brand Drawer */}
      <EditBrandDrawer
        open={isEditBrandDrawerOpen}
        onClose={handleCloseEditBrandDrawer}
        onSubmit={handleUpdateBrand}
        brand={brandToEdit}
      />
      <DeleteConfirmationModal
        open={isDeleteProductModalOpen}
        onClose={handleCloseDeleteProductModal}
        onConfirm={handleConfirmDeleteProduct}
        title="Delete Product"
        description={`Are you sure you want to delete ${productToDelete?.Category.SubCategory.Product.name}? This action cannot be undone.`}
        loading={isDeleting}
      />
    </Box>
  );
};

export default Products;
