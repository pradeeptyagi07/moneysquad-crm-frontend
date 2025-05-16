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
  Alert,
  Snackbar,
  Chip,
  Badge,
} from "@mui/material"
import { Edit, PhotoCamera, Save, Cancel, Verified } from "@mui/icons-material"
import RequestChangeDialog from "./RequestChangeDialog"

interface ProfileSectionProps {
  user?: any
  isAdmin?: boolean
  isManager?: boolean
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    location: "Mumbai",
    bio: "Experienced professional with expertise in sales and marketing.",
    profileImage: "/placeholder-kgkar.png",
  },
  isAdmin = false,
  isManager = false,
}) => {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    bio: user.bio || "",
    profileImage: user.profileImage || "/placeholder-kgkar.png",
  })
  const [openRequestDialog, setOpenRequestDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (isAdmin) {
      // Direct save for admin
      console.log("Saving profile data:", formData)
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      })
      setEditing(false)
    } else {
      // Open request dialog for partners and managers
      setOpenRequestDialog(true)
    }
  }

  const handleRequestSubmit = (reason: string) => {
    console.log("Change request submitted:", { ...formData, reason })
    setOpenRequestDialog(false)
    setSnackbar({
      open: true,
      message: "Change request submitted successfully!",
      severity: "success",
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      profileImage: user.profileImage || "/placeholder-kgkar.png",
    })
    setEditing(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

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
            {isAdmin ? "Edit Profile" : "Request Changes"}
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
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
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
                src={formData.profileImage}
                alt={`${formData.firstName} ${formData.lastName}`}
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
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    mt: 1,
                    color: "#0f766e",
                    bgcolor: "rgba(15, 118, 110, 0.08)",
                    "&:hover": {
                      bgcolor: "rgba(15, 118, 110, 0.12)",
                    },
                  }}
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCamera />
                </IconButton>
              </Tooltip>
            )}
            <Chip
              label={isAdmin ? "Administrator" : isManager ? "Manager" : "Partner"}
              color="primary"
              sx={{
                mt: 2,
                bgcolor: "#0f766e",
                fontWeight: 500,
                "& .MuiChip-label": { px: 2 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editing,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editing,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editing,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editing,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              {(isManager || isAdmin) && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  multiline
                  rows={4}
                  InputProps={{
                    readOnly: !editing,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {editing && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              sx={{
                borderColor: "#94a3b8",
                color: "#64748b",
                "&:hover": {
                  borderColor: "#64748b",
                  backgroundColor: "rgba(100, 116, 139, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                backgroundColor: "#0f766e",
                "&:hover": {
                  backgroundColor: "#0e6660",
                },
              }}
            >
              {isAdmin ? "Save Changes" : "Request Changes"}
            </Button>
          </Box>
        )}
      </Paper>

      {!isAdmin && (
        <Alert
          severity="info"
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
          Changes to your profile information require approval from an administrator. Your request will be reviewed
          within 1-2 business days.
        </Alert>
      )}

      <RequestChangeDialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        onSubmit={handleRequestSubmit}
        title="Request Profile Changes"
        changes={Object.entries(formData)
          .filter(([key, value]) => value !== user[key] && key !== "profileImage")
          .map(([key, value]) => ({
            field: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            oldValue: user[key] || "Not set",
            newValue: value as string,
          }))}
      />

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
