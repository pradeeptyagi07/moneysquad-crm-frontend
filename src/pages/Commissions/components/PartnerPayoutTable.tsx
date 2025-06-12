"use client"

import React, { useState } from "react"
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
  Stack,
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
  Grid
} from "@mui/material"
import { MoreVert } from "@mui/icons-material"
import FiltersBar from "./FilterBar"

const mockPartnerPayouts = [
  {
    partnerId: "P001",
    partnerName: "Ravi Patel",
    gross: 20000,
    net: 19600,
    paid: 19600,
    gstApplicable: true,
    gstStatus: "Pending",
    advancesPaid: 1000,
  },
  {
    partnerId: "P002",
    partnerName: "Nidhi Sharma",
    gross: 15000,
    net: 14700,
    paid: 12000,
    gstApplicable: false,
    gstStatus: "GST Not Applicable",
    advancesPaid: 0,
  },
]

const PartnerPayoutTable: React.FC = () => {
  const [rows, setRows] = useState(mockPartnerPayouts)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

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

  const handleSave = () => {
    setRows((prev) =>
      prev.map((row) =>
        row.partnerId === selectedRow.partnerId ? selectedRow : row
      )
    )
    handleDialogClose()
  }

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box component={Paper} elevation={2} p={3} borderRadius={2}>
      {/* Filters */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box flex={1}>
          <FiltersBar />
        </Box>
      </Stack>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Partner (Name, ID)</TableCell>
              <TableCell>Gross Payout</TableCell>
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
            {paginatedRows.map((row) => {
              const pending = (row.net ?? 0) - (row.paid ?? 0)
              const status = pending <= 0 ? "Paid" : "Pending"

              return (
                <TableRow key={row.partnerId} hover>
                  <TableCell>
                    <Typography fontWeight={500}>{row.partnerName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.partnerId}
                    </Typography>
                  </TableCell>
                  <TableCell>₹{row.gross.toLocaleString()}</TableCell>
                  <TableCell>₹{row.net.toLocaleString()}</TableCell>
                  <TableCell>₹{row.paid.toLocaleString()}</TableCell>
                  <TableCell>₹{pending.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={status}
                      color={status === "Paid" ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.gstApplicable ? "Yes" : "No"}
                      color={row.gstApplicable ? "info" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.gstStatus}</TableCell>
                  <TableCell>₹{row.advancesPaid}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleOpenMenu(e, row)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        disableAutoFocus
      >
        <MenuItem onClick={handleOpenDialog}>Edit Payout Info</MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Payout Information</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {selectedRow?.gstApplicable && (
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>GST Status</InputLabel>
                  <Select
                    value={selectedRow.gstStatus}
                    label="GST Status"
                    onChange={(e) => handleFieldChange("gstStatus", e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="GST Not Applicable">GST Not Applicable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                type="number"
                label="Advances Paid"
                size="small"
                fullWidth
                value={selectedRow?.advancesPaid ?? ""}
                onChange={(e) => handleFieldChange("advancesPaid", parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default PartnerPayoutTable
