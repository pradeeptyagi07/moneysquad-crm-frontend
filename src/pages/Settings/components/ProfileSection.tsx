"use client"

import React, { useState } from "react"
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
} from "@mui/material"
import { Edit, PhotoCamera, Save, Cancel, Verified } from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"

const ProfileSection: React.FC = () => {
  const { userRole } = useAuth()
  const [editing, setEditing] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const showLocation = userRole === "manager"

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
            sx={{ borderColor: "#0f766e", color: "#0f766e", "&:hover": { borderColor: "#0e6660", backgroundColor: "rgba(15, 118, 110, 0.04)" } }}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 4, background: "linear-gradient(145deg, #ffffff, #f9fafb)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
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
                src="/placeholder-kgkar.png"
                alt="User Avatar"
                sx={{ width: 120, height: 120, mb: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "4px solid white" }}
              />
            </Badge>
            {editing && (
              <Tooltip title="Upload new photo">
                <IconButton component="label" sx={{ mt: 1, color: "#0f766e", bgcolor: "rgba(15, 118, 110, 0.08)", "&:hover": { bgcolor: "rgba(15, 118, 110, 0.12)" } }}>
                  <input hidden accept="image/*" type="file" />
                  <PhotoCamera />
                </IconButton>
              </Tooltip>
            )}
            <Chip label={userRole === "admin" ? "Administrator" : userRole === "manager" ? "Manager" : "Partner"} color="primary" sx={{ mt: 2, bgcolor: "#0f766e", fontWeight: 500 }} />
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" value="" disabled={!editing} variant={editing ? "outlined" : "filled"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" value="" disabled={!editing} variant={editing ? "outlined" : "filled"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" value="" disabled={!editing} variant={editing ? "outlined" : "filled"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value="" disabled={!editing} variant={editing ? "outlined" : "filled"} />
              </Grid>
              {showLocation && (
                <Grid item xs={12}>
                  <TextField fullWidth label="Location" value="" disabled={!editing} variant={editing ? "outlined" : "filled"} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {editing && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
            <Button variant="outlined" startIcon={<Cancel />} onClick={() => setEditing(false)} sx={{ borderColor: "#94a3b8", color: "#64748b" }}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={() => setSnackbar({ open: true, message: "Changes saved successfully!", severity: "success" })} sx={{ backgroundColor: "#0f766e", "&:hover": { backgroundColor: "#0e6660" } }}>
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
