"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
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
} from "@mui/material"
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearAuthError } from "../../store/slices/authSlice"
import type { RootState, AppDispatch } from "../../store"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  // Get auth state from Redux
  const { isAuthenticated, userRole, loading, error } = useSelector((state: RootState) => state.auth)

  // Local state
  const [showPassword, setShowPassword] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [formData, setFormData] = useState({ emailOrMobile: "", password: "" })
  const [formErrors, setFormErrors] = useState({ emailOrMobile: "", password: "" })
  const [hasRedirected, setHasRedirected] = useState(false)

  // Show error in snackbar
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }, [error])

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated && !hasRedirected) {
      // Show success message
      setSnackbarMessage("Login successful! Redirecting...")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)

      // Set flag to prevent multiple redirects
      setHasRedirected(true)

      // Redirect after delay
      const timer = setTimeout(() => {
        if (userRole === "admin") navigate("/admin")
        else if (userRole === "manager") navigate("/manager")
        else if (userRole === "partner") navigate("/partner")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, userRole, navigate, hasRedirected])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear field error
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }

    // Clear Redux error
    if (error) dispatch(clearAuthError())
  }

  // Validate form
  const validateForm = () => {
    const newErrors = { emailOrMobile: "", password: "" }
    let isValid = true

    if (!formData.emailOrMobile) {
      newErrors.emailOrMobile = "Email or mobile number is required"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setFormErrors(newErrors)
    return isValid
  }

  // Handle login
  const handleLogin = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Reset redirect flag
    setHasRedirected(false)

    dispatch(
      loginUser({
        email: formData.emailOrMobile,
        password: formData.password,
      }),
    )
  }

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleLogin(e)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        p: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 25px 25px, #e2e8f0 2px, transparent 0)",
          backgroundSize: "50px 50px",
          opacity: 0.4,
          zIndex: 0,
        },
      }}
    >
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, md: 24 },
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 1
        }}
      >
        <Box
          component="img"
          src="/images/MoneySquad-logo.png"
          alt="MoneySquad"
          sx={{
            height: { xs: 50, md: 60 },   // ← smaller logo
            mb: 1
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",       // ← premium blue
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          Partner Portal
        </Typography>
      </Box>

      {/* Background elements */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: -100, md: -150 },
          right: { xs: -100, md: -150 },
          width: { xs: 300, md: 400 },
          height: { xs: 300, md: 400 },
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: -100, md: -150 },
          left: { xs: -100, md: -150 },
          width: { xs: 300, md: 400 },
          height: { xs: 300, md: 400 },
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)",
          zIndex: 0,
        }}
      />

      {/* Login Card */}
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          overflow: "visible",
          position: "relative",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 60,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)",
          }}
        >
          <LoginIcon sx={{ color: "white", fontSize: 28 }} />
        </Box>

        <CardContent sx={{ p: 4, pt: 5 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 1,
              fontWeight: 700,
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>

          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Log in to your MoneySquad partner account
          </Typography>

          {/* Login Form */}
          <div onKeyDown={handleKeyDown}>
            <TextField
              fullWidth
              label="Email or Mobile Number"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleChange}
              error={!!formErrors.emailOrMobile}
              helperText={formErrors.emailOrMobile}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: 2 },
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
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "right", mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.875rem",
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
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </div>

          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              New to MoneySquad?
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/sign-up/become-partner")}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
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
  )
}

export default Login
