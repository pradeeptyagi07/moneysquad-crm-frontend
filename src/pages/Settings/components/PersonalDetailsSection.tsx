"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, TextField, Grid, Paper, Button } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { Edit, Save, Cancel } from "@mui/icons-material"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  selectUserData,

  isPartnerUser,
} from "../../../store/slices/userDataSlice"

const PersonalDetailsSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)

  // Get user data from Redux store
  const userData = useAppSelector(selectUserData)


  // Extract data from userData if it's a partner
  const user = isPartnerUser(userData)
    ? {
        fullName: userData.basicInfo?.fullName || "",
        mobileNumber: userData.basicInfo?.mobile || "",
        email: userData.basicInfo?.email || "",
        registrationType: userData.basicInfo?.registeringAs || "",
        currentProfession: userData.personalInfo?.currentProfession || "",
        dateOfBirth: userData.personalInfo?.dateOfBirth || "",
        emergencyContact: userData.personalInfo?.emergencyContactNumber || "",
        focusProduct: userData.personalInfo?.focusProduct || "",
        experienceInSellingLoans: userData.personalInfo?.experienceInSellingLoans || "",
      }
    : {
        fullName: "",
        mobileNumber: "",
        email: "",
        registrationType: "",
        currentProfession: "",
        dateOfBirth: "",
        emergencyContact: "",
        focusProduct: "",
        experienceInSellingLoans: "",
      }

  const [tempData, setTempData] = useState(user)

  const handleEdit = () => {
    setTempData(user)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempData(user)
    setIsEditing(false)
  }

  const handleUpdate = () => {
    // Here you would make API call to update the data
    console.log("Updating personal details:", tempData)
    // For now, just exit edit mode
    setIsEditing(false)
    // In real implementation, update the user data after successful API call
  }

  const handleChange = (field: string, value: any) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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

  return (
    <Box>
      {/* Profile Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={600} color="#334155">
          Partner Profile
        </Typography>
        {!isEditing ? (
          <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit} sx={{ borderRadius: 2 }}>
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleUpdate} sx={{ borderRadius: 2 }}>
              Update
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
              fullWidth
              label="Focus Product"
              value={isEditing ? tempData.focusProduct : user.focusProduct}
              onChange={(e) => handleChange("focusProduct", e.target.value)}
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
    </Box>
  )
}

export default PersonalDetailsSection
