"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Grid, TextField, MenuItem, Paper, Button } from "@mui/material"
import { Edit, Save, Cancel } from "@mui/icons-material"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  selectUserData,
  selectUserDataLoading,
  selectUserDataError,
  isPartnerUser,
} from "../../../store/slices/userDataSlice"

interface AddressDetailsSectionProps {
  user?: {
    addressLine1?: string
    addressLine2?: string
    landmark?: string
    city?: string
    addressPincode?: string
    addressType?: string
  }
}

const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({
  user = {
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    addressPincode: "",
    addressType: "",
  },
}) => {
  const [isEditing, setIsEditing] = useState(false)

  // Get user data from Redux store
  const userData = useAppSelector(selectUserData)
  const loading = useAppSelector(selectUserDataLoading)
  const error = useAppSelector(selectUserDataError)

  // Use Redux data if available, otherwise fall back to props
  const addressData =
    userData && isPartnerUser(userData)
      ? {
          addressLine1: userData.addressDetails?.addressLine1 || "",
          addressLine2: userData.addressDetails?.addressLine2 || "",
          landmark: userData.addressDetails?.landmark || "",
          city: userData.addressDetails?.city || "",
          addressPincode: userData.addressDetails?.pincode || "",
          addressType: userData.addressDetails?.addressType || "",
        }
      : user

  const [tempData, setTempData] = useState(addressData)

  const addressTypes = ["Residential", "Commercial", "Permanent", "Temporary"]

  const handleEdit = () => {
    setTempData(addressData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempData(addressData)
    setIsEditing(false)
  }

  const handleUpdate = () => {
    // Here you would make API call to update the data
    console.log("Updating address details:", tempData)
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

  return (
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
      {/* Section Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="#334155">
          Address Details
        </Typography>
        {!isEditing ? (
          <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit} size="small" sx={{ borderRadius: 2 }}>
            Edit Address
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleUpdate}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Update
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Address Line 1"
            value={isEditing ? tempData.addressLine1 : addressData.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
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

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 2 (Optional)"
            value={isEditing ? tempData.addressLine2 : addressData.addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Landmark (Optional)"
            value={isEditing ? tempData.landmark : addressData.landmark}
            onChange={(e) => handleChange("landmark", e.target.value)}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="City"
            value={isEditing ? tempData.city : addressData.city}
            onChange={(e) => handleChange("city", e.target.value)}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Pincode"
            value={isEditing ? tempData.addressPincode : addressData.addressPincode}
            onChange={(e) => handleChange("addressPincode", e.target.value)}
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

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Address Type"
            value={isEditing ? tempData.addressType : addressData.addressType}
            onChange={(e) => handleChange("addressType", e.target.value)}
            disabled={!isEditing}
            variant="outlined"
            sx={{
              backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#64748b",
              },
            }}
          >
            {addressTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default AddressDetailsSection
