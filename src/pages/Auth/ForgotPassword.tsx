"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Fade,
  Link as MuiLink,
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import OtpInput from "react-otp-input"
import { LockReset, Email, ArrowBack } from "@mui/icons-material"

// Simulated OTP verification
const simulateOtpSend = async (email: string): Promise<string> => {
  // In a real app, this would call an API to send OTP
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return "1234" // Simulated OTP for demo purposes
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      const otp = await simulateOtpSend(email)
      setGeneratedOtp(otp)
      setStep(2)
      setCountdown(60) // 60 seconds countdown for resend
    } catch (error) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 4) {
      setError("Please enter the complete 4-digit OTP")
      return
    }

    setLoading(true)
    setError("")

    // Simulate OTP verification
    setTimeout(() => {
      if (otp === generatedOtp) {
        setStep(3)
      } else {
        setError("Invalid OTP. Please try again.")
      }
      setLoading(false)
    }, 1500)
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return

    setLoading(true)
    try {
      const otp = await simulateOtpSend(email)
      setGeneratedOtp(otp)
      setCountdown(60)
      setError("")
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ textAlign: "center", mb: 4 }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Reset Your Password
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && "Enter the 4-digit code sent to your email"}
            {step === 3 && "Your password has been reset successfully"}
          </Typography>
        </Box>

        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          </Fade>
        )}

        {step === 3 ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ textAlign: "center" }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <LockReset sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#10b981" }}>
              Password Reset Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              A new password has been sent to your email. You can now log in with this new password.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              component={Link}
              to="/"
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(37, 99, 235, 0.2)",
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={step === 1 ? handleEmailSubmit : handleOtpSubmit} sx={{ width: "100%" }}>
            {step === 1 ? (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(37, 99, 235, 0.2)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send Verification Code"}
                </Button>
              </Box>
            ) : (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  maxWidth: "400px",
                  mx: "auto",
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  We've sent a 4-digit code to
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 4 }}>
                  {email}
                </Typography>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  inputType="text"
                  shouldAutoFocus
                  renderSeparator={<Box sx={{ width: 8 }} />}
                  renderInput={(props) => (
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        "&:focus-within": {
                          borderColor: "#2563eb",
                          borderWidth: 2,
                        },
                      }}
                    >
                      <input
                        {...props}
                        maxLength={1}
                        style={{
                          width: "100%",
                          height: "100%",
                          fontSize: "1.5rem",
                          textAlign: "center",
                          border: "none",
                          borderRadius: 8,
                          outline: "none",
                          background: "transparent",
                          // Hide number input arrows
                          WebkitAppearance: "none",
                          MozAppearance: "textfield",
                        }}
                        onKeyDown={(e) => {
                          // Allow only numbers, backspace, delete, tab, arrows
                          if (
                            !/^\d$/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "Tab" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault()
                          }
                        }}
                      />
                    </Box>
                  )}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading || otp.length !== 4}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    mb: 2,
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(37, 99, 235, 0.2)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Reset Password"}
                </Button>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => setStep(1)}
                    disabled={loading}
                    sx={{ color: "text.secondary" }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleResendOtp}
                    disabled={loading || countdown > 0}
                    sx={{ color: countdown > 0 ? "text.secondary" : "primary.main" }}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <MuiLink
            component={Link}
            to="/"
            underline="hover"
            sx={{
              color: "text.secondary",
              display: "inline-flex",
              alignItems: "center",
              transition: "color 0.2s",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            Remember your password? Login
          </MuiLink>
        </Box>
      </Paper>
    </Container>
  )
}

export default ForgotPassword
