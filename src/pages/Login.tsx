import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Stack,
    Card,
    CardContent,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user types
        if (error) setError(null);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await login(formData);
            console.log("Login Response:", response);

            // Store token, role, and name
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("role", response.role);
                localStorage.setItem("name", response.admin?.name || "User");
            } else if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("name", response.data.admin?.name || "User");
            }

            navigate("/overview");
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F3F4F6", // Light gray background
                padding: "20px",
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: "480px",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                    padding: "24px",
                }}
            >
                <CardContent sx={{ padding: "0 !important" }}>
                    <Stack spacing={4}>
                        {/* Header */}
                        <Box textAlign="center">
                            <Typography variant="sb24" sx={{ color: "#121318", marginBottom: "8px", display: "block" }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="r16" sx={{ color: "#6B7280" }}>
                                Please enter your details to sign in
                            </Typography>
                        </Box>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: "8px" }}>
                                        {error}
                                    </Alert>
                                )}

                                <Box>
                                    <Typography variant="sb14" sx={{ marginBottom: "6px", display: "block" }}>
                                        Email Address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#F9FAFB",
                                            },
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="sb14" sx={{ marginBottom: "6px", display: "block" }}>
                                        Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#F9FAFB",
                                            },
                                        }}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleTogglePasswordVisibility} edge="end" disabled={loading}>
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        height: "48px",
                                        marginTop: "8px",
                                        fontSize: "16px !important",
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
