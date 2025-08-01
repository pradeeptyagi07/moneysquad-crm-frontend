"use client";

import type React from "react";
import { useState } from "react";
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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OtpInput from "react-otp-input";
import { LockReset, Email, ArrowBack } from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { sendOtp, forgotPassword } from "../../store/slices/authSlice";

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await dispatch(sendOtp(String(email).toLowerCase(),)).unwrap();
      setStep(2);
    } catch (err: any) {
      setError(err || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await dispatch(
        forgotPassword({ email: String(email).toLowerCase(), otp })
      ).unwrap();
      setStep(3);
    } catch (err: any) {
      setError(err || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
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
            {step === 2 && "Enter the 6-digit code sent to your email"}
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
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, color: "#10b981" }}
            >
              Password Reset Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              A new password has been sent to your email. You can now log in
              with this new password.
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
          <Box
            component="form"
            onSubmit={step === 1 ? handleEmailSubmit : handleOtpSubmit}
            sx={{ width: "100%" }}
          >
            {step === 1 ? (
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
                  maxWidth: "480px",
                  mx: "auto",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  We've sent a 6-digit code to
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 4 }}>
                  {email}
                </Typography>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  inputType="text"
                  shouldAutoFocus
                  renderSeparator={<Box sx={{ width: 8 }} />}
                  renderInput={(props) => (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
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
                          fontSize: "1.25rem",
                          textAlign: "center",
                          border: "none",
                          borderRadius: 8,
                          outline: "none",
                          background: "transparent",
                          WebkitAppearance: "none",
                          MozAppearance: "textfield",
                        }}
                        onKeyDown={(e) => {
                          if (
                            !/\d/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "Tab" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Box>
                  )}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading || (step === 2 && otp.length !== 6)}
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : step === 1 ? (
                "Send Verification Code"
              ) : (
                "Verify & Reset Password"
              )}
            </Button>

            {step === 2 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => setStep(1)}
                  disabled={loading}
                  sx={{ color: "text.secondary" }}
                >
                  Back
                </Button>
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
  );
};

export default ForgotPassword;
