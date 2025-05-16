"use client"

import React, { useState } from "react"
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
} from "@mui/material"
import type { TransitionProps } from "@mui/material/transitions"
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
} from "@mui/icons-material"
import type { BankOffer } from "../types"
import { loanTypeOptions } from "../types"

// Add imports for DatePicker
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

interface CreateOfferDialogProps {
  open: boolean
  onClose: () => void
  onCreateOffer: (offer: BankOffer) => void
}

// Transition component for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

// Get icon component based on icon name
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "CreditCard":
      return <CreditCard fontSize="small" />
    case "Home":
      return <Home fontSize="small" />
    case "Business":
      return <Business fontSize="small" />
    case "School":
      return <School fontSize="small" />
    case "DirectionsCar":
      return <DirectionsCar fontSize="small" />
    case "Diamond":
      return <Diamond fontSize="small" />
    case "AccountBalance":
      return <AccountBalance fontSize="small" />
    case "LocalOffer":
    default:
      return <LocalOffer fontSize="small" />
  }
}

const CreateOfferDialog: React.FC<CreateOfferDialogProps> = ({ open, onClose, onCreateOffer }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [featureInput, setFeatureInput] = useState("")

  // Update the newOffer state to include headline and validity
  const [newOffer, setNewOffer] = useState<Partial<BankOffer>>({
    bankName: "",
    logo: "",
    loanType: "",
    headline: "",
    validity: "",
    interestRate: "",
    processingFee: "",
    maxAmount: "",
    features: [],
    commission: "",
    isFeatured: false,
    eligibilityCriteria: {
      minAge: undefined,
      maxAge: undefined,
      minIncome: "",
      employmentType: "",
      minCreditScore: undefined,
      documents: [],
    },
  })

  const handleNewOfferChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    // Handle nested eligibilityCriteria fields
    if (name.startsWith("eligibility.")) {
      const field = name.split(".")[1]
      setNewOffer({
        ...newOffer,
        eligibilityCriteria: {
          ...newOffer.eligibilityCriteria,
          [field]: value,
        },
      })
    } else {
      setNewOffer({
        ...newOffer,
        [name]: value,
      })
    }
  }

  const handleToggleFeatured = () => {
    setNewOffer({
      ...newOffer,
      isFeatured: !newOffer.isFeatured,
    })
  }

  const handleAddFeature = () => {
    if (featureInput.trim() && newOffer.features) {
      setNewOffer({
        ...newOffer,
        features: [...newOffer.features, featureInput.trim()],
      })
      setFeatureInput("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    if (newOffer.features) {
      const updatedFeatures = [...newOffer.features]
      updatedFeatures.splice(index, 1)
      setNewOffer({
        ...newOffer,
        features: updatedFeatures,
      })
    }
  }

  // Add this function to handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Format date as dd/mm/yyyy
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      const formattedDate = `${day}/${month}/${year}`

      setNewOffer({
        ...newOffer,
        validity: formattedDate,
      })
    } else {
      setNewOffer({
        ...newOffer,
        validity: "",
      })
    }
  }

  // Update the handleCreateOffer function to include headline and validity
  const handleCreateOffer = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newId = Math.floor(Math.random() * 1000).toString()
      const createdOffer: BankOffer = {
        id: newId,
        bankName: newOffer.bankName || "",
        logo:
          newOffer.logo ||
          "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        loanType: newOffer.loanType || "",
        headline: newOffer.headline || "",
        validity: newOffer.validity || "",
        interestRate: newOffer.interestRate || "",
        processingFee: newOffer.processingFee || "",
        maxAmount: newOffer.maxAmount || "",
        features: newOffer.features || [],
        commission: newOffer.commission || "",
        isFeatured: newOffer.isFeatured || false,
        createdAt: new Date().toISOString().split("T")[0],
        eligibilityCriteria: newOffer.eligibilityCriteria,
      }

      setIsSubmitting(false)
      onCreateOffer(createdOffer)
      onClose()

      // Reset form
      setNewOffer({
        bankName: "",
        logo: "",
        loanType: "",
        headline: "",
        validity: "",
        interestRate: "",
        processingFee: "",
        maxAmount: "",
        features: [],
        commission: "",
        isFeatured: false,
        eligibilityCriteria: {
          minAge: undefined,
          maxAge: undefined,
          minIncome: "",
          employmentType: "",
          minCreditScore: undefined,
          documents: [],
        },
      })
      setFeatureInput("")
    }, 1500)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Transition}>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Create New Offer</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: 140,
                  borderRadius: 2,
                  border: "2px dashed",
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
                }}
              >
                <Image sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Click to upload bank logo or banner
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recommended size: 1200 x 400px
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Bank Name"
                name="bankName"
                value={newOffer.bankName}
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
                name="headline"
                value={newOffer.headline}
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
                  value={newOffer.validity ? new Date(newOffer.validity.split("/").reverse().join("-")) : null}
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
                value={newOffer.loanType}
                onChange={handleNewOfferChange}
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
              >
                {loanTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getIconComponent(option.icon)}
                      <Box sx={{ ml: 1 }}>{option.value}</Box>
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
                value={newOffer.interestRate}
                onChange={handleNewOfferChange}
                placeholder="e.g. 10.50%"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Processing Fee"
                name="processingFee"
                value={newOffer.processingFee}
                onChange={handleNewOfferChange}
                placeholder="e.g. 1%"
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Maximum Amount"
                name="maxAmount"
                value={newOffer.maxAmount}
                onChange={handleNewOfferChange}
                placeholder="e.g. ₹40,00,000"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Commission"
                name="commission"
                value={newOffer.commission}
                onChange={handleNewOfferChange}
                placeholder="e.g. 2%"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
                    setFeatureInput(e.target.value)
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
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
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
                {newOffer.features && newOffer.features.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {newOffer.features.map((feature, index) => (
                      <Chip key={index} label={feature} onDelete={() => handleRemoveFeature(index)} sx={{ mb: 1 }} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    No features added yet. Add key features to make your offer stand out.
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
                      value={newOffer.eligibilityCriteria?.minAge || ""}
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
                      value={newOffer.eligibilityCriteria?.maxAge || ""}
                      onChange={handleNewOfferChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Income"
                      name="eligibility.minIncome"
                      placeholder="e.g. ₹25,000"
                      value={newOffer.eligibilityCriteria?.minIncome || ""}
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
                      value={newOffer.eligibilityCriteria?.employmentType || ""}
                      onChange={handleNewOfferChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Credit Score"
                      name="eligibility.minCreditScore"
                      type="number"
                      placeholder="e.g. 700"
                      value={newOffer.eligibilityCriteria?.minCreditScore || ""}
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
          onClick={handleCreateOffer}
          disabled={
            !newOffer.bankName ||
            !newOffer.loanType ||
            !newOffer.headline ||
            !newOffer.validity ||
            !newOffer.interestRate ||
            !newOffer.processingFee ||
            !newOffer.maxAmount ||
            !newOffer.commission ||
            isSubmitting
          }
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
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
          {isSubmitting ? "Creating..." : "Create Offer"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOfferDialog
