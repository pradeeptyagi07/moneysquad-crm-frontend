"use client"

import type React from "react"
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
} from "@mui/material"
import type { PartnerCommissionSummary } from "../types/commissionTypes"

interface PartnerCommissionTableProps {
  commissions: PartnerCommissionSummary[]
}

const PartnerCommissionTable: React.FC<PartnerCommissionTableProps> = ({ commissions }) => {
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

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleString("en-IN", { month: "long", year: "numeric" })
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Commission Payouts
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Lender</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Loan Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Gross Payout
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                TDS (2%)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Net Payout
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id} hover>
                <TableCell>{formatMonth(commission.month)}</TableCell>
                <TableCell>{commission.lenderName}</TableCell>
                <TableCell>{commission.loanType}</TableCell>
                <TableCell align="right">{formatCurrency(commission.grossPayout)}</TableCell>
                <TableCell align="right">{formatCurrency(commission.tdsAmount)}</TableCell>
                <TableCell align="right">{formatCurrency(commission.netPayout)}</TableCell>
                <TableCell align="center">
                  <Chip label={commission.status} color={getStatusChipColor(commission.status) as any} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default PartnerCommissionTable
