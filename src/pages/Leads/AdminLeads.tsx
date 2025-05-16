"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
} from "@mui/material"
import {
  Add,
  Person,
  Business,
  MoreVert,
  Visibility,
  Assignment,
  Edit,
  History,
  Delete,
  Search,
  FilterAlt,
  Clear,
} from "@mui/icons-material"
import { useAuth } from "../../hooks/useAuth"
import type { Lead, LeadStatus } from "../../data/leadTypes"
import { mockLeads } from "../../data/mockLeads"
import { formatCurrency, getStatusColor, getStatusIcon } from "./utils/leadUtils"

// Import components
import LeadDetailsDialog from "./components/LeadDetailsDialog"
import LeadTimelineDialog from "./components/LeadTimelineDialog"
import StatusUpdateDialog from "./components/StatusUpdateDialog"
import AssignLeadDialog from "./components/AssignLeadDialog"
import LeadForm from "./components/LeadForm"

const AdminLeads: React.FC = () => {
  const theme = useTheme()
  const { userName } = useAuth()

  // State for leads data
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])

  // State for pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // State for selected lead and dialogs
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // State for action menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuLead, setMenuLead] = useState<Lead | null>(null)

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  // State for filters
  const [statusFilter, setStatusFilter] = useState("all")
  const [loanTypeFilter, setLoanTypeFilter] = useState("all")
  const [partnerFilter, setPartnerFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Load mock data
  useEffect(() => {
    setLeads(mockLeads)
    setFilteredLeads(mockLeads)

    // Initialize filters from URL params if needed
    // This is optional but useful for bookmarking filtered views
    const params = new URLSearchParams(window.location.search)
    const statusParam = params.get("status")
    const loanTypeParam = params.get("loanType")
    const searchParam = params.get("search")

    if (statusParam) setStatusFilter(statusParam)
    if (loanTypeParam) setLoanTypeFilter(loanTypeParam)
    if (searchParam) setSearchTerm(searchParam)
  }, [])

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Action menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lead: Lead) => {
    setAnchorEl(event.currentTarget)
    setMenuLead(lead)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuLead(null)
  }

  // Dialog handlers
  const handleOpenDetailsDialog = (lead: Lead) => {
    setSelectedLead(lead)
    setDetailsDialogOpen(true)
    handleMenuClose()
  }

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true)
  }

  const handleOpenAssignDialog = (lead: Lead) => {
    setSelectedLead(lead)
    setAssignDialogOpen(true)
    handleMenuClose()
  }

  const handleOpenStatusDialog = (lead: Lead) => {
    setSelectedLead(lead)
    setStatusDialogOpen(true)
    handleMenuClose()
  }

  const handleOpenTimelineDialog = (lead: Lead) => {
    setSelectedLead(lead)
    setTimelineDialogOpen(true)
    handleMenuClose()
  }

  const handleOpenEditDialog = (lead: Lead) => {
    setSelectedLead(lead)
    setEditDialogOpen(true)
    handleMenuClose()
  }

  // Lead actions
  const handleCreateLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: `LEAD${Math.floor(Math.random() * 10000)}`,
      applicantName: leadData.applicantName || "",
      applicantProfile: leadData.applicantProfile || "Salaried",
      businessName: leadData.businessName || "",
      mobileNumber: leadData.mobileNumber || "",
      email: leadData.email || "",
      pincode: leadData.pincode || "",
      loanType: leadData.loanType || "",
      loanAmount: leadData.loanAmount || 0,
      status: "pending",
      createdBy: "Admin User",
      createdAt: new Date().toISOString(),
      assignedTo: "",
      assignedToId: "",
      lender: "",
      comments: leadData.comments || "",
      timeline: [
        {
          status: "created",
          timestamp: new Date().toISOString(),
          comment: "Lead created by admin",
          updatedBy: userName,
        },
      ],
    }

    setLeads([newLead, ...leads])
    setCreateDialogOpen(false)
    setSnackbar({
      open: true,
      message: "Lead created successfully",
      severity: "success",
    })
  }

  const handleEditLead = (leadData: Partial<Lead>) => {
    if (!selectedLead) return

    const updatedLeads = leads.map((lead) => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          ...leadData,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...lead.timeline,
            {
              status: "updated",
              timestamp: new Date().toISOString(),
              comment: "Lead details updated",
              updatedBy: userName,
            },
          ],
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    setFilteredLeads(
      filteredLeads.map((lead) => {
        if (lead.id === selectedLead.id) {
          return updatedLeads.find((l) => l.id === selectedLead.id) || lead
        }
        return lead
      }),
    )
    setEditDialogOpen(false)
    setSnackbar({
      open: true,
      message: "Lead updated successfully",
      severity: "success",
    })
  }

  const handleAssignLead = (leadId: string, managerId: string, managerName: string) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        return {
          ...lead,
          assignedTo: managerName,
          assignedToId: managerId,
          status: lead.status === "pending" ? "login" : lead.status,
          timeline: [
            ...lead.timeline,
            {
              status: "assigned",
              timestamp: new Date().toISOString(),
              comment: `Assigned to ${managerName}`,
              updatedBy: userName,
            },
          ],
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    setAssignDialogOpen(false)
    setSnackbar({
      open: true,
      message: "Lead assigned successfully",
      severity: "success",
    })
  }

  const handleUpdateStatus = (leadId: string, newStatus: LeadStatus, comment: string) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...lead.timeline,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              comment: comment,
              updatedBy: userName,
            },
          ],
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    setStatusDialogOpen(false)
    setSnackbar({
      open: true,
      message: `Lead status updated to ${newStatus}`,
      severity: "success",
    })
  }

  const handleDeleteLead = (leadId: string) => {
    const updatedLeads = leads.filter((lead) => lead.id !== leadId)
    setLeads(updatedLeads)
    handleMenuClose()
    setSnackbar({
      open: true,
      message: "Lead deleted successfully",
      severity: "success",
    })
  }

  // Filter functions
  const applyFilters = () => {
    let filtered = [...leads]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    // Apply loan type filter
    if (loanTypeFilter !== "all") {
      filtered = filtered.filter((lead) => lead.loanType === loanTypeFilter)
    }

    // Apply partner filter
    if (partnerFilter !== "all") {
      filtered = filtered.filter((lead) => lead.createdBy === partnerFilter)
    }

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.id.toLowerCase().includes(searchLower) ||
          lead.applicantName.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.mobileNumber.includes(searchTerm),
      )
    }

    setFilteredLeads(filtered)
    setPage(0) // Reset to first page when filtering
  }

  const resetFilters = () => {
    setStatusFilter("all")
    setLoanTypeFilter("all")
    setPartnerFilter("all")
    setSearchTerm("")
    setFilteredLeads(leads)
  }

  // Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Calculate statistics
  const getTotalLeads = () => leads.length
  const getPendingLeads = () => leads.filter((lead) => lead.status === "pending").length
  const getApprovedLeads = () => leads.filter((lead) => lead.status === "approved").length
  const getDisbursedLeads = () => leads.filter((lead) => lead.status === "disbursed").length

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Lead Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
          sx={{
            borderRadius: 2,
            boxShadow: `0 4px 14px 0 ${theme.palette.primary.main}30`,
          }}
        >
          Create New Lead
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
                theme.palette.primary.main,
                0.05,
              )} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Leads
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  <Person />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                {getTotalLeads()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From all partners
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(
                theme.palette.warning.main,
                0.05,
              )} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Pending
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getStatusIcon("pending")}
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                {getPendingLeads()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Awaiting assignment
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(
                theme.palette.success.main,
                0.05,
              )} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Approved
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getStatusIcon("approved")}
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                {getApprovedLeads()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ready for disbursal
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(
                theme.palette.info.main,
                0.05,
              )} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Disbursed
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getStatusIcon("disbursed")}
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                {getDisbursedLeads()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successfully completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filter Leads
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="disbursed">Disbursed</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Loan Type"
              value={loanTypeFilter}
              onChange={(e) => setLoanTypeFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Loan Types</MenuItem>
              <MenuItem value="Personal Loan">Personal Loan</MenuItem>
              <MenuItem value="Business Loan">Business Loan</MenuItem>
              <MenuItem value="Home Loan">Home Loan</MenuItem>
              <MenuItem value="Car Loan">Car Loan</MenuItem>
              <MenuItem value="Education Loan">Education Loan</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Partner"
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Partners</MenuItem>
              {Array.from(new Set(leads.map((lead) => lead.createdBy))).map((partner) => (
                <MenuItem key={partner} value={partner}>
                  {partner}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Name, Email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="outlined" size="small" startIcon={<FilterAlt />} onClick={applyFilters} sx={{ mr: 1 }}>
            Apply Filters
          </Button>
          <Button variant="text" size="small" startIcon={<Clear />} onClick={resetFilters}>
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Leads Table */}
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2, mb: 4 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="leads table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Lead ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Applicant</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Loan Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Partner</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Manager</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead) => (
                <TableRow
                  key={lead.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  onClick={() => handleOpenDetailsDialog(lead)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {lead.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mr: 1.5,
                        }}
                      >
                        {lead.applicantProfile === "Business" ? (
                          <Business fontSize="small" />
                        ) : (
                          <Person fontSize="small" />
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {lead.applicantName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          {lead.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.loanType}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {formatCurrency(lead.loanAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.createdBy}</Typography>
                  </TableCell>
                  <TableCell>
                    {lead.assignedTo ? (
                      <Typography variant="body2">{lead.assignedTo}</Typography>
                    ) : (
                      <Chip
                        label="Unassigned"
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(lead.status)}
                      label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(lead.status, theme), 0.1),
                        color: getStatusColor(lead.status, theme),
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          color: getStatusColor(lead.status, theme),
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(lead.createdAt).toLocaleDateString()}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {new Date(lead.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMenuOpen(e, lead)
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No leads found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredLeads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200, borderRadius: 2, boxShadow: theme.shadows[3] },
        }}
      >
        <MenuItem onClick={() => menuLead && handleOpenDetailsDialog(menuLead)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuLead && handleOpenEditDialog(menuLead)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Lead</ListItemText>
        </MenuItem>
        {menuLead && !menuLead.assignedTo && (
          <MenuItem onClick={() => menuLead && handleOpenAssignDialog(menuLead)}>
            <ListItemIcon>
              <Assignment fontSize="small" />
            </ListItemIcon>
            <ListItemText>Assign Lead</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => menuLead && handleOpenStatusDialog(menuLead)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update Status</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuLead && handleOpenTimelineDialog(menuLead)}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Timeline</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuLead && handleDeleteLead(menuLead.id)} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Lead</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      {selectedLead && (
        <>
          <LeadDetailsDialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} lead={selectedLead} />
          <AssignLeadDialog
            open={assignDialogOpen}
            onClose={() => setAssignDialogOpen(false)}
            lead={selectedLead}
            onAssign={handleAssignLead}
          />
          <StatusUpdateDialog
            open={statusDialogOpen}
            onClose={() => setStatusDialogOpen(false)}
            lead={selectedLead}
            onUpdateStatus={handleUpdateStatus}
          />
          <LeadTimelineDialog
            open={timelineDialogOpen}
            onClose={() => setTimelineDialogOpen(false)}
            lead={selectedLead}
          />
        </>
      )}

      {/* Create Lead Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h6">Create New Lead</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <LeadForm onSubmit={handleCreateLead} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h6">Edit Lead</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLead && (
            <LeadForm
              onSubmit={handleEditLead}
              onCancel={() => setEditDialogOpen(false)}
              initialData={selectedLead}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminLeads
