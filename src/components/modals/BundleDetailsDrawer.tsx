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
import type { Bundle } from "../../utilities/bundlesData";
import type { School } from "../../utilities/schoolsData";

interface BundleDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  bundle: Bundle | null;
  school: School | null;
  onEdit?: () => void;
}

interface ItemData {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

const BundleDetailsDrawer: React.FC<BundleDetailsDrawerProps> = ({
  open,
  onClose,
  bundle,
  school,
  onEdit,
}) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    commonBooks: true,
    stationary: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Mock data for items
  const commonBooksItems: ItemData[] = [
    { id: "1", name: "My First Steps with Cambridge", quantity: 1, price: "₹ 110/-" },
    { id: "2", name: "My First Steps with Cambridge", quantity: 1, price: "₹ 110/-" },
    { id: "3", name: "My First Steps with Cambridge", quantity: 1, price: "₹ 110/-" },
    { id: "4", name: "My First Steps with Cambridge", quantity: 1, price: "₹ 110/-" },
  ];

  const stationaryItems: ItemData[] = [
    { id: "1", name: "Notebook", quantity: 1, price: "₹ 50/-" },
    { id: "2", name: "Pen", quantity: 2, price: "₹ 20/-" },
  ];

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
          padding:"20px",
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
                  {bundle.bundleName}
                </Typography>
                <Typography variant="r14" color="text.secondary">
                  {school.schoolName}
                </Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="flex-end">
                <Typography variant="sb24" sx={{ color: "#155DFC" }}>
                  {bundle.price}
                </Typography>
                <Typography variant="r14" sx={{ color: "text.secondary" }}>
                  inc of all taxes
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Common Books Section */}
        <Box
          sx={{
            // border: "1px solid #E5E7EB",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Section Header */}
          <Box
            onClick={() => toggleSection("commonBooks")}
            sx={{
              backgroundColor: "#DFE6F7",
              padding: "10px 15px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              borderBottomLeftRadius: expandedSections.commonBooks ? "0px" : "12px",
              borderBottomRightRadius: expandedSections.commonBooks ? "0px" : "12px",
            }}
          >
            <Stack spacing={0.1}>
              <Typography variant="m18" sx={{ color: "#121318" }}>
                Common Books
              </Typography>
              <Typography variant="r14">
                7 Books
              </Typography>
            </Stack>
            <IconButton
              size="small"
              sx={{
                color: "#121318",
                padding: "4px",
              }}
            >
              {expandedSections.commonBooks ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )}
            </IconButton>
          </Box>

          {/* Section Content */}
          <Collapse in={expandedSections.commonBooks}>
            <Box sx={{ padding: "16px 20px", backgroundColor: "#FFFFFF", border:"unset !important" }}>
              <Stack spacing={2}>
                {commonBooksItems.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      borderRadius: "8px",
                      boxShadow: "none",
                      // border: "1px solid #E5E7EB",
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
                        <Stack spacing={0.5}>
                          <Typography variant="sb16">
                            {item.name}
                          </Typography>
                          <Typography variant="m14">
                            Qty : {item.quantity}
                          </Typography>
                        </Stack>
                        <Typography variant="sb18">
                          {item.price}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </Box>

        {/* Stationary Section */}
        <Box
          sx={{
            // border: "1px solid #E5E7EB",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Section Header */}
          <Box
            onClick={() => toggleSection("stationary")}
            sx={{
              backgroundColor: "#DFE6F7",
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottomLeftRadius: expandedSections.stationary ? "0px" : "12px",
              borderBottomRightRadius: expandedSections.stationary ? "0px" : "12px",
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="m18" sx={{ color: "#121318" }}>
                Stationary
              </Typography>
              <Typography variant="r14">
                7 Items
              </Typography>
            </Stack>
            <IconButton
              size="small"
              sx={{
                color: "#121318",
                padding: "4px",
              }}
            >
              {expandedSections.stationary ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )}
            </IconButton>
          </Box>

          {/* Section Content */}
          <Collapse in={expandedSections.stationary}>
            <Box sx={{ padding: "16px 20px", backgroundColor: "#FFFFFF", border:"unset !important" }}>
              <Stack spacing={2}>
                {stationaryItems.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      borderRadius: "8px",
                      boxShadow: "none",
                      // border: "1px solid #E5E7EB",
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
                        <Stack spacing={0.5}>
                          <Typography variant="sb16">
                            {item.name}
                          </Typography>
                          <Typography variant="m14">
                            Qty : {item.quantity}
                          </Typography>
                        </Stack>
                          <Typography variant="sb18">
                          {item.price}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </Box>

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
        </Stack>
      </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BundleDetailsDrawer;

