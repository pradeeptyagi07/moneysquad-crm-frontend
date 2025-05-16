"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
  Zoom,
  Fade,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PendingIcon from "@mui/icons-material/Pending"
import ErrorIcon from "@mui/icons-material/Error"
import DownloadIcon from "@mui/icons-material/Download"
import HistoryIcon from "@mui/icons-material/History"

interface Document {
  id: string
  name: string
  status: "verified" | "pending" | "rejected"
  uploadDate: string
  fileUrl: string
  description?: string
}

interface DocumentsSectionProps {
  user?: any
  readOnly?: boolean
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ user, readOnly = false }) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "ID Proof",
      status: "verified",
      uploadDate: "2023-10-15",
      fileUrl: "/document-preview.png",
      description: "Government issued photo ID card",
    },
    {
      id: "2",
      name: "Address Proof",
      status: "verified",
      uploadDate: "2023-10-15",
      fileUrl: "/document-preview.png",
      description: "Utility bill or bank statement showing current address",
    },
    {
      id: "3",
      name: "Business Registration",
      status: "pending",
      uploadDate: "2023-10-20",
      fileUrl: "/document-preview.png",
      description: "Certificate of incorporation or business registration",
    },
    {
      id: "4",
      name: "Tax Certificate",
      status: "rejected",
      uploadDate: "2023-10-18",
      fileUrl: "/document-preview.png",
      description: "Tax registration certificate or GST registration",
    },
  ])

  const [previewOpen, setPreviewOpen] = useState(false)
  const [currentPreview, setCurrentPreview] = useState<Document | null>(null)
  const [requestChangeOpen, setRequestChangeOpen] = useState(false)
  const [changeRequest, setChangeRequest] = useState({ documentId: "", reason: "" })
  const [historyOpen, setHistoryOpen] = useState(false)

  const handlePreview = (document: Document) => {
    setCurrentPreview(document)
    setPreviewOpen(true)
  }

  const handleRequestChange = (documentId: string) => {
    setChangeRequest({ documentId, reason: "" })
    setRequestChangeOpen(true)
  }

  const handleSubmitChangeRequest = () => {
    // In a real app, this would send the change request to the backend
    console.log("Change requested for document:", changeRequest)
    setRequestChangeOpen(false)
    // Show success notification
  }

  const handleViewHistory = () => {
    setHistoryOpen(true)
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Chip icon={<CheckCircleIcon />} label="Verified" color="success" size="small" sx={{ fontWeight: 500 }} />
        )
      case "pending":
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" sx={{ fontWeight: 500 }} />
      case "rejected":
        return <Chip icon={<ErrorIcon />} label="Rejected" color="error" size="small" sx={{ fontWeight: 500 }} />
      default:
        return null
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a" }}>
          Documents
        </Typography>
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{
            borderColor: "#0f766e",
            color: "#0f766e",
            "&:hover": {
              borderColor: "#0e6660",
              backgroundColor: "rgba(15, 118, 110, 0.04)",
            },
          }}
        >
          Upload New Document
        </Button>
      </Box>

      <Grid container spacing={3}>
        {documents.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.3s ease",
                borderRadius: 2,
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>{getStatusChip(doc.status)}</Box>

              <CardMedia
                component="img"
                height="140"
                image={doc.fileUrl}
                alt={doc.name}
                sx={{
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />

              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {doc.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {doc.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Uploaded on: {new Date(doc.uploadDate).toLocaleDateString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                <Box>
                  <Tooltip title="Preview Document" arrow>
                    <IconButton onClick={() => handlePreview(doc)} sx={{ color: "#0f766e" }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Document" arrow>
                    <IconButton sx={{ color: "#0f766e" }}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View History" arrow>
                    <IconButton onClick={handleViewHistory} sx={{ color: "#0f766e" }}>
                      <HistoryIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {!readOnly && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleRequestChange(doc.id)}
                    sx={{
                      backgroundColor: "#0f766e",
                      "&:hover": {
                        backgroundColor: "#0e6660",
                      },
                    }}
                  >
                    Replace
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Document Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle
          sx={{ bgcolor: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6" fontWeight={600}>
            {currentPreview?.name}
          </Typography>
          <Box>{currentPreview && getStatusChip(currentPreview.status)}</Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="img"
            src={currentPreview?.fileUrl}
            alt={currentPreview?.name}
            sx={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {currentPreview?.description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Uploaded on: {currentPreview?.uploadDate ? new Date(currentPreview.uploadDate).toLocaleDateString() : ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            startIcon={<DownloadIcon />}
            sx={{
              color: "#0f766e",
              mr: "auto",
            }}
          >
            Download
          </Button>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          {!readOnly && (
            <Button
              variant="contained"
              onClick={() => {
                setPreviewOpen(false)
                if (currentPreview) handleRequestChange(currentPreview.id)
              }}
              sx={{
                backgroundColor: "#0f766e",
                "&:hover": {
                  backgroundColor: "#0e6660",
                },
              }}
            >
              Replace Document
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Request Change Dialog */}
      <Dialog open={requestChangeOpen} onClose={() => setRequestChangeOpen(false)} TransitionComponent={Fade}>
        <DialogTitle sx={{ bgcolor: "#f8fafc" }}>Request Document Change</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for requesting a change to this document.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for change"
            fullWidth
            multiline
            rows={4}
            value={changeRequest.reason}
            onChange={(e) => setChangeRequest({ ...changeRequest, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRequestChangeOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitChangeRequest}
            variant="contained"
            color="primary"
            disabled={!changeRequest.reason}
            sx={{
              backgroundColor: "#0f766e",
              "&:hover": {
                backgroundColor: "#0e6660",
              },
              "&.Mui-disabled": {
                backgroundColor: "#e2e8f0",
              },
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document History Dialog */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ bgcolor: "#f8fafc" }}>Document History</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              ID Proof
            </Typography>
            <Box sx={{ ml: 2, borderLeft: "2px solid #e2e8f0", pl: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  October 15, 2023
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Document uploaded and submitted for verification
                </Typography>
                <Chip
                  icon={<PendingIcon />}
                  label="Pending"
                  color="warning"
                  size="small"
                  sx={{ mt: 1, fontWeight: 500 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  October 17, 2023
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Document verified by Admin (John Smith)
                </Typography>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Verified"
                  color="success"
                  size="small"
                  sx={{ mt: 1, fontWeight: 500 }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DocumentsSection
