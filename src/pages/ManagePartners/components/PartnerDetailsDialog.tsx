"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Avatar,
  Chip,
} from "@mui/material"
import {
  Close,
  Download,
  FileDownload,
  TableChart,
  Person,
  Email,
  Phone,
  CheckCircle,
  Block,
  VerifiedUser,
  Work,
  Description,
  LocationOn,
} from "@mui/icons-material"
import BasicInfoSection from "./BasicInfoSection"
import PersonalDetailsSection from "./PersonalDetailsSection"
import AddressDetailsSection from "./AddressDetailsSection"
import BankDetailsSection from "./BankDetailsSection"
import DocumentsSection from "./DocumentsSection"
// import { exportSinglePartnerToCSV, exportSinglePartnerToExcel } from "../utils/exportUtils"

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

interface PartnerDetailsDialogProps {
  open: boolean
  onClose: () => void
  partner: any
}

const PartnerDetailsDialog: React.FC<PartnerDetailsDialogProps> = ({ open, onClose, partner }) => {
  const [tabValue, setTabValue] = useState(0)
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(null)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleDownloadMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadMenuAnchor(event.currentTarget)
  }

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null)
  }

  // const handleDownloadCSV = () => {
  //   if (partner) {
  //     exportSinglePartnerToCSV(partner, `partner_${partner.partnerId}_details`)
  //   }
  //   handleDownloadMenuClose()
  // }

  // const handleDownloadExcel = () => {
  //   if (partner) {
  //     exportSinglePartnerToExcel(partner, `partner_${partner.partnerId}_details`)
  //   }
  //   handleDownloadMenuClose()
  // }

  if (!partner) return null

  const tierDisplay = {
    gold: {
      label: "Gold Plan",
      color: "#FFD700",
      bg: "#FFF8DC",
      icon: "🥇",
    },
    diamond: {
      label: "Diamond Plan",
      color: "#00BFFF",
      bg: "#E0FFFF",
      icon: "💎",
    },
    platinum: {
      label: "Platinum Plan",
      color: "#E5E4E2",
      bg: "#F8F8FF",
      icon: "🏆",
    },
    na: {
      label: "Not Available",
      color: "#B0BEC5",
      bg: "#ECEFF1",
      icon: "❔",
    },
  }

  const commissionPlanKey = partner?.commissionPlan?.toLowerCase() || "n/a"
  const commissionPlan = tierDisplay[commissionPlanKey as keyof typeof tierDisplay]

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Partner Details
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadMenuOpen}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Export Data
              </Button>
              <IconButton onClick={onClose} edge="end">
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        {/* <Menu
          anchorEl={downloadMenuAnchor}
          open={Boolean(downloadMenuAnchor)}
          onClose={handleDownloadMenuClose}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 180 },
          }}
        >
          <MenuItem onClick={handleDownloadCSV}>
            <ListItemIcon>
              <FileDownload fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Download as CSV" />
          </MenuItem>
          <MenuItem onClick={handleDownloadExcel}>
            <ListItemIcon>
              <TableChart fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Download as Excel" />
          </MenuItem>
        </Menu> */}

        <DialogContent dividers>
          {partner && (
            <>
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
                        src={partner.documents?.profilePhoto}
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 700, mr: 1 }}>
                            {partner.basicInfo?.fullName}
                          </Typography>
                          <Chip
                            size="small"
                            label={partner.partnerId}
                            sx={{
                              fontWeight: 600,
                              bgcolor: "primary.lighter",
                              color: "primary.dark",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Email fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {partner.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Phone fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {partner.mobile}
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <VerifiedUser fontSize="small" sx={{ color: "success.main", mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Verified Partner
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Joined on{" "}
                          {new Date(partner.createdAt).toLocaleDateString("en-IN", {
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
                          {partner.basicInfo?.registeringAs}
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
                          {partner.personalInfo?.roleSelection === "leadSharing" ? "Lead Sharing" : "File Sharing"}
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
                          {partner.addressDetails?.city}
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
                          backgroundColor: commissionPlan?.bg,
                          color: commissionPlan?.color,
                          mr: 2,
                          fontSize: 22,
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {commissionPlan?.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Commission Plan
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: commissionPlan?.color }}>
                          {commissionPlan?.label}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

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
                </Tabs>
              </Box>

              <Box>
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
                  <DocumentsSection partner={partner} />
                </TabPanel>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PartnerDetailsDialog
