"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import { AccountBalance, CheckCircle, Cancel, AccessTime, ArrowForward } from "@mui/icons-material"

interface BankData {
  accountType: string
  accountHolderName: string
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
  relationshipWithAccountHolder: string
  isGstBillingApplicable: string
}

interface BankChangeRequest {
  id: string
  type: string
  submittedAt: string
  reason: string
  status: "pending" | "approved" | "rejected"
  currentData: BankData
  requestedData: BankData
}

interface BankChangeRequestCardProps {
  request: BankChangeRequest
  onApprove: (requestId: string, adminNotes?: string) => void
  onDecline: (requestId: string, reason: string) => void
}

const BankChangeRequestCard: React.FC<BankChangeRequestCardProps> = ({ request, onApprove, onDecline }) => {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [declineReason, setDeclineReason] = useState("")

  const handleApprove = () => {
    onApprove(request.id, adminNotes)
    setApproveDialogOpen(false)
    setAdminNotes("")
  }

  const handleDecline = () => {
    if (declineReason.trim()) {
      onDecline(request.id, declineReason)
      setDeclineDialogOpen(false)
      setDeclineReason("")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <AccountBalance />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                  Bank Details Update Request
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <AccessTime fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    Submitted {formatDate(request.submittedAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.7)",
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>
                  Current Details
                </Typography>
                <Box sx={{ space: 1 }}>
                  <Typography variant="body2">
                    <strong>Account Type:</strong> {request.currentData.accountType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Account Holder:</strong> {request.currentData.accountHolderName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Bank:</strong> {request.currentData.bankName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Account:</strong> {request.currentData.accountNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>IFSC:</strong> {request.currentData.ifscCode}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Branch:</strong> {request.currentData.branchName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Relationship:</strong> {request.currentData.relationshipWithAccountHolder}
                  </Typography>
                  <Typography variant="body2">
                    <strong>GST Billing:</strong> {request.currentData.isGstBillingApplicable}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowForward sx={{ color: "primary.main", fontSize: 32 }} />
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
                  Requested Changes
                </Typography>
                <Box sx={{ space: 1 }}>
                  <Typography variant="body2">
                    <strong>Account Type:</strong> {request.requestedData.accountType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Account Holder:</strong> {request.requestedData.accountHolderName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Bank:</strong> {request.requestedData.bankName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Account:</strong> {request.requestedData.accountNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>IFSC:</strong> {request.requestedData.ifscCode}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Branch:</strong> {request.requestedData.branchName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Relationship:</strong> {request.requestedData.relationshipWithAccountHolder}
                  </Typography>
                  <Typography variant="body2">
                    <strong>GST Billing:</strong> {request.requestedData.isGstBillingApplicable}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Reason for Change
            </Typography>
            <Typography
              variant="body2"
              sx={{
                bgcolor: "rgba(255,255,255,0.7)",
                p: 2,
                borderRadius: 1,
                fontStyle: "italic",
                color: "text.secondary",
              }}
            >
              "{request.reason}"
            </Typography>
          </Box>

          {request.status === "pending" && (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => setDeclineDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Decline
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => setApproveDialogOpen(true)}
                sx={{
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                }}
              >
                Approve
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Bank Change Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to approve this bank details change request?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Admin Notes (Optional)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add any notes about this approval..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" color="success">
            Approve Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={declineDialogOpen} onClose={() => setDeclineDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Decline Bank Change Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for declining this request:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Decline Reason *"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Explain why this request is being declined..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDecline} variant="contained" color="error" disabled={!declineReason.trim()}>
            Decline Request
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BankChangeRequestCard
