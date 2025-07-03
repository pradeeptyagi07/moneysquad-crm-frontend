// src/pages/Leads/components/Login.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../../store/slices/authSlice";
import type { RootState, AppDispatch } from "../../store";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Pull auth state from Redux
  const { isAuthenticated, userRole, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Local form/snackbar state
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [formData, setFormData] = useState({ emailOrMobile: "", password: "" });
  const [formErrors, setFormErrors] = useState({
    emailOrMobile: "",
    password: "",
  });
  const [hasRedirected, setHasRedirected] = useState(false);

  // Show any Redux error in a snackbar
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [error]);

  // Once auth flips true, redirect based on role
  useEffect(() => {
    if (isAuthenticated && !hasRedirected) {
      setSnackbarMessage("Login successful! Redirecting...");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setHasRedirected(true);
      const timer = setTimeout(() => {
        if (userRole === "admin") navigate("/admin");
        else if (userRole === "manager") navigate("/manager");
        else if (userRole === "partner") navigate("/partner");
        else if (userRole === "associate") navigate("/associate");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, userRole, navigate, hasRedirected]);

  // Update form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error if present
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear Redux error if it exists
    if (error) dispatch(clearAuthError());
  };

  // Simple form validation
  const validateForm = () => {
    const newErrors = { emailOrMobile: "", password: "" };
    let isValid = true;
    if (!formData.emailOrMobile) {
      newErrors.emailOrMobile = "Email or mobile number is required";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    setFormErrors(newErrors);
    return isValid;
  };

  // Called on button click or pressing Enter
  const handleLogin = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Reset redirect flag for the useEffect above to fire
    setHasRedirected(false);

    dispatch(
      loginUser({
        email: formData.emailOrMobile.toLowerCase().trim(),
        password: formData.password,
      })
    );
  };

  // If user presses Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin(e);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2 },
        position: "relative",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background circles (zIndex: 0) */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "-50px", sm: "-100px", md: "-150px" },
          right: { xs: "-50px", sm: "-100px", md: "-150px" },
          width: { xs: 150, sm: 200, md: 400 },
          height: { xs: 150, sm: 200, md: 400 },
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "-50px", sm: "-100px", md: "-150px" },
          left: { xs: "-50px", sm: "-100px", md: "-150px" },
          width: { xs: 150, sm: 200, md: 400 },
          height: { xs: 150, sm: 200, md: 400 },
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)",
          zIndex: 0,
        }}
      />

      {/* Snackbar (zIndex: 10) */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 10 }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Logo + "Partner Portal" (zIndex: 2) */}
      <Box
        sx={{
          zIndex: 2, // must be higher than the Card's zIndex
          mb: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src="/images/MoneySquad-logo.png"
          alt="MoneySquad"
          sx={{
            height: { xs: 35, sm: 45, md: 60 },
            mb: 1,
            mx: "auto",
            display: "block",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: 1,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          Partner Portal
        </Typography>
      </Box>

      {/* Card (zIndex: 1) */}
      <Card
        sx={{
          zIndex: 1,
          width: { xs: "95%", sm: "90%", md: 450 },
          maxWidth: 450,
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          position: "relative",
          overflow: "visible", // allow the icon to overflow
          mt: { xs: 0, sm: 1, md: 2 },
        }}
      >
        {/* Floating Icon (half‐inside, half‐outside the Card) */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: -25, sm: -30 },
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: 50, sm: 60 },
            height: { xs: 50, sm: 60 },
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)",
          }}
        >
          <LoginIcon sx={{ color: "white", fontSize: { xs: 24, sm: 28 } }} />
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 4, sm: 5 } }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Log in to your MoneySquad partner account
          </Typography>

          {/* Login Form */}
          <Box component="form" onKeyDown={handleKeyDown}>
            <TextField
              fullWidth
              label="Enter Your Email"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleChange}
              error={!!formErrors.emailOrMobile}
              helperText={formErrors.emailOrMobile}
              sx={{
                mb: { xs: 2.5, sm: 3 },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "right", mb: { xs: 2.5, sm: 3 } }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleLogin}
              sx={{
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: 2,
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{
              mb: 2,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            OR
          </Typography>

          {/* "Become a Partner" Section */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              New to MoneySquad?
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/become-partner")}
              sx={{
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: 2,
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  background: "rgba(37, 99, 235, 0.05)",
                },
              }}
            >
              Become a Partner
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
