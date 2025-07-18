// File: steps/AddressDetails.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Box, Grid, TextField, MenuItem, Typography, useTheme } from "@mui/material"
import type { PartnerFormData } from "../index"

interface AddressDetailsProps {
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
}

const addressTypes = ["Owned", "Rented", "Company Provided", "Parental", "Other"]

const AddressDetails: React.FC<AddressDetailsProps> = ({ formData, updateFormData }) => {
  const theme = useTheme()
  const [errors, setErrors] = useState({
    addressLine1: "",
    city: "",
    addressPincode: "",
    addressType: "",
  })

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "addressLine1":
        return value.trim() ? "" : "Address line 1 is required"
      case "city":
        return value.trim() ? "" : "City is required"
      case "addressPincode":
        return value ? (/^\d{6}$/.test(value) ? "" : "Enter a valid 6-digit pincode") : "Pincode is required"
      case "addressType":
        return value ? "" : "Please select address type"
      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // For pincode, only allow digits and limit to 6 characters
    if (name === "addressPincode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6)
      updateFormData({ [name]: numericValue })
    } else {
      updateFormData({ [name]: value })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const errorMessage = validateField(name, value)
    setErrors({
      ...errors,
      [name]: errorMessage,
    })
  }

  // Red asterisk styling for required fields
  const labelProps = {
    sx: {
      "& .MuiInputLabel-asterisk": {
        color: theme.palette.error.main,
      },
    },
  }

  const addressTitle = formData.registrationType === "Individual" ? "Residence Address" : "Work Address"

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {addressTitle}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.addressLine1}
            helperText={errors.addressLine1}
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 2 (Optional)"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Landmark (Optional)"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.city}
            helperText={errors.city}
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Pincode"
            name="addressPincode"
            value={formData.addressPincode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.addressPincode}
            helperText={errors.addressPincode}
            InputLabelProps={labelProps}
            InputProps={{
              sx: { borderRadius: 2 },
              inputProps: { maxLength: 6 },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Address Type"
            name="addressType"
            value={formData.addressType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.addressType}
            helperText={errors.addressType}
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          >
            {addressTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddressDetails
