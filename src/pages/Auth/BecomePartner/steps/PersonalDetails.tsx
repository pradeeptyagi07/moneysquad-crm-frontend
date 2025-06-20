"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Typography,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import type { PartnerFormData } from "../index"

interface PersonalDetailsProps {
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
}

const currentProfessionOptions = [
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

const focusProducts = ["Credit Card", "Personal Loan", "Business Loan", "Home Loan", "Insurance", "Other"]

const experienceOptions = [
  "Completely New",
  "Less than 12 months",
  "1 Year - 3 Years",
  "3 Years - 10 Years",
  "More than 10 Years",
]

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ formData, updateFormData }) => {
  const [errors, setErrors] = useState({
    dateOfBirth: "",
    employmentType: "",
    emergencyContact: "",
    focusProduct: "",
    experienceInSellingLoans: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    updateFormData({ [name]: value })
  }

  const handleDateChange = (date: Date | null) => {
    if (errors.dateOfBirth) {
      setErrors({
        ...errors,
        dateOfBirth: "",
      })
    }

    updateFormData({ dateOfBirth: date ? date.toISOString() : null })
  }

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "employmentType":
        return value ? "" : "Please select your current profession"
      case "emergencyContact":
        return value
          ? /^[6-9]\d{9}$/.test(value)
            ? ""
            : "Enter a valid 10-digit mobile number"
          : "Emergency contact is required"
      case "focusProduct":
        return value ? "" : "Please select your focus product"
      case "experienceInSellingLoans":
        return value ? "" : "Please select your experience in selling loans"
      default:
        return ""
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

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            disabled
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth *"
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth,
                  InputProps: {
                    sx: { borderRadius: 2 },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Current Profession"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.employmentType}
            helperText={errors.employmentType}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          >
            {currentProfessionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Experience in Selling Loans"
            name="experienceInSellingLoans"
            value={formData.experienceInSellingLoans}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.experienceInSellingLoans}
            helperText={errors.experienceInSellingLoans}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          >
            {experienceOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Emergency Contact Number"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.emergencyContact}
            helperText={errors.emergencyContact}
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Focus Product"
            name="focusProduct"
            value={formData.focusProduct}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.focusProduct}
            helperText={errors.focusProduct}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          >
            {focusProducts.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Role Selection
            </FormLabel>
            <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
              <FormControlLabel
                value="leadSharing"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">Lead Sharing</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Share leads with us and earn commission
                    </Typography>
                  </Box>
                }
                sx={{
                  border: "1px solid",
                  borderColor: formData.role === "leadSharing" ? "primary.main" : "divider",
                  borderRadius: 2,
                  p: 1,
                  mr: 2,
                  backgroundColor: formData.role === "leadSharing" ? "primary.lighter" : "transparent",
                }}
              />
              <FormControlLabel
                value="fileSharing"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">File Sharing</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Process complete loan files for higher commission
                    </Typography>
                  </Box>
                }
                sx={{
                  border: "1px solid",
                  borderColor: formData.role === "fileSharing" ? "primary.main" : "divider",
                  borderRadius: 2,
                  p: 1,
                  backgroundColor: formData.role === "fileSharing" ? "primary.lighter" : "transparent",
                }}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PersonalDetails
