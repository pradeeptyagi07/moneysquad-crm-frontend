"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Divider,
  Grid,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonIcon from "@mui/icons-material/Person"
import BusinessIcon from "@mui/icons-material/Business"
import DescriptionIcon from "@mui/icons-material/Description"

interface DocumentsData {
  [category: string]: {
    color: string
    subcategories: {
      [subcategory: string]: string[]
    }
  }
}

interface EditDocumentsDialogProps {
  open: boolean
  onClose: () => void
  documents: DocumentsData
  onSave: (documents: DocumentsData) => void
  loading?: boolean
}

const getIconForCategory = (category: string) => {
  if (category.includes("PL")) return <PersonIcon />
  if (category.includes("BL")) return <BusinessIcon />
  if (category.includes("SEP")) return <DescriptionIcon />
  return <DescriptionIcon />
}

const EditDocumentsDialog: React.FC<EditDocumentsDialogProps> = ({
  open,
  onClose,
  documents,
  onSave,
  loading = false,
}) => {
  const [tempDocuments, setTempDocuments] = useState<DocumentsData>(documents)

  useEffect(() => {
    setTempDocuments(documents)
  }, [documents])

  const handleDocumentChange = (category: string, subcategory: string, docIndex: number, value: string) => {
    setTempDocuments((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        subcategories: {
          ...prev[category].subcategories,
          [subcategory]: prev[category].subcategories[subcategory].map((doc, index) =>
            index === docIndex ? value : doc,
          ),
        },
      },
    }))
  }

  const handleAddDocument = (category: string, subcategory: string) => {
    setTempDocuments((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        subcategories: {
          ...prev[category].subcategories,
          [subcategory]: [...prev[category].subcategories[subcategory], ""],
        },
      },
    }))
  }

  const handleDeleteDocument = (category: string, subcategory: string, docIndex: number) => {
    setTempDocuments((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        subcategories: {
          ...prev[category].subcategories,
          [subcategory]: prev[category].subcategories[subcategory].filter((_, index) => index !== docIndex),
        },
      },
    }))
  }

  const handleSave = () => {
    onSave(tempDocuments)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit Documents
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        {Object.entries(tempDocuments).map(([category, data], categoryIndex) => (
          <Accordion
            key={categoryIndex}
            defaultExpanded
            sx={{
              mb: 2,
              "&:before": { display: "none" },
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              borderRadius: "8px !important",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                "&.Mui-expanded": {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    color: data.color,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {getIconForCategory(category)}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {category}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {Object.entries(data.subcategories).map(([subcategory, docs], subcatIndex) => (
                  <Grid item xs={12} md={6} key={subcatIndex}>
                    <Box
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        p: 2,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: data.color }}>
                          {subcategory}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handleAddDocument(category, subcategory)}
                          sx={{ minWidth: "auto", p: 0.5 }}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {docs.map((doc, docIndex) => (
                        <Box
                          key={docIndex}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            value={doc}
                            onChange={(e) => handleDocumentChange(category, subcategory, docIndex, e.target.value)}
                            sx={{ mr: 1 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteDocument(category, subcategory, docIndex)}
                            sx={{ color: "#d32f2f" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDocumentsDialog
