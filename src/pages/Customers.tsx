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
  InputBase,
} from "@mui/material";
// Unused imports FilterList and SearchIcon removed
import { customersData } from "../utilities/customersData";
import type { Customer } from "../utilities/customersData";
import { FilterIcon, MoreActionsIcon } from "../components/icons/CommonIcons";

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  // Filter customers based on search query
  const filteredCustomers = customersData.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.customerName.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      (customer.phone && customer.phone.includes(query))
    );
  });

  return (
    <Box>
      {/* Header Section */}

      {/* Table Section */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid #CFCDCD4D",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 30px 0px #0000000F",
          padding: "20px",
        }}
      >
        <Stack spacing={3} sx={{ marginBottom: "20px" }}>
          <Typography variant="sb20">Customer Management</Typography>

          {/* Search and Filter Section */}
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "20px" }}
          >
            {/* Search Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #D1D4DE",
                borderRadius: "12px",
                padding: "12px 16px",
                flex: 1,
                maxWidth: "280px",
                height: "48px",
                backgroundColor: "#FFFFFF",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "16px",
                  display: "flex",
                  alignItems: "center",
                  color: "#787E91",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99822 1.33325C6.09461 1.33333 5.20413 1.54949 4.40105 1.96371C3.59798 2.37793 2.90561 2.9782 2.38171 3.71442C1.8578 4.45065 1.51756 5.30148 1.38935 6.19595C1.26115 7.09041 1.34872 8.00257 1.64473 8.85631C1.94075 9.71005 2.43665 10.4806 3.09104 11.1037C3.74543 11.7269 4.53935 12.1844 5.40656 12.4383C6.27377 12.6922 7.18911 12.735 8.07623 12.5632C8.96335 12.3914 9.79651 12.0099 10.5062 11.4506L12.9409 13.8853C13.0666 14.0067 13.235 14.0739 13.4098 14.0724C13.5846 14.0709 13.7518 14.0007 13.8754 13.8771C13.999 13.7535 14.0691 13.5863 14.0707 13.4115C14.0722 13.2367 14.005 13.0683 13.8836 12.9426L11.4489 10.5079C12.1075 9.67233 12.5177 8.66819 12.6323 7.6104C12.7469 6.55262 12.5614 5.48393 12.097 4.52665C11.6327 3.56936 10.9081 2.76216 10.0064 2.19741C9.1047 1.63266 8.06219 1.33318 6.99822 1.33325ZM2.66488 6.99992C2.66488 5.85065 3.12143 4.74845 3.93409 3.93579C4.74674 3.12313 5.84895 2.66659 6.99822 2.66659C8.14749 2.66659 9.24969 3.12313 10.0623 3.93579C10.875 4.74845 11.3316 5.85065 11.3316 6.99992C11.3316 8.14919 10.875 9.25139 10.0623 10.064C9.24969 10.8767 8.14749 11.3333 6.99822 11.3333C5.84895 11.3333 4.74674 10.8767 3.93409 10.064C3.12143 9.25139 2.66488 8.14919 2.66488 6.99992Z" fill="#1F2026" />
                </svg>

                {/* <SearchIcon sx={{ fontSize: "20px" }} /> */}
              </Box>
              <InputBase
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  paddingLeft: "25px",
                  "& .MuiInputBase-input::placeholder": {
                    color: "#787E91",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Select Filter Button */}
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterOpen}
              sx={{
                borderColor: "#121318",
                color: "text.secondary",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#121318",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Select Filter
            </Button>

            {/* Filter Menu */}
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={handleFilterClose}
              PaperProps={{
                sx: {
                  marginTop: "8px",
                  borderRadius: "8px",
                  minWidth: "180px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <MenuItem onClick={handleFilterClose}>
                <Typography variant="r14">All Customers</Typography>
              </MenuItem>
              <MenuItem onClick={handleFilterClose}>
                <Typography variant="r14">Active</Typography>
              </MenuItem>
              <MenuItem onClick={handleFilterClose}>
                <Typography variant="r14">Inactive</Typography>
              </MenuItem>
              <MenuItem onClick={handleFilterClose}>
                <Typography variant="r14">Public</Typography>
              </MenuItem>
              <MenuItem onClick={handleFilterClose}>
                <Typography variant="r14">Private</Typography>
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Customer Type</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer: Customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>
                    {customer.customerName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{customer.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{customer.customerType}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{String(customer.orders).padStart(2, "0")}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        customer.status === "Active" ? "#D5F8E7" : "#F3F4F6",
                      color: customer.status === "Active" ? "#17B168" : "#6B7280",
                      fontWeight: 500,
                      fontSize: "14px",
                      borderRadius: "12px",
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
        <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <Typography variant="r14" sx={{ color: "#E24600" }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Customers;
