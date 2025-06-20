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
  Typography,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material"
import { Close, Save, Edit } from "@mui/icons-material"

interface PartnerEditDialogProps {
  open: boolean
  onClose: () => void
  partner: any
  onSave: (updatedPartner: any) => void
  loading?: boolean
}

const PartnerEditDialog: React.FC<PartnerEditDialogProps> = ({ open, onClose, partner, onSave, loading = false }) => {
  const [editedPartner, setEditedPartner] = useState<any>({})
  const [showSnackbar, setShowSnackbar] = useState(false)

  useEffect(() => {
    if (partner) {
      setEditedPartner({
        email: partner.basicInfo?.email || "",
        fullName: partner.basicInfo?.fullName || "",
        mobileNumber: partner.basicInfo?.mobile || "",
        currentProfession: partner.personalInfo?.currentProfession || "",
        focusProduct: partner.personalInfo?.focusProduct?.toLowerCase().replace(/\s+/g, "-") || "",
        role: partner.personalInfo?.roleSelection || "",
        commissionPlan: partner.commissionPlan || "",
      })
    }
  }, [partner])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setEditedPartner((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleEditSubmit = async () => {
    if (partner && partner._id) {
      const updatePayload = {
        mobile: editedPartner.mobileNumber || "",
        email: editedPartner.email || "",
        fullName: editedPartner.fullName || "",
        currentProfession: editedPartner.currentProfession || "",
        focusProduct: editedPartner.focusProduct || "",
        roleSelection: editedPartner.role || "",
        commission: (editedPartner.commissionPlan || "").toLowerCase(),
      }

      try {
        await onSave(updatePayload)
        setShowSnackbar(true)
      } catch (error) {
        console.error("Failed to update partner:", error)
      }
    }
  }

  const handleClose = () => {
    setEditedPartner({})
    onClose()
  }

  if (!partner) return null

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Edit sx={{ mr: 1 }} />
              <Typography variant="h6">Edit Partner Details</Typography>
            </Box>
            <IconButton onClick={handleClose} edge="end">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="fullName"
                value={editedPartner.fullName || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={editedPartner.email || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={editedPartner.mobileNumber || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Current Profession</InputLabel>
                <Select
                  name="currentProfession"
                  value={editedPartner.currentProfession || ""}
                  label="Current Profession"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="Freelancer">Freelancer</MenuItem>
                  <MenuItem value="Financial Advisor">Financial Advisor</MenuItem>
                  <MenuItem value="Insurance Agent">Insurance Agent</MenuItem>
                  <MenuItem value="Property Dealer">Property Dealer</MenuItem>
                  <MenuItem value="Chartered Accountant">Chartered Accountant</MenuItem>
                  <MenuItem value="Wealth Manager">Wealth Manager</MenuItem>
                  <MenuItem value="Loan Agent/DSA">Loan Agent/DSA</MenuItem>
                  <MenuItem value="Bank Employee">Bank Employee</MenuItem>
                  <MenuItem value="Retired Individual">Retired Individual</MenuItem>
                  <MenuItem value="Salaried Individual">Salaried Individual</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Focus Product</InputLabel>
                <Select
                  name="focusProduct"
                  value={editedPartner.focusProduct || ""}
                  label="Focus Product"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="personal-loan">Personal Loan</MenuItem>
                  <MenuItem value="home-loan">Home Loan</MenuItem>
                  <MenuItem value="business-loan">Business Loan</MenuItem>
                  <MenuItem value="credit-card">Credit Card</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Partner Role</InputLabel>
                <Select
                  name="role"
                  value={editedPartner.role || ""}
                  label="Partner Role"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="leadSharing">Lead Sharing</MenuItem>
                  <MenuItem value="fileSharing">File Sharing</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" disabled={editedPartner.role !== "fileSharing"}>
                <InputLabel>Commission Plan</InputLabel>
                <Select
                  name="commissionPlan"
                  value={editedPartner.commissionPlan || ""}
                  label="Commission Plan"
                  onChange={handleEditChange as any}
                  disabled={editedPartner.role !== "fileSharing"}
                >
                  <MenuItem value="gold">Gold</MenuItem>
                  <MenuItem value="diamond">Diamond</MenuItem>
                  <MenuItem value="platinum">Platinum</MenuItem>
                </Select>
                {editedPartner.role !== "fileSharing" && (
                  <FormHelperText>Commission plan is enabled only for File Sharing role</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" variant="outlined">
          Partner details updated successfully!
        </Alert>
      </Snackbar>
    </>
  )
}

export default PartnerEditDialog
