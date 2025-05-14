"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Link,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material"
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material"

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  })

  const [formErrors, setFormErrors] = useState({
    emailOrMobile: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...formErrors }

    // Validate email/mobile
    if (!formData.emailOrMobile) {
      newErrors.emailOrMobile = "Email or mobile number is required"
      isValid = false
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrMobile) &&
      !/^[6-9]\d{9}$/.test(formData.emailOrMobile)
    ) {
      newErrors.emailOrMobile = "Please enter a valid email or 10-digit mobile number"
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setFormErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, show error for specific credentials
      if (formData.emailOrMobile === "test@example.com" && formData.password === "wrongpass") {
        throw new Error("Invalid credentials. Please try again.")
      }

      // Success - would normally set auth tokens, user context, etc.
      navigate("/overview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
      <Box
        sx={{
          position: "absolute",
          top: { xs: 20, md: 40 },
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          MoneySquad
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Partner Portal
        </Typography>
      </Box>

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

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
                sx: {
                  borderRadius: 2,
                },
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
                sx: {
                  borderRadius: 2,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "right", mb: 3 }}>
              <Link
                href="#"
                underline="hover"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
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
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

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
