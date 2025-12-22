import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { CloseIcon } from "../icons/CommonIcons";
import { getBundleDetail, type Bundle } from "../../api/bundle";
import type { School } from "../../api/school";

interface BundleDetailsModalProps {
  open: boolean;
  onClose: () => void;
  bundle: (Bundle & { allProducts?: Bundle[]; total_bundle_price?: number }) | null;
  school: School | null;
  onEdit?: () => void;
}

interface ItemData {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  is_mandatory: boolean;
}

interface CategorySection {
  name: string;
  items: ItemData[];
}

const BundleDetailsModal: React.FC<BundleDetailsModalProps> = ({
  open,
  onClose,
  bundle,
  school,
  onEdit,
}) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [sections, setSections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  React.useEffect(() => {
    const fetchItemDetails = async () => {
      if (!bundle?.bundle_id) return;

      setLoading(true);
      try {
        const detail = await getBundleDetail(bundle.bundle_id);

        const commonBooks: ItemData[] = [];
        const stationary: ItemData[] = [];

        detail.allProducts.forEach((bp: any) => {
          const item: ItemData = {
            id: bp.product_id.toString(),
            name: bp.Product.name,
            quantity: bp.quantity,
            price: bp.price,
            image: bp.Product.images?.[0],
            is_mandatory: bp.is_mandatory === 1
          };

          if (item.is_mandatory) {
            commonBooks.push(item);
          } else {
            stationary.push(item);
          }
        });

        const sectionList: CategorySection[] = [];
        if (commonBooks.length > 0) {
          sectionList.push({ name: "Common books", items: commonBooks });
        }
        if (stationary.length > 0) {
          sectionList.push({ name: "Stationary", items: stationary });
        }

        setSections(sectionList);

        // Auto-expand sections
        const initialExpanded: { [key: string]: boolean } = {};
        sectionList.forEach(s => initialExpanded[s.name] = true);
        setExpandedSections(initialExpanded);
      } catch (error) {
        console.error("Failed to fetch product details for modal", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchItemDetails();
    }
  }, [open, bundle?.bundle_id]);

  if (!bundle || !school) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0px 0px 30px 0px #00000026",
          maxWidth: "860px",
          padding: "20px",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 0px 10px 0px",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Typography variant="sb20" sx={{ color: "#121318" }}>
          Bundle Details
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#121318",
            padding: "4px",
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ padding: "24px 0px 0px 0px !important" }}>
        <Stack spacing={3}>
          {/* Bundle Summary Card */}
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "none !important",
              border: "1px solid #CFCDCD4D",
            }}
          >
            <CardContent sx={{ padding: "20px" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.5}>
                  <Typography variant="sb24">
                    {bundle.name}
                  </Typography>
                  <Typography variant="r14" color="text.secondary">
                    {school.name}
                  </Typography>
                </Stack>
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography variant="sb24" sx={{ color: "#155DFC" }}>
                    ₹ {bundle.total_bundle_price}/-
                  </Typography>
                  <Typography variant="r14" sx={{ color: "text.secondary" }}>
                    inc of all taxes
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {sections.map((section) => (
            <Box
              key={section.name}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <Box
                onClick={() => toggleSection(section.name)}
                sx={{
                  backgroundColor: "#DFE6F7",
                  padding: "10px 15px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  borderBottomLeftRadius: expandedSections[section.name] ? "0px" : "12px",
                  borderBottomRightRadius: expandedSections[section.name] ? "0px" : "12px",
                }}
              >
                <Stack spacing={0.1}>
                  <Typography variant="m18" sx={{ color: "#121318" }}>
                    {section.name}
                  </Typography>
                  <Typography variant="r14">
                    {section.items.length} Items
                  </Typography>
                </Stack>
                <IconButton
                  size="small"
                  sx={{
                    color: "#121318",
                    padding: "4px",
                  }}
                >
                  {expandedSections[section.name] ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </Box>

              <Collapse in={expandedSections[section.name]}>
                <Box sx={{ padding: "16px 20px", backgroundColor: "#FFFFFF" }}>
                  <Stack spacing={2}>
                    {section.items.map((item) => (
                      <Card
                        key={item.id}
                        sx={{
                          borderRadius: "8px",
                          boxShadow: "none",
                          backgroundColor: "#F9F9F9",
                        }}
                      >
                        <CardContent
                          sx={{
                            padding: "12px 16px",
                            "&:last-child": {
                              paddingBottom: "12px",
                            },
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Stack direction="row" spacing={2} alignItems="center">
                              {item.image && (
                                <img src={item.image} alt="" style={{ width: "30px", height: "40px", objectFit: "contain" }} />
                              )}
                              <Stack spacing={0.5}>
                                <Typography variant="sb16">
                                  {item.name}
                                </Typography>
                                <Typography variant="m14">
                                  Qty : {item.quantity}
                                </Typography>
                              </Stack>
                            </Stack>
                            <Typography variant="sb18">
                              ₹ {item.price}/-
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          ))}

          {loading && (
            <Typography sx={{ textAlign: "center", py: 2 }}>Loading items...</Typography>
          )}

          {!loading && sections.length === 0 && (
            <Typography sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>No items found in this bundle</Typography>
          )}

          {/* Action Buttons */}
          {/* <Stack
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
              onClick={() => {
                if (onEdit) {
                  onEdit();
                }
                onClose();
              }}
              sx={{
                textTransform: "none",
              }}
            >
              Edit Bundle
            </Button>
          </Stack> */}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BundleDetailsModal;

