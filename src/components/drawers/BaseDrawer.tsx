import React from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { CloseIcon } from "../icons/CommonIcons";

interface BaseDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string | number;
  anchor?: "left" | "right" | "top" | "bottom";
}

const BaseDrawer: React.FC<BaseDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 600,
  anchor = "right",
}) => {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: width,
          boxShadow: "0px 0px 30px 0px #00000026",

        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography variant="sb20" sx={{ color: "#121318" }}>
            {title}
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
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};

export default BaseDrawer;

