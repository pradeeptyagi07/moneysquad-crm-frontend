"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Alert,
  Dialog,
  Button,
} from "@mui/material"
import { Edit } from "@mui/icons-material"
import type { PartnerPayout } from "../types/commissionTypes"

interface PartnerPayoutsTableProps {
  payouts: PartnerPayout[]
  onUpdateStatus?: (id: string, newStatus: string) => void
}

const PartnerPayoutsTable: React.FC<PartnerPayoutsTableProps> = ({ payouts, onUpdateStatus }) => {
  const [editingPayout, setEditingPayout] = useState<PartnerPayout | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editValue, setEditValue] = useState<string>("")

  const handleEditClick = (payout: PartnerPayout) => {
    setEditingPayout(payout)
    setEditValue(payout.status)
    setEditDialogOpen(true)
  }

  const handleDialogClose = () => {
    setEditDialogOpen(false)
    setEditingPayout(null)
  }

  const handleSaveChanges = () => {
    if (editingPayout && onUpdateStatus) {
      onUpdateStatus(editingPayout.id, editValue)
    }
    setEditDialogOpen(false)
    setEditingPayout(null)
  }

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "success"
      case "Processing":
        return "warning"
      case "Pending":
        return "default"
      default:
        return "default"
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Partner Payouts
      </Typography>

      {payouts.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No partner payouts found for the selected filters. Try adjusting your filters or adding new payouts.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Partner Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Partner ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Gross Payout
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  TDS (2%)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Net Payout (98%)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  GST Applicable
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id} hover>
                  <TableCell>{payout.partnerName}</TableCell>
                  <TableCell>{payout.partnerId}</TableCell>
                  <TableCell align="right">{formatCurrency(payout.grossPayout)}</TableCell>
                  <TableCell align="right">{formatCurrency(payout.tdsAmount)}</TableCell>
                  <TableCell align="right">{formatCurrency(payout.netPayout)}</TableCell>
                  <TableCell align="center">{payout.gstApplicable ? "Yes" : "No"}</TableCell>
                  <TableCell align="center">
                    <Chip label={payout.status} color={getStatusChipColor(payout.status) as any} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Payout">
                      <IconButton size="small" onClick={() => handleEditClick(payout)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Payout Details
          </Typography>

          {editingPayout && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Partner: {editingPayout.partnerName}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Partner ID: {editingPayout.partnerId}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Gross Payout: {formatCurrency(editingPayout.grossPayout)}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  TDS Amount: {formatCurrency(editingPayout.tdsAmount)}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Net Payout: {formatCurrency(editingPayout.netPayout)}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  GST Applicable: {editingPayout.gstApplicable ? "Yes" : "No"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Paid">Paid</option>
                </TextField>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button variant="outlined" onClick={handleDialogClose} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  )
}

export default PartnerPayoutsTable
