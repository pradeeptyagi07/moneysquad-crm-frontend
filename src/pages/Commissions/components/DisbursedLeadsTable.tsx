"use client"

import React, { useState } from "react"
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
} from "@mui/material"
import { MoreVert, WarningAmberRounded, HourglassEmpty, Group, InsertDriveFile } from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import LeadDetailsDialog from "../../Leads/components/LeadDetailsDialog"
import PayoutDetailsDialog from "./PayoutDetailsDialog"
import UpdatePayoutDialog from "./UpdatePayoutDetailsDialog"
import FiltersBar from "./FilterBar"

const mockLeads = [
  {
    leadId: "LD1001",
    partnerName: "Ravi Kumar",
    partnerId: "PR001",
    applicantName: "Amit Sharma",
    businessName: "Sharma Traders",
    lenderName: "HDFC Bank",
    loanType: "PL-Term Loan",
    disbursedAmount: 500000,
    commission: 2.5,
    remarks: "High profile lead",
    topupScheme: false,
    grossPayout: 12500,
    netPayout: 12000,
    payoutStatus: "Paid",
  },
  {
    leadId: "LD1002",
    partnerName: "Neha Gupta",
    partnerId: "PR002",
    applicantName: "Sunil Verma",
    businessName: "Verma Enterprises",
    lenderName: "ICICI Bank",
    loanType: "PL-Overdraft",
    disbursedAmount: 300000,
    commission: 3.0,
    remarks: "",
    topupScheme: true,
    grossPayout: 9000,
    netPayout: 8500,
    payoutStatus: "Pending",
  },
  {
    leadId: "LD1003",
    partnerName: "Anil Mehta",
    partnerId: "PR003",
    applicantName: "Karan Singh",
    businessName: "Singh Solutions",
    lenderName: "Axis Bank",
    loanType: "BL-Working Capital",
    disbursedAmount: 750000,
    commission: 2.0,
    remarks: "Quick approval",
    topupScheme: false,
    grossPayout: 15000,
    netPayout: 14000,
    payoutStatus: "Paid",
  },
  {
    leadId: "LD1004",
    partnerName: "Priya Desai",
    partnerId: "PR004",
    applicantName: "Mohit Jain",
    businessName: "Jain Automobiles",
    lenderName: "Kotak Mahindra",
    loanType: "PL-Term Loan",
    disbursedAmount: 1000000,
    commission: 2.2,
    remarks: "",
    topupScheme: false,
    grossPayout: 22000,
    netPayout: 21000,
    payoutStatus: "Pending",
  },
  {
    leadId: "LD1005",
    partnerName: "Rajesh Patel",
    partnerId: "PR005",
    applicantName: "Deepak Joshi",
    businessName: "Joshi Stores",
    lenderName: "Bajaj Finance",
    loanType: "BL-Term Loan",
    disbursedAmount: 200000,
    commission: 1.8,
    remarks: "Repeat client",
    topupScheme: false,
    grossPayout: 3600,
    netPayout: 3400,
    payoutStatus: "Paid",
  },
]

const DisbursedLeadsTable: React.FC = () => {
  const { userRole } = useAuth()
  const isAdmin = userRole === "admin"

  const [rows] = useState(mockLeads)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [dialogType, setDialogType] = useState<"lead" | "payout" | "update" | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

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

  if (rows.length === 0) {
    return (
      <Box component={Paper} elevation={2} p={4} borderRadius={2} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
        {isAdmin ? (
          <>
            <Group color="disabled" sx={{ fontSize: 48 }} />
            <Typography variant="h6">No disbursed leads yet</Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Disbursed leads will appear here once partners successfully disburse leads. Keep monitoring or check the leads progress under All Leads.
            </Typography>
          </>
        ) : (
          <>
            <HourglassEmpty color="warning" sx={{ fontSize: 48 }} />
            <Typography variant="h6" color="text.primary" fontWeight={600}>Commissions will display here soon</Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Once your account is verified and leads reach the disbursed status, your payout details will be visible here. Verification typically takes 24 hours but may vary.
              To fast-track, kindly upload all KYC documents in the profile section.
            </Typography>
          </>
        )}
      </Box>
    )
  }

  return (
    <Box component={Paper} elevation={2} p={3} borderRadius={2}>
      {/* Filters */}
      <FiltersBar />

      {/* Table */}
      <TableContainer sx={{ mt: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Lead ID</TableCell>
              <TableCell>Partner (Name, ID)</TableCell>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.leadId} hover>
                <TableCell>{row.leadId}</TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{row.partnerName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.partnerId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{row.applicantName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.businessName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{row.lenderName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.loanType}
                  </Typography>
                </TableCell>
                <TableCell>₹{row.disbursedAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography>{row.commission}%</Typography>
                    {(row.remarks || row.topupScheme) && (
                      <Tooltip title={row.remarks || "Top-up Scheme"}>
                        <WarningAmberRounded fontSize="small" color="warning" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>₹{row.grossPayout.toLocaleString()}</TableCell>
                <TableCell>₹{row.netPayout.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={row.payoutStatus}
                    color={row.payoutStatus === "Paid" ? "success" : "warning"}
                    size="small"
                  />
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
      />

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleDialogOpen("lead")}>View Lead Details</MenuItem>
        <MenuItem onClick={() => handleDialogOpen("payout")}>View Payout Details</MenuItem>
        {isAdmin && <MenuItem onClick={() => handleDialogOpen("update")}>Update Payout</MenuItem>}
      </Menu>

      {/* Dialogs */}
      {dialogType === "lead" && selectedLead && (
        <LeadDetailsDialog
          leadId={selectedLead.leadId}
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
