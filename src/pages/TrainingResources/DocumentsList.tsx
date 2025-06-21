"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../store"
import {
  fetchProductInfo,
  updateProductDocuments,
  selectProductInfo,
  selectProductInfoLoading,
  selectProductInfoUpdateLoading,
  selectProductInfoUpdateSuccess,
  clearProductInfoUpdateSuccess,
} from "../../store/slices/resourceAndSupportSlice"
import { selectUserData, isAdminUser } from "../../store/slices/userDataSlice"
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import DescriptionIcon from "@mui/icons-material/Description"
import BusinessIcon from "@mui/icons-material/Business"
import PersonIcon from "@mui/icons-material/Person"
import EditDocumentsDialog from "./EditDocumentsDialog"

const getIconForCategory = (category: string) => {
  if (category.includes("PL")) return <PersonIcon />
  if (category.includes("BL")) return <BusinessIcon />
  if (category.includes("SEP")) return <DescriptionIcon />
  return <DescriptionIcon />
}

const DocumentsList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const productInfo = useSelector(selectProductInfo)
  const loading = useSelector(selectProductInfoLoading)
  const updateLoading = useSelector(selectProductInfoUpdateLoading)
  const updateSuccess = useSelector(selectProductInfoUpdateSuccess)
  const userData = useSelector(selectUserData)
  const isAdmin = isAdminUser(userData)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!productInfo) {
      dispatch(fetchProductInfo())
    }
  }, [dispatch, productInfo])

  useEffect(() => {
    if (updateSuccess) {
      setOpen(false)
      dispatch(clearProductInfoUpdateSuccess())
    }
  }, [updateSuccess, dispatch])

  const handleSave = (updatedDocuments: typeof documents) => {
    dispatch(updateProductDocuments(updatedDocuments))
  }

  if (loading) {
    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography>Loading...</Typography>
        </CardContent>
      </Card>
    )
  }

  const documents = productInfo?.documents || {}

  const renderDocumentItem = (doc: string, index: number) => {
    const isMandatory = doc.includes("*")
    return (
      <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: isMandatory ? "#d32f2f" : "#757575",
            mr: 1,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: isMandatory ? "#d32f2f" : "#424242",
            fontWeight: isMandatory ? 500 : 400,
          }}
        >
          {doc}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Documents Required
            </Typography>
            {isAdmin && (
              <IconButton
                onClick={() => setOpen(true)}
                sx={{
                  backgroundColor: "#f5f5f5",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {Object.entries(documents).map(([category, data], categoryIndex) => (
            <Accordion
              key={categoryIndex}
              sx={{
                mb: 2,
                "&:before": { display: "none" },
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                borderRadius: "8px !important",
                "&.Mui-expanded": {
                  margin: "0 0 16px 0",
                },
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
              <AccordionDetails sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {Object.entries(data.subcategories).map(([subcat, docs], subcatIndex) => (
                    <Grid item xs={12} md={6} key={subcatIndex}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          borderRadius: 2,
                          border: "1px solid #e8e8e8",
                          "&:hover": {
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Chip
                              label={subcat}
                              size="small"
                              sx={{
                                backgroundColor: `${data.color}15`,
                                color: data.color,
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            />
                          </Box>
                          <Divider sx={{ mb: 2 }} />
                          <Box>{docs.map((doc, docIndex) => renderDocumentItem(doc, docIndex))}</Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              border: "1px solid #e9ecef",
            }}
          >
            <Typography variant="caption" sx={{ color: "#6c757d" }}>
              <Box component="span" sx={{ color: "#d32f2f", mr: 0.5 }}>
                •
              </Box>
              Documents marked with * are mandatory
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {isAdmin && (
        <EditDocumentsDialog
          open={open}
          onClose={() => setOpen(false)}
          documents={documents}
          onSave={handleSave}
          loading={updateLoading}
        />
      )}
    </>
  )
}

export default DocumentsList
