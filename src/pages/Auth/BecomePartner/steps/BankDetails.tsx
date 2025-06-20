"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from "@mui/material"
import { Info, Visibility, VisibilityOff } from "@mui/icons-material"
import type { PartnerFormData } from "../index"

interface BankDetailsProps {
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
}

const accountTypes = ["Savings", "Current", "Others"]
const relationshipOptions = ["Self", "Company", "Spouse", "Parent", "Others"]

const BankDetails: React.FC<BankDetailsProps> = ({ formData, updateFormData }) => {
  const [errors, setErrors] = useState({
    accountHolderName: "",
    accountType: "",
    relationshipWithAccountHolder: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
    isGstBillingApplicable: "",
  })

  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [showConfirmAccountNumber, setShowConfirmAccountNumber] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // Special validation for confirm account number
    if (name === "confirmAccountNumber" && value !== formData.accountNumber) {
      setErrors({
        ...errors,
        confirmAccountNumber: "Account numbers do not match",
      })
    } else if (name === "accountNumber" && formData.confirmAccountNumber && value !== formData.confirmAccountNumber) {
      setErrors({
        ...errors,
        confirmAccountNumber: "Account numbers do not match",
      })
    }

    updateFormData({ [name]: value })
  }

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "accountHolderName":
        return value ? "" : "Account holder name is required"
      case "accountType":
        return value ? "" : "Please select account type"
      case "relationshipWithAccountHolder":
        return value ? "" : "Please select relationship with account holder"
      case "bankName":
        return value ? "" : "Bank name is required"
      case "accountNumber":
        return value ? (/^\d{9,18}$/.test(value) ? "" : "Enter a valid account number") : "Account number is required"
      case "confirmAccountNumber":
        return value
          ? value === formData.accountNumber
            ? ""
            : "Account numbers do not match"
          : "Please confirm account number"
      case "ifscCode":
        // Updated IFSC validation: First 4 alphabets + "0" + 6 characters = 11 total
        return value
          ? /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
            ? ""
            : "Enter a valid IFSC code (First 4 letters, then 0, then 6 characters)"
          : "IFSC code is required"
      case "branchName":
        return value ? "" : "Branch name is required"
      case "isGstBillingApplicable": {
        const needsGstBilling = formData.accountType === "Current" || formData.accountType === "Others"
        return needsGstBilling && !value ? "Please select GST billing option" : ""
      }
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

  const showGstBilling = formData.accountType === "Current" || formData.accountType === "Others"

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Bank Account Details
      </Typography>

      <Grid container spacing={3}>
        {/* Account Holder Name - First field */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Account Holder Name"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.accountHolderName}
            helperText={errors.accountHolderName}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

        {/* Account Type - Second field */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Account Type"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.accountType}
            helperText={errors.accountType}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          >
            {accountTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Relationship with Account Holder - Third field */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Relationship with Account Holder"
            name="relationshipWithAccountHolder"
            value={formData.relationshipWithAccountHolder}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.relationshipWithAccountHolder}
            helperText={errors.relationshipWithAccountHolder}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          >
            {relationshipOptions.map((option) => (
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
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.bankName}
            helperText={errors.bankName}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Account Number"
            name="accountNumber"
            type={showAccountNumber ? "text" : "password"}
            value={formData.accountNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber}
            InputProps={{
              sx: { borderRadius: 2 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowAccountNumber(!showAccountNumber)} edge="end">
                    {showAccountNumber ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Confirm Account Number"
            name="confirmAccountNumber"
            type={showConfirmAccountNumber ? "text" : "password"}
            value={formData.confirmAccountNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.confirmAccountNumber}
            helperText={errors.confirmAccountNumber}
            InputProps={{
              sx: { borderRadius: 2 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmAccountNumber(!showConfirmAccountNumber)} edge="end">
                    {showConfirmAccountNumber ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.ifscCode}
            helperText={errors.ifscCode}
            InputProps={{
              sx: { borderRadius: 2 },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="IFSC code format: First 4 letters + 0 + 6 characters (e.g., HDFC0123456)">
                    <IconButton edge="end">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Branch Name"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.branchName}
            helperText={errors.branchName}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

        {/* GST Billing Section - Only show for Current or Others account type */}
        {showGstBilling && (
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.isGstBillingApplicable}>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Is GST billing applicable? *
              </FormLabel>
              <RadioGroup
                row
                name="isGstBillingApplicable"
                value={formData.isGstBillingApplicable}
                onChange={handleChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.isGstBillingApplicable && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.isGstBillingApplicable}
                </Typography>
              )}
            </FormControl>

            <Alert severity="info" sx={{ mt: 2 }}>
              GST Amount to be processed after you file GSTR-1 for that invoice.
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Your bank details are secure and will only be used for commission payouts.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BankDetails
