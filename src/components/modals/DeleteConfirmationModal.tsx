import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import React from "react";
import { CloseIcon } from "../icons/CommonIcons";

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    title = "Delete Item",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    loading = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    padding: "40px 20px",
                    maxWidth: "500px",
                    width: "100%",
                },
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <DialogTitle variant="sb20" sx={{ p: 0, fontWeight: 600 }}>
                    {title}
                </DialogTitle>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{
                padding: "20px 0px",
                mb: 3
            }}>
                <Typography variant="m14" color="text.primary">
                    {description}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 0 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#E5E7EB" }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" } }}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationModal;
