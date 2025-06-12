"use client"

import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material"

interface Props {
  open: boolean
  onClose: () => void
  lead: any
}

const PayoutDetailsDialog: React.FC<Props> = ({ open, onClose, lead }) => {
  const gross = lead.disbursedAmount * (lead.commission / 100)
  const tds = gross * 0.02
  const net = gross - tds

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem", pb: 1 }}>
        Payout Breakdown
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Disbursement Summary
          </Typography>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography>Disbursed Amount</Typography>
            <Typography fontWeight={600}>₹{lead.disbursedAmount.toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography>Commission</Typography>
            <Typography fontWeight={600}>{lead.commission}%</Typography>
          </Box>
        </Paper>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Payout Computation
          </Typography>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography>Gross Payout</Typography>
            <Typography fontWeight={600}>₹{gross.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography>TDS (2%)</Typography>
            <Typography fontWeight={600}>- ₹{tds.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography>Net Payout</Typography>
            <Typography fontWeight={600} color="primary">
              ₹{net.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {lead.remarks && (
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Remarks
            </Typography>
            <Typography variant="body2" color="text.secondary">{lead.remarks}</Typography>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PayoutDetailsDialog
