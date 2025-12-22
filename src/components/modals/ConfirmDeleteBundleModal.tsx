import React from "react";
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
import { CloseIcon } from "../icons/CommonIcons";

interface ConfirmDeleteBundleModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bundleName: string;
    loading?: boolean;
}

const ConfirmDeleteBundleModal: React.FC<ConfirmDeleteBundleModalProps> = ({
    open,
    onClose,
    onConfirm,
    bundleName,
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
                    Delete Bundle
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
                    Are you sure you want to delete the bundle <strong>"{bundleName}"</strong>? This action cannot be undone.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 0 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    disabled={loading}
                    sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        borderColor: "#121318",
                        color: "#121318",
                        px: 4,
                        "&:hover": {
                            borderColor: "#121318",
                            backgroundColor: "#F9FAFB",
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        bgcolor: "#EF4444",
                        px: 4,
                        "&:hover": {
                            bgcolor: "#DC2626",
                        },
                    }}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteBundleModal;
