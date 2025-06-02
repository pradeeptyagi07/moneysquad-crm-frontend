"use client"

import React, { useState } from "react"
import { Box, Grid, Typography, Button, Card, CardContent, IconButton, Tooltip, Divider } from "@mui/material"
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
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

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept={accept}
        />

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
                  {(file.size / 1024).toFixed(1)} KB
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

  const handleFileUpload = (fieldName: keyof PartnerFormData, file: File) => {
    updateFormData({ [fieldName]: file })
  }

  const handleFileDelete = (fieldName: keyof PartnerFormData) => {
    updateFormData({ [fieldName]: null })
  }

  const handleAddOtherDocument = (file: File) => {
    const newDocs = [...otherDocuments, file]
    setOtherDocuments(newDocs)
    updateFormData({ otherDocuments: newDocs })
  }

  const handleDeleteOtherDocument = (index: number) => {
    const newDocs = otherDocuments.filter((_, i) => i !== index)
    setOtherDocuments(newDocs)
    updateFormData({ otherDocuments: newDocs })
  }

  return (
    <Box>
      {/* Header with new mandatory-note */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Upload Required Documents
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "error.main",
            fontWeight: 600,
            textAlign: "right",
            maxWidth: 600,
          }}
        >
          ⚠️ This step is <strong>mandatory</strong>. Please upload your <em>PAN Card</em> and both sides of your <em>Aadhar Card</em> to become eligible for partner commissions.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Profile Photo"
            description="Upload a clear, recent photo of yourself"
            file={formData.profilePhoto}
            onUpload={(file) => handleFileUpload("profilePhoto", file)}
            onDelete={() => handleFileDelete("profilePhoto")}
            accept="image/*"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="PAN Card"
            description="Upload a clear scan or photo of your PAN card"
            file={formData.panCard}
            onUpload={(file) => handleFileUpload("panCard", file)}
            onDelete={() => handleFileDelete("panCard")}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Aadhar Card (Front)"
            description="Upload a clear scan or photo of the front side of your Aadhar card"
            file={formData.aadharFront}
            onUpload={(file) => handleFileUpload("aadharFront", file)}
            onDelete={() => handleFileDelete("aadharFront")}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Aadhar Card (Back)"
            description="Upload a clear scan or photo of the back side of your Aadhar card"
            file={formData.aadharBack}
            onUpload={(file) => handleFileUpload("aadharBack", file)}
            onDelete={() => handleFileDelete("aadharBack")}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Cancelled Cheque"
            description="Upload a scan or photo of a cancelled cheque for bank verification"
            file={formData.cancelledCheque}
            onUpload={(file) => handleFileUpload("cancelledCheque", file)}
            onDelete={() => handleFileDelete("cancelledCheque")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DocumentCard
            title="GST Certificate"
            description="Upload your GST certificate if applicable"
            file={formData.gstCertificate}
            onUpload={(file) => handleFileUpload("gstCertificate", file)}
            onDelete={() => handleFileDelete("gstCertificate")}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Additional Documents */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Additional Documents
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload any other relevant documents if required
        </Typography>
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
                  {(doc.size / 1024).toFixed(1)} KB
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
