"use client"

import React from "react"
import { Box, Typography, Grid, TextField, MenuItem } from "@mui/material"

interface BankDetailsSectionProps {
  title?: string
  accountTypes?: string[]
  formData?: {
    accountType: string
    accountHolderName: string
    accountNumber: string
    ifscCode: string
    bankName: string
    branchName: string
  }
  errors?: Partial<Record<keyof BankDetailsSectionProps['formData'], string>>
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
  title = "Bank Account Details",
  accountTypes = ["Savings", "Current"],
  formData = {
    accountType: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
  },
  errors = {},
  handleChange = () => {},
  handleBlur = () => {},
}) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
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
            InputProps={{ sx: { borderRadius: 2 } }}
          >
            {accountTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
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
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default BankDetailsSection
