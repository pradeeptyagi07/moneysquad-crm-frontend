"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material"
import { InsertDriveFile, CloudDownload, Visibility, Close } from "@mui/icons-material"

interface DocumentsSectionProps {
  partner: Partner
}

interface Partner {
  documents?: {
    [key: string]: any
  }
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ partner }) => {
  const [viewDocumentOpen, setViewDocumentOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; url: string } | null>(null)

  const docs = partner.documents || {}

  // Filter out _id and only process actual document fields
  const allDocuments = Object.entries(docs)
    .filter(([key]) => key !== "_id") // Exclude _id field
    .flatMap(([key, value]: [string, any]) => {
      if (key === "otherDocuments" && Array.isArray(value)) {
        return value.map((doc: any, i: number) => ({
          title: `Additional Document ${i + 1}`,
          fileName: doc.name || `additional_doc_${i + 1}`,
          uploadDate: "N/A",
          status: "Verified",
          required: false,
          url: doc.url || URL.createObjectURL(doc),
        }))
      } else if (typeof value === "string" && value) {
        return [
          {
            title: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            fileName: value.split("/").pop() || key + ".file",
            uploadDate: "N/A",
            status: "Verified",
            required: false,
            url: value,
          },
        ]
      }
      return []
    })

  const handleViewDocument = (title: string, url: string) => {
    setSelectedDocument({ title, url })
    setViewDocumentOpen(true)
  }

  const handleCloseViewDocument = () => {
    setViewDocumentOpen(false)
    setSelectedDocument(null)
  }

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url)
  }

  const isPDFFile = (url: string) => {
    return /\.pdf$/i.test(url)
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Partner Documents
      </Typography>

      <Grid container spacing={3}>
        {allDocuments.map((doc, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {doc.title}
                </Typography>
                <Chip
                  label={doc.required ? "Required" : "Optional"}
                  size="small"
                  color={doc.required ? "primary" : "default"}
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  mb: 2,
                }}
              >
                <InsertDriveFile color="primary" sx={{ mr: 1 }} />
                <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                  <Typography variant="body2" noWrap>
                    {doc.fileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded on {doc.uploadDate}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Chip
                  label={doc.status}
                  size="small"
                  color={doc.status === "Verified" ? "success" : "warning"}
                  sx={{ fontWeight: 600 }}
                />
                <Box>
                  <Button
                    startIcon={<Visibility />}
                    size="small"
                    onClick={() => handleViewDocument(doc.title, doc.url)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button startIcon={<CloudDownload />} size="small">
                    Download
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* View Document Dialog - Inline */}
      <Dialog
        open={viewDocumentOpen}
        onClose={handleCloseViewDocument}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" component="div">
            {selectedDocument?.title || "Document Viewer"}
          </Typography>
          <IconButton
            onClick={handleCloseViewDocument}
            sx={{
              color: "grey.500",
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {selectedDocument && (
            <Box
              sx={{ width: "100%", height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {isImageFile(selectedDocument.url) ? (
                <img
                  src={selectedDocument.url || "/placeholder.svg"}
                  alt={selectedDocument.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              ) : isPDFFile(selectedDocument.url) ? (
                <iframe
                  src={selectedDocument.url}
                  title={selectedDocument.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "text.secondary",
                  }}
                >
                  <InsertDriveFile sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Document Preview Not Available
                  </Typography>
                  <Typography variant="body2" align="center">
                    This document type cannot be previewed in the browser.
                    <br />
                    Please download the file to view it.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<CloudDownload />}
                    sx={{ mt: 2 }}
                    onClick={() => window.open(selectedDocument.url, "_blank")}
                  >
                    Download Document
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default DocumentsSection
