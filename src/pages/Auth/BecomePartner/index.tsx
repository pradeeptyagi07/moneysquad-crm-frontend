// src/pages/BecomePartner.tsx
"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { ArrowBack, Close, CheckCircle } from "@mui/icons-material";

import BasicInfo from "./steps/Basicinfo";
import PersonalDetails from "./steps/PersonalDetails";
import AddressDetails from "./steps/AddressDetails";
import BankDetails from "./steps/BankDetails";
import UploadDocuments from "./steps/UploadDocuments";
import Preview from "./steps/Preview";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { createPartner } from "../../../store/slices/signupPartnerSlice";

const steps = [
  "Basic Info",
  "Personal Details",
  "Address Details",
  "Bank Details",
  "Upload Documents",
  "Preview & Submit",
];

export interface PartnerFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  pincode: string;
  registrationType: string;
  otpVerified: boolean;
  gender: string;
  dateOfBirth: string | null;
  employmentType: string;
  emergencyContact: string;
  focusProduct: string;
  role: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  addressPincode: string;
  addressType: string;
  accountType: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  branchName: string;
  profilePhoto: File | null;
  panCard: File | null;
  aadharFront: File | null;
  aadharBack: File | null;
  cancelledCheque: File | null;
  gstCertificate: File | null;
  otherDocuments: File[];
}

const BecomePartner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PartnerFormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    pincode: "",
    registrationType: "",
    otpVerified: false,
    gender: "",
    dateOfBirth: null,
    employmentType: "",
    emergencyContact: "",
    focusProduct: "",
    role: "leadSharing",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    addressPincode: "",
    addressType: "",
    accountType: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
    profilePhoto: null,
    panCard: null,
    aadharFront: null,
    aadharBack: null,
    cancelledCheque: null,
    gstCertificate: null,
    otherDocuments: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerId, setPartnerId] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");

  const updateFormData = (stepData: Partial<PartnerFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(createPartner(formData)).unwrap();
      setPartnerId(result?.data?.partnerId);
      setSnackbarSeverity("success");
      setSnackbarMessage("Partner registered successfully!");
      setSnackbarOpen(true);
      setShowSuccessDialog(true);
    } catch (error: any) {
      // show error in snackbar
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Failed to register partner.");
      setSnackbarOpen(true);
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => setShowExitDialog(true);
  const confirmExit = () => navigate("/");

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BasicInfo formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <PersonalDetails formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <AddressDetails formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <BankDetails formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <UploadDocuments formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Preview formData={formData} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return (
          formData.fullName &&
          formData.mobileNumber &&
          formData.email &&
          formData.registrationType &&
          formData.otpVerified
        );
      case 1:
        return (
          formData.gender &&
          formData.dateOfBirth &&
          formData.employmentType &&
          formData.emergencyContact &&
          formData.focusProduct &&
          formData.role
        );
      case 2:
        return (
          formData.addressLine1 &&
          formData.city &&
          formData.addressPincode &&
          formData.addressType
        );
      case 3:
        return (
          formData.accountType &&
          formData.accountHolderName &&
          formData.bankName &&
          formData.accountNumber &&
          formData.confirmAccountNumber &&
          formData.ifscCode &&
          formData.branchName &&
          formData.accountNumber === formData.confirmAccountNumber
        );
      case 4:
        return !!formData.panCard && !!formData.aadharFront && !!formData.aadharBack;
      case 5:
        return true;
      default:
        return false;
    }
  };

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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box
              component="img"
              src="/images/MoneySquad-logo.png"
              alt="MoneySquad"
              sx={{ height: { xs: 30, md: 40 }, mb: 0.5 }}
            />
            <Typography variant="subtitle1" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 0.5 }}>
              Partner Portal
            </Typography>
          </Box>
        </Box>

        <Card sx={{ borderRadius: 3, background: "#fff" }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"} alternativeLabel={!isMobile}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4 }}>{renderStepContent()}</Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button variant="outlined" onClick={activeStep === 0 ? handleExit : handleBack}>
                {activeStep === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={!isStepValid() || isSubmitting}
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
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BecomePartner;
