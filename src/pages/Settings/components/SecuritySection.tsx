"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Save, Cancel, Visibility, VisibilityOff } from "@mui/icons-material"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { resetPassword } from "../../../store/slices/authSlice"

const SecuritySection: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleShowPassword = (field: "currentPassword" | "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({ open: true, message: "New passwords do not match!", severity: "error" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setSnackbar({ open: true, message: "Password must be at least 6 characters long!", severity: "error" })
      return
    }

    try {
      await dispatch(resetPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap()
      setSnackbar({ open: true, message: "Password changed successfully!", severity: "success" })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      setSnackbar({ open: true, message: error, severity: "error" })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} color="#0f172a" mb={3}>
        Change Password
      </Typography>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, background: "linear-gradient(145deg, #ffffff, #f9fafb)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <Grid container spacing={2}>
          {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                label={field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
                name={field}
                type={showPassword[field] ? "text" : "password"}
                value={passwordData[field]}
                onChange={handlePasswordChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleShowPassword(field)}>
                        {showPassword[field] ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
            sx={{ borderColor: "#94a3b8", color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleChangePassword}
            disabled={loading}
            sx={{ backgroundColor: "#0f766e", "&:hover": { backgroundColor: "#0e6660" } }}
          >
            Change Password
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SecuritySection
