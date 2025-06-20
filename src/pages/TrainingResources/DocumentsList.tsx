"use client"

import { useState } from "react"
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

const initialDocuments = {
  "PL - Term Loan/Overdraft": {
    icon: <PersonIcon />,
    color: "#1976d2",
    subcategories: {
      "Personal Loan": [
        "PAN, Aadhar, Photo (Applicant KYC)*",
        "Latest 3 Payslips",
        "Salary A/C Bank Statement (Last 3 Months)*",
        "Latest Form-16 (optional)",
      ],
    },
  },
  "BL - Term Loan/Overdraft": {
    icon: <BusinessIcon />,
    color: "#388e3c",
    subcategories: {
      Proprietorship: [
        "PAN, Aadhar, Photo (Proprietor KYC)*",
        "GST Certificate, Udyam Certificate*",
        "Bank Statement (Last 6 Months)*",
        "Latest E Bill (Proof of Ownership)",
        "GSTR3Bs - last 12 months",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
        "Tax Audit Report - last 2 years",
      ],
      Partnership: [
        "PAN, Aadhar, Photo (2 Partners' KYC)*",
        "Firm PAN Card*",
        "Partnership Deed*",
        "GST Certificate, Udyam Certificate*",
        "Bank Statement (Last 6 Months)*",
        "Latest E Bill (Proof of Ownership)",
        "GSTR3Bs - last 12 months",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
        "Tax Audit Report - last 2 years",
      ],
      LLP: [
        "PAN, Aadhar, Photo (2 Partners' KYC)*",
        "Firm PAN Card*",
        "Certification of Incorporation*",
        "Partnership Deed*",
        "GST Certificate, Udyam Certificate*",
        "Bank Statement (Last 6 Months)*",
        "Latest E Bill (Proof of Ownership)",
        "GSTR3Bs - last 12 months",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
        "Tax Audit Report - last 2 years",
      ],
      "Private Limited / Limited": [
        "PAN, Aadhar, Photo (2 Directors' KYC)*",
        "Company PAN Card*",
        "Certification of Incorporation*",
        "MOA, AOA*",
        "List of Directors & Shareholders*",
        "GST Certificate, Udyam Certificate*",
        "Bank Statement (Last 6 Months)*",
        "Latest E Bill (Proof of Ownership)",
        "GSTR3Bs - last 12 months",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
        "Independent, Tax Audit Report - last 2 years",
      ],
    },
  },
  "SEP - Term Loan/Overdraft": {
    icon: <DescriptionIcon />,
    color: "#f57c00",
    subcategories: {
      Doctor: [
        "PAN, Aadhar, Photo (Applicant KYC)*",
        "Doctor Degree Certificate*",
        "Medical Council Certificate*",
        "Hospital/Clinic Address Proof",
        "Bank Statement (Last 6 Months)*",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
      ],
      CA: [
        "PAN, Aadhar, Photo (Applicant KYC)*",
        "Certificate of Practice*",
        "Certificate of Membership*",
        "Office Address Proof",
        "Bank Statement (Last 6 Months)*",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
      ],
      CS: [
        "PAN, Aadhar, Photo (Applicant KYC)*",
        "Certificate of Practice*",
        "Professional Qualification Certificate*",
        "Office Address Proof",
        "Bank Statement (Last 6 Months)*",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
      ],
      Architect: [
        "PAN, Aadhar, Photo (Applicant KYC)*",
        "Architect Degree Certificate*",
        "Council of Architecture (CoA) license*",
        "Office Address Proof",
        "Bank Statement (Last 6 Months)*",
        "ITR, Computation - last 2 years",
        "Complete Financials with P&L - last 2 years",
      ],
    },
  },
}

const DocumentsList = () => {
  const [open, setOpen] = useState(false)
  const [documents, setDocuments] = useState(initialDocuments)

  const handleSave = (updatedDocuments: typeof initialDocuments) => {
    setDocuments(updatedDocuments)
    setOpen(false)
  }

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
            <IconButton
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: "#f5f5f5",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
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
                    {data.icon}
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

      <EditDocumentsDialog open={open} onClose={() => setOpen(false)} documents={documents} onSave={handleSave} />
    </>
  )
}

export default DocumentsList
