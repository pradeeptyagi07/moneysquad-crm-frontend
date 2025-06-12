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
  type CreateOfferRequest,
  type BankOffer,
} from "../../../store/slices/offersSlice";
import {
  fetchLoanTypes,
  fetchLenders,
} from "../../../store/slices/lenderLoanSlice";

const DEFAULT_BANK_LOGO = "https://via.placeholder.com/400x150?text=Bank+Logo";

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
  editOffer?: BankOffer | null;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getIconComponent = (name: string) => {
  switch (name) {
    case "CreditCard": return <CreditCard fontSize="small" />;
    case "Home": return <Home fontSize="small" />;
    case "Business": return <Business fontSize="small" />;
    case "School": return <School fontSize="small" />;
    case "DirectionsCar": return <DirectionsCar fontSize="small" />;
    case "Diamond": return <Diamond fontSize="small" />;
    case "AccountBalance": return <AccountBalance fontSize="small" />;
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
  const { loanTypes, lenders, error: lenderError } = useAppSelector(
    (state) => state.lenderLoan
  );
  const { loading } = useAppSelector((state) => state.offers);

  const [featureInput, setFeatureInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    dispatch(fetchLoanTypes());
    dispatch(fetchLenders());
  }, [dispatch]);

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString);
    } catch {
      return null;
    }
  };

  const [newOffer, setNewOffer] = useState<Partial<BankOffer>>({
    bankName: "",
    bankImage: "",
    loanType: "",
    offerHeadline: "",
    offerValidity: "",
    interestRate: "",
    processingFee: "",
    keyFeatures: [],
    isFeatured: false,
    eligibility: {
      minAge: undefined,
      maxAge: undefined,
      minIncome: "",
      employmentType: "",
      maxCreditScore: undefined,
    },
  });

  useEffect(() => {
    if (editOffer) {
      setNewOffer({ ...editOffer });
      if (typeof editOffer.bankImage === "string") {
        setImagePreview(editOffer.bankImage);
      }
    }
  }, [editOffer]);

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
            keyFeatures: [],
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

  const handleNewOfferChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("eligibility.")) {
      const field = name.split(".")[1];
      setNewOffer({
        ...newOffer,
        eligibility: { ...newOffer.eligibility, [field]: value },
      });
    } else {
      setNewOffer({ ...newOffer, [name]: value });
    }
  };

  const handleToggleFeatured = () => {
    setNewOffer((prev) => ({
      ...prev,
      isFeatured: !prev.isFeatured,
    }));
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

  const handleRemoveFeature = (idx: number) => {
    if (newOffer.keyFeatures) {
      const arr = [...newOffer.keyFeatures];
      arr.splice(idx, 1);
      setNewOffer({ ...newOffer, keyFeatures: arr });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImageError(false);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImagePreview(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setNewOffer({
      ...newOffer,
      offerValidity: date ? date.toISOString() : "",
    });
  };

  const handleSubmitOffer = () => {
    const offerData: CreateOfferRequest = {
      bankName: newOffer.bankName || "",
      bankImage:
        selectedImage || newOffer.bankImage || DEFAULT_BANK_LOGO,
      offerHeadline: newOffer.offerHeadline || "",
      offerValidity:
        newOffer.offerValidity || new Date().toISOString(),
      loanType: newOffer.loanType || "",
      interestRate: parseFloat(
        newOffer.interestRate?.toString().replace("%", "") || "0"
      ),
      processingFee: parseFloat(
        newOffer.processingFee?.toString().replace(/[₹,]/g, "") || "0"
      ),
      keyFeatures: newOffer.keyFeatures || [],
      isFeatured: newOffer.isFeatured || false,
      eligibility: {
        minAge:
          newOffer.eligibility?.minAge !== undefined
            ? Number(newOffer.eligibility.minAge)
            : undefined,
        maxAge:
          newOffer.eligibility?.maxAge !== undefined
            ? Number(newOffer.eligibility.maxAge)
            : undefined,
        minIncome:
          newOffer.eligibility?.minIncome
            ? parseFloat(
                newOffer.eligibility.minIncome.toString().replace(/[₹,]/g, "")
              )
            : undefined,
        employmentType:
          newOffer.eligibility?.employmentType || "",
        maxCreditScore:
          newOffer.eligibility?.maxCreditScore !== undefined
            ? Number(newOffer.eligibility.maxCreditScore)
            : undefined,
      },
    };

    if (editOffer) {
      dispatch(
        updateOffer({ id: editOffer._id, offerData })
      )
        .unwrap()
        .then(onClose)
        .catch((err) => console.error(err));
    } else {
      dispatch(createOffer(offerData))
        .unwrap()
        .then(onClose)
        .catch((err) => console.error(err));
    }
  };

  const displayImageUrl = imageError
    ? DEFAULT_BANK_LOGO
    : imagePreview ||
      (typeof newOffer.bankImage === "string"
        ? newOffer.bankImage
        : "");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {editOffer ? "Edit Offer" : "Create New Offer"}
          </Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={3}>
            {/* Image Upload */}
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
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "primary.main", bgcolor: "primary.lighter" },
                    backgroundImage: displayImageUrl ? `url(${displayImageUrl})` : "none",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {!displayImageUrl && (
                    <>
                      <Image sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
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

            {/* Bank Name (fetched) */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                label="Bank Name"
                name="bankName"
                value={newOffer.bankName || ""}
                onChange={handleNewOfferChange}
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
                helperText={lenderError || ""}
              >
                {lenders.map((l) => (
                  <MenuItem key={l._id} value={l.name}>
                    {getIconComponent(l.name)}
                    <Box sx={{ ml: 1 }}>{l.name}</Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Offer Headline */}
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

            {/* Offer Validity */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Offer Validity *"
                  value={formatDateForDisplay(newOffer.offerValidity)}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true, sx: { mb: 3 }, InputProps: { sx: { borderRadius: 2 } }, placeholder: "dd/mm/yyyy", required: true } }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Loan Type */}
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
              >
                {loanTypes.map((lt) => (
                  <MenuItem key={lt._id} value={lt.name}>
                    {getIconComponent(lt.name)} {lt.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Interest & Processing Fee */}
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
                InputProps={{ sx: { borderRadius: 2 }, endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
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

            {/* Featured Toggle */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", height: "100%", pl: 2 }}>
                <Button
                  variant={newOffer.isFeatured ? "contained" : "outlined"}
                  startIcon={newOffer.isFeatured ? <Star /> : <StarBorder />}
                  onClick={handleToggleFeatured}
                  sx={{ borderRadius: 2, ...(newOffer.isFeatured && { background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }) }}
                >
                  {newOffer.isFeatured ? "Featured Offer" : "Mark as Featured"}
                </Button>
              </Box>
            </Grid>

            {/* Key Features */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Key Features</Typography>
              <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. Quick Approval"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddFeature}
                  disabled={!featureInput.trim()}
                  sx={{ ml: 1, borderRadius: 2, minWidth: 100, background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", "&.Mui-disabled": { background: "#e2e8f0", color: "#94a3b8" } }}
                >Add</Button>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, minHeight: 100, bgcolor: "background.default" }}>
                {newOffer.keyFeatures && newOffer.keyFeatures.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {newOffer.keyFeatures.map((feat, i) => (
                      <Chip key={i} label={feat} onDelete={() => handleRemoveFeature(i)} sx={{ mb: 1 }} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    No features added yet.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Eligibility Criteria */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Eligibility Criteria</Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Minimum Age" name="eligibility.minAge" type="number" placeholder="e.g. 23" value={newOffer.eligibility?.minAge || ""} onChange={handleNewOfferChange} InputProps={{ sx: { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Maximum Age" name="eligibility.maxAge" type="number" placeholder="e.g. 60" value={newOffer.eligibility?.maxAge || ""} onChange={handleNewOfferChange} InputProps={{ sx: { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Minimum Income" name="eligibility.minIncome" placeholder="e.g. 25000" value={newOffer.eligibility?.minIncome || ""} onChange={handleNewOfferChange} InputProps={{ sx: { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Employment Type" name="eligibility.employmentType" placeholder="e.g. Salaried" value={newOffer.eligibility?.employmentType || ""} onChange={handleNewOfferChange} InputProps={{ sx: { borderRadius: 2 } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Minimum Credit Score" name="eligibility.maxCreditScore" type="number" placeholder="e.g. 850" value={newOffer.eligibility?.maxCreditScore || ""} onChange={handleNewOfferChange} InputProps={{ sx: { borderRadius: 2 } }} />
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
            loading
          }
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />
          }
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            "&.Mui-disabled": { background: "#e2e8f0", color: "#94a3b8" },
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
