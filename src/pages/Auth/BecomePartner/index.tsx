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
} from "@mui/material"
import { ArrowBack, Close, CheckCircle } from "@mui/icons-material"

// Import step components
import BasicInfo from "./steps/Basicinfo"
import PersonalDetails from "./steps/PersonalDetails"
import AddressDetails from "./steps/AddressDetails"
import BankDetails from "./steps/BankDetails"
import UploadDocuments from "./steps/UploadDocuments"
import Preview from "./steps/Preview"

// Define step titles
const steps = [
  "Basic Info",
  "Personal Details",
  "Address Details",
  "Bank Details",
  "Upload Documents",
  "Preview & Submit",
]

// Define the form data interface
export interface PartnerFormData {
  // Step 1: Basic Info
  fullName: string
  mobileNumber: string
  email: string
  pincode: string
  registrationType: string
  otpVerified: boolean

  // Step 2: Personal Details
  gender: string
  dateOfBirth: string | null
  employmentType: string
  emergencyContact: string
  focusProduct: string
  role: string

  // Step 3: Address Details
  addressLine1: string
  addressLine2: string
  landmark: string
  city: string
  addressPincode: string
  addressType: string

  // Step 4: Bank Details
  accountType: string
  accountHolderName: string
  bankName: string
  accountNumber: string
  confirmAccountNumber: string
  ifscCode: string
  branchName: string

  // Step 5: Upload Documents
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

  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<PartnerFormData>({
    // Step 1: Basic Info
    fullName: "",
    mobileNumber: "",
    email: "",
    pincode: "",
    registrationType: "",
    otpVerified: false,

    // Step 2: Personal Details
    gender: "",
    dateOfBirth: null,
    employmentType: "",
    emergencyContact: "",
    focusProduct: "",
    role: "leadSharing",

    // Step 3: Address Details
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    addressPincode: "",
    addressType: "",

    // Step 4: Bank Details
    accountType: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",

    // Step 5: Upload Documents
    profilePhoto: null,
    panCard: null,
    aadharFront: null,
    aadharBack: null,
    cancelledCheque: null,
    gstCertificate: null,
    otherDocuments: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [partnerId, setPartnerId] = useState("")
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Update form data from child components
  const updateFormData = (stepData: Partial<PartnerFormData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...stepData,
    }))
  }

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
    window.scrollTo(0, 0)
  }

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
    window.scrollTo(0, 0)
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random partner ID
      const randomId = Math.floor(1000 + Math.random() * 9000)
      setPartnerId(`MS000${randomId}`)

      // Show success dialog
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle exit confirmation
  const handleExit = () => {
    setShowExitDialog(true)
  }

  // Confirm exit
  const confirmExit = () => {
    navigate("/")
  }

  // Render current step content
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
        return <Preview formData={formData} />
      default:
        return null
    }
  }

  // Check if current step is valid
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Basic Info
        return (
          formData.fullName &&
          formData.mobileNumber &&
          formData.email &&
          formData.pincode &&
          formData.registrationType &&
          formData.otpVerified
        )
      case 1: // Personal Details
        return (
          formData.gender &&
          formData.dateOfBirth &&
          formData.employmentType &&
          formData.emergencyContact &&
          formData.focusProduct &&
          formData.role
        )
      case 2: // Address Details
        return formData.addressLine1 && formData.city && formData.addressPincode && formData.addressType
      case 3: // Bank Details
        return (
          formData.accountType &&
          formData.accountHolderName &&
          formData.bankName &&
          formData.accountNumber &&
          formData.confirmAccountNumber &&
          formData.ifscCode &&
          formData.branchName &&
          formData.accountNumber === formData.confirmAccountNumber
        )
      case 4: // Upload Documents
        // Documents are optional, so always return true
        return true
      case 5: // Preview
        return true
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
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 25px 25px, #e2e8f0 2px, transparent 0)",
          backgroundSize: "50px 50px",
          opacity: 0.4,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleExit} sx={{ mr: 2, color: "text.primary" }}>
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Become a Partner
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            MoneySquad
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel={!isMobile}
                orientation={isMobile ? "vertical" : "horizontal"}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{!isMobile && label}</StepLabel>
                    {isMobile && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: activeStep === index ? "primary.main" : "text.secondary",
                          fontWeight: activeStep === index ? 600 : 400,
                        }}
                      >
                        {label}
                      </Typography>
                    )}
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Box sx={{ mt: 2, mb: 4 }}>
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                {steps[activeStep]}
              </Typography>
            </Box>

            {renderStepContent()}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? handleExit : handleBack}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              >
                {activeStep === 0 ? "Cancel" : "Back"}
              </Button>

              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={!isStepValid() || isSubmitting}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
                  },
                  "&.Mui-disabled": {
                    background: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">Registration Successful</Typography>
            <IconButton onClick={() => navigate("/")}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              🎉 Congratulations! Your account has been created.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Your Partner ID is <strong>{partnerId}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will receive an email containing your login credentials shortly.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.2,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Exit Registration?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">Your progress will be lost. Are you sure you want to exit?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmExit}>
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BecomePartner
