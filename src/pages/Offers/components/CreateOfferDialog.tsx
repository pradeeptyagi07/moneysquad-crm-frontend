"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Paper,
  CircularProgress,
  Slide,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import {
  Close,
  Image,
  CheckCircle,
  Star,
  StarBorder,
  CreditCard,
  AccountBalance,
  Home,
  Business,
  LocalOffer,
  School,
  DirectionsCar,
  Diamond,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  createOffer,
  updateOffer,
  type BankOffer,
  type CreateOfferRequest,
  loanTypeOptions,
} from "../../../store/slices/offersSlice";
import { fetchLoanTypes } from "../../../store/slices/lenderLoanSlice";

// Default bank logo for fallback
const DEFAULT_BANK_LOGO = "https://via.placeholder.com/400x150?text=Bank+Logo";

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
  editOffer?: BankOffer | null;
}

// Transition component for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Get icon component based on icon name
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "CreditCard":
      return <CreditCard fontSize="small" />;
    case "Home":
      return <Home fontSize="small" />;
    case "Business":
      return <Business fontSize="small" />;
    case "School":
      return <School fontSize="small" />;
    case "DirectionsCar":
      return <DirectionsCar fontSize="small" />;
    case "Diamond":
      return <Diamond fontSize="small" />;
    case "AccountBalance":
      return <AccountBalance fontSize="small" />;
    case "LocalOffer":
    default:
      return <LocalOffer fontSize="small" />;
  }
};

const CreateOfferDialog: React.FC<CreateOfferDialogProps> = ({
  open,
  onClose,
  editOffer,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.offers);
  const [featureInput, setFeatureInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  const { loanTypes,error } = useAppSelector((state) => state.lenderLoan);

  useEffect(() => {
    dispatch(fetchLoanTypes());
  }, [dispatch]);

  // Format date for display
  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date;
    } catch (error) {
      return null;
    }
  };

  // Update the newOffer state to include headline and validity
  const [newOffer, setNewOffer] = useState<Partial<BankOffer>>({
    bankName: "",
    bankImage: "",
    loanType: "",
    offerHeadline: "",
    offerValidity: "",
    interestRate: "",
    processingFee: "",
    maximumAmount: "",
    keyFeatures: [],
    commissionPercent: "",
    isFeatured: false,
    eligibility: {
      minAge: undefined,
      maxAge: undefined,
      minIncome: "",
      employmentType: "",
      maxCreditScore: undefined,
    },
  });

  // If editing an offer, populate the form with the offer data
  useEffect(() => {
    if (editOffer) {
      setNewOffer({
        ...editOffer,
      });
      if (editOffer.bankImage && typeof editOffer.bankImage === "string") {
        setImagePreview(editOffer.bankImage);
      }
    }
  }, [editOffer]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        if (!editOffer) {
          setNewOffer({
            bankName: "",
            bankImage: "",
            loanType: "",
            offerHeadline: "",
            offerValidity: "",
            interestRate: "",
            processingFee: "",
            maximumAmount: "",
            keyFeatures: [],
            commissionPercent: "",
            isFeatured: false,
            eligibility: {
              minAge: undefined,
              maxAge: undefined,
              minIncome: "",
              employmentType: "",
              maxCreditScore: undefined,
            },
          });
          setSelectedImage(null);
          setImagePreview("");
          setImageError(false);
        }
        setFeatureInput("");
      }, 300);
    }
  }, [open, editOffer]);

  const handleNewOfferChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Handle nested eligibility fields
    if (name.startsWith("eligibility.")) {
      const field = name.split(".")[1];
      setNewOffer({
        ...newOffer,
        eligibility: {
          ...newOffer.eligibility,
          [field]: value,
        },
      });
    } else {
      setNewOffer({
        ...newOffer,
        [name]: value,
      });
    }
  };

  const handleToggleFeatured = () => {
    setNewOffer({
      ...newOffer,
      isFeatured: !newOffer.isFeatured,
    });
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && newOffer.keyFeatures) {
      setNewOffer({
        ...newOffer,
        keyFeatures: [...newOffer.keyFeatures, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (newOffer.keyFeatures) {
      const updatedFeatures = [...newOffer.keyFeatures];
      updatedFeatures.splice(index, 1);
      setNewOffer({
        ...newOffer,
        keyFeatures: updatedFeatures,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImageError(false);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function to handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewOffer({
        ...newOffer,
        offerValidity: date.toISOString(),
      });
    } else {
      setNewOffer({
        ...newOffer,
        offerValidity: "",
      });
    }
  };

  // Update the handleCreateOffer function to include headline and validity
  const handleSubmitOffer = () => {
    // Format the offer data for API
    const offerData: CreateOfferRequest = {
      bankName: newOffer.bankName || "",
      // Use the actual File object for bankImage if available
      bankImage: selectedImage || newOffer.bankImage || DEFAULT_BANK_LOGO,
      offerHeadline: newOffer.offerHeadline || "",
      offerValidity: newOffer.offerValidity || new Date().toISOString(),
      loanType: newOffer.loanType || "",
      interestRate: Number.parseFloat(
        newOffer.interestRate?.toString().replace("%", "") || "0"
      ),
      processingFee: Number.parseFloat(
        newOffer.processingFee?.toString().replace(/[₹,]/g, "") || "0"
      ),
      maximumAmount: Number.parseFloat(
        newOffer.maximumAmount?.toString().replace(/[₹,]/g, "") || "0"
      ),
      commissionPercent: Number.parseFloat(
        newOffer.commissionPercent?.toString().replace("%", "") || "0"
      ),
      isFeatured: newOffer.isFeatured || false,
      keyFeatures: newOffer.keyFeatures || [],
      eligibility: {
        minAge: newOffer.eligibility?.minAge !== undefined
          ? Number(newOffer.eligibility.minAge)
          : undefined,
        maxAge: newOffer.eligibility?.maxAge !== undefined
          ? Number(newOffer.eligibility.maxAge)
          : undefined,
        minIncome: newOffer.eligibility?.minIncome
          ? Number.parseFloat(
              newOffer.eligibility.minIncome.toString().replace(/[₹,]/g, "")
            )
          : undefined,
        employmentType: newOffer.eligibility?.employmentType || "",
        maxCreditScore: newOffer.eligibility?.maxCreditScore !== undefined
          ? Number(newOffer.eligibility.maxCreditScore)
          : undefined,
      },
      
    };

    console.log("Submitting offer data:", offerData);

    if (editOffer) {
      // Update existing offer
      dispatch(updateOffer({ id: editOffer._id, offerData }))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Failed to update offer:", error);
        });
    } else {
      // Create new offer
      dispatch(createOffer(offerData))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Failed to create offer:", error);
        });
    }
  };

  // Use default image if bankImage is not available or has error
  const displayImageUrl =
    imageError || (!imagePreview && !newOffer.bankImage)
      ? DEFAULT_BANK_LOGO
      : imagePreview || newOffer.bankImage;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {editOffer ? "Edit Offer" : "Create New Offer"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="bank-logo-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="bank-logo-upload">
                <Box
                  sx={{
                    height: 140,
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    bgcolor: "background.default",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.lighter",
                    },
                    backgroundImage: displayImageUrl
                      ? `url(${displayImageUrl})`
                      : "none",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {!displayImageUrl && (
                    <>
                      <Image
                        sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload bank logo
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recommended size: 400 x 150px
                      </Typography>
                    </>
                  )}
                </Box>
              </label>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Bank Name"
                name="bankName"
                value={newOffer.bankName || ""}
                onChange={handleNewOfferChange}
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Offer Headline"
                name="offerHeadline"
                value={newOffer.offerHeadline || ""}
                onChange={handleNewOfferChange}
                placeholder="e.g. Limited Time Offer"
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Offer Validity *"
                  value={formatDateForDisplay(newOffer.offerValidity)}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 3 },
                      InputProps: { sx: { borderRadius: 2 } },
                      placeholder: "dd/mm/yyyy",
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                label="Loan Type"
                name="loanType"
                value={newOffer.loanType || ""}
                onChange={handleNewOfferChange}
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
                disabled={loading}
                helperText={error ?? ""}
              >
                {loanTypes.map((lt) => (
                  <MenuItem key={lt._id} value={lt.name}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* only if you have icons per type */}
                      {getIconComponent(lt.name)}
                      <Box sx={{ ml: 1 }}>{lt.name}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Interest Rate"
                name="interestRate"
                value={newOffer.interestRate || ""}
                onChange={handleNewOfferChange}
                placeholder="e.g. 10.50"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Processing Fee"
                name="processingFee"
                value={newOffer.processingFee || ""}
                onChange={handleNewOfferChange}
                placeholder="e.g. 1500"
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Maximum Amount"
                name="maximumAmount"
                value={newOffer.maximumAmount || ""}
                onChange={handleNewOfferChange}
                placeholder="e.g. 4000000"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Commission"
                name="commissionPercent"
                value={newOffer.commissionPercent || ""}
                onChange={handleNewOfferChange}
                placeholder="e.g. 2"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  pl: 2,
                }}
              >
                <Button
                  variant={newOffer.isFeatured ? "contained" : "outlined"}
                  startIcon={newOffer.isFeatured ? <Star /> : <StarBorder />}
                  onClick={handleToggleFeatured}
                  sx={{
                    borderRadius: 2,
                    ...(newOffer.isFeatured && {
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    }),
                  }}
                >
                  {newOffer.isFeatured ? "Featured Offer" : "Mark as Featured"}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Key Features
              </Typography>
              <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Feature"
                  value={featureInput}
                  onChange={(e) => {
                    setFeatureInput(e.target.value);
                  }}
                  placeholder="e.g. Quick Approval"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddFeature}
                  disabled={!featureInput.trim()}
                  sx={{
                    ml: 1,
                    borderRadius: 2,
                    minWidth: 100,
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    "&.Mui-disabled": {
                      background: "#e2e8f0",
                      color: "#94a3b8",
                    },
                  }}
                >
                  Add
                </Button>
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  minHeight: 100,
                  bgcolor: "background.default",
                }}
              >
                {newOffer.keyFeatures && newOffer.keyFeatures.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {newOffer.keyFeatures.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        onDelete={() => handleRemoveFeature(index)}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ py: 2 }}
                  >
                    No features added yet. Add key features to make your offer
                    stand out.
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Eligibility Criteria
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Age"
                      name="eligibility.minAge"
                      type="number"
                      placeholder="e.g. 23"
                      value={newOffer.eligibility?.minAge || ""}
                      onChange={handleNewOfferChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Maximum Age"
                      name="eligibility.maxAge"
                      type="number"
                      placeholder="e.g. 60"
                      value={newOffer.eligibility?.maxAge || ""}
                      onChange={handleNewOfferChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Income"
                      name="eligibility.minIncome"
                      placeholder="e.g. 25000"
                      value={newOffer.eligibility?.minIncome || ""}
                      onChange={handleNewOfferChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Employment Type"
                      name="eligibility.employmentType"
                      placeholder="e.g. Salaried/Self-employed"
                      value={newOffer.eligibility?.employmentType || ""}
                      onChange={handleNewOfferChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Maximum Credit Score"
                      name="eligibility.maxCreditScore"
                      type="number"
                      placeholder="e.g. 850"
                      value={newOffer.eligibility?.maxCreditScore || ""}
                      onChange={handleNewOfferChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmitOffer}
          disabled={
            !newOffer.bankName ||
            !newOffer.loanType ||
            !newOffer.offerHeadline ||
            !newOffer.interestRate ||
            !newOffer.processingFee ||
            !newOffer.maximumAmount ||
            !newOffer.commissionPercent ||
            loading
          }
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CheckCircle />
            )
          }
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            "&.Mui-disabled": {
              background: "#e2e8f0",
              color: "#94a3b8",
            },
          }}
        >
          {loading
            ? editOffer
              ? "Updating..."
              : "Creating..."
            : editOffer
            ? "Update Offer"
            : "Create Offer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOfferDialog;
