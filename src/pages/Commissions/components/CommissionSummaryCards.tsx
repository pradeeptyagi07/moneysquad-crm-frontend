"use client"

import type React from "react"
import { Box, Paper, Typography, Grid } from "@mui/material"
import { Wallet, AccountBalance, Pending, CheckCircle } from "@mui/icons-material"

interface CommissionSummaryCardsProps {
  totalEarnings: number
  pendingAmount: number
  paidAmount: number
  leadCount: number
  isAdmin?: boolean
}

const CommissionSummaryCards: React.FC<CommissionSummaryCardsProps> = ({
  totalEarnings,
  pendingAmount,
  paidAmount,
  leadCount,
  isAdmin = false,
}) => {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderLeft: "4px solid #4caf50",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Typography variant="subtitle2" color="text.secondary">
                {isAdmin ? "Total Commission" : "My Total Earnings"}
              </Typography>
              <Wallet sx={{ color: "#4caf50" }} />
            </Box>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: "medium" }}>
              {formatCurrency(totalEarnings)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {leadCount} {leadCount === 1 ? "Lead" : "Leads"}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderLeft: "4px solid #f44336",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Pending Amount
              </Typography>
              <Pending sx={{ color: "#f44336" }} />
            </Box>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: "medium" }}>
              {formatCurrency(pendingAmount)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {isAdmin ? "Across all partners" : "To be processed"}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderLeft: "4px solid #2196f3",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Paid Amount
              </Typography>
              <CheckCircle sx={{ color: "#2196f3" }} />
            </Box>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: "medium" }}>
              {formatCurrency(paidAmount)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {isAdmin ? "Across all partners" : "Already processed"}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderLeft: "4px solid #ff9800",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Typography variant="subtitle2" color="text.secondary">
                {isAdmin ? "Total Disbursed Leads" : "My Disbursed Leads"}
              </Typography>
              <AccountBalance sx={{ color: "#ff9800" }} />
            </Box>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: "medium" }}>
              {leadCount}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {isAdmin ? "Across all partners" : "Eligible for commission"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CommissionSummaryCards
