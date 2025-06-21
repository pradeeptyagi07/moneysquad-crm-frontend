"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  Divider,
  Chip,
  useTheme,
  alpha,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import SaveIcon from "@mui/icons-material/Save"

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(3),
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "#ffffff",
  color: theme.palette.text.primary,
  padding: theme.spacing(2.5),
  margin: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

const CategoryCard = styled(Box)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}))

const CalculationItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  background: "rgba(255,255,255,0.8)",
  borderRadius: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    background: "rgba(255,255,255,0.9)",
  },
}))

interface EditCalculationDialogProps {
  open: boolean
  data: Record<string, string[]>
  onClose: () => void
  onSave: (updated: Record<string, string[]>) => void
  loading?: boolean
}

const EditCalculationDialog: React.FC<EditCalculationDialogProps> = ({
  open,
  data,
  onClose,
  onSave,
  loading = false,
}) => {
  const [tempData, setTempData] = useState<Record<string, string[]>>({})
  const theme = useTheme()

  // Update temp data when dialog opens or data changes
  useEffect(() => {
    if (open && data) {
      // Deep copy the data to avoid mutations
      const deepCopy = Object.entries(data).reduce(
        (acc, [key, values]) => {
          acc[key] = [...values]
          return acc
        },
        {} as Record<string, string[]>,
      )
      setTempData(deepCopy)
    }
  }, [open, data])

  const handleChange = (key: string, index: number, value: string) => {
    setTempData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleAddCalculation = (key: string) => {
    setTempData((prev) => ({
      ...prev,
      [key]: [...prev[key], ""],
    }))
  }

  const handleDeleteCalculation = (key: string, index: number) => {
    setTempData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    // Filter out empty calculations
    const cleanedData = Object.fromEntries(
      Object.entries(tempData).map(([key, values]) => [key, values.filter((value) => value.trim() !== "")]),
    )
    onSave(cleanedData)
  }

  const handleClose = () => {
    // Reset temp data when closing
    setTempData({})
    onClose()
  }

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Edit Eligibility Calculation
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "text.primary",
              "&:hover": { background: alpha(theme.palette.primary.main, 0.1) },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
        {Object.entries(tempData).map(([category, points]) => (
          <CategoryCard key={category}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Chip
                label={category}
                sx={{
                  background: theme.palette.secondary.main,
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  px: 1.5,
                  py: 0.5,
                }}
              />
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddCalculation(category)}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Add Rule
              </Button>
            </Box>

            {points.map((point, j) => (
              <CalculationItem key={j}>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  value={point}
                  onChange={(e) => handleChange(category, j, e.target.value)}
                  placeholder="Enter calculation rule..."
                  variant="outlined"
                  size="small"
                />
                {points.length > 1 && (
                  <IconButton
                    onClick={() => handleDeleteCalculation(category, j)}
                    sx={{
                      color: "error.main",
                      background: alpha(theme.palette.error.main, 0.1),
                      "&:hover": { background: alpha(theme.palette.error.main, 0.2) },
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </CalculationItem>
            ))}
          </CategoryCard>
        ))}
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default EditCalculationDialog
