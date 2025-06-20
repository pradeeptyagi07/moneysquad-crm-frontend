"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material"
import UniversalFilterBar from "./UniversalFilterBar"
import { useAuth } from "../../../hooks/useAuth"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { fetchMonthlyBreakdown } from "../../../store/slices/commissionSlice"

interface PayoutHistoryFilters {
  month?: number
  year?: number
  paymentStatus?: string
  gstStatus?: string
}

const PayoutHistoryTable = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { monthlyBreakdown, monthlyBreakdownLoading, error } = useAppSelector((state) => state.commission)
  const isGSTApplicable = true // Simulated based on account type

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filters, setFilters] = useState<PayoutHistoryFilters>({})

  // Call API only once on mount
  useEffect(() => {
    console.log("🚀 Initial PayoutHistory API call")
    dispatch(fetchMonthlyBreakdown())
  }, [dispatch])

  // Handle filter changes (client-side filtering only)
  const handleFiltersChange = (newFilters: PayoutHistoryFilters) => {
    console.log("📤 PayoutHistory filters changed:", newFilters)
    setFilters(newFilters)
    setPage(0) // Reset pagination
  }

  // Client-side filtering
  const filteredData = useMemo(() => {
    let filtered = [...monthlyBreakdown]

    // Filter by month/year
    if (filters.month && filters.year) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.month + "-01")
        return itemDate.getMonth() + 1 === filters.month && itemDate.getFullYear() === filters.year
      })
    }

    // Filter by payment status
    if (filters.paymentStatus) {
      filtered = filtered.filter((item) => item.paymentStatus === filters.paymentStatus)
    }

    // Filter by GST status
    if (filters.gstStatus) {
      filtered = filtered.filter((item) => item.gstStatus === filters.gstStatus)
    }

    console.log(`🔍 Filtered ${monthlyBreakdown.length} → ${filtered.length} records`)
    return filtered
  }, [monthlyBreakdown, filters])

  // Format month display
  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", "'")
  }

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (monthlyBreakdownLoading) {
    return (
      <Box
        component={Paper}
        elevation={2}
        p={3}
        borderRadius={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box component={Paper} elevation={2} p={3} borderRadius={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box component={Paper} elevation={2} p={3} borderRadius={2}>
      {/* Filters */}
      <Box mb={2}>
        <UniversalFilterBar filterType="payout-history" onFiltersChange={handleFiltersChange} />
      </Box>

      <Typography variant="h6" mb={2} fontWeight={600}>
        Payout History ({filteredData.length} records)
      </Typography>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Total Disbursal</TableCell>
              <TableCell>Commission Earned</TableCell>
              <TableCell>Payout Paid</TableCell>
              <TableCell>Payout Pending</TableCell>
              <TableCell>Payment Status</TableCell>
              {isGSTApplicable && <TableCell>GST Status</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isGSTApplicable ? 7 : 6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {filteredData.length === 0 && monthlyBreakdown.length > 0
                      ? "No records match the selected filters"
                      : "No payout history data available"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={`${row.month}-${index}`} hover>
                  <TableCell>{formatMonth(row.month)}</TableCell>
                  <TableCell>₹{row.totalDisbursals.toLocaleString()}</TableCell>
                  <TableCell>₹{row.commissionEarned.toLocaleString()}</TableCell>
                  <TableCell>₹{row.payoutPaid.toLocaleString()}</TableCell>
                  <TableCell>₹{row.payoutPending.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.paymentStatus}
                      color={row.paymentStatus === "Paid" ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  {isGSTApplicable && (
                    <TableCell>
                      <Chip
                        label={row.gstStatus === "paid" ? "Paid" : row.gstStatus === "pending" ? "Pending" : "N/A"}
                        color={
                          row.gstStatus === "paid" ? "success" : row.gstStatus === "pending" ? "warning" : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                  )}
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
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number.parseInt(e.target.value, 10))
          setPage(0)
        }}
      />

      {/* GST Invoice Info */}
      {isGSTApplicable && (
        <Card variant="outlined" sx={{ mt: 2, p: 1, bgcolor: "#fefefe", borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              GST Invoice Info (for Partners)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Chip label="Company Name" variant="outlined" color="primary" />
                <Typography mt={1}>MoneySquad</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Chip label="GSTIN" variant="outlined" color="primary" />
                <Typography mt={1}>07ATYPT5728R1Z7</Typography>
              </Grid>
              <Grid item xs={12}>
                <Chip label="Address" variant="outlined" color="primary" />
                <Typography mt={1}>935, 9th Floor, Westend Mall, Janakpuri, Delhi-110058</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Chip label="Phone" variant="outlined" color="primary" />
                <Typography mt={1}>011-47094707</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Chip label="Email" variant="outlined" color="primary" />
                <Typography mt={1}>hello@moneysquad.in</Typography>
              </Grid>
              <Grid item xs={12}>
                <Chip label="SAC Code" variant="outlined" color="primary" />
                <Typography mt={1}>997159 (Other financial & related services - commission)</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default PayoutHistoryTable
