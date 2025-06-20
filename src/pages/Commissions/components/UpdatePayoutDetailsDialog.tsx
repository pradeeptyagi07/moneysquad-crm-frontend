"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Snackbar,
} from "@mui/material"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { updatePayoutStatus } from "../../../store/slices/commissionSlice"
import { useAppSelector } from "../../../hooks/useAppSelector"

interface Props {
  open: boolean
  onClose: () => void
  lead: any
}

const UpdatePayoutDialog: React.FC<Props> = ({ open, onClose, lead }) => {
  const dispatch = useAppDispatch()
  const { payoutUpdating, error } = useAppSelector((state) => state.commission)

  const [commission, setCommission] = useState(lead.commission || 0)
  const [status, setStatus] = useState(lead.payoutStatus || "pending")
  const [remark, setRemark] = useState(lead.remark || "")
  const [localError, setLocalError] = useState<string | null>(null)

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

  const handleSubmit = async () => {
    try {
      setLocalError(null)

      const result = await dispatch(
        updatePayoutStatus({
          payoutId: lead._id,
          commission: commission / 100, // Divide by 100 for backend
          payoutStatus: status as "pending" | "paid",
          remark: remark,
        }),
      )

      if (updatePayoutStatus.fulfilled.match(result)) {
        // Success - show success snackbar and close dialog
        setSnackbarMessage("Payout details updated successfully!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        setTimeout(() => {
          onClose()
        }, 1000) // Close dialog after 1 second
      } else {
        // Handle error
        const errorMessage = (result.payload as string) || "Failed to update payout"
        setLocalError(errorMessage)
        setSnackbarMessage(errorMessage)
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred"
      setLocalError(errorMessage)
      setSnackbarMessage(errorMessage)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  const handleClose = () => {
    setLocalError(null)
    onClose()
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Payout Details</DialogTitle>
        <DialogContent>
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || error}
            </Alert>
          )}

          <TextField
            label="Commission %"
            fullWidth
            type="number"
            margin="normal"
            value={commission}
            onChange={(e) => setCommission(Number.parseFloat(e.target.value) || 0)}
            disabled={payoutUpdating}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            helperText="Enter percentage value (e.g., 3 for 3%)"
          />

          <TextField
            label="Payout Status"
            fullWidth
            select
            margin="normal"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={payoutUpdating}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </TextField>

          <TextField
            label="Remark"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={payoutUpdating}
            placeholder="Enter any remarks or notes..."
          />

          {/* Display current lead info */}
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Lead ID: {lead.leadId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Partner: {lead.partner.name} ({lead.partner.partnerId})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Disbursed Amount: ₹{lead.disbursedAmount.toLocaleString()}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" disabled={payoutUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={payoutUpdating}
            startIcon={payoutUpdating ? <CircularProgress size={20} /> : null}
          >
            {payoutUpdating ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UpdatePayoutDialog
