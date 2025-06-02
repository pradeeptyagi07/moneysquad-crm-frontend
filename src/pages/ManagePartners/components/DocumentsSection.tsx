"use client"

import type React from "react"
import { Box, Typography, Paper, Grid, Button, Chip } from "@mui/material"
import { InsertDriveFile, CloudDownload, Visibility } from "@mui/icons-material"

interface DocumentsSectionProps {
  partner: Partner
  onViewDocument: (title: string, url: string) => void
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ partner, onViewDocument }) => {
  const docs = partner.documents || {}

  const allDocuments = Object.entries(docs).flatMap(([key, value]: [string, any], index) => {
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
      return [{
        title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        fileName: value.split('/').pop() || key + ".file",
        uploadDate: "N/A",
        status: "Verified",
        required: false,
        url: value,
      }]
    }
    return []
  })

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
                    onClick={() => onViewDocument(doc.title, doc.url)}
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
    </Box>
  )
}

export default DocumentsSection
