"use client"

import React from "react"
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
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import {
  selectUserData,
  selectUserDataLoading,
  selectUserDataError,
  selectUserDataUpdating,
  selectUserDataUpdateError,
  updateUserData,
  isAdminUser,
  isManagerUser,
  isAssociateUser,
  isPartnerUser,
} from "../../../store/slices/userDataSlice"

const ProfileSection: React.FC = () => {
  const [editing, setEditing] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  // Get user data from Redux store
  const dispatch = useAppDispatch()
  const userData = useAppSelector(selectUserData)
  const loading = useAppSelector(selectUserDataLoading)
  const error = useAppSelector(selectUserDataError)
  const updating = useAppSelector(selectUserDataUpdating)
  const updateError = useAppSelector(selectUserDataUpdateError)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    location: "",
  })

  // Initialize form data when userData changes
  React.useEffect(() => {
    if (userData) {
      if (isAdminUser(userData) || isManagerUser(userData) || isAssociateUser(userData)) {
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          mobile: userData.mobile || "",
          location: isManagerUser(userData) || isAssociateUser(userData) ? userData.location || "" : "",
        })
      }
    }
  }, [userData])

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (userData) {
      if (isAdminUser(userData) || isManagerUser(userData) || isAssociateUser(userData)) {
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          mobile: userData.mobile || "",
          location: isManagerUser(userData) || isAssociateUser(userData) ? userData.location || "" : "",
        })
      }
    }
    setEditing(false)
  }

  const handleSave = async () => {
    if (!userData) return

    try {
      // Prepare update data based on role restrictions
      let updateData: any = {}

      if (isAdminUser(userData)) {
        // Admin can edit all fields
        updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
        }
      } else if (isManagerUser(userData)) {
        // Manager can only edit location and mobile
        updateData = {
          mobile: formData.mobile,
          location: formData.location,
        }
      } else if (isAssociateUser(userData)) {
        // Associate can only edit location and mobile
        updateData = {
          mobile: formData.mobile,
          location: formData.location,
        }
      }

      await dispatch(updateUserData(updateData)).unwrap()
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" })
      setEditing(false)
    } catch (error: any) {
      setSnackbar({ open: true, message: error || "Failed to update profile", severity: "error" })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Helper function to determine if field is editable
  const isFieldEditable = (field: string) => {
    if (!editing) return false

    if (isAdminUser(userData)) {
      return true // Admin can edit all fields
    } else if (isManagerUser(userData)) {
      return field === "mobile" || field === "location" // Manager can only edit mobile and location
    } else if (isAssociateUser(userData)) {
      return field === "mobile" || field === "location" // Associate can only edit mobile and location
    }

    return false
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
            onClick={handleEdit}
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
                  value={
                    editing && isFieldEditable("firstName")
                      ? formData.firstName
                      : isAdminUser(userData) || isManagerUser(userData) || isAssociateUser(userData)
                        ? userData.firstName
                        : ""
                  }
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isFieldEditable("firstName")}
                  variant={editing && isFieldEditable("firstName") ? "outlined" : "filled"}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: editing && !isFieldEditable("firstName") ? "#94a3b8" : "#64748b",
                    },
                    ...(editing &&
                      !isFieldEditable("firstName") && {
                        "& .MuiFilledInput-root": {
                          backgroundColor: "#f1f5f9",
                        },
                      }),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={
                    editing && isFieldEditable("lastName")
                      ? formData.lastName
                      : isAdminUser(userData) || isManagerUser(userData) || isAssociateUser(userData)
                        ? userData.lastName
                        : ""
                  }
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isFieldEditable("lastName")}
                  variant={editing && isFieldEditable("lastName") ? "outlined" : "filled"}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: editing && !isFieldEditable("lastName") ? "#94a3b8" : "#64748b",
                    },
                    ...(editing &&
                      !isFieldEditable("lastName") && {
                        "& .MuiFilledInput-root": {
                          backgroundColor: "#f1f5f9",
                        },
                      }),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editing && isFieldEditable("email") ? formData.email : userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isFieldEditable("email")}
                  variant={editing && isFieldEditable("email") ? "outlined" : "filled"}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: editing && !isFieldEditable("email") ? "#94a3b8" : "#64748b",
                    },
                    ...(editing &&
                      !isFieldEditable("email") && {
                        "& .MuiFilledInput-root": {
                          backgroundColor: "#f1f5f9",
                        },
                      }),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={editing && isFieldEditable("mobile") ? formData.mobile : userData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  disabled={!isFieldEditable("mobile")}
                  variant={editing && isFieldEditable("mobile") ? "outlined" : "filled"}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: editing && !isFieldEditable("mobile") ? "#94a3b8" : "#64748b",
                    },
                    ...(editing &&
                      !isFieldEditable("mobile") && {
                        "& .MuiFilledInput-root": {
                          backgroundColor: "#f1f5f9",
                        },
                      }),
                  }}
                />
              </Grid>
              {showLocation && (isManagerUser(userData) || isAssociateUser(userData)) && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={
                      editing && isFieldEditable("location")
                        ? formData.location
                        : isManagerUser(userData) || isAssociateUser(userData)
                          ? userData.location
                          : ""
                    }
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={!isFieldEditable("location")}
                    variant={editing && isFieldEditable("location") ? "outlined" : "filled"}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: editing && !isFieldEditable("location") ? "#94a3b8" : "#64748b",
                      },
                      ...(editing &&
                        !isFieldEditable("location") && {
                          "& .MuiFilledInput-root": {
                            backgroundColor: "#f1f5f9",
                          },
                        }),
                    }}
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
              onClick={handleCancel}
              sx={{ borderColor: "#94a3b8", color: "#64748b" }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={updating ? <CircularProgress size={16} color="inherit" /> : <Save />}
              onClick={handleSave}
              sx={{ backgroundColor: "#0f766e", "&:hover": { backgroundColor: "#0e6660" } }}
              disabled={updating}
            >
              {updating ? "Saving..." : "Save Changes"}
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
