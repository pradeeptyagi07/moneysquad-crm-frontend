"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Tab,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"

import {
  fetchLoanTypes,
  fetchLenders,
  createLoanType,
  createLender,
  clearLenderLoanState,
} from "../../../store/slices/lenderLoanSlice"

const LenderLoanType: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    loanTypes,
    lenders,
    loading,
    error,
    success,
  } = useAppSelector((state) => state.lenderLoan || { loanTypes: [], lenders: [], loading: false, error: null, success: null })

  const [tab, setTab] = useState(0)
  const [loanInput, setLoanInput] = useState("")
  const [lenderInput, setLenderInput] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>("success")

  useEffect(() => {
    dispatch(fetchLoanTypes())
    dispatch(fetchLenders())
    return () => {
      dispatch(clearLenderLoanState())
    }
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } else if (success) {
      setSnackbarMessage(success)
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    }
  }, [error, success])

  const handleCreateLoan = () => {
    if (loanInput.trim()) {
      dispatch(createLoanType(loanInput))
      setLoanInput("")
    }
  }

  const handleCreateLender = () => {
    if (lenderInput.trim()) {
      dispatch(createLender(lenderInput))
      setLenderInput("")
    }
  }

  return (
    <Box>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label="Lenders" />
        <Tab label="Loan Types" />
      </Tabs>

      {[0, 1].includes(tab) && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {tab === 0 ? "Add Lender" : "Add Loan Type"}
            </Typography>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <TextField
                label={tab === 0 ? "Lender Name" : "Loan Type Name"}
                value={tab === 0 ? lenderInput : loanInput}
                onChange={(e) => tab === 0 ? setLenderInput(e.target.value) : setLoanInput(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={tab === 0 ? handleCreateLender : handleCreateLoan}
                disabled={loading}
              >
                Add
              </Button>
            </Box>
            <Paper variant="outlined" sx={{ maxHeight: 360, overflow: "auto", borderRadius: 2 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(tab === 0 ? lenders : loanTypes).map((item) => (
                      <TableRow key={item._id} hover>
                        <TableCell>{item.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </CardContent>
        </Card>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LenderLoanType
