"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Menu,
  Tooltip,
  TablePagination,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material"
import { Search, Add, Person, MoreVert, Visibility, Edit, Delete, Timeline } from "@mui/icons-material"
import { useAuth } from "../../hooks/useAuth"
import type { Lead } from "../../data/leadTypes"
import { mockLeads } from "../../data/mockLeads"
import { getStatusIcon, getStatusColor, formatCurrency } from "./utils/leadUtils"
import LeadDetailsDialog from "./components/LeadDetailsDialog"
import LeadForm from "./components/LeadForm"
import LeadTimelineDialog from "./components/LeadTimelineDialog"
import { createLead } from "../../store/slices/leadSLice"
import { useAppDispatch } from "../../hooks/useAppDispatch"

const PartnerLeads = () => {
  const dispatch = useAppDispatch()

  const theme = useTheme()
  const { userName } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [loanTypeFilter, setLoanTypeFilter] = useState<string>("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Dialogs
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false)

  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Action menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuLead, setMenuLead] = useState<Lead | null>(null)

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  // Load mock data - filter for created by current partner
  useEffect(() => {
    // In a real app, we would filter by the actual partner ID
    // For now, we'll just filter for leads created by "Jane Partner"
    const partnerLeads = mockLeads.filter((lead) => lead.createdBy === "Jane Partner")
    setLeads(partnerLeads)
    setFilteredLeads(partnerLeads)
  }, [])

  // Apply filters
  useEffect(() => {
    let result = leads

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (lead) =>
          lead.applicantName.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          lead.mobileNumber.includes(term) ||
          lead.id.toLowerCase().includes(term),
      )
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((lead) => lead.status === statusFilter)
    }

    // Loan type filter
    if (loanTypeFilter) {
      result = result.filter((lead) => lead.loanType === loanTypeFilter)
    }

    setFilteredLeads(result)
    setPage(0)
  }, [leads, searchTerm, statusFilter, loanTypeFilter])

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // Handle filter changes
  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value)
  }

  const handleLoanTypeFilterChange = (event: any) => {
    setLoanTypeFilter(event.target.value)
  }

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

  const handleOpenEditDialog = (lead: Lead) => {
    // Check if lead is already assigned
    if (lead.assignedTo) {
      setSnackbar({
        open: true,
        message: "You cannot edit a lead that has been assigned to a manager",
        severity: "warning",
      })
      handleMenuClose()
      return
    }

    setSelectedLead(lead)
    setEditDialogOpen(true)
    handleMenuClose()
  }

  const handleOpenTimelineDialog = (lead: Lead) => {
    setSelectedLead(lead)
    setTimelineDialogOpen(true)
    handleMenuClose()
  }

  // Lead actions
  const handleCreateLead = async (leadData: Partial<Lead>) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const partnerId = user?.id
  
    if (!partnerId) {
      console.error("Partner ID missing from localStorage user")
      setSnackbar({
        open: true,
        message: "Unable to determine partner identity",
        severity: "error",
      })
      return
    }
  
    const payload = {
      partnerId,
      leadData: {
        applicant: {
          name: leadData.applicantName || "",
          profile: leadData.applicantProfile || "Salaried",
          mobile: leadData.mobileNumber || "",
          email: leadData.email || "",
          pincode: leadData.pincode || "",
        },
        loan: {
          type: leadData.loanType || "",
          amount: String(leadData.loanAmount || "0"),
          comments: leadData.comments || "",
        },
      },
    }
  
    try {
      const result = await dispatch(createLead(payload)).unwrap()
  
      setSnackbar({
        open: true,
        message: "Lead created successfully",
        severity: "success",
      })
  
      setCreateDialogOpen(false)
  
      // Optionally update local state if needed
      // setLeads([result, ...leads])
    } catch (err) {
      console.error("Lead creation failed:", err)
      setSnackbar({
        open: true,
        message: `Error: ${err}`,
        severity: "error",
      })
    }
  }
  

  const handleEditLead = (leadData: Partial<Lead>) => {
    // Double-check that the lead is not assigned (security measure)
    if (selectedLead?.assignedTo) {
      setSnackbar({
        open: true,
        message: "You cannot edit a lead that has been assigned to a manager",
        severity: "error",
      })
      setEditDialogOpen(false)
      return
    }

    const updatedLeads = leads.map((lead) => {
      if (lead.id === selectedLead?.id) {
        const updatedLead = {
          ...lead,
          ...leadData,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...lead.timeline,
            {
              status: "updated",
              timestamp: new Date().toISOString(),
              comment: "Lead information updated",
              updatedBy: userName,
            },
          ],
        }
        return updatedLead
      }
      return lead
    })

    setLeads(updatedLeads)
    setEditDialogOpen(false)
    setSnackbar({
      open: true,
      message: "Lead updated successfully",
      severity: "success",
    })
  }

  const handleDeleteLead = (leadId: string) => {
    // Only allow deletion if status is pending and not assigned
    const lead = leads.find((l) => l.id === leadId)
    if (lead && lead.status !== "pending") {
      setSnackbar({
        open: true,
        message: "Only pending leads can be deleted",
        severity: "error",
      })
      return
    }

    if (lead && lead.assignedTo) {
      setSnackbar({
        open: true,
        message: "You cannot delete a lead that has been assigned to a manager",
        severity: "error",
      })
      return
    }

    const updatedLeads = leads.filter((lead) => lead.id !== leadId)
    setLeads(updatedLeads)
    handleMenuClose()
    setSnackbar({
      open: true,
      message: "Lead deleted successfully",
      severity: "success",
    })
  }

  // Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Get unique values for filters
  const getUniqueLoanTypes = () => {
    const loanTypes = new Set(leads.map((lead) => lead.loanType))
    return Array.from(loanTypes)
  }

  // Calculate statistics
  const getTotalLeads = () => leads.length
  const getPendingLeads = () => leads.filter((lead) => lead.status === "pending").length
  const getApprovedLeads = () => leads.filter((lead) => lead.status === "approved").length
  const getDisbursedLeads = () => leads.filter((lead) => lead.status === "disbursed").length

  // Check if a lead is editable by partner
  const isLeadEditable = (lead: Lead) => {
    return !lead.assignedTo // Lead is editable if not assigned to a manager
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Leads
      </Typography>

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
                Created by you
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

      {/* Search and Filters */}
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name, email, phone or ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} label="Status" onChange={handleStatusFilterChange}>
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="login">Login</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                      <MenuItem value="disbursed">Disbursed</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                      <MenuItem value="expired">Expired</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Loan Type</InputLabel>
                    <Select value={loanTypeFilter} label="Loan Type" onChange={handleLoanTypeFilterChange}>
                      <MenuItem value="">All Types</MenuItem>
                      {getUniqueLoanTypes().map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenCreateDialog}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                Create New Lead
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4, boxShadow: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell>Lead ID</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Loan Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead) => (
              <TableRow key={lead.id} hover>
                <TableCell>{lead.id}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {lead.applicantName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lead.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{lead.loanType}</TableCell>
                <TableCell>{formatCurrency(lead.loanAmount)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    icon={getStatusIcon(lead.status)}
                    label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    sx={{
                      bgcolor: `${getStatusColor(lead.status, theme)}15`,
                      color: getStatusColor(lead.status, theme),
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {lead.assignedTo ? (
                    <Tooltip title="Assigned to manager">
                      <Chip size="small" label={lead.assignedTo} color="primary" variant="outlined" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Not yet assigned">
                      <Chip size="small" label="Unassigned" variant="outlined" />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, lead)}
                    aria-label="lead actions"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No leads found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLeads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => menuLead && handleOpenDetailsDialog(menuLead)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem
          onClick={() => menuLead && handleOpenEditDialog(menuLead)}
          disabled={menuLead && !isLeadEditable(menuLead)}
          sx={{
            color: menuLead && !isLeadEditable(menuLead) ? "text.disabled" : "inherit",
            "&.Mui-disabled": {
              opacity: 0.6,
            },
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          {menuLead && !isLeadEditable(menuLead) ? "Cannot Edit (Assigned)" : "Edit Lead"}
        </MenuItem>
        <MenuItem onClick={() => menuLead && handleOpenTimelineDialog(menuLead)}>
          <Timeline fontSize="small" sx={{ mr: 1 }} /> View Timeline
        </MenuItem>
        <MenuItem
          onClick={() => menuLead && handleDeleteLead(menuLead.id)}
          disabled={menuLead && (menuLead.status !== "pending" || Boolean(menuLead.assignedTo))}
          sx={{
            color: "error.main",
            "&.Mui-disabled": {
              opacity: 0.6,
              color: "text.disabled",
            },
          }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Lead
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      {selectedLead && (
        <LeadDetailsDialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} lead={selectedLead} />
      )}

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <LeadForm onSubmit={handleCreateLead} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {selectedLead && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogContent>
            <LeadForm
              onSubmit={handleEditLead}
              onCancel={() => setEditDialogOpen(false)}
              initialData={selectedLead}
              isEdit={true}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedLead && (
        <LeadTimelineDialog
          open={timelineDialogOpen}
          onClose={() => setTimelineDialogOpen(false)}
          lead={selectedLead}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PartnerLeads
