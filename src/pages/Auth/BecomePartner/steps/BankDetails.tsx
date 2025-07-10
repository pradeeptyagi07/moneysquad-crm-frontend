// File: steps/BankDetails.tsx
"use client"

import React, { useState, useEffect } from "react"
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
  Autocomplete,
  CircularProgress,
  useTheme,
} from "@mui/material"
import { Info, Visibility, VisibilityOff } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../../../store"
import { fetchBanks } from "../../../../store/slices/lenderLoanSlice"
import type { PartnerFormData } from "../index"

interface BankDetailsProps {
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
}

const accountTypes = ["Savings", "Current", "Others"]
const relationshipOptions = ["Self", "Company", "Spouse", "Parent", "Others"]

const BankDetails: React.FC<BankDetailsProps> = ({ formData, updateFormData }) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { banks, loading: banksLoading } = useSelector((state: RootState) => state.lenderLoan)

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
  const [banksFetched, setBanksFetched] = useState(false)

  // Red asterisk styling for required fields
  const labelProps = {
    sx: {
      "& .MuiInputLabel-asterisk": {
        color: theme.palette.error.main,
      },
    },
  }

  // Fetch banks once
  useEffect(() => {
    if (!banksFetched && banks.length === 0) {
      dispatch(fetchBanks())
      setBanksFetched(true)
    }
  }, [dispatch, banks.length, banksFetched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
    // Validate matching account numbers
    if (name === "confirmAccountNumber" && value && value !== formData.accountNumber) {
      setErrors(prev => ({ ...prev, confirmAccountNumber: "Account numbers do not match" }))
    } else if (name === "accountNumber" && formData.confirmAccountNumber && value !== formData.confirmAccountNumber) {
      setErrors(prev => ({ ...prev, confirmAccountNumber: "Account numbers do not match" }))
    }
    updateFormData({ [name]: value })
    // Only one eye toggle active at a time
    if (name === "accountNumber") setShowConfirmAccountNumber(false)
    if (name === "confirmAccountNumber") setShowAccountNumber(false)
  }

  const handleBankChange = (_: any, newValue: any) => {
    const bankName = newValue ? newValue.name : ""
    updateFormData({ bankName })
    if (bankName && errors.bankName) {
      setErrors(prev => ({ ...prev, bankName: "" }))
    }
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
        return value
          ? /^\d{9,18}$/.test(value)
            ? ""
            : "Enter a valid account number"
          : "Account number is required"
      case "confirmAccountNumber":
        return value
          ? value === formData.accountNumber
            ? ""
            : "Account numbers do not match"
          : "Please confirm account number"
      case "ifscCode":
        return value
          ? /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
            ? ""
            : "Enter a valid IFSC code (First 4 letters, then 0, then 6 chars)"
          : "IFSC code is required"
      case "branchName":
        return value ? "" : "Branch name is required"
      case "isGstBillingApplicable": {
        const needs = formData.accountType === "Current" || formData.accountType === "Others"
        return needs && !value ? "Please select GST billing option" : ""
      }
      default:
        return ""
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const showGstBilling = formData.accountType === "Current" || formData.accountType === "Others"

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Bank Account Details
      </Typography>

      <Grid container spacing={3}>
        {/* Account Holder Name */}
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
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        {/* Account Type */}
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
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          >
            {accountTypes.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Relationship with Account Holder */}
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
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          >
            {relationshipOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Bank Name */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={banks}
            getOptionLabel={option => option.name}
            value={banks.find(bank => bank.name === formData.bankName) || null}
            onChange={handleBankChange}
            loading={banksLoading}
            renderInput={params => (
              <TextField
                {...params}
                required
                label="Bank Name"
                error={!!errors.bankName}
                helperText={errors.bankName}
                InputLabelProps={labelProps}
                InputProps={{
                  ...params.InputProps,
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <>
                      {banksLoading && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                {option.name}
              </li>
            )}
            filterOptions={(options, { inputValue }) =>
              options.filter(opt => opt.name.toLowerCase().includes(inputValue.toLowerCase()))
            }
            noOptionsText="No banks found"
            sx={{ width: "100%" }}
          />
        </Grid>

  {/* Account Number */}
        <Grid item xs={12} md={6}>
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
            InputLabelProps={labelProps}
            InputProps={{
              sx: { borderRadius: 2 },
              inputProps: {
                style: { WebkitTextSecurity: showAccountNumber ? "none" : "disc", userSelect: "none" },
                onCopy: (e: React.ClipboardEvent) => e.preventDefault(),
                onCut: (e: React.ClipboardEvent) => e.preventDefault(),
                onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setShowAccountNumber(prev => !prev)
                      setShowConfirmAccountNumber(false)
                    }}
                    edge="end"
                  >
                    {showAccountNumber ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Confirm Account Number */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Confirm Account Number"
            name="confirmAccountNumber"
            value={formData.confirmAccountNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.confirmAccountNumber}
            helperText={errors.confirmAccountNumber}
            InputLabelProps={labelProps}
            InputProps={{
              sx: { borderRadius: 2 },
              inputProps: {
                style: { WebkitTextSecurity: showConfirmAccountNumber ? "none" : "disc", userSelect: "none" },
                onCopy: (e: React.ClipboardEvent) => e.preventDefault(),
                onCut: (e: React.ClipboardEvent) => e.preventDefault(),
                onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setShowConfirmAccountNumber(prev => !prev)
                      setShowAccountNumber(false)
                    }}
                    edge="end"
                  >
                    {showConfirmAccountNumber ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* IFSC Code */}
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
            InputLabelProps={labelProps}
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

        {/* Branch Name */}
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
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Grid>

        {/* GST Billing Section */}
        {showGstBilling && (
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.isGstBillingApplicable}>
              <FormLabel component="legend" sx={{ mb: 1 }} {...labelProps}>
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
