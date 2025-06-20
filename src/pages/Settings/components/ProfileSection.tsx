"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Chip,
  Badge,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Edit, PhotoCamera, Save, Cancel, Verified } from "@mui/icons-material"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  selectUserData,
  selectUserDataLoading,
  selectUserDataError,
  isAdminUser,
  isManagerUser,
  isAssociateUser,
  isPartnerUser,
} from "../../../store/slices/userDataSlice"

const ProfileSection: React.FC = () => {
  const [editing, setEditing] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  // Get user data from Redux store
  const userData = useAppSelector(selectUserData)
  const loading = useAppSelector(selectUserDataLoading)
  const error = useAppSelector(selectUserDataError)

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const handleSave = () => {
    setSnackbar({ open: true, message: "Changes saved successfully!", severity: "success" })
    setEditing(false)
  }

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress sx={{ color: "#0f766e" }} />
        <Typography sx={{ ml: 2, color: "#64748b" }}>Loading profile...</Typography>
      </Box>
    )
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  // Show message if no user data
  if (!userData) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="textSecondary">No user data available</Typography>
      </Box>
    )
  }

  // Get role-specific data
  const getRoleLabel = () => {
    switch (userData.role) {
      case "admin":
        return "Administrator"
      case "manager":
        return "Manager"
      case "associate":
        return "Associate"
      case "partner":
        return "Partner"
      default:
        return userData.role
    }
  }

  const getDisplayName = () => {
    if (isAdminUser(userData) || isManagerUser(userData) || isAssociateUser(userData)) {
      return `${userData.firstName} ${userData.lastName}`
    }
    if (isPartnerUser(userData)) {
      return userData.basicInfo.fullName
    }
    return "N/A"
  }

  const getFirstName = () => {
    if (isAdminUser(userData) || isManagerUser(userData) || isAssociateUser(userData)) {
      return userData.firstName
    }
    if (isPartnerUser(userData)) {
      return userData.basicInfo.fullName.split(" ")[0] || ""
    }
    return ""
  }

  const getLastName = () => {
    if (isAdminUser(userData) || isManagerUser(userData) || isAssociateUser(userData)) {
      return userData.lastName
    }
    if (isPartnerUser(userData)) {
      const nameParts = userData.basicInfo.fullName.split(" ")
      return nameParts.slice(1).join(" ") || ""
    }
    return ""
  }

  const getLocation = () => {
    if (isManagerUser(userData) || isAssociateUser(userData)) {
      return userData.location
    }
    if (isPartnerUser(userData)) {
      return `${userData.addressDetails.city}, ${userData.addressDetails.pincode}`
    }
    return ""
  }

  const getProfilePhoto = () => {
    if (isPartnerUser(userData) && userData.documents.profilePhoto) {
      return userData.documents.profilePhoto
    }
    return "/placeholder.svg?height=120&width=120&text=Profile"
  }

  const showLocation = isManagerUser(userData) || isAssociateUser(userData) || isPartnerUser(userData)

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="#0f172a">
          Profile Information
        </Typography>
        {!editing && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
            sx={{
              borderColor: "#0f766e",
              color: "#0f766e",
              "&:hover": {
                borderColor: "#0e6660",
                backgroundColor: "rgba(15, 118, 110, 0.04)",
              },
            }}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 4,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Tooltip title="Verified Account">
                  <Verified sx={{ color: "#0f766e", bgcolor: "white", borderRadius: "50%", padding: "2px" }} />
                </Tooltip>
              }
            >
              <Avatar
                src={getProfilePhoto()}
                alt="User Avatar"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "4px solid white",
                }}
              />
            </Badge>
            {editing && (
              <Tooltip title="Upload new photo">
                <IconButton
                  component="label"
                  sx={{
                    mt: 1,
                    color: "#0f766e",
                    bgcolor: "rgba(15, 118, 110, 0.08)",
                    "&:hover": { bgcolor: "rgba(15, 118, 110, 0.12)" },
                  }}
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCamera />
                </IconButton>
              </Tooltip>
            )}
            <Chip label={getRoleLabel()} color="primary" sx={{ mt: 2, bgcolor: "#0f766e", fontWeight: 500 }} />

            {/* Show additional info based on role */}
            {isPartnerUser(userData) && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                ID: {userData.partnerId}
              </Typography>
            )}
            {isManagerUser(userData) && userData.managerId && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                ID: {userData.managerId}
              </Typography>
            )}
            {isAssociateUser(userData) && userData.associateDisplayId && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                ID: {userData.associateDisplayId}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={getFirstName()}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={getLastName()}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userData.email}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={userData.mobile}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                />
              </Grid>
              {showLocation && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={getLocation()}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {editing && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={() => setEditing(false)}
              sx={{ borderColor: "#94a3b8", color: "#64748b" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ backgroundColor: "#0f766e", "&:hover": { backgroundColor: "#0e6660" } }}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>

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

export default ProfileSection
