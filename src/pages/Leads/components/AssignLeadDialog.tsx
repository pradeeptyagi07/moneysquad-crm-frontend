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
} from "@mui/material"
import { Close } from "@mui/icons-material"
import type { Lead } from "../../../data/leadTypes"
import { mockManagers } from "../../../data/mockLeads"

interface AssignLeadDialogProps {
  open: boolean
  onClose: () => void
  lead: Lead
  onAssign: (leadId: string, managerId: string, managerName: string) => void
}

const AssignLeadDialog: React.FC<AssignLeadDialogProps> = ({ open, onClose, lead, onAssign }) => {
  const [selectedManager, setSelectedManager] = useState("")

  const handleAssign = () => {
    if (!selectedManager || !lead) return

    const manager = mockManagers.find((m) => m.id === selectedManager)
    if (manager) {
      onAssign(lead.id, manager.id, manager.name)
    }
  }

  // If lead is undefined, don't render the dialog content
  if (!lead) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Assign Lead to Manager</Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>No lead selected</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Assign Lead to Manager</Typography>
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
            {lead.id}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Applicant
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {lead.applicantName}
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Manager</InputLabel>
          <Select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value as string)}
            label="Select Manager"
          >
            {mockManagers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.name} ({manager.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAssign} variant="contained" color="primary" disabled={!selectedManager}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignLeadDialog
