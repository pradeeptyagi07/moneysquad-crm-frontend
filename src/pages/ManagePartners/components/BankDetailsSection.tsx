"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Paper, Grid, Divider, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import type { Partner } from "../types/partnerTypes"

interface BankDetailsSectionProps {
  partner: Partner
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({ partner }) => {
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [showIFSC, setShowIFSC] = useState(false)

  const toggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber)
  }

  const toggleIFSC = () => {
    setShowIFSC(!showIFSC)
  }

  const maskText = (text: string) => {
    const visibleChars = 4
    const maskedPart = "*".repeat(text.length - visibleChars)
    const visiblePart = text.slice(-visibleChars)
    return maskedPart + visiblePart
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 1,
            fontSize: "0.875rem",
            fontWeight: 700,
          }}
        >
          4
        </Box>
        Bank Details
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Account Type
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {partner.accountType}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Account Holder Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {partner.accountHolderName}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Bank Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {partner.bankName}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Account Number
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {showAccountNumber ? partner.accountNumber : maskText(partner.accountNumber)}
            </Typography>
            <IconButton size="small" onClick={toggleAccountNumber} sx={{ ml: 1, mb: 2 }}>
              {showAccountNumber ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            IFSC Code
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {showIFSC ? partner.ifscCode : maskText(partner.ifscCode)}
            </Typography>
            <IconButton size="small" onClick={toggleIFSC} sx={{ ml: 1, mb: 2 }}>
              {showIFSC ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Branch Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {partner.branchName}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default BankDetailsSection
