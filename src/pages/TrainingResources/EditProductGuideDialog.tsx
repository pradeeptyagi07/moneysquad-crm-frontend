"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
  Divider,
  useTheme,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CloseIcon from "@mui/icons-material/Close"

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    maxWidth: "800px",
    width: "100%",
  },
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}))

const ProductCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  position: "relative",
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}))

const ReadOnlyTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    "& fieldset": {
      borderColor: theme.palette.grey[300],
      borderStyle: "dashed",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[400],
    },
    "& input": {
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
}))

interface Product {
  type: string
  interestRate: string
  processingFees: string
  loanAmount: string
  tenure: string
  _id?: string
}

interface Props {
  open: boolean
  onClose: () => void
  data: Product[]
  onSave: (updated: Product[]) => void
  loading?: boolean
}

const EditProductGuideDialog: React.FC<Props> = ({ open, onClose, data, onSave, loading = false }) => {
  const [formData, setFormData] = useState<Product[]>([])
  const theme = useTheme()

  // Update form data when dialog opens or data changes
  useEffect(() => {
    if (open && data) {
      setFormData([...data])
    }
  }, [open, data])

  const handleChange = (index: number, key: keyof Product, value: string) => {
    setFormData((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: value }
      return updated
    })
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleClose = () => {
    // Reset form data when closing
    setFormData([])
    onClose()
  }

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Edit Product Guide
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3, maxHeight: "60vh", overflowY: "auto" }}>
        {formData.map((item, index) => (
          <ProductCard key={item._id || index}>
            <Typography variant="subtitle1" fontWeight={600} color="primary" mb={1.5}>
              Product {index + 1}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ReadOnlyTextField
                  label="Loan Type"
                  fullWidth
                  size="small"
                  value={item.type || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Interest Rate"
                  fullWidth
                  size="small"
                  value={item.interestRate || ""}
                  onChange={(e) => handleChange(index, "interestRate", e.target.value)}
                  placeholder="e.g., 10.5% - 18%"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Processing Fees"
                  fullWidth
                  size="small"
                  value={item.processingFees || ""}
                  onChange={(e) => handleChange(index, "processingFees", e.target.value)}
                  placeholder="e.g., 4999 - 1%"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Loan Amount"
                  fullWidth
                  size="small"
                  value={item.loanAmount || ""}
                  onChange={(e) => handleChange(index, "loanAmount", e.target.value)}
                  placeholder="e.g., ₹1L - ₹1Cr"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Tenure"
                  fullWidth
                  size="small"
                  value={item.tenure || ""}
                  onChange={(e) => handleChange(index, "tenure", e.target.value)}
                  placeholder="e.g., 1-8 years"
                />
              </Grid>
            </Grid>
          </ProductCard>
        ))}
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ borderRadius: 2, px: 3 }}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default EditProductGuideDialog
