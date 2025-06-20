"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  TablePagination,
  CircularProgress,
  Alert,
} from "@mui/material"
import { MoreVert, WarningAmberRounded, HourglassEmpty, Group, InfoOutlined, AccessTime } from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { fetchDisbursedLeads } from "../../../store/slices/commissionSlice"
import LeadDetailsDialog from "../../Leads/components/LeadDetailsDialog"
import LeadTimelineDialog from "../../Leads/components/LeadTimelineDialog"
import PayoutDetailsDialog from "./PayoutDetailsDialog"
import UpdatePayoutDialog from "./UpdatePayoutDetailsDialog"
import UniversalFilterBar from "./UniversalFilterBar"
import { useAppSelector } from "../../../hooks/useAppSelector"

// Filter types defined locally
interface DisbursedLeadsFilters {
  month?: number
  year?: number
  lender?: string
  payoutStatus?: string
  partner?: string
  associate?: string
}

const DisbursedLeadsTable: React.FC = () => {
  const { userRole } = useAuth()
  const dispatch = useAppDispatch()
  const { disbursedLeads, disbursedLeadsLoading, error } = useAppSelector((state) => state.commission)
  const isPartner = userRole === "partner"
  const isAdmin = userRole === "admin"

  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [dialogType, setDialogType] = useState<"lead" | "payout" | "update" | "timeline" | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filters, setFilters] = useState<DisbursedLeadsFilters>({})

  // Fetch disbursed leads on component mount
  useEffect(() => {
    dispatch(fetchDisbursedLeads())
  }, [dispatch])

  const handleFiltersChange = (newFilters: DisbursedLeadsFilters) => {
    console.log("🔄 DisbursedLeads filters received:", newFilters)
    setFilters(newFilters)
    setPage(0) // Reset to first page when filters change
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, lead: any) => {
    setSelectedLead(lead)
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDialogOpen = (type: typeof dialogType) => {
    setDialogType(type)
    handleMenuClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPayoutStatusDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Filter the disbursed leads based on current filters
  const filteredLeads = disbursedLeads.filter((lead) => {
    // Filter by payout status
    if (filters.payoutStatus && lead.payoutStatus !== filters.payoutStatus) return false

    // Filter by lender (exact match)
    if (filters.lender && lead.lender.name !== filters.lender) return false

    // Filter by partner (for admin)
    if (filters.partner) {
      const partnerString = `${lead.partner.name} (${lead.partner.partnerId})`
      if (partnerString !== filters.partner) return false
    }

    // Filter by associate (for partner)
    if (filters.associate) {
      const associateString = `${lead.associate.name} (${lead.associate.associateDisplayId})`
      if (associateString !== filters.associate) return false
    }

    // Filter by month/year (if needed for client-side filtering)
    if (filters.month && filters.year) {
      const leadDate = new Date(lead.createdAt)
      if (leadDate.getMonth() + 1 !== filters.month || leadDate.getFullYear() !== filters.year) return false
    }

    return true
  })

  if (disbursedLeadsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (filteredLeads.length === 0 && disbursedLeads.length === 0) {
    return (
      <Box component={Paper} elevation={2} p={3} borderRadius={2}>
        <UniversalFilterBar filterType="disbursed-leads" onFiltersChange={handleFiltersChange} userRole={userRole} />

        <Box
          component={Paper}
          elevation={1}
          p={4}
          borderRadius={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          mt={2}
        >
          {!isPartner ? (
            <>
              <Group color="disabled" sx={{ fontSize: 48 }} />
              <Typography variant="h6">No disbursed leads yet</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Disbursed leads will appear here once partners successfully disburse leads. Keep monitoring or check the
                leads progress under All Leads.
              </Typography>
            </>
          ) : (
            <>
              <HourglassEmpty color="warning" sx={{ fontSize: 48 }} />
              <Typography variant="h6" color="text.primary" fontWeight={600}>
                Commissions will display here soon
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Once your account is verified and leads reach the disbursed status, your payout details will be visible
                here. Verification typically takes 24 hours but may vary. To fast-track, kindly upload all KYC documents
                in the profile section.
              </Typography>
            </>
          )}
        </Box>
      </Box>
    )
  }

  if (filteredLeads.length === 0 && disbursedLeads.length > 0) {
    return (
      <Box component={Paper} elevation={2} p={3} borderRadius={2}>
        <UniversalFilterBar filterType="disbursed-leads" onFiltersChange={handleFiltersChange} userRole={userRole} />

        <Box
          component={Paper}
          elevation={1}
          p={4}
          borderRadius={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          mt={2}
        >
          <Group color="disabled" sx={{ fontSize: 48 }} />
          <Typography variant="h6">No results found</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            No disbursed leads match your current filters. Try adjusting the filters to see more results.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box component={Paper} elevation={2} p={3} borderRadius={2}>
      {/* Filters */}
      <UniversalFilterBar filterType="disbursed-leads" onFiltersChange={handleFiltersChange} userRole={userRole} />

      {/* Table */}
      <TableContainer sx={{ mt: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>Lead ID</TableCell>
              {!isPartner && <TableCell>Partner (Name, ID)</TableCell>}
              {isPartner && <TableCell>Associate (Name, ID)</TableCell>}
              <TableCell>Applicant (Name, Business)</TableCell>
              <TableCell>Lender (Name, Loan Type)</TableCell>
              <TableCell>Disbursal Amount</TableCell>
              <TableCell>Commission %</TableCell>
              <TableCell>Gross Payout</TableCell>
              <TableCell>Net Payout</TableCell>
              <TableCell>Payout Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(row.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{row.leadId}</Typography>
                </TableCell>
                {!isPartner && (
                  <TableCell>
                    <Typography fontWeight={500}>{row.partner.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.partner.partnerId}
                    </Typography>
                  </TableCell>
                )}
                {isPartner && (
                  <TableCell>
                    <Typography fontWeight={500}>{row.associate.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.associate.associateDisplayId}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Typography fontWeight={500}>{row.applicant.name}</Typography>
                  {row.applicant.business && (
                    <Typography variant="caption" color="text.secondary">
                      {row.applicant.business}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{row.lender.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.lender.loanType}
                  </Typography>
                </TableCell>
                <TableCell>₹{row.disbursedAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography>{row.commission}%</Typography>
                    {isAdmin && row.isTopupLoan && (
                      <Tooltip title="Top-up Loan">
                        <InfoOutlined fontSize="small" color="info" />
                      </Tooltip>
                    )}
                    {isAdmin && row.warning && (
                      <Tooltip title="Warning">
                        <WarningAmberRounded fontSize="small" color="warning" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>₹{row.grossPayout.toLocaleString()}</TableCell>
                <TableCell>₹{row.netPayout.toLocaleString()}</TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Chip
                      label={row.payoutStatus}
                      color={row.payoutStatus === "paid" ? "success" : "warning"}
                      size="small"
                    />
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AccessTime fontSize="small" color="disabled" />
                      <Typography variant="caption" color="text.secondary">
                        {formatPayoutStatusDate(row.payoutStatusUpdatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLeads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number.parseInt(e.target.value, 10))
          setPage(0)
        }}
      />

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleDialogOpen("lead")}>View Lead Details</MenuItem>
        <MenuItem onClick={() => handleDialogOpen("timeline")}>View Timeline</MenuItem>
        <MenuItem onClick={() => handleDialogOpen("payout")}>View Payout Details</MenuItem>
        {!isPartner && <MenuItem onClick={() => handleDialogOpen("update")}>Update Payout</MenuItem>}
      </Menu>

      {/* Dialogs */}
      {dialogType === "lead" && selectedLead && (
        <LeadDetailsDialog
          leadId={selectedLead.lead_Id}
          open
          onClose={() => {
            setDialogType(null)
            setSelectedLead(null)
          }}
        />
      )}
      {dialogType === "timeline" && selectedLead && (
        <LeadTimelineDialog
          lead={{ leadId: selectedLead.leadId }}
          open
          onClose={() => {
            setDialogType(null)
            setSelectedLead(null)
          }}
        />
      )}
      {dialogType === "payout" && selectedLead && (
        <PayoutDetailsDialog
          lead={selectedLead}
          open
          onClose={() => {
            setDialogType(null)
            setSelectedLead(null)
          }}
        />
      )}
      {dialogType === "update" && selectedLead && (
        <UpdatePayoutDialog
          lead={selectedLead}
          open
          onClose={() => {
            setDialogType(null)
            setSelectedLead(null)
          }}
        />
      )}
    </Box>
  )
}

export default DisbursedLeadsTable
