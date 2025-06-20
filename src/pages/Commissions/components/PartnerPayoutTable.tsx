"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  Select,
  InputLabel,
  Button,
  Grid,
  CircularProgress,
  Alert,
  TableSortLabel,
  Snackbar,
  Backdrop,
} from "@mui/material"
import { MoreVert } from "@mui/icons-material"
import UniversalFilterBar from "./UniversalFilterBar"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { fetchPartnerSummary, updatePartnerPayoutInfo } from "../../../store/slices/commissionSlice"
import { useAppSelector } from "../../../hooks/useAppSelector"

const PartnerPayoutTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const { partnerSummary, partnerSummaryLoading, partnerPayoutUpdating, error } = useAppSelector(
    (state) => state.commission,
  )

  // UI States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [sortBy, setSortBy] = useState<"asc" | "desc" | null>(null)

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")

  // Filter States
  const [currentApiParams, setCurrentApiParams] = useState<{ month: number; year: number } | null>(null)
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
  const [gstApplicableFilter, setGstApplicableFilter] = useState<boolean | null>(null)
  const [gstStatusFilter, setGstStatusFilter] = useState<string>("all")

  // Get current month and year
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  // Initial API call on component mount
  useEffect(() => {
    console.log("🚀 Initial API call on mount")
    dispatch(fetchPartnerSummary({ month: currentMonth, year: currentYear }))
    setCurrentApiParams({ month: currentMonth, year: currentYear })
  }, [dispatch, currentMonth, currentYear])

  // Handle month/year change from filter (API call)
  const handleMonthYearChange = (month: number, year: number) => {
    const isSameAsCurrentApi = currentApiParams?.month === month && currentApiParams?.year === year

    if (!isSameAsCurrentApi) {
      console.log("📡 API call for new month/year:", { month, year })
      dispatch(fetchPartnerSummary({ month, year }))
      setCurrentApiParams({ month, year })
    } else {
      console.log("🚫 Same month/year - no API call needed")
    }
  }

  // Handle other filter changes (no API call)
  const handleOtherFiltersChange = (paymentStatus: string, gstApplicable: boolean | null, gstStatus: string) => {
    console.log("🔧 Updating UI filters:", { paymentStatus, gstApplicable, gstStatus })
    setPaymentStatusFilter(paymentStatus)
    setGstApplicableFilter(gstApplicable)
    setGstStatusFilter(gstStatus)
    setPage(0) // Reset pagination
  }

  // Apply client-side filtering
  const filteredAndSortedData = useMemo(() => {
    console.log("🔍 Applying filters to data:", {
      totalRows: partnerSummary.length,
      paymentStatusFilter,
      gstApplicableFilter,
      gstStatusFilter,
    })

    let filtered = [...partnerSummary]

    // Apply payment status filter
    if (paymentStatusFilter && paymentStatusFilter !== "all") {
      const beforeCount = filtered.length
      filtered = filtered.filter((row) => row.paymentStatus === paymentStatusFilter)
      console.log(`💰 Payment status filter (${paymentStatusFilter}): ${beforeCount} → ${filtered.length}`)
    }

    // Apply GST applicable filter
    if (gstApplicableFilter !== null) {
      const beforeCount = filtered.length
      const gstValue = gstApplicableFilter ? "Yes" : "No"
      filtered = filtered.filter((row) => row.gstApplicable === gstValue)
      console.log(`📋 GST applicable filter (${gstValue}): ${beforeCount} → ${filtered.length}`)
    }

    // Apply GST status filter
    if (gstStatusFilter && gstStatusFilter !== "all") {
      const beforeCount = filtered.length
      filtered = filtered.filter((row) => row.gstStatus === gstStatusFilter)
      console.log(`📊 GST status filter (${gstStatusFilter}): ${beforeCount} → ${filtered.length}`)
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        const aValue = a.grossPayout
        const bValue = b.grossPayout
        return sortBy === "asc" ? aValue - bValue : bValue - aValue
      })
    }

    console.log("✅ Final filtered data:", filtered.length, "rows")
    return filtered
  }, [partnerSummary, paymentStatusFilter, gstApplicableFilter, gstStatusFilter, sortBy])

  const handleSortChange = () => {
    if (sortBy === null) setSortBy("desc")
    else if (sortBy === "desc") setSortBy("asc")
    else setSortBy(null)
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleCloseMenu = () => setAnchorEl(null)

  const handleOpenDialog = () => {
    setOpenEditDialog(true)
    handleCloseMenu()
  }

  const handleDialogClose = () => {
    setOpenEditDialog(false)
    setSelectedRow(null)
  }

  const handleFieldChange = (key: string, value: any) => {
    setSelectedRow((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!selectedRow || !currentApiParams) return

    try {
      await dispatch(
        updatePartnerPayoutInfo({
          partnerId: selectedRow.partnerId,
          month: currentApiParams.month,
          year: currentApiParams.year,
          gstStatus: selectedRow.gstStatus,
          advancesPaid: selectedRow.advancesPaid,
        }),
      ).unwrap()

      setSnackbarMessage("Partner payout information updated successfully!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      handleDialogClose()
    } catch (error: any) {
      setSnackbarMessage(error || "Failed to update partner payout information")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const paginatedRows = filteredAndSortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (error) {
    return (
      <Box component={Paper} elevation={2} p={3} borderRadius={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box component={Paper} elevation={2} p={3} borderRadius={2}>
      {/* Filters - Always visible */}
      <UniversalFilterBar
        filterType="partner-payout"
        onMonthYearChange={handleMonthYearChange}
        onOtherFiltersChange={handleOtherFiltersChange}
        currentApiParams={currentApiParams}
      />

      {/* Table Container with Loading Overlay */}
      <Box position="relative">
        {partnerSummaryLoading && (
          <Backdrop
            open={true}
            sx={{
              position: "absolute",
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 2,
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                Loading partner data...
              </Typography>
            </Box>
          </Backdrop>
        )}

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Partner (Name, ID)</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy !== null}
                    direction={sortBy === "asc" ? "asc" : "desc"}
                    onClick={handleSortChange}
                  >
                    Gross Payout
                  </TableSortLabel>
                </TableCell>
                <TableCell>TDS</TableCell>
                <TableCell>Net Payout</TableCell>
                <TableCell>Amount Paid</TableCell>
                <TableCell>Amount Pending</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>GST Applicable</TableCell>
                <TableCell>GST Status</TableCell>
                <TableCell>Advances Paid</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 && !partnerSummaryLoading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No data available for the selected filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, index) => (
                  <TableRow key={`${row.partnerId}-${index}`} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{row.partnerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.partnerId}
                      </Typography>
                    </TableCell>
                    <TableCell>₹{row.grossPayout.toLocaleString()}</TableCell>
                    <TableCell>₹{row.tds.toLocaleString()}</TableCell>
                    <TableCell>₹{row.netPayout.toLocaleString()}</TableCell>
                    <TableCell>₹{row.amountPaid.toLocaleString()}</TableCell>
                    <TableCell>₹{row.amountPending.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.paymentStatus}
                        color={row.paymentStatus === "Paid" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.gstApplicable}
                        color={row.gstApplicable === "Yes" ? "info" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.gstStatus}</TableCell>
                    <TableCell>₹{row.advancesPaid.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleOpenMenu(e, row)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number.parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </Box>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} disableAutoFocus>
        <MenuItem onClick={handleOpenDialog}>Edit Payout Info</MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Payout Information</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>GST Status</InputLabel>
                <Select
                  value={selectedRow?.gstStatus || ""}
                  label="GST Status"
                  onChange={(e) => handleFieldChange("gstStatus", e.target.value)}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="GST Not Applicable">GST Not Applicable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                label="Advances Paid"
                size="small"
                fullWidth
                value={selectedRow?.advancesPaid ?? ""}
                onChange={(e) => handleFieldChange("advancesPaid", Number.parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" onClick={handleDialogClose} disabled={partnerPayoutUpdating}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={partnerPayoutUpdating}
                startIcon={partnerPayoutUpdating ? <CircularProgress size={16} /> : null}
              >
                {partnerPayoutUpdating ? "Saving..." : "Save"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PartnerPayoutTable
