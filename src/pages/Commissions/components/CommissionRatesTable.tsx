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
  IconButton,
  TextField,
  Tabs,
  Tab,
  Alert,
  Dialog,
  Button,
  Tooltip,
} from "@mui/material"
import { Edit } from "@mui/icons-material"
import type { CommissionRate } from "../types/commissionTypes"

interface CommissionRatesTableProps {
  commissionRates: CommissionRate[]
  isAdmin?: boolean
  onUpdateCommission?: (id: string, newPercentage: number) => void
  tier?: string
  userRole?: "admin" | "partner"
}

const CommissionRatesTable: React.FC<CommissionRatesTableProps> = ({
  commissionRates,
  isAdmin = false,
  onUpdateCommission,
  tier = "Gold",
  userRole = "admin",
}) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingLender, setEditingLender] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<{
    termLoanId: string
    overdraftId: string
    termLoanPercentage: string
    overdraftPercentage: string
  }>({
    termLoanId: "",
    overdraftId: "",
    termLoanPercentage: "",
    overdraftPercentage: "",
  })

  const applicantTypes = ["Salaried", "Business", "Professional"]

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleEditClick = (lenderName: string) => {
    const termLoanRate = filteredRates.find((rate) => rate.lenderName === lenderName && rate.loanType === "Term Loan")

    const overdraftRate = filteredRates.find((rate) => rate.lenderName === lenderName && rate.loanType === "Overdraft")

    setEditingLender(lenderName)
    setEditingValues({
      termLoanId: termLoanRate?.id || "",
      overdraftId: overdraftRate?.id || "",
      termLoanPercentage: termLoanRate?.commissionPercentage.toString() || "",
      overdraftPercentage: overdraftRate?.commissionPercentage.toString() || "",
    })
    setEditDialogOpen(true)
  }

  const handleDialogClose = () => {
    setEditDialogOpen(false)
    setEditingLender(null)
  }

  const handleSaveChanges = () => {
    if (onUpdateCommission) {
      if (editingValues.termLoanId) {
        onUpdateCommission(editingValues.termLoanId, Number.parseFloat(editingValues.termLoanPercentage))
      }

      if (editingValues.overdraftId) {
        onUpdateCommission(editingValues.overdraftId, Number.parseFloat(editingValues.overdraftPercentage))
      }
    }
    setEditDialogOpen(false)
    setEditingLender(null)
  }

  // For partners, only show their tier rates (typically "Silver")
  // For admins, show the rates for the specified tier
  const filteredRates = commissionRates.filter((rate) => {
    const matchesApplicantType = rate.applicantType === applicantTypes[activeTab]
    const matchesTier = userRole === "partner" ? rate.tier === "Silver" : rate.tier === tier
    return matchesApplicantType && matchesTier
  })

  // Get unique lender names for the current applicant type and tier
  const lenderNames = Array.from(new Set(filteredRates.map((rate) => rate.lenderName)))

  return (
    <Box sx={{ mb: 4 }}>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Salaried Individual" />
        <Tab label="Business (SENP)" />
        <Tab label="Professional (SEP)" />
      </Tabs>

      {filteredRates.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No commission rates found for {applicantTypes[activeTab]} in {tier} tier.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Lender</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Term Loan
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Overdraft
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Notes</TableCell>
                {isAdmin && (
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {lenderNames.map((lenderName) => (
                <TableRow key={lenderName} hover>
                  <TableCell>{lenderName}</TableCell>

                  {/* Term Loan Cell */}
                  <TableCell align="center">
                    {(() => {
                      const termLoanRate = filteredRates.find(
                        (rate) => rate.lenderName === lenderName && rate.loanType === "Term Loan",
                      )
                      return termLoanRate ? `${termLoanRate.commissionPercentage}%` : "-"
                    })()}
                  </TableCell>

                  {/* Overdraft Cell */}
                  <TableCell align="center">
                    {(() => {
                      const overdraftRate = filteredRates.find(
                        (rate) => rate.lenderName === lenderName && rate.loanType === "Overdraft",
                      )
                      return overdraftRate ? `${overdraftRate.commissionPercentage}%` : "-"
                    })()}
                  </TableCell>

                  {/* Notes Cell */}
                  <TableCell>
                    {filteredRates
                      .filter((rate) => rate.lenderName === lenderName && rate.notes)
                      .map((rate) => (
                        <Typography key={rate.id} variant="body2" color="text.secondary">
                          {rate.notes}
                        </Typography>
                      ))}
                  </TableCell>

                  {/* Only show edit button for admins */}
                  {isAdmin && (
                    <TableCell align="center">
                      <Tooltip title="Edit Commission Rates">
                        <IconButton size="small" onClick={() => handleEditClick(lenderName)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Commission Rates
          </Typography>

          {editingLender && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Lender: {editingLender}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Applicant Type: {applicantTypes[activeTab]}
              </Typography>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                Tier: {tier}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Term Loan Commission Rate
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editingValues.termLoanPercentage}
                  onChange={(e) => setEditingValues({ ...editingValues, termLoanPercentage: e.target.value })}
                  InputProps={{
                    endAdornment: "%",
                  }}
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle2" gutterBottom>
                  Overdraft Commission Rate
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editingValues.overdraftPercentage}
                  onChange={(e) => setEditingValues({ ...editingValues, overdraftPercentage: e.target.value })}
                  InputProps={{
                    endAdornment: "%",
                  }}
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

export default CommissionRatesTable
