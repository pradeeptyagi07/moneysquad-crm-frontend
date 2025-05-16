"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
} from "@mui/material"
import {
  Save,
  Visibility,
  VisibilityOff,
  LockReset,
  PhoneAndroid,
  VerifiedUser,
  CheckCircle,
  Cancel,
  Info,
  ExpandMore,
  ExpandLess,
  DeviceUnknown,
  Computer,
  Smartphone,
  Tablet,
} from "@mui/icons-material"

interface SecuritySectionProps {
  user?: any
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  user = {
    security: {
      twoFactorEnabled: false,
      lastLoginIp: "192.168.1.1",
      lastLoginDate: new Date().toISOString(),
    },
  },
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.security?.twoFactorEnabled || false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([])
  const [showLoginHistory, setShowLoginHistory] = useState(false)

  // Mock login history
  const loginHistory = [
    {
      id: 1,
      date: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      ip: "192.168.1.1",
      device: "desktop",
      location: "Mumbai, India",
      status: "success",
    },
    {
      id: 2,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      ip: "192.168.1.1",
      device: "mobile",
      location: "Mumbai, India",
      status: "success",
    },
    {
      id: 3,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      ip: "192.168.1.1",
      device: "tablet",
      location: "Mumbai, India",
      status: "success",
    },
    {
      id: 4,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      ip: "192.168.1.1",
      device: "desktop",
      location: "Mumbai, India",
      status: "success",
    },
    {
      id: 5,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      ip: "192.168.1.1",
      device: "unknown",
      location: "Mumbai, India",
      status: "failed",
    },
  ]

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Simple password strength checker
    if (name === "newPassword") {
      let strength = 0
      const feedback = []

      if (value.length >= 8) {
        strength += 25
        feedback.push("8+ characters")
      }

      if (/[A-Z]/.test(value)) {
        strength += 25
        feedback.push("Uppercase letter")
      }

      if (/[0-9]/.test(value)) {
        strength += 25
        feedback.push("Number")
      }

      if (/[^A-Za-z0-9]/.test(value)) {
        strength += 25
        feedback.push("Special character")
      }

      setPasswordStrength(strength)
      setPasswordFeedback(feedback)
    }
  }

  const toggleShowPassword = (field: "currentPassword" | "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleTwoFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTwoFactorEnabled(event.target.checked)
  }

  const handleChangePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match!",
        severity: "error",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setSnackbar({
        open: true,
        message: "Password must be at least 8 characters long!",
        severity: "error",
      })
      return
    }

    console.log("Changing password:", passwordData)
    setSnackbar({
      open: true,
      message: "Password changed successfully!",
      severity: "success",
    })

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setPasswordStrength(0)
    setPasswordFeedback([])
  }

  const handleSaveTwoFactor = () => {
    console.log("Saving two-factor authentication status:", twoFactorEnabled)
    setSnackbar({
      open: true,
      message: twoFactorEnabled
        ? "Two-factor authentication enabled successfully!"
        : "Two-factor authentication disabled successfully!",
      severity: "success",
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "#ef4444"
    if (passwordStrength < 75) return "#f59e0b"
    return "#10b981"
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "desktop":
        return <Computer />
      case "mobile":
        return <Smartphone />
      case "tablet":
        return <Tablet />
      default:
        return <DeviceUnknown />
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="#0f172a">
          Security Settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={1}
            sx={{
              borderRadius: 2,
              mb: { xs: 0, md: 4 },
              height: "100%",
              background: "linear-gradient(145deg, #ffffff, #f9fafb)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#0f172a"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <LockReset sx={{ mr: 1, color: "#0f766e" }} />
                Change Password
              </Typography>

              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type={showPassword.currentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => toggleShowPassword("currentPassword")}
                        edge="end"
                      >
                        {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword.newPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => toggleShowPassword("newPassword")}
                        edge="end"
                      >
                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              {passwordData.newPassword && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography variant="caption" sx={{ mr: 1 }}>
                      Password Strength:
                    </Typography>
                    <Typography variant="caption" fontWeight={500} sx={{ color: getPasswordStrengthColor() }}>
                      {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: "#e2e8f0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getPasswordStrengthColor(),
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {["8+ characters", "Uppercase letter", "Number", "Special character"].map((item, index) => (
                      <Chip
                        key={index}
                        size="small"
                        icon={
                          passwordFeedback.includes(item) ? (
                            <CheckCircle fontSize="small" />
                          ) : (
                            <Cancel fontSize="small" />
                          )
                        }
                        label={item}
                        sx={{
                          bgcolor: passwordFeedback.includes(item)
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                          color: passwordFeedback.includes(item) ? "#10b981" : "#ef4444",
                          "& .MuiChip-icon": {
                            color: "inherit",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => toggleShowPassword("confirmPassword")}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                  Passwords do not match
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleChangePassword}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  sx={{
                    backgroundColor: "#0f766e",
                    "&:hover": {
                      backgroundColor: "#0e6660",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#e2e8f0",
                    },
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={1}
            sx={{
              borderRadius: 2,
              mb: 4,
              height: "100%",
              background: "linear-gradient(145deg, #ffffff, #f9fafb)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#0f172a"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <PhoneAndroid sx={{ mr: 1, color: "#0f766e" }} />
                Two-Factor Authentication
              </Typography>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={twoFactorEnabled}
                      onChange={handleTwoFactorChange}
                      name="twoFactorEnabled"
                      color="primary"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#0f766e",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#0f766e",
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={500}>Enable Two-Factor Authentication</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Secure your account with an additional verification step
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Alert
                severity="info"
                icon={<Info />}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(3, 105, 161, 0.08)",
                  color: "#0369a1",
                  "& .MuiAlert-icon": {
                    color: "#0369a1",
                  },
                }}
              >
                <Typography variant="body2">
                  Two-factor authentication adds an extra layer of security to your account by requiring a verification
                  code from your mobile device in addition to your password.
                </Typography>
              </Alert>

              {twoFactorEnabled && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(22, 163, 74, 0.08)",
                    color: "#16a34a",
                    "& .MuiAlert-icon": {
                      color: "#16a34a",
                    },
                  }}
                >
                  <Typography variant="body2">
                    Your account is protected with two-factor authentication. You'll need to enter a verification code
                    when signing in from a new device.
                  </Typography>
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveTwoFactor}
                  sx={{
                    backgroundColor: "#0f766e",
                    "&:hover": {
                      backgroundColor: "#0e6660",
                    },
                  }}
                >
                  Save 2FA Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        elevation={1}
        sx={{
          borderRadius: 2,
          mb: 4,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="#0f172a"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <VerifiedUser sx={{ mr: 1, color: "#0f766e" }} />
              Account Activity
            </Typography>
            <Button
              variant="text"
              endIcon={showLoginHistory ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowLoginHistory(!showLoginHistory)}
              sx={{ color: "#0f766e" }}
            >
              {showLoginHistory ? "Hide History" : "Show History"}
            </Button>
          </Box>

          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: "rgba(22, 163, 74, 0.08)",
              color: "#16a34a",
              "& .MuiAlert-icon": {
                color: "#16a34a",
              },
            }}
          >
            <Typography variant="body2">
              Last login: {new Date(user.security?.lastLoginDate || Date.now()).toLocaleString()} from{" "}
              {user.security?.lastLoginIp || "192.168.1.1"}
            </Typography>
          </Alert>

          <Collapse in={showLoginHistory}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
              Recent Login Activity
            </Typography>

            <List sx={{ bgcolor: "#f8fafc", borderRadius: 2 }}>
              {loginHistory.map((login) => (
                <ListItem key={login.id} sx={{ borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {login.status === "success" ? (
                      <CheckCircle sx={{ color: "#10b981" }} />
                    ) : (
                      <Cancel sx={{ color: "#ef4444" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {getDeviceIcon(login.device)}
                        <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                          {login.location}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {new Date(login.date).toLocaleString()} • IP: {login.ip}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: login.status === "success" ? "#10b981" : "#ef4444",
                            fontWeight: 500,
                          }}
                        >
                          {login.status === "success" ? "Successful login" : "Failed login attempt"}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#0f766e",
                  color: "#0f766e",
                  "&:hover": {
                    borderColor: "#0e6660",
                    backgroundColor: "rgba(15, 118, 110, 0.04)",
                  },
                }}
              >
                View Full Login History
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SecuritySection
