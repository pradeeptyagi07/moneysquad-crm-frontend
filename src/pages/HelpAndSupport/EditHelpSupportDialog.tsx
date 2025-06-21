"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import {
  updateSupportData,
  selectUpdateLoading,
  selectSupportError,
  selectUpdateSuccess,
  clearError,
  clearUpdateSuccess,
  fetchSupportData,
} from "../../store/slices/resourceAndSupportSlice"
import type { SupportData } from "../../store/slices/resourceAndSupportSlice"
import { useAppSelector } from "../../hooks/useAppSelector"

interface EditHelpSupportDialogProps {
  open: boolean
  onClose: () => void
  supportData: SupportData
}

const EditHelpSupportDialog = ({ open, onClose, supportData }: EditHelpSupportDialogProps) => {
  const [localData, setLocalData] = useState<SupportData>(supportData)
  const dispatch = useAppDispatch()

  const updateLoading = useAppSelector(selectUpdateLoading)
  const error = useAppSelector(selectSupportError)
  const updateSuccess = useAppSelector(selectUpdateSuccess)

  useEffect(() => {
    if (open) {
      setLocalData(supportData)
    }
  }, [supportData, open])

  useEffect(() => {
    if (updateSuccess) {
      // Refresh data and close dialog
      dispatch(fetchSupportData())
      onClose()
      dispatch(clearUpdateSuccess())
    }
  }, [updateSuccess, dispatch, onClose])

  const handleSave = async () => {
    // Remove _id and __v from the data before sending
    const { _id, __v, ...dataToUpdate } = localData
    dispatch(updateSupportData(dataToUpdate))
  }

  const handleClose = () => {
    if (error) {
      dispatch(clearError())
    }
    onClose()
  }

  const gradientTitle = {
    fontWeight: 700,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    mb: 2,
    mt: 3,
  }

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#f8fafc",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
  }

  const sectionDivider = {
    my: 4,
    borderColor: "rgba(102, 126, 234, 0.2)",
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Edit Help & Support Information
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: "#f9fafb", p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Section 1: Support Methods */}
          <Typography variant="h6" sx={gradientTitle}>
            Support Methods
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(localData)
              .filter(([key]) => ["email", "phone", "whatsapp", "office"].includes(key))
              .map(([key, value]: any) => (
                <React.Fragment key={key}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label={`${key.charAt(0).toUpperCase() + key.slice(1)} Contact`}
                      value={value.contact}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          [key]: { ...value, contact: e.target.value },
                        })
                      }
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label={`${key.charAt(0).toUpperCase() + key.slice(1)} Timing`}
                      value={value.timing}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          [key]: { ...value, timing: e.target.value },
                        })
                      }
                      sx={inputStyle}
                    />
                  </Grid>
                </React.Fragment>
              ))}
          </Grid>

          <Divider sx={sectionDivider} />

          {/* Section 2: Lead Submission Emails */}
          <Typography variant="h6" sx={gradientTitle}>
            Lead Document Submission Emails
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(localData.leadEmails).map(([key, value]: any) => (
              <React.Fragment key={key}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`${key.toUpperCase()} To Email`}
                    value={value.to}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        leadEmails: {
                          ...localData.leadEmails,
                          [key]: { ...value, to: e.target.value },
                        },
                      })
                    }
                    sx={inputStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`${key.toUpperCase()} CC Email`}
                    value={value.cc}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        leadEmails: {
                          ...localData.leadEmails,
                          [key]: { ...value, cc: e.target.value },
                        },
                      })
                    }
                    sx={inputStyle}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>

          <Divider sx={sectionDivider} />

          {/* Section 3: Contact Info */}
          <Typography variant="h6" sx={gradientTitle}>
            Grievance & Payout Contact
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(localData)
              .filter(([key]) => ["grievance", "payout"].includes(key))
              .map(([key, value]: any) => (
                <React.Fragment key={key}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label={`${key.charAt(0).toUpperCase() + key.slice(1)} Name`}
                      value={value.name}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          [key]: { ...value, name: e.target.value },
                        })
                      }
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label={`${key.charAt(0).toUpperCase() + key.slice(1)} Phone`}
                      value={value.phone}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          [key]: { ...value, phone: e.target.value },
                        })
                      }
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label={`${key.charAt(0).toUpperCase() + key.slice(1)} Email`}
                      value={value.email}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          [key]: { ...value, email: e.target.value },
                        })
                      }
                      sx={inputStyle}
                    />
                  </Grid>
                </React.Fragment>
              ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 4, py: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleClose} disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={updateLoading}
            sx={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8, #6b46c1)",
              },
              minWidth: 120,
            }}
          >
            {updateLoading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={updateSuccess}
        autoHideDuration={3000}
        onClose={() => dispatch(clearUpdateSuccess())}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Support information updated successfully!
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditHelpSupportDialog
