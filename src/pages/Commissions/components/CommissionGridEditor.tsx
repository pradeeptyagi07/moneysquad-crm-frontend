"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tabs,
  Tab,
} from "@mui/material"
import { useAuth } from "../../../hooks/useAuth"

const initialGrids = {
  gold: [
    { lenderName: "HDFC Bank", termLoan: "2.5", overdraft: "2.3", remarks: "Gold grid logic" },
    { lenderName: "Axis Bank", termLoan: "2.4", overdraft: "2.2", remarks: "" },
  ],
  diamond: [
    { lenderName: "ICICI Bank", termLoan: "2.7", overdraft: "2.5", remarks: "Diamond grid notes" },
  ],
  platinum: [
    { lenderName: "Kotak Bank", termLoan: "3.0", overdraft: "2.8", remarks: "Platinum elite cases" },
  ],
}

const CommissionGridEditor = () => {
  const { userRole } = useAuth()
  const [activeTab, setActiveTab] = useState("gold")
  const [rows, setRows] = useState(initialGrids["gold"])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editData, setEditData] = useState({ lenderName: "", termLoan: "", overdraft: "", remarks: "" })

  const handleTabChange = (_: any, newValue: string) => {
    setActiveTab(newValue)
    setRows(initialGrids[newValue])
  }

  const handleOpenDialog = (index: number) => {
    setEditIndex(index)
    setEditData(rows[index])
    setDialogOpen(true)
  }

  const handleSaveDialog = () => {
    if (editIndex !== null) {
      const updated = [...rows]
      updated[editIndex] = editData
      setRows(updated)
    }
    setDialogOpen(false)
  }

  if (userRole === "partner") {
    const assignedGrid = "gold" // Replace with user.assignedGrid if available from auth
    const gridData = initialGrids[assignedGrid]
    return (
      <Box>
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
                <TableCell>Lender Name</TableCell>
                <TableCell>Term Loan %</TableCell>
                <TableCell>Overdraft %</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gridData.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell>{row.lenderName}</TableCell>
                  <TableCell>{row.termLoan}%</TableCell>
                  <TableCell>{row.overdraft}%</TableCell>
                  <TableCell>{row.remarks || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Commission Grid Editor (Admin)
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Gold" value="gold" />
        <Tab label="Diamond" value="diamond" />
        <Tab label="Platinum" value="platinum" />
      </Tabs>

      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
              <TableCell>Lender Name</TableCell>
              <TableCell>Term Loan %</TableCell>
              <TableCell>Overdraft %</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell>{row.lenderName}</TableCell>
                <TableCell>{row.termLoan}%</TableCell>
                <TableCell>{row.overdraft}%</TableCell>
                <TableCell>{row.remarks || "-"}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => handleOpenDialog(i)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Commission Row</DialogTitle>
        <DialogContent>
          <Box mt={1} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Lender Name"
              fullWidth
              value={editData.lenderName}
              onChange={(e) => setEditData({ ...editData, lenderName: e.target.value })}
            />
            <TextField
              label="Term Loan %"
              fullWidth
              value={editData.termLoan}
              onChange={(e) => setEditData({ ...editData, termLoan: e.target.value })}
            />
            <TextField
              label="Overdraft %"
              fullWidth
              value={editData.overdraft}
              onChange={(e) => setEditData({ ...editData, overdraft: e.target.value })}
            />
            <TextField
              label="Remarks"
              fullWidth
              value={editData.remarks}
              onChange={(e) => setEditData({ ...editData, remarks: e.target.value })}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={() => setDialogOpen(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleSaveDialog} variant="contained">
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default CommissionGridEditor
