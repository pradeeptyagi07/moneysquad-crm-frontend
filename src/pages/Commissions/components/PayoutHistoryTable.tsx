"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  Chip,
  Divider,
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
} from "@mui/material"
import FiltersBar from "./FilterBar"
import { useAuth } from "../../../hooks/useAuth"

const historyData = [
  {
    month: "May'25",
    totalDisbursal: 450000,
    netPayout: 11250,
    payoutPaid: 10000,
    gstStatus: "Paid"
  },
  {
    month: "Apr'25",
    totalDisbursal: 300000,
    netPayout: 9000,
    payoutPaid: 9000,
    gstStatus: "Paid"
  },
  {
    month: "Mar'25",
    totalDisbursal: 200000,
    netPayout: 5000,
    payoutPaid: 3000,
    gstStatus: "Pending"
  },
  {
    month: "Feb'25",
    totalDisbursal: 0,
    netPayout: 0,
    payoutPaid: 0,
    gstStatus: "GST Not Applicable"
  },
  {
    month: "Jan'25",
    totalDisbursal: 600000,
    netPayout: 18000,
    payoutPaid: 18000,
    gstStatus: "Paid"
  },
  {
    month: "Dec'24",
    totalDisbursal: 450000,
    netPayout: 13500,
    payoutPaid: 12000,
    gstStatus: "Paid"
  }
]

const PayoutHistoryTable = () => {
  const { user } = useAuth()
  const isGSTApplicable = true // Simulated based on account type

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const paginated = historyData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box component={Paper} elevation={2} p={3} borderRadius={2}>
      {/* Filters */}
      <Box mb={2}>
        <FiltersBar fullWidth />
      </Box>

      <Typography variant="h6" mb={2} fontWeight={600}>
        Payout History (Last 6 Months)
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
            {paginated.map((row) => {
              const pending = row.netPayout - row.payoutPaid
              const status = pending <= 0 ? "Paid" : "Pending"

              return (
                <TableRow key={row.month} hover>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>₹{row.totalDisbursal.toLocaleString()}</TableCell>
                  <TableCell>₹{row.netPayout.toLocaleString()}</TableCell>
                  <TableCell>₹{row.payoutPaid.toLocaleString()}</TableCell>
                  <TableCell>₹{pending.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={status}
                      color={status === "Paid" ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  {isGSTApplicable && (
                    <TableCell>
                      <Chip
                        label={row.gstStatus}
                        color={
                          row.gstStatus === "Paid"
                            ? "success"
                            : row.gstStatus === "Pending"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={historyData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
      />

      {/* GST Invoice Info */}
      {isGSTApplicable && (
        <Card
          variant="outlined"
          sx={{ mt: 2, p: 1, bgcolor: "#fefefe", borderRadius: 3, boxShadow: 1 }}
        >
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
                <Typography mt={1}>
                  935, 9th Floor, Westend Mall, Janakpuri, Delhi-110058
                </Typography>
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
                <Typography mt={1}>
                  997159 (Other financial & related services - commission)
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default PayoutHistoryTable
