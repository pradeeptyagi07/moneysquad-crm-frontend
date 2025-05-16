"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material"
import { Edit, Save, Cancel, LocationOn, MyLocation, ContentCopy, CheckCircle } from "@mui/icons-material"
import RequestChangeDialog from "./RequestChangeDialog"

interface AddressDetailsSectionProps {
  user?: any
  isAdmin?: boolean
}

const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({
  user = {
    addressType: "Residential",
    addressLine1: "123 Partner Street",
    addressLine2: "Andheri East",
    landmark: "Near Metro Station",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400069",
    country: "India",
  },
  isAdmin = false,
}) => {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    addressType: user.addressType || "",
    addressLine1: user.addressLine1 || "",
    addressLine2: user.addressLine2 || "",
    landmark: user.landmark || "",
    city: user.city || "",
    state: user.state || "",
    postalCode: user.postalCode || "",
    country: user.country || "",
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
      // Admin can directly save changes
      console.log("Address details updated:", formData)
      setSnackbar({
        open: true,
        message: "Address details updated successfully!",
        severity: "success",
      })
      setEditing(false)
    } else {
      // Partners and Managers need to request changes
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
      addressType: user.addressType || "",
      addressLine1: user.addressLine1 || "",
      addressLine2: user.addressLine2 || "",
      landmark: user.landmark || "",
      city: user.city || "",
      state: user.state || "",
      postalCode: user.postalCode || "",
      country: user.country || "",
    })
    setEditing(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const handleDetectLocation = () => {
    // In a real app, this would use the browser's geolocation API
    setSnackbar({
      open: true,
      message: "Location detection is not available in demo mode",
      severity: "info",
    })
  }

  const handleCopyAddress = () => {
    const fullAddress = `${formData.addressLine1}, ${formData.addressLine2 ? formData.addressLine2 + ", " : ""}${formData.landmark ? formData.landmark + ", " : ""}${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`
    navigator.clipboard.writeText(fullAddress)
    setSnackbar({
      open: true,
      message: "Address copied to clipboard!",
      severity: "success",
    })
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="#0f172a">
          Address Details
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
            {isAdmin ? "Edit" : "Request Changes"}
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Address Type"
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                  >
                    <MenuItem value="">Select Address Type</MenuItem>
                    <MenuItem value="Residential">Residential</MenuItem>
                    <MenuItem value="Commercial">Commercial</MenuItem>
                    <MenuItem value="Permanent">Permanent</MenuItem>
                    <MenuItem value="Temporary">Temporary</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editing && (
                    <Box sx={{ display: "flex", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                      <Tooltip title="Detect my location">
                        <Button
                          startIcon={<MyLocation />}
                          variant="outlined"
                          size="small"
                          onClick={handleDetectLocation}
                          sx={{
                            borderColor: "#0f766e",
                            color: "#0f766e",
                            "&:hover": {
                              borderColor: "#0e6660",
                              backgroundColor: "rgba(15, 118, 110, 0.04)",
                            },
                          }}
                        >
                          Detect Location
                        </Button>
                      </Tooltip>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                      startAdornment: !editing ? (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ) : undefined,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                    }}
                  />
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
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
              <Typography variant="subtitle1" fontWeight={600} color="#0f172a" sx={{ mb: 2 }}>
                Address Summary
              </Typography>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px dashed #cbd5e1",
                  position: "relative",
                }}
              >
                <Tooltip title="Copy address">
                  <IconButton size="small" sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleCopyAddress}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Typography variant="body2" fontWeight={500} color="#0f172a">
                  {formData.addressType} Address
                </Typography>
                <Typography variant="body2" color="#334155" sx={{ mt: 1 }}>
                  {formData.addressLine1}
                </Typography>
                {formData.addressLine2 && (
                  <Typography variant="body2" color="#334155">
                    {formData.addressLine2}
                  </Typography>
                )}
                {formData.landmark && (
                  <Typography variant="body2" color="#334155">
                    {formData.landmark}
                  </Typography>
                )}
                <Typography variant="body2" color="#334155">
                  {formData.city}, {formData.state} {formData.postalCode}
                </Typography>
                <Typography variant="body2" color="#334155">
                  {formData.country}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" fontWeight={500} color="#475569" sx={{ mb: 1 }}>
                Address Verification Status
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(22, 163, 74, 0.08)",
                  borderRadius: 2,
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CheckCircle sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight={500}>
                  Address Verified
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          Changes to your address details require approval from an administrator. Your request will be reviewed within
          1-2 business days.
        </Alert>
      )}

      <RequestChangeDialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        onSubmit={handleRequestSubmit}
        title="Request Address Changes"
        changes={Object.entries(formData)
          .filter(([key, value]) => value !== user[key])
          .map(([key, value]) => ({
            field: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            oldValue: user[key] || "Not set",
            newValue: (value as string) || "Not set",
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

export default AddressDetailsSection
