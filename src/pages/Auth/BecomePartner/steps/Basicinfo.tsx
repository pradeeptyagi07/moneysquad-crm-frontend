// ✅ File: steps/BasicInfo.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material"
import { VerifiedUser } from "@mui/icons-material"
import { sendPartnerOtp, verifyPartnerOtp } from "../../../../store/slices/signupPartnerSlice"
import type { PartnerFormData } from "../index"

interface BasicInfoProps {
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
  onValidationChange?: (isValid: boolean) => void
}

const registrationTypes = ["Individual", "Proprietorship", "Partnership", "LLP", "Private Limited", "Other"]
const teamStrengthOptions = ["<5", "5-15", "15-30", "30-50", "50+"]

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, updateFormData, onValidationChange }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const [errors, setErrors] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    registrationType: "",
    teamStrength: "",
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Full name is required"
      case "mobileNumber":
        return value
          ? /^[6-9]\d{9}$/.test(value)
            ? ""
            : "Enter a valid 10-digit mobile number starting with 6-9"
          : "Mobile number is required"
      case "email":
        return value
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ""
            : "Enter a valid email address"
          : "Email is required"
      case "registrationType":
        return value ? "" : "Please select registration type"
      case "teamStrength": {
        const isNonIndividual = formData.registrationType !== "Individual"
        return isNonIndividual && !value ? "Team strength is required for non-individual registration" : ""
      }
      default:
        return ""
    }
  }

  const checkFormValidity = () => {
    const requiredFields = ["fullName", "mobileNumber", "email", "registrationType"]
    const isNonIndividual = formData.registrationType && formData.registrationType !== "Individual"

    if (isNonIndividual) {
      requiredFields.push("teamStrength")
    }

    // Check if all required fields have valid values
    for (const field of requiredFields) {
      const value = formData[field as keyof PartnerFormData] as string
      if (!value || validateField(field, value)) {
        return false
      }
    }

    // Check if OTP is verified
    if (!formData.otpVerified) {
      return false
    }

    return true
  }

  // Check validity whenever form data changes
  useEffect(() => {
    const isValid = checkFormValidity()
    onValidationChange?.(isValid)
  }, [formData, onValidationChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" })
    }

    // For mobile number, only allow digits and limit to 10 characters
    if (name === "mobileNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10)
      updateFormData({ [name]: numericValue })
    } else {
      updateFormData({ [name]: value })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const errorMessage = validateField(name, value)
    setErrors({ ...errors, [name]: errorMessage })
  }

  const handleSendOtp = async () => {
    const emailError = validateField("email", formData.email)
    if (emailError) {
      setErrors({ ...errors, email: emailError })
      return
    }

    setIsSendingOtp(true)
    try {
      await dispatch(sendPartnerOtp(formData.email)).unwrap()
      setOtpSent(true)
      setOtpError("")
    } catch (error) {
      setOtpError(error as string)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP")
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)
    try {
      await dispatch(verifyPartnerOtp({ email: formData.email, otp })).unwrap()
      updateFormData({ otpVerified: true })
      setOtpError("")
    } catch (error) {
      setOtpError(error as string)
    } finally {
      setIsVerifying(false)
    }
  }

  const isNonIndividual = formData.registrationType && formData.registrationType !== "Individual"

  // Label props for red asterisk on required fields
  const labelProps = {
    sx: {
      "& .MuiInputLabel-asterisk": {
        color: theme.palette.error.main,
      },
    },
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Full Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.fullName}
            helperText={errors.fullName}
            InputLabelProps={labelProps}
            InputProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        {/* Mobile Number */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            InputLabelProps={labelProps}
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
              sx: { borderRadius: 2 },
              inputProps: { maxLength: 10 },
            }}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.email}
            helperText={errors.email}
            disabled={formData.otpVerified}
            InputLabelProps={labelProps}
            InputProps={{
              sx: { borderRadius: 2 },
              endAdornment: formData.otpVerified ? (
                <InputAdornment position="end">
                  <VerifiedUser color="success" />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        {/* OTP Section */}
        <Grid item xs={12}>
          {!formData.otpVerified && !otpSent && (
            <Button
              variant="contained"
              onClick={handleSendOtp}
              disabled={isSendingOtp || !formData.email || !!validateField("email", formData.email)}
              sx={{
                height: "56px",
                borderRadius: 2,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                "&.Mui-disabled": {
                  background: "#e2e8f0",
                  color: "#94a3b8",
                },
              }}
            >
              {isSendingOtp ? <CircularProgress size={24} /> : "Send Verification Code to Email"}
            </Button>
          )}

          {!formData.otpVerified && otpSent && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Enter Verification Code"
                value={otp}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setOtp(numericValue)
                  if (otpError) setOtpError("")
                }}
                error={!!otpError}
                helperText={otpError}
                sx={{ flex: 1 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  inputProps: { maxLength: 6 },
                }}
                placeholder="6-digit code"
              />
              <Button
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={isVerifying || !otp || otp.length !== 6}
                sx={{
                  height: "56px",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  "&.Mui-disabled": {
                    background: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
              >
                {isVerifying ? <CircularProgress size={24} /> : "Verify"}
              </Button>
            </Box>
          )}

          {formData.otpVerified && (
            <Alert severity="success" sx={{ height: "100%", display: "flex", alignItems: "center" }}>
              Email verified successfully
            </Alert>
          )}
        </Grid>

        {/* Registration Type */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            label="Registering as"
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.registrationType}
            helperText={errors.registrationType}
            InputLabelProps={labelProps}
            InputProps={{ sx: { borderRadius: 2 } }}
          >
            {registrationTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Team Strength - Only show for non-individual registration */}
        {isNonIndividual && (
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              required
              label="Team Strength"
              name="teamStrength"
              value={formData.teamStrength}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.teamStrength}
              helperText={errors.teamStrength}
              InputLabelProps={labelProps}
              InputProps={{ sx: { borderRadius: 2 } }}
            >
              {teamStrengthOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default BasicInfo
