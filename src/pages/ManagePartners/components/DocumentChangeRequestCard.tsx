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
  Chip,
} from "@mui/material"
import { Description, CheckCircle, Cancel, AccessTime, Visibility } from "@mui/icons-material"

interface DocumentChangeRequest {
  id: string
  type: string
  submittedAt: string
  reason: string
  status: string
  previousData: Record<string, string>
  currentData: Record<string, string | string[]>
}

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

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      profilePhoto: "Profile Photo",
      panCard: "PAN Card",
      aadharFront: "Aadhar Front",
      aadharBack: "Aadhar Back",
      cancelledCheque: "Cancelled Cheque",
      gstCertificate: "GST Certificate",
      aditional: "Additional Documents",
    }
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  const getFileName = (url: string) => {
    if (!url) return "Unknown file"
    const parts = url.split("/")
    const fileName = parts[parts.length - 1]
    return decodeURIComponent(fileName)
  }

  // Get all document types that are being changed
  const changedDocuments = Object.keys(request.currentData)
  const totalDocuments = changedDocuments.length

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
                  Document Update Request
                  <Chip
                    label={`${totalDocuments} Documents`}
                    size="small"
                    sx={{ ml: 1, bgcolor: "primary.main", color: "white" }}
                  />
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
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "text.secondary" }}>
              Documents Being Updated ({totalDocuments})
            </Typography>

            <Grid container spacing={2}>
              {changedDocuments.map((docType) => {
                const currentDoc = request.previousData[docType]
                const newDoc = request.currentData[docType]
                const newDocUrl = Array.isArray(newDoc) ? newDoc[0] : newDoc

                return (
                  <Grid item xs={12} key={docType}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "primary.main" }}>
                        {getDocumentTypeLabel(docType)}
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                            Current Document
                          </Typography>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor: "rgba(255,0,0,0.05)",
                              border: "1px solid rgba(255,0,0,0.2)",
                              mt: 0.5,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                              <Description fontSize="small" color="error" />
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                                {currentDoc ? getFileName(currentDoc) : "No current document"}
                              </Typography>
                            </Box>
                            {currentDoc && (
                              <Button
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() => window.open(currentDoc, "_blank")}
                                sx={{ fontSize: "0.7rem" }}
                              >
                                View Current
                              </Button>
                            )}
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main" }}>
                            New Document
                          </Typography>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor: "rgba(25,118,210,0.05)",
                              border: "1px solid rgba(25,118,210,0.2)",
                              mt: 0.5,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                              <Description fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                                {newDocUrl ? getFileName(newDocUrl) : "No new document"}
                              </Typography>
                            </Box>
                            {Array.isArray(newDoc) && newDoc.length > 1 && (
                              <Chip
                                label={`+${newDoc.length - 1} more files`}
                                size="small"
                                sx={{ mb: 1, fontSize: "0.7rem" }}
                              />
                            )}
                            {newDocUrl && (
                              <Button
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() => window.open(newDocUrl, "_blank")}
                                sx={{ fontSize: "0.7rem" }}
                              >
                                View New
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                )
              })}
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
                Decline All
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
                Approve All
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
            Are you sure you want to approve all {totalDocuments} document changes in this request?
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
            Approve All Documents
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={declineDialogOpen} onClose={() => setDeclineDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Decline Document Change Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for declining all {totalDocuments} document changes:
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
            Decline All Documents
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DocumentChangeRequestCard
