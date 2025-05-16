"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Divider,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import {
  ArrowBack,
  Edit,
  Person,
  Phone,
  Email,
  LocationOn,
  Work,
  Description,
  CheckCircle,
  Block,
  VerifiedUser,
  InsertDriveFile,
  Visibility,
  Save,
} from "@mui/icons-material"
import { mockPartners } from "./data/mockPartners"
import { mockLeads } from "../../data/mockLeads"
import BasicInfoSection from "./components/BasicInfoSection"
import PersonalDetailsSection from "./components/PersonalDetailsSection"
import AddressDetailsSection from "./components/AddressDetailsSection"
import BankDetailsSection from "./components/BankDetailsSection"
import DocumentsSection from "./components/DocumentsSection"
import type { Partner } from "./types/partnerTypes"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`partner-detail-tabpanel-${index}`}
      aria-labelledby={`partner-detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `partner-detail-tab-${index}`,
    "aria-controls": `partner-detail-tabpanel-${index}`,
  }
}

const PartnerDetails: React.FC = () => {
  const { partnerId } = useParams<{ partnerId: string }>()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [partner, setPartner] = useState<Partner | null>(null)
  const [partnerLeads, setPartnerLeads] = useState<any[]>([])
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; url: string } | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedPartner, setEditedPartner] = useState<Partial<Partner>>({})

  useEffect(() => {
    // Find partner by ID
    const foundPartner = mockPartners.find((p) => p.partnerId === partnerId)
    if (foundPartner) {
      // Calculate active status
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const hasRecentLeads = mockLeads.some(
        (lead) => lead.createdBy === foundPartner.fullName && new Date(lead.createdAt) >= thirtyDaysAgo,
      )

      setPartner({
        ...foundPartner,
        status: hasRecentLeads ? "active" : "inactive",
      })

      // Get partner leads
      const leads = mockLeads.filter((lead) => lead.createdBy === foundPartner.fullName)
      setPartnerLeads(leads)
    }
  }, [partnerId])

  useEffect(() => {
    // Check if edit=true is in the URL query parameters
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get("edit") === "true" && partner) {
      // Open edit dialog automatically if edit=true is in URL
      setEditedPartner({
        fullName: partner.fullName,
        email: partner.email,
        mobileNumber: partner.mobileNumber,
        gender: partner.gender,
        employmentType: partner.employmentType,
        focusProduct: partner.focusProduct,
        role: partner.role,
      })
      setEditDialogOpen(true)
    }
  }, [partner])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleBack = () => {
    navigate("/admin/manage-partners")
  }

  const handleViewDocument = (title: string, url: string) => {
    setSelectedDocument({ title, url })
    setShowDocumentDialog(true)
  }

  const handleCloseDocumentDialog = () => {
    setShowDocumentDialog(false)
    setSelectedDocument(null)
  }

  const handleEditPartner = () => {
    if (partner) {
      setEditedPartner({
        fullName: partner.fullName,
        email: partner.email,
        mobileNumber: partner.mobileNumber,
        gender: partner.gender,
        employmentType: partner.employmentType,
        focusProduct: partner.focusProduct,
        role: partner.role,
      })
      setEditDialogOpen(true)
    }
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    setEditedPartner({})
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setEditedPartner((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleEditSubmit = () => {
    // In a real app, this would update the partner data in the backend
    console.log("Updated partner data:", editedPartner)

    // Update local state for demo purposes
    if (partner) {
      setPartner({
        ...partner,
        ...editedPartner,
      })
    }

    handleEditDialogClose()
  }

  if (!partner) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6">Partner not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Partners
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Partner Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleEditPartner}
          sx={{
            borderRadius: 2,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
            },
          }}
        >
          Edit Partner
        </Button>
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={partner.profilePhoto}
                sx={{
                  width: 80,
                  height: 80,
                  mr: 3,
                  bgcolor: "primary.main",
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mr: 1 }}>
                    {partner.fullName}
                  </Typography>
                  <Chip
                    size="small"
                    label={partner.partnerId}
                    sx={{ fontWeight: 600, bgcolor: "primary.lighter", color: "primary.dark" }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Email fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {partner.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Phone fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {partner.mobileNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", md: "flex-end" },
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Chip
                  icon={partner.status === "active" ? <CheckCircle /> : <Block />}
                  label={partner.status === "active" ? "Active" : "Inactive"}
                  color={partner.status === "active" ? "success" : "default"}
                  sx={{ fontWeight: 600, mb: 1 }}
                />
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <VerifiedUser fontSize="small" sx={{ color: "success.main", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Verified Partner
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Joined on{" "}
                  {new Date(partner.joinedOn).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "primary.lighter",
                  color: "primary.dark",
                  mr: 2,
                }}
              >
                <Work />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Registration Type
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {partner.registrationType}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "secondary.lighter",
                  color: "secondary.dark",
                  mr: 2,
                }}
              >
                <Description />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Partner Role
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {partner.role === "leadSharing" ? "Lead Sharing" : "File Sharing"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "success.lighter",
                  color: "success.dark",
                  mr: 2,
                }}
              >
                <LocationOn />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {partner.city}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "info.lighter",
                  color: "info.dark",
                  mr: 2,
                }}
              >
                <InsertDriveFile />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Leads
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {partnerLeads.length}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="partner details tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                px: 4,
              },
            }}
          >
            <Tab label="Profile Details" {...a11yProps(0)} />
            <Tab label="Documents" {...a11yProps(1)} />
            <Tab label="Leads" {...a11yProps(2)} />
            <Tab label="Commission History" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <BasicInfoSection partner={partner} />
              </Grid>
              <Grid item xs={12} md={6}>
                <PersonalDetailsSection partner={partner} />
              </Grid>
              <Grid item xs={12} md={6}>
                <AddressDetailsSection partner={partner} />
              </Grid>
              <Grid item xs={12} md={6}>
                <BankDetailsSection partner={partner} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DocumentsSection partner={partner} onViewDocument={handleViewDocument} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h5" color="text.primary" gutterBottom>
                Total Leads: {partnerLeads.length}
              </Typography>

              {partnerLeads.length > 0 ? (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Lead Summary
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2, maxWidth: 800, mx: "auto" }}>
                    {/* Pending Leads */}
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                        <Typography variant="h6" color="warning.main">
                          {partnerLeads.filter((lead) => lead.status === "pending").length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Approved Leads */}
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                        <Typography variant="h6" color="success.main">
                          {partnerLeads.filter((lead) => lead.status === "approved").length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Approved
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Rejected Leads */}
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                        <Typography variant="h6" color="error.main">
                          {partnerLeads.filter((lead) => lead.status === "rejected").length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rejected
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Disbursed Leads */}
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                        <Typography variant="h6" color="primary.main">
                          {partnerLeads.filter((lead) => lead.status === "disbursed").length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Disbursed
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
                    For detailed lead information, please visit the Leads section.
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  This partner has not created any leads yet.
                </Typography>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                No commission history available
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Commission transactions will appear here
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      </Paper>

      {/* Document Viewer Dialog */}
      <Dialog open={showDocumentDialog} onClose={handleCloseDocumentDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{selectedDocument?.title}</Typography>
            <IconButton onClick={handleCloseDocumentDialog}>
              <Visibility />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%", height: "500px", overflow: "auto" }}>
            {/* In a real app, this would display the actual document */}
            <img src="/document-preview.png" alt="Document Preview" style={{ width: "100%", height: "auto" }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocumentDialog}>Close</Button>
          <Button variant="contained" color="primary">
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Edit sx={{ mr: 1 }} />
            Edit Partner Details
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="fullName"
                value={editedPartner.fullName || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={editedPartner.email || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={editedPartner.mobileNumber || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={editedPartner.gender || ""}
                  label="Gender"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Employment Type</InputLabel>
                <Select
                  name="employmentType"
                  value={editedPartner.employmentType || ""}
                  label="Employment Type"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="salaried">Salaried</MenuItem>
                  <MenuItem value="self-employed">Self-Employed</MenuItem>
                  <MenuItem value="business">Business Owner</MenuItem>
                  <MenuItem value="freelancer">Freelancer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Focus Product</InputLabel>
                <Select
                  name="focusProduct"
                  value={editedPartner.focusProduct || ""}
                  label="Focus Product"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="personal-loan">Personal Loan</MenuItem>
                  <MenuItem value="home-loan">Home Loan</MenuItem>
                  <MenuItem value="business-loan">Business Loan</MenuItem>
                  <MenuItem value="credit-card">Credit Card</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Partner Role</InputLabel>
                <Select
                  name="role"
                  value={editedPartner.role || ""}
                  label="Partner Role"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="leadSharing">Lead Sharing</MenuItem>
                  <MenuItem value="fileSharing">File Sharing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary" startIcon={<Save />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PartnerDetails
