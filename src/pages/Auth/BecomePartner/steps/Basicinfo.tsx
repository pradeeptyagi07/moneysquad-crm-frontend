"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material"
import { VerifiedUser } from "@mui/icons-material"
import type { PartnerFormData } from "../index"

interface BasicInfoProps {
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
}

const registrationTypes = ["Individual", "Proprietorship", "LLP", "Private Limited", "Other"]

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, updateFormData }) => {
  const [errors, setErrors] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    pincode: "",
    registrationType: "",
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)

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

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "fullName":
        return value ? "" : "Full name is required"
      case "mobileNumber":
        return value
          ? /^[6-9]\d{9}$/.test(value)
            ? ""
            : "Enter a valid 10-digit mobile number"
          : "Mobile number is required"
      case "email":
        return value
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ""
            : "Enter a valid email address"
          : "Email is required"
      case "pincode":
        return value ? (/^\d{6}$/.test(value) ? "" : "Enter a valid 6-digit pincode") : "Pincode is required"
      case "registrationType":
        return value ? "" : "Please select registration type"
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

  const handleSendOtp = async () => {
    const emailError = validateField("email", formData.email)

    if (emailError) {
      setErrors({
        ...errors,
        email: emailError,
      })
      return
    }

    setIsSendingOtp(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setOtpSent(true)
    } catch (error) {
      console.error("Error sending OTP:", error)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP")
      return
    }

    setIsVerifying(true)
    setOtpError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, accept any 4-digit OTP
      if (otp.length === 4 && /^\d{4}$/.test(otp)) {
        updateFormData({ otpVerified: true })
      } else {
        setOtpError("Invalid OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setOtpError("Failed to verify OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Box>
      <Grid container spacing={3}>
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
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

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
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

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

        <Grid item xs={12}>
          {!formData.otpVerified && !otpSent && (
            <Button
              variant="contained"
              onClick={handleSendOtp}
              disabled={isSendingOtp || !formData.email}
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
                  setOtp(e.target.value)
                  if (otpError) setOtpError("")
                }}
                error={!!otpError}
                helperText={otpError}
                sx={{ flex: 1 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />
              <Button
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={isVerifying || !otp}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.pincode}
            helperText={errors.pincode}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

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
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          >
            {registrationTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            All fields marked with * are mandatory. Your email will be verified via a verification code.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BasicInfo
