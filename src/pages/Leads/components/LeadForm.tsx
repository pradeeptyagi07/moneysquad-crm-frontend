"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import type { Lead, ApplicantProfile } from "../../../data/leadTypes"

interface LeadFormProps {
  onSubmit: (data: Partial<Lead>) => void
  onCancel: () => void
  initialData?: Lead
  isEdit?: boolean
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, onCancel, initialData, isEdit = false }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    applicantName: initialData?.applicantName || "",
    applicantProfile: initialData?.applicantProfile || "Salaried",
    businessName: initialData?.businessName || "",
    mobileNumber: initialData?.mobileNumber || "",
    email: initialData?.email || "",
    pincode: initialData?.pincode || "",
    loanType: initialData?.loanType || "",
    loanAmount: initialData?.loanAmount || 0,
    comments: initialData?.comments || "",
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const loanTypes = [
    "Personal Loan",
    "Home Loan",
    "Business Loan",
    "Car Loan",
    "Education Loan",
    "Gold Loan",
    "Loan Against Property",
  ]

  const applicantProfiles: ApplicantProfile[] = ["Salaried", "Self-Employed", "Business", "Student", "Retired"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (!name) return

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // Required fields
    if (!formData.applicantName?.trim()) {
      newErrors.applicantName = "Applicant name is required"
      isValid = false
    }

    if (formData.applicantProfile === "Business" && !formData.businessName?.trim()) {
      newErrors.businessName = "Business name is required"
      isValid = false
    }

    if (!formData.mobileNumber?.trim()) {
      newErrors.mobileNumber = "Mobile number is required"
      isValid = false
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number"
      isValid = false
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address"
      isValid = false
    }

    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required"
      isValid = false
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode"
      isValid = false
    }

    if (!formData.loanType) {
      newErrors.loanType = "Loan type is required"
      isValid = false
    }

    if (!formData.loanAmount) {
      newErrors.loanAmount = "Loan amount is required"
      isValid = false
    } else if (formData.loanAmount <= 0) {
      newErrors.loanAmount = "Loan amount must be greater than 0"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {isEdit ? "Edit Lead Information" : "New Lead Information"}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600}>
            Applicant Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant Name"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleChange}
            error={!!errors.applicantName}
            helperText={errors.applicantName}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.applicantProfile}>
            <InputLabel>Applicant Profile</InputLabel>
            <Select
              name="applicantProfile"
              value={formData.applicantProfile}
              label="Applicant Profile"
              onChange={handleChange}
            >
              {applicantProfiles.map((profile) => (
                <MenuItem key={profile} value={profile}>
                  {profile}
                </MenuItem>
              ))}
            </Select>
            {errors.applicantProfile && <FormHelperText>{errors.applicantProfile}</FormHelperText>}
          </FormControl>
        </Grid>

        {formData.applicantProfile === "Business" && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={!!errors.businessName}
              helperText={errors.businessName}
              required
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            error={!!errors.pincode}
            helperText={errors.pincode}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
            Loan Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.loanType}>
            <InputLabel>Loan Type</InputLabel>
            <Select name="loanType" value={formData.loanType} label="Loan Type" onChange={handleChange} required>
              {loanTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.loanType && <FormHelperText>{errors.loanType}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Loan Amount"
            name="loanAmount"
            type="number"
            value={formData.loanAmount}
            onChange={handleChange}
            error={!!errors.loanAmount}
            helperText={errors.loanAmount}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Comments"
            name="comments"
            multiline
            rows={4}
            value={formData.comments}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              {isEdit ? "Update Lead" : "Create Lead"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LeadForm
