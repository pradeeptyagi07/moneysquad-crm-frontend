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
  Paper,
} from "@mui/material"
import { Description, CheckCircle, Cancel, AccessTime, Visibility } from "@mui/icons-material"
import type { DocumentChangeRequest } from "../types/changeRequestTypes"

interface DocumentChangeRequestCardProps {
  request: DocumentChangeRequest
  onApprove: (requestId: string, adminNotes?: string) => void
  onDecline: (requestId: string, reason: string) => void
}

const DocumentChangeRequestCard: React.FC<DocumentChangeRequestCardProps> = ({ request, onApprove, onDecline }) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      panCard: "PAN Card",
      aadharCard: "Aadhar Card",
      bankPassbook: "Bank Passbook",
      profilePhoto: "Profile Photo",
    }
    return labels[type] || type
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
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  color: "white",
                }}
              >
                <Description />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {getDocumentTypeLabel(request.documentType)} Update Request
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
              p: 1.5,
              mb: 1.5,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "text.secondary" }}>
                  Current Document
                </Typography>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Description color="action" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {request.currentDocument.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Size: {formatFileSize(request.currentDocument.size)} • Uploaded:{" "}
                    {formatDate(request.currentDocument.uploadedAt)}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => window.open(request.currentDocument.url, "_blank")}
                    >
                      View
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                  New Document
                </Typography>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(25,118,210,0.05)",
                    border: "1px solid rgba(25,118,210,0.2)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Description color="primary" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {request.newDocument.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Size: {formatFileSize(request.newDocument.size)} • Uploaded:{" "}
                    {formatDate(request.newDocument.uploadedAt)}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => window.open(request.newDocument.url, "_blank")}
                    >
                      View
                    </Button>
                  </Box>
                </Paper>
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
        <DialogTitle>Approve Document Change Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to approve this {getDocumentTypeLabel(request.documentType).toLowerCase()} change
            request?
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
        <DialogTitle>Decline Document Change Request</DialogTitle>
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

export default DocumentChangeRequestCard
