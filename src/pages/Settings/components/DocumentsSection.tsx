"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  selectUserData,
  selectUserDataLoading,
  selectUserDataError,
  isPartnerUser,
} from "../../../store/slices/userDataSlice"
import RequestChangeDialog from "./RequestChangeDialog"

interface Document {
  id: string
  name: string
  fileName: string
  fileUrl: string
  uploadDate: string
  fileType: string
  fileSize?: string
  status: "verified" | "pending" | "expired"
}

const DocumentsSection: React.FC = () => {
  const theme = useTheme()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

  // Get user data from Redux store
  const userData = useAppSelector(selectUserData)
  const loading = useAppSelector(selectUserDataLoading)
  const error = useAppSelector(selectUserDataError)

  // Create documents array from userData
  const userDocuments: Document[] = useMemo(() => {
    if (!userData || !isPartnerUser(userData) || !userData.documents) return []

    const docs: Document[] = []
    const status = userData.commissionPlan === "n/a" ? "pending" : "verified"

    if (userData.documents.profilePhoto) {
      docs.push({
        id: "1",
        name: "Profile Photo",
        fileName: "profile_photo.jpg",
        fileUrl: userData.documents.profilePhoto,
        uploadDate: userData.updatedAt || userData.createdAt || "2024-01-15",
        fileType: "jpg",
        fileSize: "1.2 MB",
        status: status,
      })
    }

    if (userData.documents.panCard) {
      docs.push({
        id: "2",
        name: "PAN Card",
        fileName: "pan_card.pdf",
        fileUrl: userData.documents.panCard,
        uploadDate: userData.updatedAt || userData.createdAt || "2024-01-15",
        fileType: "pdf",
        fileSize: "2.3 MB",
        status: status,
      })
    }

    if (userData.documents.aadharFront) {
      docs.push({
        id: "3",
        name: "Aadhar Card (Front)",
        fileName: "aadhar_front.jpg",
        fileUrl: userData.documents.aadharFront,
        uploadDate: userData.updatedAt || userData.createdAt || "2024-01-15",
        fileType: "jpg",
        fileSize: "1.8 MB",
        status: status,
      })
    }

    if (userData.documents.aadharBack) {
      docs.push({
        id: "4",
        name: "Aadhar Card (Back)",
        fileName: "aadhar_back.jpg",
        fileUrl: userData.documents.aadharBack,
        uploadDate: userData.updatedAt || userData.createdAt || "2024-01-15",
        fileType: "jpg",
        fileSize: "1.9 MB",
        status: status,
      })
    }

    if (userData.documents.cancelledCheque) {
      docs.push({
        id: "5",
        name: "Bank Statement",
        fileName: "bank_statement.pdf",
        fileUrl: userData.documents.cancelledCheque,
        uploadDate: userData.updatedAt || userData.createdAt || "2024-01-10",
        fileType: "pdf",
        fileSize: "5.2 MB",
        status: status,
      })
    }

    if (userData.documents.gstCertificate) {
      docs.push({
        id: "6",
        name: "GST Certificate",
        fileName: "gst_certificate.pdf",
        fileUrl: userData.documents.gstCertificate,
        uploadDate: userData.updatedAt || userData.createdAt || "2024-01-12",
        fileType: "pdf",
        fileSize: "1.1 MB",
        status: status,
      })
    }

    if (userData.documents.aditional) {
      docs.push({
        id: "7",
        name: "Additional Document",
        fileName: "additional_doc.pdf",
        fileUrl: userData.documents.aditional,
        uploadDate: userData.updatedAt || userData.createdAt || "2024-01-08",
        fileType: "pdf",
        fileSize: "3.4 MB",
        status: status,
      })
    }

    return docs
  }, [userData])

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <PdfIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon sx={{ fontSize: 40, color: "#1976d2" }} />
      case "doc":
      case "docx":
        return <DocIcon sx={{ fontSize: 40, color: "#1976d2" }} />
      default:
        return <DocIcon sx={{ fontSize: 40, color: "#757575" }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "success"
      case "pending":
        return "warning"
      case "expired":
        return "error"
      default:
        return "default"
    }
  }

  const handleViewDocument = (document: Document) => {
    setPreviewDocument(document)
    setPreviewOpen(true)
  }

  const renderPreview = () => {
    if (!previewDocument) return null

    const { fileType, fileUrl, fileName } = previewDocument

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileType.toLowerCase())) {
      return (
        <Box sx={{ textAlign: "center" }}>
          <img
            src={fileUrl || "/placeholder.svg"}
            alt={fileName}
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        </Box>
      )
    }

    if (fileType.toLowerCase() === "pdf") {
      return (
        <Box sx={{ height: "500px", width: "100%" }}>
          <object data={fileUrl} type="application/pdf" width="100%" height="100%" style={{ borderRadius: "8px" }}>
            <Typography>
              PDF preview not available.{" "}
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                Download PDF
              </a>
            </Typography>
          </object>
        </Box>
      )
    }

    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Preview not available
        </Typography>
        <Typography color="text.secondary">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download {fileName}
          </a>
        </Typography>
      </Box>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading documents...</Typography>
      </Box>
    )
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  // Show message if no user data or not a partner
  if (!userData || !isPartnerUser(userData)) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Documents not available
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setRequestDialogOpen(true)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Request Update
        </Button>
      </Box>

      <Grid container spacing={3}>
        {userDocuments.map((document) => (
          <Grid item xs={12} sm={6} md={4} key={document.id}>
            <Card
              sx={{
                borderRadius: "16px",
                transition: "all 0.3s ease",
                border: "1px solid",
                borderColor: theme.palette.divider,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "transparent",
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getFileIcon(document.fileType)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {document.name}
                      </Typography>
                      <Chip
                        label={document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                        color={getStatusColor(document.status) as any}
                        size="small"
                        sx={{ borderRadius: "8px", fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleViewDocument(document)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                    size="small"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>File:</strong> {document.fileName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Size:</strong> {document.fileSize}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Uploaded:</strong> {new Date(document.uploadDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Document Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {previewDocument && getFileIcon(previewDocument.fileType)}
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {previewDocument?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {previewDocument?.fileName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {renderPreview()}
        </DialogContent>
      </Dialog>

      {/* Request Change Dialog */}
      <RequestChangeDialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        mode="document_update"
        data={userData}
      />
    </Box>
  )
}

export default DocumentsSection
