"use client"

import type React from "react"
import { useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { fetchPayoutDetails, clearPayoutDetails } from "../../../store/slices/commissionSlice"
import { useAppSelector } from "../../../hooks/useAppSelector"

interface Props {
  open: boolean
  onClose: () => void
  lead: any
}

const PayoutDetailsDialog: React.FC<Props> = ({ open, onClose, lead }) => {
  const dispatch = useAppDispatch()
  const { payoutDetails, payoutDetailsLoading, error } = useAppSelector((state) => state.commission)

  useEffect(() => {
    if (open && lead?._id) {
      dispatch(fetchPayoutDetails(lead._id))
    }

    return () => {
      if (!open) {
        dispatch(clearPayoutDetails())
      }
    }
  }, [open, lead?._id, dispatch])

  const handleClose = () => {
    dispatch(clearPayoutDetails())
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem", pb: 1 }}>Payout Breakdown</DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {payoutDetailsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading payout details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : payoutDetails ? (
          <>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Lead Information
              </Typography>
              <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography>Lead ID</Typography>
                <Typography fontWeight={600}>{payoutDetails.leadId}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography>Disbursed Amount</Typography>
                <Typography fontWeight={600}>₹{payoutDetails.disbursedAmount.toLocaleString()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography>Commission Rate</Typography>
                <Typography fontWeight={600}>{payoutDetails.commission}%</Typography>
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Payout Computation
              </Typography>
              <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography>Gross Payout</Typography>
                <Typography fontWeight={600}>₹{payoutDetails.grossPayout.toLocaleString()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography>TDS Deduction</Typography>
                <Typography fontWeight={600}>- ₹{payoutDetails.tds.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" py={0.5}>
                <Typography>Net Payout</Typography>
                <Typography fontWeight={600} color="primary">
                  ₹{payoutDetails.netPayout.toLocaleString()}
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#f9f9f9", mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Payout Remark
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payoutDetails.remark || "Not Provided"}
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#f0f7ff" }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Commission Remark
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payoutDetails.commissionRemark || "Not Applicable"}
              </Typography>
            </Paper>
          </>
        ) : (
          <Alert severity="info">No payout details available for this lead.</Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PayoutDetailsDialog
