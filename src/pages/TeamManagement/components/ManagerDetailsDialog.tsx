"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Paper,
  Divider,
  Chip,
  Button,
} from "@mui/material"
import { Close, Email, Phone, LocationOn, Work, CalendarToday, Edit as EditIcon } from "@mui/icons-material"
import type { TeamMember } from "../types/teamTypes"

interface ManagerDetailsDialogProps {
  open: boolean
  onClose: () => void
  manager: TeamMember | null
  onEdit: (manager: TeamMember) => void
}

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
      id={`manager-tabpanel-${index}`}
      aria-labelledby={`manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const ManagerDetailsDialog: React.FC<ManagerDetailsDialogProps> = ({ open, onClose, manager, onEdit }) => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleEdit = () => {
    if (manager) {
      onEdit(manager)
    }
  }

  if (!manager) return null

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Manager Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, bgcolor: "grey.50" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar src={manager.profileImage} alt={manager.name} sx={{ width: 120, height: 120, mb: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {manager.name}
                </Typography>
                <Chip
                  label={manager.status === "active" ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    backgroundColor: manager.status === "active" ? "success.lighter" : "grey.200",
                    color: manager.status === "active" ? "success.dark" : "text.secondary",
                    fontWeight: 600,
                    mb: 1,
                  }}
                />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID: {manager.id}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Role
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Work sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="body1">{manager.role}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Email
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Email sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="body1">{manager.email}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Phone
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="body1">{manager.mobile}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Location
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="body1">{manager.location}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Joined Date
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <CalendarToday sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="body1">{formatDate(manager.joinedDate)}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="manager details tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                px: 3,
              },
            }}
          >
            <Tab label="Performance" />
            <Tab label="Assigned Leads" />
            <Tab label="Activity" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "primary.lighter",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Assigned Leads
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {manager.assignedLeads || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "success.lighter",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Completed Leads
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {manager.completedLeads || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "info.lighter",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {manager.conversionRate?.toFixed(1) || 0}%
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Performance Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detailed performance metrics and charts will be displayed here. This section can include monthly
                  performance trends, comparison with team averages, and other relevant KPIs.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            <Typography variant="body1">
              Assigned leads will be displayed here. This section can include a table of leads assigned to this manager,
              their status, and other relevant information.
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3 }}>
            <Typography variant="body1">
              Activity log will be displayed here. This section can include a timeline of the manager's activities, such
              as lead assignments, status updates, and other relevant events.
            </Typography>
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  )
}

export default ManagerDetailsDialog
