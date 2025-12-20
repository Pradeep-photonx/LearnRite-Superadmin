import React, { useState } from "react";
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
} from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import { productsData } from "../utilities/productsData";
import type { Product } from "../utilities/productsData";
import { MoreActionsIcon } from "../components/icons/CommonIcons";
import CreateProductDrawer, { type ProductFormData } from "../components/drawers/CreateProductDrawer";
import CreateCategoryDrawer from "../components/drawers/CreateCategoryDrawer";
import CreateSubCategoryDrawer from "../components/drawers/CreateSubCategoryDrawer";
import EditCategoryDrawer from "../components/drawers/EditCategoryDrawer";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import { getCategoryList, deleteCategory, getSubCategoryList, type Category, type SubCategory } from "../api/category";
import { notifyError, notifySuccess } from "../utils/toastUtils";

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [isCreateProductDrawerOpen, setIsCreateProductDrawerOpen] = useState(false);
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
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

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

  React.useEffect(() => {
    if (activeTab === 0) {
      fetchCategories();
    }
  }, [activeTab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };



  const [activeMenuCategory, setActiveMenuCategory] = useState<Category | null>(null);

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, category?: Category) => {
    setActionMenuAnchor(event.currentTarget);
    if (category) {
      setActiveMenuCategory(category);
    }
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActiveMenuCategory(null);
  };

  const handleEditCategory = () => {
    if (activeMenuCategory) {
      setCategoryToEdit(activeMenuCategory);
      setIsEditCategoryDrawerOpen(true);
    }
    handleActionMenuClose();
  };

  const handleCloseEditCategoryDrawer = () => {
    setIsEditCategoryDrawerOpen(false);
    setCategoryToEdit(null);
  };

  const handleDeleteCategoryClick = () => {
    if (activeMenuCategory) {
      setCategoryToDelete(activeMenuCategory);
      setIsDeleteCategoryModalOpen(true);
    }
    handleActionMenuClose();
  };

  const handleCloseDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
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

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setLoadingSubCategories(true);
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
  };

  const handleAddProduct = () => {
    if (activeTab === 1) {
      setIsCreateProductDrawerOpen(true);
    } else if (selectedCategory) {
      setIsCreateSubCategoryDrawerOpen(true);
    } else {
      setIsCreateCategoryDrawerOpen(true);
    }
  };

  const handleCloseCreateProductDrawer = () => {
    setIsCreateProductDrawerOpen(false);
  };

  const handleCloseCreateCategoryDrawer = () => {
    setIsCreateCategoryDrawerOpen(false);
  };

  const handleCloseCreateSubCategoryDrawer = () => {
    setIsCreateSubCategoryDrawerOpen(false);
  };

  const handleSubmitProduct = (data: ProductFormData) => {
    // Handle product submission
    console.log("Product data:", data);
    // You can add API call here to save the product data
  };

  const handleSubmitCategory = () => {
    fetchCategories();
  };

  const handleUpdateCategory = () => {
    fetchCategories();
  }

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
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsData.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      {product.productImage && (
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Typography sx={{ fontWeight: 500 }}>
                        {product.productName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography>{product.sku}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{product.category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{product.currentStock}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>
                      {product.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          product.status === "In stock"
                            ? "#D5F8E7"
                            : product.status === "low stock"
                              ? "#FFF0EE"
                              : "#F3F4F6",
                        color:
                          product.status === "In stock"
                            ? "#17B168"
                            : product.status === "low stock"
                              ? "#EB291B"
                              : "#6B7280",
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
                      onClick={handleActionMenuOpen}
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
              ))}
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
                    <TableRow key={subCategory.subcategory_id}>
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
                          onClick={handleActionMenuOpen}
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
        {/* <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14">View Details</Typography>
        </MenuItem> */}
        <MenuItem onClick={handleEditCategory}>
          <Typography variant="r14">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteCategoryClick}>
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

      <DeleteConfirmationModal
        open={isDeleteCategoryModalOpen}
        onClose={handleCloseDeleteCategoryModal}
        onConfirm={handleConfirmDeleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete ${categoryToDelete?.name}? This action cannot be undone.`}
        loading={isDeleting}
      />

      {/* Create Product Drawer */}
      <CreateProductDrawer
        open={isCreateProductDrawerOpen}
        onClose={handleCloseCreateProductDrawer}
        onSubmit={handleSubmitProduct}
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
        onSubmit={() => console.log("Sub Category Created")}
      />
    </Box>
  );
};

export default Products;
