"use client"

import React, { useState } from "react"
import { Box, Grid, Typography, Button, Card, CardContent, IconButton, Tooltip, Divider, Alert } from "@mui/material"
import { CloudUpload, InsertDriveFile, Delete, Visibility, Info, AddCircleOutline } from "@mui/icons-material"
import type { PartnerFormData } from "../index"

interface UploadDocumentsProps {
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
}

interface DocumentCardProps {
  title: string
  description: string
  file: File | null
  onUpload: (file: File) => void
  onDelete: () => void
  accept?: string
  required?: boolean
}

// File validation constants
const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_PDF_TYPE = 'application/pdf'
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPE]

// File validation functions
const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE
}

const validateFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeError = (file: File): string => {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
  const isPdf = file.type === ALLOWED_PDF_TYPE
  
  if (!isImage && !isPdf) {
    return 'Please upload only image files (JPEG, JPG, PNG) or PDF files'
  }
  return ''
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  description,
  file,
  onUpload,
  onDelete,
  accept = "image/*,.pdf",
  required = false,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      // Clear previous error
      setError("")
      
      // Validate file type
      if (!validateFileType(selectedFile)) {
        setError(getFileTypeError(selectedFile))
        return
      }
      
      // Validate file size
      if (!validateFileSize(selectedFile)) {
        setError(`File size must be less than 4MB. Current size: ${formatFileSize(selectedFile.size)}`)
        return
      }
      
      onUpload(selectedFile)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
            {required && (
              <Typography component="span" color="error.main">
                *
              </Typography>
            )}
          </Typography>
          {!required && (
            <Tooltip title="Optional document">
              <Info fontSize="small" color="action" />
            </Tooltip>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>

        <Box sx={{ mb: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            📁 File Requirements:
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            • Formats: {accept === "image/*" ? "Images only (JPEG, JPG, PNG)" : "Images (JPEG, JPG, PNG) or PDF"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            • Maximum size: 4MB per file
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            • Ensure document is clear and readable
          </Typography>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept={accept}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: "0.875rem" }}>
            {error}
          </Alert>
        )}

        {!file ? (
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={handleButtonClick}
            fullWidth
            sx={{
              py: 1.5,
              borderStyle: "dashed",
              borderWidth: 2,
              borderRadius: 2,
            }}
          >
            Upload File
          </Button>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <InsertDriveFile color="primary" sx={{ mr: 1 }} />
              <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                <Typography variant="body2" noWrap>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(file.size)}
                </Typography>
              </Box>
              <Box>
                <Tooltip title="View">
                  <IconButton size="small" onClick={() => window.open(URL.createObjectURL(file))}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={onDelete} color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

const UploadDocuments: React.FC<UploadDocumentsProps> = ({ formData, updateFormData }) => {
  const [otherDocuments, setOtherDocuments] = useState<File[]>(formData.otherDocuments || [])
  const [otherDocError, setOtherDocError] = useState<string>("")

  const handleFileUpload = (fieldName: keyof PartnerFormData, file: File) => {
    updateFormData({ [fieldName]: file })
  }

  const handleFileDelete = (fieldName: keyof PartnerFormData) => {
    updateFormData({ [fieldName]: null })
  }

  const handleAddOtherDocument = (file: File) => {
    // Clear previous error
    setOtherDocError("")
    
    // Validate file type
    if (!validateFileType(file)) {
      setOtherDocError(getFileTypeError(file))
      return
    }
    
    // Validate file size
    if (!validateFileSize(file)) {
      setOtherDocError(`File size must be less than 4MB. Current size: ${formatFileSize(file.size)}`)
      return
    }

    const newDocs = [...otherDocuments, file]
    setOtherDocuments(newDocs)
    updateFormData({ otherDocuments: newDocs })
  }

  const handleDeleteOtherDocument = (index: number) => {
    const newDocs = otherDocuments.filter((_, i) => i !== index)
    setOtherDocuments(newDocs)
    updateFormData({ otherDocuments: newDocs })
    setOtherDocError("") // Clear error when deleting
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Upload Required Documents
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Profile Photo"
            description="Upload a clear, recent photo of yourself for identification purposes"
            file={formData.profilePhoto}
            onUpload={(file) => handleFileUpload("profilePhoto", file)}
            onDelete={() => handleFileDelete("profilePhoto")}
            accept="image/*"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="PAN Card"
            description="Upload a clear scan or photo of your PAN card (mandatory for tax purposes)"
            file={formData.panCard}
            onUpload={(file) => handleFileUpload("panCard", file)}
            onDelete={() => handleFileDelete("panCard")}
            accept="image/*,.pdf"
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Aadhar Card (Front)"
            description="Upload the front side of your Aadhar card showing your photo and details"
            file={formData.aadharFront}
            onUpload={(file) => handleFileUpload("aadharFront", file)}
            onDelete={() => handleFileDelete("aadharFront")}
            accept="image/*,.pdf"
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Aadhar Card (Back)"
            description="Upload the back side of your Aadhar card showing the address details"
            file={formData.aadharBack}
            onUpload={(file) => handleFileUpload("aadharBack", file)}
            onDelete={() => handleFileDelete("aadharBack")}
            accept="image/*,.pdf"
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Cancelled Cheque"
            description="Upload a cancelled cheque or bank passbook front page for account verification"
            file={formData.cancelledCheque}
            onUpload={(file) => handleFileUpload("cancelledCheque", file)}
            onDelete={() => handleFileDelete("cancelledCheque")}
            accept="image/*,.pdf"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="GST Certificate"
            description="Upload your GST registration certificate (required only if you have GST registration)"
            file={formData.gstCertificate}
            onUpload={(file) => handleFileUpload("gstCertificate", file)}
            onDelete={() => handleFileDelete("gstCertificate")}
            accept="image/*,.pdf"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Additional Documents */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Additional Documents (Optional)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Upload any other relevant supporting documents if required
        </Typography>
        <Box sx={{ p: 1.5, bgcolor: "grey.50", borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            📁 File Requirements:
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            • Formats: Images (JPEG, PNG, GIF, WebP) or PDF files
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            • Maximum size: 4MB per file
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            • Examples: Business license, partnership deed, certificates, etc.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {otherDocuments.map((doc, index) => (
          <Grid item xs={12} key={index}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <InsertDriveFile color="primary" sx={{ mr: 1 }} />
              <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                <Typography variant="body2" noWrap>
                  {doc.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(doc.size)}
                </Typography>
              </Box>
              <Box>
                <Tooltip title="View">
                  <IconButton size="small" onClick={() => window.open(URL.createObjectURL(doc))}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => handleDeleteOtherDocument(index)} color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12}>
          {otherDocError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {otherDocError}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 3,
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <input
              type="file"
              id="other-document-upload"
              style={{ display: "none" }}
              accept="image/*,.pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAddOtherDocument(e.target.files[0])
                  e.target.value = ""
                }
              }}
            />
            <label htmlFor="other-document-upload">
              <Button component="span" startIcon={<AddCircleOutline />} variant="outlined">
                Add Document
              </Button>
            </label>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UploadDocuments