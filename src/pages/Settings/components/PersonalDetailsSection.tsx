"use client"

import React from "react"

import { useState } from "react"
import type { FC } from "react"
import { Box, Typography, TextField, Grid, Paper, Button, CircularProgress, Snackbar, Alert, MenuItem } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { Edit, Save, Cancel } from "@mui/icons-material"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import {
  selectUserData,
  selectUserDataLoading,
  selectUserDataError,
  selectUserDataUpdating,
  selectUserDataUpdateError,
  updateUserData,
  isPartnerUser,
} from "../../../store/slices/userDataSlice"

const PersonalDetailsSection: FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  // Get user data from Redux store
  const dispatch = useAppDispatch()
  const userData = useAppSelector(selectUserData)
  const loading = useAppSelector(selectUserDataLoading)
  const error = useAppSelector(selectUserDataError)
  const updating = useAppSelector(selectUserDataUpdating)
  const updateError = useAppSelector(selectUserDataUpdateError)

  // Extract data from userData if it's a partner
  const user = isPartnerUser(userData)
    ? {
        fullName: userData.basicInfo?.fullName || "",
        mobileNumber: userData.basicInfo?.mobile || "",
        email: userData.basicInfo?.email || "",
        registrationType: userData.basicInfo?.registeringAs || "",
        teamStrength: userData.basicInfo?.teamStrength || "",
        currentProfession: userData.personalInfo?.currentProfession || "",
        dateOfBirth: userData.personalInfo?.dateOfBirth || "",
        emergencyContact: userData.personalInfo?.emergencyContactNumber || "",
        focusProduct: userData.personalInfo?.focusProduct || "",
        roleSelection: userData.personalInfo?.roleSelection || "",
        experienceInSellingLoans: userData.personalInfo?.experienceInSellingLoans || "",
      }
    : {
        fullName: "",
        mobileNumber: "",
        email: "",
        registrationType: "",
        teamStrength: "",
        currentProfession: "",
        dateOfBirth: "",
        emergencyContact: "",
        focusProduct: "",
        roleSelection: "",
        experienceInSellingLoans: "",
      }

  const [tempData, setTempData] = useState(user)

  // Update tempData when userData changes
  React.useEffect(() => {
    if (isPartnerUser(userData)) {
      const updatedUser = {
        fullName: userData.basicInfo?.fullName || "",
        mobileNumber: userData.basicInfo?.mobile || "",
        email: userData.basicInfo?.email || "",
        registrationType: userData.basicInfo?.registeringAs || "",
        teamStrength: userData.basicInfo?.teamStrength || "",
        currentProfession: userData.personalInfo?.currentProfession || "",
        dateOfBirth: userData.personalInfo?.dateOfBirth || "",
        emergencyContact: userData.personalInfo?.emergencyContactNumber || "",
        focusProduct: userData.personalInfo?.focusProduct || "",
        roleSelection: userData.personalInfo?.roleSelection || "",
        experienceInSellingLoans: userData.personalInfo?.experienceInSellingLoans || "",
      }
      setTempData(updatedUser)
    }
  }, [userData])

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const handleEdit = () => {
    setTempData(user)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempData(user)
    setIsEditing(false)
  }

  const handleUpdate = async () => {
    if (!userData || !isPartnerUser(userData)) return

    try {
      // Prepare update data in the same format as received (basicInfo and personalInfo)
      // Email should be read-only for partners, so exclude it from updates
      const updateData = {
        basicInfo: {
          ...userData.basicInfo,
          fullName: tempData.fullName,
          mobile: tempData.mobileNumber,
          teamStrength: tempData.teamStrength,
          // email is read-only for partners, so we keep the original value
          email: userData.basicInfo?.email,
        },
        personalInfo: {
          ...userData.personalInfo,
          currentProfession: tempData.currentProfession,
          dateOfBirth: tempData.dateOfBirth,
          emergencyContactNumber: tempData.emergencyContact,
          focusProduct: tempData.focusProduct,
          roleSelection: tempData.roleSelection,
          experienceInSellingLoans: tempData.experienceInSellingLoans,
        },
      }

      await dispatch(updateUserData(updateData)).unwrap()
      setSnackbar({ open: true, message: "Personal details updated successfully!", severity: "success" })
      setIsEditing(false)
    } catch (error: any) {
      setSnackbar({ open: true, message: error || "Failed to update personal details", severity: "error" })
    }
  }

  const handleChange = (field: string, value: any) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Helper function to determine if field is editable
  const isFieldEditable = (field: string) => {
    if (!isEditing) return false

    // For partners, email should be read-only
    if (field === "email") {
      return false
    }

    return true
  }

  // Dropdown options from BecomePartner form
  const professionOptions = [
    "Freelancer",
    "Financial Advisor",
    "Insurance Agent",
    "Property Dealer",
    "Chartered Accountant",
    "Wealth Manager",
    "Loan Agent/DSA",
    "Bank Employee",
    "Retired Individual",
    "Salaried Individual",
    "Student",
    "Other",
  ]

  const experienceOptions = [
    "Completely New",
    "Less than 12 months",
    "1 Year - 3 Years",
    "3 Years - 10 Years",
    "More than 10 Years",
  ]

  const teamStrengthOptions = [ "<5", "5-10", "10-20", "20-50", "50+"]

  const focusProductOptions = [
    "Personal Loan",
    "Business Loan",
    "Home Loan",
    "Loan Against Property",
    "Credit Card",
    "Insurance",
    "All Products",
  ]

const roleSelectionOptions = [
  { value: "fileSharing", label: "File Sharing" },
  { value: "leadSharing", label: "Lead Sharing" },
]

  return (
    <Box>
      {/* Profile Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={600} color="#334155">
          Partner Profile
        </Typography>
        {!isEditing ? (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{ borderRadius: 2 }}
            disabled={updating}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              sx={{ borderRadius: 2 }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={updating ? <CircularProgress size={16} color="inherit" /> : <Save />}
              onClick={handleUpdate}
              sx={{ borderRadius: 2 }}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </Button>
          </Box>
        )}
      </Box>

      {/* Basic Info Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 4,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
          transition: "all 0.3s ease",
          ...(isEditing && {
            border: "2px solid #3b82f6",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
          }),
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
              value={isEditing ? tempData.fullName : user.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              sx={{
                backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#64748b",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={isEditing ? tempData.mobileNumber : user.mobileNumber}
              onChange={(e) => handleChange("mobileNumber", e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              sx={{
                backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#64748b",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={isEditing ? tempData.email : user.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!isFieldEditable("email")} // Email is always read-only for partners
              variant="outlined"
              sx={{
                backgroundColor: "#f1f5f9", // Always read-only background for email
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#475569",
                },
              }}
              helperText={isEditing ? "Email cannot be changed" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Registration Type"
              value={isEditing ? tempData.registrationType : user.registrationType}
              disabled
              variant="outlined"
              sx={{
                backgroundColor: "#f1f5f9",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#475569",
                },
              }}
            />
          </Grid>
          {/* Show Team Strength only for non-Individual registration types */}
          {user.registrationType !== "Individual" && (
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Team Strength"
                value={isEditing ? tempData.teamStrength : user.teamStrength}
                onChange={(e) => handleChange("teamStrength", e.target.value)}
                disabled={!isEditing}
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#64748b",
                  },
                }}
              >
                <option value="" disabled>
                  Select Team Strength
                </option>
                {teamStrengthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Personal Details Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
          transition: "all 0.3s ease",
          ...(isEditing && {
            border: "2px solid #3b82f6",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
          }),
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
                value={
                  isEditing
                    ? tempData.dateOfBirth
                      ? new Date(tempData.dateOfBirth)
                      : null
                    : user.dateOfBirth
                      ? new Date(user.dateOfBirth)
                      : null
                }
                onChange={(date) => handleChange("dateOfBirth", date?.toISOString())}
                disabled={!isEditing}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#64748b",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Current Profession"
              value={isEditing ? tempData.currentProfession : user.currentProfession}
              onChange={(e) => handleChange("currentProfession", e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#64748b",
                },
              }}
            >
              <option value="" disabled>
                Select Profession
              </option>
              {professionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact"
              value={isEditing ? tempData.emergencyContact : user.emergencyContact}
              onChange={(e) => handleChange("emergencyContact", e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              sx={{
                backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#64748b",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Focus Product"
              value={isEditing ? tempData.focusProduct : user.focusProduct}
              onChange={(e) => handleChange("focusProduct", e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#64748b",
                },
              }}
            >
              <option value="" disabled>
                Select Focus Product
              </option>
              {focusProductOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
        <TextField
  select
  fullWidth
  label="Role Selection"
  value={isEditing ? tempData.roleSelection : user.roleSelection}
  onChange={(e) => handleChange("roleSelection", e.target.value)}
  disabled={!isEditing}
  variant="outlined"
  SelectProps={{
    native: false, // ⚠️ Use native: false for better compatibility
  }}
  InputLabelProps={{
    shrink: true,
  }}
  sx={{
    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#64748b",
    },
  }}
>
  <MenuItem value="">
    <em>Select Role</em>
  </MenuItem>
  {roleSelectionOptions.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
</TextField>

          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Experience in Selling Loans"
              value={isEditing ? tempData.experienceInSellingLoans : user.experienceInSellingLoans}
              onChange={(e) => handleChange("experienceInSellingLoans", e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#64748b",
                },
              }}
            >
              <option value="" disabled>
                Select Experience
              </option>
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
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

export default PersonalDetailsSection
