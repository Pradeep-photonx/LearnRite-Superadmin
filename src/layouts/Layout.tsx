import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

interface LayoutProps {
  children: React.ReactNode;
  footerPaddingTop?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarWidth = isSidebarCollapsed ? "90px" : "280px";

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        // backgroundColor: "#F9FAFB",
      }}
    >
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          marginLeft: sidebarWidth,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {/* Top Header */}
        <TopHeader />

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

