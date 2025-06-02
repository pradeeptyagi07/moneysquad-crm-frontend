"use client"

import React from "react"
import { Box, Typography, Grid, TextField, MenuItem } from "@mui/material"

interface AddressDetailsSectionProps {
  addressTitle?: string
  addressTypes?: string[]
  formData?: {
    addressLine1: string
    addressLine2?: string
    landmark?: string
    city: string
    addressPincode: string
    addressType: string
  }
  errors?: {
    addressLine1?: string
    city?: string
    addressPincode?: string
    addressType?: string
  }
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({
  addressTitle = "Address Details",
  addressTypes = ["Residential", "Commercial", "Permanent", "Temporary"],
  formData = {
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    addressPincode: "",
    addressType: "",
  },
  errors = {},
  handleChange = () => {},
  handleBlur = () => {},
}) => {
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
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 2 (Optional)"
            name="addressLine2"
            value={formData.addressLine2 || ""}
            onChange={handleChange}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Landmark (Optional)"
            name="landmark"
            value={formData.landmark || ""}
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
            InputProps={{ sx: { borderRadius: 2 } }}
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

export default AddressDetailsSection
