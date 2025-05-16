"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  TextField,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import type { Lead, LeadStatus } from "../../../data/leadTypes"

interface StatusUpdateDialogProps {
  open: boolean
  onClose: () => void
  lead: Lead
  onUpdateStatus: (leadId: string, newStatus: LeadStatus, comment: string) => void
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({ open, onClose, lead, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead?.status || "pending")
  const [comment, setComment] = useState("")

  // Available status options based on current status
  const getAvailableStatuses = (): LeadStatus[] => {
    if (!lead) return ["pending"]

    switch (lead.status) {
      case "pending":
        return ["pending", "login", "rejected"]
      case "login":
        return ["login", "approved", "rejected"]
      case "approved":
        return ["approved", "disbursed", "rejected"]
      case "disbursed":
        return ["disbursed", "closed"]
      case "rejected":
        return ["rejected", "login"] // Allow reopening rejected leads
      case "closed":
        return ["closed"] // Closed is final
      case "expired":
        return ["expired", "login"] // Allow reopening expired leads
      default:
        return ["pending", "login", "approved", "rejected", "disbursed", "closed", "expired"]
    }
  }

  const handleUpdate = () => {
    if (!comment.trim()) return
    onUpdateStatus(lead.id, selectedStatus, comment)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Update Lead Status</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Lead ID
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {lead?.id}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Applicant
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {lead?.applicantName}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Current Status
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {lead?.status.charAt(0).toUpperCase() + lead?.status.slice(1)}
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>New Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
            label="New Status"
          >
            {getAvailableStatuses().map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment about this status update"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          color="primary"
          disabled={!comment.trim() || selectedStatus === lead?.status || !lead}
        >
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StatusUpdateDialog
