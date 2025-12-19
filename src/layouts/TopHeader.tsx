import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  Avatar,
  Badge,
} from "@mui/material";
import {
  KeyboardArrowDown,
  SearchRounded,
  ArrowBack,
  Notifications,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ArrowDownIcon, NotificationIcon, SearchIcon } from "../components/icons/CommonIcons";

const dateFilterOptions = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Last 6 months",
  "Last year",
];

const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const [dateFilterAnchor, setDateFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState("Last 30 days");
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleDateFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDateFilterAnchor(event.currentTarget);
  };

  const handleDateFilterClose = () => {
    setDateFilterAnchor(null);
  };

  const handleDateFilterSelect = (option: string) => {
    setSelectedDateFilter(option);
    setDateFilterAnchor(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        padding: "12px 30px",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        {/* Left Section: Back Arrow and Search */}
        <Stack direction="row" alignItems="center" spacing={2} flex={1}>
          

          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
              border: "1px solid #D1D4DE",
              backgroundColor: "#FFFFFF",
              px: "15px",
              py: "10px",
              flex: 1,
              maxWidth: "440px",
              height: "48px",
              position: "relative",
            }}
          >
            <Box position="absolute" right="15px">
              <SearchIcon />
            </Box>
            <InputBase
              sx={{
                flex: 1,
                fontSize: "14px",
                fontWeight: 500,
                // fontFamily: "Figtree, sans-serif",
                "& .MuiInputBase-input::placeholder": {
                  color: "#787E91",
                  opacity: 1,
                },
              }}
              placeholder="Search for books, stationary, school products..."
              inputProps={{ "aria-label": "search" }}
            />
          </Paper>
        </Stack>

        {/* Right Section: Notifications, User Profile, Date Filter */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Notification Bell */}
          <IconButton
            sx={{
              color: "#121318",
              padding: "8px",
              border:"1px solid #1213181A",
              backgroundColor: "#FFF",
              "&:hover": {
                backgroundColor: "#FFF",
                border:"1px solid #1213181A",
              },
            }}
          >
            <Badge badgeContent={0} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>

          {/* User Profile */}
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={1.5}
            sx={{
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
            onClick={handleUserMenuOpen}
          >
            <Avatar
              sx={{
                width: "40px",
                height: "40px",
                backgroundColor: "#2C65F9",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              LR
            </Avatar>
            <Box sx={{
              display:"flex",
              flexDirection:"column",
              gap:"1px",
              marginLeft:"15px !important",
            }}>
              <Typography
                variant="m16"
                // sx={{
                //   color: "#121318",
                //   fontSize: "14px",
                //   fontWeight: 600,
                //   lineHeight: "20px",
                // }}
              >
                Learnrite
              </Typography>
              <Typography
                variant="m12"
                sx={{
                  color: "#787E91",
                }}
              >
                Super Admin
              </Typography>
            </Box>
            <ArrowDownIcon />
          </Stack>

          {/* Date Filter */}
          {/* <Button
            variant="outlined"
            onClick={handleDateFilterOpen}
            endIcon={<KeyboardArrowDown />}
            sx={{
              borderColor: "#D1D4DE",
              color: "#121318",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: "8px",
              fontFamily: "Figtree, sans-serif",
              "&:hover": {
                borderColor: "#2C65F9",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            {selectedDateFilter}
          </Button> */}

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                marginTop: "8px",
                borderRadius: "8px",
                minWidth: "200px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <Typography variant="r14">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <Typography variant="r14">Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <Typography variant="r14">Logout</Typography>
            </MenuItem>
          </Menu>

          {/* Date Filter Menu */}
          <Menu
            anchorEl={dateFilterAnchor}
            open={Boolean(dateFilterAnchor)}
            onClose={handleDateFilterClose}
            PaperProps={{
              sx: {
                marginTop: "8px",
                borderRadius: "8px",
                minWidth: "180px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {dateFilterOptions.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleDateFilterSelect(option)}
                selected={selectedDateFilter === option}
              >
                <Typography variant="r14">{option}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TopHeader;
