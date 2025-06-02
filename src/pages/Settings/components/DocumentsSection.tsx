"use client"

import React, { useState, useRef } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
} from "@mui/material"
import UploadFileIcon from '@mui/icons-material/UploadFile'
import VisibilityIcon from '@mui/icons-material/Visibility'

interface DocumentsSectionProps {
  /** Mapping of document type to uploaded file URL */
  documents?: Record<string, string>
  /** Callback when a document is uploaded */
  onUpload?: (type: string, file: File) => void
}

const documentTypes = [
  "Profile Photo",
  "PAN Card",
  "Aadhar Card (Front)",
  "Aadhar Card (Back)",
  "Cancelled Cheque",
  "GST Certificate",
  "Additional Documents",
]

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents = {}, onUpload }) => {
  const theme = useTheme()
  const [docs, setDocs] = useState<Record<string, string>>(documents)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [previewType, setPreviewType] = useState<string>("")
  const inputRefs = useRef<Record<string, HTMLInputElement>>({})

  const selectFile = (type: string) => {
    inputRefs.current[type]?.click()
  }

  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setDocs(prev => ({ ...prev, [type]: url }))
      onUpload?.(type, file)
    }
  }

  const openPreview = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase() || ''
    setPreviewUrl(url)
    setPreviewType(ext)
    setPreviewOpen(true)
  }

  const renderPreview = () => {
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(previewType)) {
      return <Box component="img" src={previewUrl} alt="Preview" sx={{ width: '100%', borderRadius: 2 }} />
    }
    if (previewType === 'pdf') {
      return <object data={previewUrl} type="application/pdf" width="100%" height="300px">PDF preview not available</object>
    }
    if (['doc', 'docx'].includes(previewType)) {
      return <object data={previewUrl} type="application/msword" width="100%" height="300px">Preview not available</object>
    }
    return <Typography>No preview available</Typography>
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Documents
      </Typography>

      <Grid container spacing={2}>
        {documentTypes.map(type => {
          const url = docs[type]
          const hasFile = Boolean(url)
          return (
            <Grid item xs={12} sm={6} md={4} key={type}>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                ref={el => { if (el) inputRefs.current[type] = el }}
                onChange={e => handleFileChange(type, e)}
              />

              <Card
                sx={{
                  border: `2px dashed ${hasFile ? theme.palette.success.main : theme.palette.primary.main}`,
                  borderRadius: '16px',
                  backgroundColor: 'transparent',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardActionArea
                  onClick={() => selectFile(type)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    minHeight: 100,
                  }}
                >
                  {hasFile && (
                    <IconButton
                      onClick={e => { e.stopPropagation(); openPreview(url) }}
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8, color: theme.palette.text.primary }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  )}

                  <UploadFileIcon
                    sx={{
                      fontSize: 32,
                      color: hasFile ? theme.palette.success.main : theme.palette.primary.main,
                      mb: 0.5,
                    }}
                  />

                  <Typography variant="subtitle2" fontWeight={500}>
                    {type}
                  </Typography>

                  <Chip
                    label={hasFile ? 'File Available' : 'Upload'}
                    color={hasFile ? 'success' : 'primary'}
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      borderRadius: '12px',
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" disabled>
          Submit
        </Button>
      </Box>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Preview</DialogTitle>
        <DialogContent dividers>
          {renderPreview()}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default DocumentsSection
