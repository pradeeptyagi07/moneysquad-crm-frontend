"use client"

import React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Alert,
  Checkbox,
  FormControlLabel,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material"
import {
  CloudUpload as UploadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  submitChangeRequest,
  selectChangeRequestLoading,
  selectChangeRequestError,
} from "../../../store/slices/changeRequestSlice"
import { isPartnerUser } from "../../../store/slices/userDataSlice"

interface RequestChangeDialogProps {
  open: boolean
  onClose: () => void
  mode: "bank_details" | "document_update"
  data?: any
}

interface DocumentUpdate {
  documentId: string
  documentName: string
  currentFile: any
  newFile: File | null
  selected: boolean
}

const RequestChangeDialog: React.FC<RequestChangeDialogProps> = ({ open, onClose, mode, data }) => {
  const dispatch = useAppDispatch()
  const [documentUpdates, setDocumentUpdates] = useState<DocumentUpdate[]>([])
  const [reason, setReason] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

  const changeRequestLoading = useAppSelector(selectChangeRequestLoading)
  const changeRequestError = useAppSelector(selectChangeRequestError)

  // Initialize document updates when dialog opens
  React.useEffect(() => {
    if (open && mode === "document_update" && data && isPartnerUser(data)) {
      const updates: DocumentUpdate[] = []

      // Create document updates from userData.documents
      if (data.documents?.profilePhoto) {
        updates.push({
          documentId: "profilePhoto",
          documentName: "Profile Photo",
          currentFile: {
            fileName: "profile_photo.jpg",
            fileType: "jpg",
            fileUrl: data.documents.profilePhoto,
          },
          newFile: null,
          selected: false,
        })
      }

      if (data.documents?.panCard) {
        updates.push({
          documentId: "panCard",
          documentName: "PAN Card",
          currentFile: {
            fileName: "pan_card.pdf",
            fileType: "pdf",
            fileUrl: data.documents.panCard,
          },
          newFile: null,
          selected: false,
        })
      }

      if (data.documents?.aadharFront) {
        updates.push({
          documentId: "aadharFront",
          documentName: "Aadhar Card (Front)",
          currentFile: {
            fileName: "aadhar_front.jpg",
            fileType: "jpg",
            fileUrl: data.documents.aadharFront,
          },
          newFile: null,
          selected: false,
        })
      }

      if (data.documents?.aadharBack) {
        updates.push({
          documentId: "aadharBack",
          documentName: "Aadhar Card (Back)",
          currentFile: {
            fileName: "aadhar_back.jpg",
            fileType: "jpg",
            fileUrl: data.documents.aadharBack,
          },
          newFile: null,
          selected: false,
        })
      }

      if (data.documents?.cancelledCheque) {
        updates.push({
          documentId: "cancelledCheque",
          documentName: "Bank Statement",
          currentFile: {
            fileName: "bank_statement.pdf",
            fileType: "pdf",
            fileUrl: data.documents.cancelledCheque,
          },
          newFile: null,
          selected: false,
        })
      }

      if (data.documents?.gstCertificate) {
        updates.push({
          documentId: "gstCertificate",
          documentName: "GST Certificate",
          currentFile: {
            fileName: "gst_certificate.pdf",
            fileType: "pdf",
            fileUrl: data.documents.gstCertificate,
          },
          newFile: null,
          selected: false,
        })
      }

      if (data.documents?.aditional) {
        updates.push({
          documentId: "aditional",
          documentName: "Additional Document",
          currentFile: {
            fileName: "additional_doc.pdf",
            fileType: "pdf",
            fileUrl: data.documents.aditional,
          },
          newFile: null,
          selected: false,
        })
      }

      setDocumentUpdates(updates)
    }
  }, [open, mode, data])

  const getFileIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <PdfIcon sx={{ fontSize: 32, color: "#d32f2f" }} />
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon sx={{ fontSize: 32, color: "#1976d2" }} />
      default:
        return <DocIcon sx={{ fontSize: 32, color: "#757575" }} />
    }
  }

  const handleDocumentSelect = (documentId: string, selected: boolean) => {
    setDocumentUpdates((prev) =>
      prev.map((update) => (update.documentId === documentId ? { ...update, selected } : update)),
    )
  }

  const handleFileSelect = (documentId: string, file: File) => {
    setDocumentUpdates((prev) =>
      prev.map((update) => (update.documentId === documentId ? { ...update, newFile: file, selected: true } : update)),
    )
  }

  const handleRemoveFile = (documentId: string) => {
    setDocumentUpdates((prev) =>
      prev.map((update) => (update.documentId === documentId ? { ...update, newFile: null, selected: false } : update)),
    )
  }

  const handleSelectAll = () => {
    const allSelected = documentUpdates.every((update) => update.selected)
    setDocumentUpdates((prev) => prev.map((update) => ({ ...update, selected: !allSelected })))
  }

  const handleSubmitRequest = async () => {
    try {
      if (mode === "document_update") {
        const selectedUpdates = documentUpdates.filter((update) => update.selected && update.newFile)

        if (selectedUpdates.length === 0) {
          setSnackbarMessage("Please select at least one document to update.")
          setSnackbarSeverity("error")
          setSnackbarOpen(true)
          return
        }

        // Prepare previous data (current document URLs)
        const previousData: Record<string, string> = {}
        selectedUpdates.forEach((update) => {
          previousData[update.documentId] = update.currentFile.fileUrl
        })

        // Prepare current data (new files)
        const currentData: Record<string, File> = {}
        selectedUpdates.forEach((update) => {
          if (update.newFile) {
            currentData[update.documentId] = update.newFile
          }
        })

        const requestData = {
          requestType: "documents" as const,
          previousData,
          currentData,
          reason,
        }

        await dispatch(submitChangeRequest(requestData)).unwrap()

        setSnackbarMessage("Document change request submitted successfully!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)

        // Reset state
        setDocumentUpdates([])
        setReason("")
        onClose()
      }
    } catch (error) {
      setSnackbarMessage("Failed to submit change request. Please try again.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  const selectedCount = documentUpdates.filter((update) => update.selected && update.newFile).length
  const totalSelected = documentUpdates.filter((update) => update.selected).length

  const renderBankDetailsContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bank Details Update Request
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Bank detail changes require admin approval for security purposes.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Current Bank Details
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Account Holder:</strong>{" "}
                  {data && isPartnerUser(data) ? data.bankDetails?.accountHolderName || "N/A" : "N/A"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Account Number:</strong>{" "}
                  {data && isPartnerUser(data) ? `****${data.bankDetails?.accountNumber?.slice(-4) || "****"}` : "****"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Bank Name:</strong>{" "}
                  {data && isPartnerUser(data) ? data.bankDetails?.bankName || "N/A" : "N/A"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>IFSC Code:</strong>{" "}
                  {data && isPartnerUser(data) ? data.bankDetails?.ifscCode || "N/A" : "N/A"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                New Bank Details
              </Typography>
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Account Holder Name" size="small" fullWidth />
                <TextField label="Account Number" size="small" fullWidth />
                <TextField label="Bank Name" size="small" fullWidth />
                <TextField label="IFSC Code" size="small" fullWidth />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )

  const renderDocumentUpdateContent = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Bulk Document Update Request</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip label={`${selectedCount} files ready to upload`} color="primary" variant="outlined" />
          <Button variant="outlined" size="small" onClick={handleSelectAll}>
            {totalSelected === documentUpdates.length ? "Deselect All" : "Select All"}
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Select multiple documents to update and upload new files. All selected documents will be submitted in a single
        request for admin approval.
      </Alert>

      <Grid container spacing={3}>
        {documentUpdates.map((update) => (
          <Grid item xs={12} md={6} key={update.documentId}>
            <Card
              sx={{
                border: update.selected ? "2px solid" : "1px solid",
                borderColor: update.selected ? "primary.main" : "divider",
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              <CardContent sx={{ pb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={update.selected}
                        onChange={(e) => handleDocumentSelect(update.documentId, e.target.checked)}
                        color="primary"
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {update.documentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current: {update.currentFile.fileName}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "transparent" }}>{getFileIcon(update.currentFile.fileType)}</Avatar>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* File Upload Area */}
                <Box>
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    Upload New File:
                  </Typography>

                  {update.newFile ? (
                    <Box
                      sx={{
                        border: "2px solid",
                        borderColor: "success.main",
                        borderRadius: 2,
                        p: 2,
                        bgcolor: "success.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {update.newFile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(update.newFile.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(update.documentId)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 2,
                        p: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "action.hover",
                        },
                      }}
                      onClick={() => document.getElementById(`file-upload-${update.documentId}`)?.click()}
                    >
                      <input
                        id={`file-upload-${update.documentId}`}
                        type="file"
                        hidden
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileSelect(update.documentId, file)
                          }
                        }}
                      />
                      <UploadIcon sx={{ fontSize: 24, color: "text.secondary", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PDF, JPG, PNG, DOC (Max 10MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedCount > 0 && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>{selectedCount} document(s)</strong> ready for update. These will be submitted together for admin
            approval.
          </Typography>
        </Alert>
      )}
    </Box>
  )

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", maxHeight: "90vh" },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={600}>
              {mode === "document_update" ? "Bulk Document Update" : "Bank Details Update"}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {mode === "bank_details" ? renderBankDetailsContent() : renderDocumentUpdateContent()}

          <Divider sx={{ my: 3 }} />

          <TextField
            label="Reason for Update"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for this bulk update request..."
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
          <Box>
            {mode === "document_update" && (
              <Typography variant="body2" color="text.secondary">
                {selectedCount} document(s) selected for update
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button onClick={onClose} variant="outlined" disabled={changeRequestLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              variant="contained"
              disabled={
                (mode === "document_update" && selectedCount === 0) || reason.trim() === "" || changeRequestLoading
              }
              startIcon={changeRequestLoading ? <CircularProgress size={20} /> : null}
            >
              {changeRequestLoading
                ? "Submitting..."
                : `Submit Request (${mode === "document_update" ? selectedCount : "1"} item${selectedCount !== 1 ? "s" : ""})`}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default RequestChangeDialog
