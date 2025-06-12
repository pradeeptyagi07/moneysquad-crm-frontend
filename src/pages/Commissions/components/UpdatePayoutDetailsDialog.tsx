"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem
} from "@mui/material"

interface Props {
  open: boolean
  onClose: () => void
  lead: any
}

const UpdatePayoutDialog: React.FC<Props> = ({ open, onClose, lead }) => {
  const [commission, setCommission] = useState(lead.commission || 0)
  const [status, setStatus] = useState(lead.payoutStatus || "Pending")
  const [remarks, setRemarks] = useState(lead.remarks || "")

  const handleSubmit = () => {
    // Call backend update API here
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Payout Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Commission %"
          fullWidth
          type="number"
          margin="normal"
          value={commission}
          onChange={(e) => setCommission(parseFloat(e.target.value))}
        />
        <TextField
          label="Payout Status"
          fullWidth
          select
          margin="normal"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </TextField>
        <TextField
          label="Remarks"
          fullWidth
          margin="normal"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdatePayoutDialog
