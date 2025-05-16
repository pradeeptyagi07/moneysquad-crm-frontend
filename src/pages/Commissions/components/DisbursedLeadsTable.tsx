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
import { Edit, FileDownload } from "@mui/icons-material"
import type { DisbursedLead } from "../types/commissionTypes"

interface DisbursedLeadsTableProps {
  leads: DisbursedLead[]
  onUpdateLead?: (id: string, field: string, value: any) => void
  onExportData?: () => void
}

const DisbursedLeadsTable: React.FC<DisbursedLeadsTableProps> = ({ leads, onUpdateLead, onExportData }) => {
  const [editingLead, setEditingLead] = useState<DisbursedLead | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedValues, setEditedValues] = useState({
    commissionPercentage: "",
    status: "",
    remarks: "",
  })

  const handleEditClick = (lead: DisbursedLead) => {
    setEditingLead(lead)
    setEditedValues({
      commissionPercentage: lead.commissionPercentage.toString(),
      status: lead.status,
      remarks: lead.remarks || "",
    })
    setEditDialogOpen(true)
  }

  const handleDialogClose = () => {
    setEditDialogOpen(false)
    setEditingLead(null)
  }

  const handleSaveChanges = () => {
    if (editingLead && onUpdateLead) {
      onUpdateLead(editingLead.id, "commissionPercentage", Number.parseFloat(editedValues.commissionPercentage))
      onUpdateLead(editingLead.id, "status", editedValues.status)
      onUpdateLead(editingLead.id, "remarks", editedValues.remarks)
    }
    setEditDialogOpen(false)
    setEditingLead(null)
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Disbursed Leads</Typography>
        <Button variant="outlined" startIcon={<FileDownload />} onClick={onExportData}>
          Export to Excel
        </Button>
      </Box>

      {leads.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No disbursed leads found for the selected filters. Try adjusting your filters or adding new leads.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Lead ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Partner</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Lender</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Loan Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Disbursed Amount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Comm. %
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Gross Payout
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  TDS
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  GST
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>{lead.id}</TableCell>
                  <TableCell>{lead.partnerName}</TableCell>
                  <TableCell>{lead.lenderName}</TableCell>
                  <TableCell>{lead.loanType}</TableCell>
                  <TableCell align="right">{formatCurrency(lead.disbursedAmount)}</TableCell>
                  <TableCell align="center">{lead.commissionPercentage}%</TableCell>
                  <TableCell align="right">{formatCurrency(lead.grossPayout)}</TableCell>
                  <TableCell align="center">{lead.tdsPercentage}%</TableCell>
                  <TableCell align="center">{lead.gstApplicable ? "Yes" : "No"}</TableCell>
                  <TableCell align="center">
                    <Chip label={lead.status} color={getStatusChipColor(lead.status) as any} size="small" />
                  </TableCell>
                  <TableCell>{lead.remarks}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Lead">
                      <IconButton size="small" onClick={() => handleEditClick(lead)}>
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
            Edit Lead Details
          </Typography>

          {editingLead && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Lead ID: {editingLead.id}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Partner: {editingLead.partnerName}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Lender: {editingLead.lenderName}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Loan Type: {editingLead.loanType}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Disbursed Amount: {formatCurrency(editingLead.disbursedAmount)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Commission Percentage
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editedValues.commissionPercentage}
                  onChange={(e) => setEditedValues({ ...editedValues, commissionPercentage: e.target.value })}
                  InputProps={{
                    endAdornment: "%",
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <TextField
                  fullWidth
                  select
                  size="small"
                  value={editedValues.status}
                  onChange={(e) => setEditedValues({ ...editedValues, status: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Paid">Paid</option>
                </TextField>

                <Typography variant="subtitle2" gutterBottom>
                  Remarks
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editedValues.remarks}
                  onChange={(e) => setEditedValues({ ...editedValues, remarks: e.target.value })}
                  multiline
                  rows={2}
                />
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

export default DisbursedLeadsTable
