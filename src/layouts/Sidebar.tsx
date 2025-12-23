import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import logo from "../assets/images/learnrite-logo.svg";
import favicon from "../assets/images/favicon.svg";
import { CustomersIcon, OrdersIcon, OverviewIcon, ProductsIcon, SchoolBundlesIcon, SchoolIconn } from "../components/icons/CommonIcons";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Overview", path: "/overview", icon: <OverviewIcon /> },
  { label: "Students", path: "/students", icon: <CustomersIcon /> },
  { label: "School", path: "/schools", icon: <SchoolIconn /> },
  { label: "School Bundles", path: "/school-bundles", icon: <SchoolBundlesIcon /> },
  { label: "Products", path: "/products", icon: <ProductsIcon /> },
  { label: "Customers", path: "/customers", icon: <CustomersIcon /> },
  { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarWidth = isCollapsed ? "90px" : "280px";

  return (
    <Box
      sx={{
        width: sidebarWidth,
        height: "100vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        borderRight: "1px solid #1213181A",
        padding: "20px",
        left: 0,
        top: 0,
        zIndex: 1000,
        // overflowY: "auto",
        // overflowX: "hidden",
        transition: "width 0.3s ease-in-out",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          // padding: isCollapsed ? "24px 12px" : "24px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          justifyContent: isCollapsed ? "center" : "center",
          transition: "all 0.3s ease-in-out",
          // paddingBottom: "20px",
        }}
      >
        {/* Favicon - shown when collapsed */}
        {isCollapsed && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <img src={favicon} alt="favicon" style={{ width: "40px", height: "40px" }} />
          </Box>
        )}

        {/* Full Logo - shown when expanded */}
        {!isCollapsed && (
          <Box
            sx={{
              opacity: 1,
              transition: "opacity 0.3s ease-in-out",
              whiteSpace: "nowrap",
              padding: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={logo} alt="logo" style={{ width: "100%", height: "auto", maxWidth: "240px" }} />
          </Box>
        )}
      </Box>

      {/* Navigation Items */}
      <List
        sx={{
          padding: isCollapsed ? "10px 0px" : "10px 0px",
          flex: 1,
          "& .MuiListItem-root": {
            marginBottom: "4px",
          },
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const iconColor = isActive ? "#FFFFFF" : "#121318";

          // Clone the icon with the appropriate color
          const iconWithColor = React.cloneElement(item.icon as React.ReactElement, {
            style: { stroke: iconColor, color: iconColor },
            stroke: iconColor,
          });

          const buttonContent = (
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "8px",
                padding: isCollapsed ? "10px" : "10px 5px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                background: isActive ? "linear-gradient(98.42deg, #2C65F9 10.23%, #2C55C1 80.76%)" : "transparent",
                "&:hover": {
                  background: isActive
                    ? "linear-gradient(98.42deg, #2C65F9 10.23%, #2C55C1 80.76%)"
                    : "transparent",
                },
                "& .MuiListItemIcon-root": {
                  minWidth: isCollapsed ? "0px" : "40px",
                  color: iconColor,
                  justifyContent: "center",
                  "& svg": {
                    stroke: iconColor,
                    "& path": {
                      stroke: iconColor,
                    },
                  },
                },
                "& .MuiListItemText-primary": {
                  color: isActive ? "#FFFFFF" : "#121318 !important",
                  fontWeight: "500 !important",
                  fontSize: "14px !important",
                  opacity: isCollapsed ? 0 : 1,
                  transition: "opacity 0.2s ease-in-out",
                },
              }}
            >
              <ListItemIcon>{iconWithColor}</ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "14px",
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.path} disablePadding>
              {isCollapsed ? (
                <Tooltip title={item.label} placement="right" arrow>
                  {buttonContent}
                </Tooltip>
              ) : (
                buttonContent
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Toggle Button */}
      <Box
        sx={{
          padding: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: isCollapsed ? "center" : "flex-end",
          transition: "all 0.3s ease-in-out",
          position: "absolute",
          top: 0,
          right: "-30px",
        }}
      >
        <IconButton
          onClick={onToggle}
          sx={{
            backgroundColor: "#2C55C1",
            color: "#FFFFFF",
            width: "28px",
            height: "28px",
            "&:hover": {
              backgroundColor: "#1e4fd1",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;

