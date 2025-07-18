// File: steps/BankDetails.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "accountHolderName":
        return value.trim() ? "" : "Account holder name is required"
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
            : "Enter a valid account number (9-18 digits)"
          : "Account number is required"
      case "confirmAccountNumber":
        return value
          ? value === formData.accountNumber
            ? ""
            : "Account numbers do not match"
          : "Please confirm account number"
      case "ifscCode":
        return value
          ? /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())
            ? ""
            : "Enter a valid IFSC code (First 4 letters, then 0, then 6 chars)"
          : "IFSC code is required"
      case "branchName":
        return value.trim() ? "" : "Branch name is required"
      case "isGstBillingApplicable": {
        const needs = formData.accountType === "Current" || formData.accountType === "Others"
        return needs && !value ? "Please select GST billing option" : ""
      }
      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    let processedValue = value

    // Process specific fields
    if (name === "accountNumber" || name === "confirmAccountNumber") {
      // Only allow digits for account numbers
      processedValue = value.replace(/\D/g, "").slice(0, 18)
    } else if (name === "ifscCode") {
      // Convert to uppercase and limit to 11 characters
      processedValue = value.toUpperCase().slice(0, 11)
    }

    updateFormData({ [name]: processedValue })

    // Validate matching account numbers in real-time
    if (name === "confirmAccountNumber" && processedValue && processedValue !== formData.accountNumber) {
      setErrors((prev) => ({ ...prev, confirmAccountNumber: "Account numbers do not match" }))
    } else if (
      name === "accountNumber" &&
      formData.confirmAccountNumber &&
      processedValue !== formData.confirmAccountNumber
    ) {
      setErrors((prev) => ({ ...prev, confirmAccountNumber: "Account numbers do not match" }))
    }

    // Only one eye toggle active at a time
    if (name === "accountNumber") setShowConfirmAccountNumber(false)
    if (name === "confirmAccountNumber") setShowAccountNumber(false)
  }

  const handleBankChange = (_: any, newValue: any) => {
    const bankName = newValue ? newValue.name : ""
    updateFormData({ bankName })
    if (bankName && errors.bankName) {
      setErrors((prev) => ({ ...prev, bankName: "" }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
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
            {accountTypes.map((option) => (
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
            {relationshipOptions.map((option) => (
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
            getOptionLabel={(option) => option.name}
            value={banks.find((bank) => bank.name === formData.bankName) || null}
            onChange={handleBankChange}
            loading={banksLoading}
            renderInput={(params) => (
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
              options.filter((opt) => opt.name.toLowerCase().includes(inputValue.toLowerCase()))
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
                maxLength: 18,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setShowAccountNumber((prev) => !prev)
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
                maxLength: 18,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setShowConfirmAccountNumber((prev) => !prev)
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
              inputProps: { maxLength: 11 },
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
              <FormLabel component="legend" required sx={{ mb: 1 }}>
                Is GST Billing Applicable?
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
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.isGstBillingApplicable}
                </Typography>
              )}
            </FormControl>
          </Grid>
        )}

        {/* Info Alert */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Please ensure all bank details are accurate. Commission payments will be made
              to this account.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BankDetails
