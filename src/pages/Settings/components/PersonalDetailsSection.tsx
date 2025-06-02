"use client"

import React from "react"
import { Box, Typography, TextField, Grid, Paper } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"

interface PartnerProfileSectionProps {
  user?: {
    fullName?: string
    mobileNumber?: string
    email?: string
    registrationType?: string
    gender?: string
    dateOfBirth?: string
    employmentType?: string
    emergencyContact?: string
    focusProduct?: string
  }
}

const PersonalDetailsSection: React.FC<PartnerProfileSectionProps> = ({
  user = {
    fullName: "",
    mobileNumber: "",
    email: "",
    registrationType: "",
    gender: "",
    dateOfBirth: undefined,
    employmentType: "",
    emergencyContact: "",
    focusProduct: "",
  },
}) => {
  const formData = {
    fullName: user.fullName || "",
    mobileNumber: user.mobileNumber || "",
    email: user.email || "",
    registrationType: user.registrationType || "",
    gender: user.gender || "",
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
    employmentType: user.employmentType || "",
    emergencyContact: user.emergencyContact || "",
    focusProduct: user.focusProduct || "",
  }

  return (
    <Box>
      {/* Profile Header */}
      <Typography variant="h5" fontWeight={600} color="#334155" mb={3}>
        Partner Profile
      </Typography>

      {/* Basic Info Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 4,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#334155" mb={2}>
          Basic Info
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={formData.mobileNumber}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Registration Type"
              value={formData.registrationType}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Personal Details Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#334155" mb={2}>
          Personal Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                disabled
                slotProps={{
                  textField: { fullWidth: true, variant: "outlined", sx: { backgroundColor: "#ffffff" } },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Gender"
              value={formData.gender}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employment Type"
              value={formData.employmentType}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact"
              value={formData.emergencyContact}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Focus Product"
              value={formData.focusProduct}
              disabled
              variant="outlined"
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default PersonalDetailsSection
