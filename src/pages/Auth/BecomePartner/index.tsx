"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material"
import { ArrowBack, Close, CheckCircle } from "@mui/icons-material"

import BasicInfo from "./steps/Basicinfo"
import PersonalDetails from "./steps/PersonalDetails"
import AddressDetails from "./steps/AddressDetails"
import BankDetails from "./steps/BankDetails"
import UploadDocuments from "./steps/UploadDocuments"
import Preview from "./steps/Preview"

import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { createPartner } from "../../../store/slices/signupPartnerSlice"

const steps = [
  "Basic Info",
  "Personal Details",
  "Address Details",
  "Bank Details",
  "Upload Documents",
  "Preview & Submit",
]

export interface PartnerFormData {
  fullName: string
  mobileNumber: string
  email: string
  pincode: string
  registrationType: string
  teamStrength: string
  otpVerified: boolean
  dateOfBirth: string | null
  employmentType: string
  emergencyContact: string
  focusProduct: string
  role: string
  experienceInSellingLoans: string
  addressLine1: string
  addressLine2: string
  landmark: string
  city: string
  addressPincode: string
  addressType: string
  accountHolderName: string
  accountType: string
  relationshipWithAccountHolder: string
  bankName: string
  accountNumber: string
  confirmAccountNumber: string
  ifscCode: string
  branchName: string
  isGstBillingApplicable: string
  profilePhoto: File | null
  panCard: File | null
  aadharFront: File | null
  aadharBack: File | null
  cancelledCheque: File | null
  gstCertificate: File | null
  otherDocuments: File[]
}

const BecomePartner: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [activeStep, setActiveStep] = useState(0)
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [formData, setFormData] = useState<PartnerFormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    pincode: "",
    registrationType: "",
    teamStrength: "",
    otpVerified: false,
    dateOfBirth: null,
    employmentType: "",
    emergencyContact: "",
    focusProduct: "",
    role: "leadSharing",
    experienceInSellingLoans: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    addressPincode: "",
    addressType: "",
    accountHolderName: "",
    accountType: "",
    relationshipWithAccountHolder: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
    isGstBillingApplicable: "",
    profilePhoto: null,
    panCard: null,
    aadharFront: null,
    aadharBack: null,
    cancelledCheque: null,
    gstCertificate: null,
    otherDocuments: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [partnerId, setPartnerId] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error")

  const updateFormData = (stepData: Partial<PartnerFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleAgreementChange = (accepted: boolean) => {
    console.log("Agreement changed in parent:", accepted)
    setAgreementAccepted(accepted)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    // Prevent any form submission if this is called from a form
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!agreementAccepted) {
      setSnackbarSeverity("error")
      setSnackbarMessage("Please accept the terms and conditions to proceed.")
      setSnackbarOpen(true)
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Starting partner creation...")

      const resultAction = await dispatch(
        createPartner({
          ...formData,
          email: formData.email.trim().toLowerCase(),
          dateOfBirth: formData.dateOfBirth ?? undefined,
        }),
      )

      console.log("Result action:", resultAction)

      // Check if the action was fulfilled or rejected
      if (createPartner.fulfilled.match(resultAction)) {
        // Success case
        const result = resultAction.payload
        console.log("Partner creation successful:", result)

        setPartnerId(result?.data?.partnerId || "")
        setSnackbarSeverity("success")
        setSnackbarMessage("Partner registered successfully!")
        setSnackbarOpen(true)
        setShowSuccessDialog(true)
      } else if (createPartner.rejected.match(resultAction)) {
        // Error case
        const errorMessage =
          (resultAction.payload as string) || "Something went wrong while submitting. Please try again."
        console.error("Partner creation failed:", errorMessage)

        setSnackbarSeverity("error")
        setSnackbarMessage(errorMessage)
        setSnackbarOpen(true)
      }
    } catch (error: any) {
      console.error("Unexpected error during partner creation:", error)

      const errorMsg =
        typeof error === "string" ? error : error?.message || "An unexpected error occurred. Please try again."

      setSnackbarSeverity("error")
      setSnackbarMessage(errorMsg)
      setSnackbarOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExit = () => setShowExitDialog(true)
  const confirmExit = () => navigate("/")

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BasicInfo formData={formData} updateFormData={updateFormData} />
      case 1:
        return <PersonalDetails formData={formData} updateFormData={updateFormData} />
      case 2:
        return <AddressDetails formData={formData} updateFormData={updateFormData} />
      case 3:
        return <BankDetails formData={formData} updateFormData={updateFormData} />
      case 4:
        return <UploadDocuments formData={formData} updateFormData={updateFormData} />
      case 5:
        return (
          <Preview
            formData={formData}
            agreementAccepted={agreementAccepted}
            onAgreementChange={handleAgreementChange}
          />
        )
      default:
        return null
    }
  }

  // Enhanced validation function that checks both presence and validity of fields
  const validateField = (field: string, value: any): boolean => {
    switch (field) {
      case "fullName":
        return !!(value && value.trim().length > 0)
      case "mobileNumber":
        return !!(value && /^[6-9]\d{9}$/.test(value))
      case "email":
        return !!(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      case "emergencyContact":
        return !!(value && /^[6-9]\d{9}$/.test(value))
      case "addressPincode":
        return !!(value && /^\d{6}$/.test(value))
      case "accountNumber":
        return !!(value && /^\d{9,18}$/.test(value))
      case "ifscCode":
        return !!(value && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
      default:
        return !!value
    }
  }

  const isStepValid = () => {
    switch (activeStep) {
      case 0: {
        // Basic Info validation
        const requiredFields = [
          { field: "fullName", value: formData.fullName },
          { field: "mobileNumber", value: formData.mobileNumber },
          { field: "email", value: formData.email },
          { field: "registrationType", value: formData.registrationType },
        ]

        // Check if all required fields are valid
        for (const { field, value } of requiredFields) {
          if (!validateField(field, value)) {
            return false
          }
        }

        // Check team strength if registering as non-individual
        const isNonIndividual = formData.registrationType !== "Individual"
        if (isNonIndividual && !formData.teamStrength) {
          return false
        }

        // Check if OTP is verified
        return formData.otpVerified
      }

      case 1: {
        // Personal Details validation
        const requiredFields = [
          { field: "dateOfBirth", value: formData.dateOfBirth },
          { field: "employmentType", value: formData.employmentType },
          { field: "emergencyContact", value: formData.emergencyContact },
          { field: "focusProduct", value: formData.focusProduct },
          { field: "role", value: formData.role },
          { field: "experienceInSellingLoans", value: formData.experienceInSellingLoans },
        ]

        for (const { field, value } of requiredFields) {
          if (!validateField(field, value)) {
            return false
          }
        }
        return true
      }

      case 2: {
        // Address Details validation
        const requiredFields = [
          { field: "addressLine1", value: formData.addressLine1 },
          { field: "city", value: formData.city },
          { field: "addressPincode", value: formData.addressPincode },
          { field: "addressType", value: formData.addressType },
        ]

        for (const { field, value } of requiredFields) {
          if (!validateField(field, value)) {
            return false
          }
        }
        return true
      }

      case 3: {
        // Bank Details validation
        const requiredFields = [
          { field: "accountHolderName", value: formData.accountHolderName },
          { field: "accountType", value: formData.accountType },
          { field: "relationshipWithAccountHolder", value: formData.relationshipWithAccountHolder },
          { field: "bankName", value: formData.bankName },
          { field: "accountNumber", value: formData.accountNumber },
          { field: "confirmAccountNumber", value: formData.confirmAccountNumber },
          { field: "ifscCode", value: formData.ifscCode },
          { field: "branchName", value: formData.branchName },
        ]

        for (const { field, value } of requiredFields) {
          if (!validateField(field, value)) {
            return false
          }
        }

        // Check if account numbers match
        if (formData.accountNumber !== formData.confirmAccountNumber) {
          return false
        }

        // Check GST billing if account type is Current or Others
        const needsGstBilling = formData.accountType === "Current" || formData.accountType === "Others"
        if (needsGstBilling && !formData.isGstBillingApplicable) {
          return false
        }

        return true
      }

      case 4: {
        // Upload Documents validation
        return !!(formData.panCard && formData.aadharFront && formData.aadharBack)
      }

      case 5:
        // Preview & Submit validation - must accept agreement
        console.log("Step 5 validation - agreementAccepted:", agreementAccepted)
        return agreementAccepted

      default:
        return false
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        py: 4,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleExit} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Become a Partner
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src="/images/MoneySquad-logo.png"
              alt="MoneySquad"
              sx={{ height: { xs: 30, md: 40 }, mb: 0.5 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              Partner Portal
            </Typography>
          </Box>
        </Box>

        <Card sx={{ borderRadius: 3, background: "#fff" }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Stepper
              activeStep={activeStep}
              orientation={isMobile ? "vertical" : "horizontal"}
              alternativeLabel={!isMobile}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  mt: 2,
                }}
              >
                <Box component="span" sx={{ color: "error.main", fontWeight: 700 }}>
                  *
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                  All fields marked with an asterisk are mandatory. Your email will be verified via a verification code.
                </Typography>
              </Box>
            </Grid>

            <Box sx={{ mt: 4 }}>{renderStepContent()}</Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button variant="outlined" onClick={activeStep === 0 ? handleExit : handleBack} disabled={isSubmitting}>
                {activeStep === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={!isStepValid() || isSubmitting}
                type="button"
              >
                {activeStep === steps.length - 1 ? (isSubmitting ? "Submitting..." : "Submit") : "Continue"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Registration Successful</Typography>
            <IconButton onClick={() => navigate("/")}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={3}>
            <CheckCircle color="success" sx={{ fontSize: 64 }} />
            <Typography variant="h5">🎉 Congratulations! Your account has been created.</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Your Partner ID is <strong>{partnerId}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will receive an email with your login credentials shortly.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Exit Registration?</DialogTitle>
        <DialogContent>
          <Typography>Your progress will be lost. Are you sure you want to exit?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmExit}>
            Exit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for errors & success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default BecomePartner
