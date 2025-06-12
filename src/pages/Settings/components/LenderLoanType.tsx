// src/components/LenderLoanType.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Tab,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
  Paper,
  Switch,
  InputAdornment,
  Skeleton,
  CircularProgress,
  useTheme,
  IconButton,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  fetchLoanTypes,
  fetchLenders,
  createLoanType,
  createLender,
  clearLenderLoanState,
  fetchMatrix,
  toggleMatrix,
} from "../../../store/slices/lenderLoanSlice"

interface MatrixTogglePayload {
  lenderId: string
  loanTypeId: string
  enabled: boolean
}

const LenderLoanType = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const {
    loanTypes,
    lenders,
    matrix,
    loading: sliceLoading,
    error,
    success,
  } = useAppSelector((state) => state.lenderLoan)

  const [tab, setTab] = useState(0)
  const [loanInput, setLoanInput] = useState("")
  const [lenderInput, setLenderInput] = useState("")
  const [localMatrix, setLocalMatrix] = useState<Record<string, Record<string, boolean>>>({})
  const [changes, setChanges] = useState<MatrixTogglePayload[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchLoanTypes())
    dispatch(fetchLenders())
    return () => dispatch(clearLenderLoanState())
  }, [dispatch])

  useEffect(() => {
    if (tab === 2) dispatch(fetchMatrix())
  }, [tab, dispatch])

  useEffect(() => {
    if (matrix) {
      const nested: Record<string, Record<string, boolean>> = {}
      matrix.forEach((entry) => {
        nested[entry.lenderId] = nested[entry.lenderId] || {}
        nested[entry.lenderId][entry.loanTypeId] = entry.enabled
      })
      setLocalMatrix(nested)
      setChanges([])
    }
  }, [matrix])

  useEffect(() => {
    if (error || success) {
      setSnackbarMessage(error || success || "")
      setSnackbarSeverity(error ? "error" : "success")
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

  const handleToggle = (lenderId: string, loanId: string) => {
    const updated = !localMatrix[lenderId]?.[loanId]
    setLocalMatrix(prev => ({
      ...prev,
      [lenderId]: { ...prev[lenderId], [loanId]: updated },
    }))
    setChanges(prev => [
      ...prev.filter(c => !(c.lenderId === lenderId && c.loanTypeId === loanId)),
      { lenderId, loanTypeId: loanId, enabled: updated },
    ])
  }

  const handleSave = () => {
    if (changes.length) {
      setLoading(true)
      dispatch(toggleMatrix(changes)).finally(() => setLoading(false))
    }
  }

  const filteredLenders = lenders.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          alignSelf: "start",
          "& .MuiTabs-indicator": {
            height: 3,
            backgroundColor: theme.palette.primary.main,
          },
          "& .MuiTab-root": {
            fontSize: "0.95rem",
            fontWeight: 500,
            textTransform: "none",
            minHeight: 36,
            px: 2,
          },
        }}
      >
        <Tab label="Lenders" />
        <Tab label="Loan Types" />
        <Tab label="Loan Matrix" />
      </Tabs>

      {(tab === 0 || tab === 1) && (
        <Card variant="outlined" sx={{ borderRadius: 3, p: 3, boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" gap={2} mb={3} alignItems="center">
              <TextField
                fullWidth
                variant="outlined"
                label={tab === 0 ? "Lender Name" : "Loan Type Name"}
                value={tab === 0 ? lenderInput : loanInput}
                onChange={e =>
                  tab === 0
                    ? setLenderInput(e.target.value)
                    : setLoanInput(e.target.value)
                }
              />
              <IconButton
                color="primary"
                onClick={tab === 0 ? handleCreateLender : handleCreateLoan}
                disabled={tab === 0 ? !lenderInput.trim() : !loanInput.trim()}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            <Paper sx={{ maxHeight: 400, overflow: "auto", borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(tab === 0 ? lenders : loanTypes).map((item, i) => (
                    <TableRow key={item._id} hover sx={{ "& td": { py: 1.2 } }}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card variant="outlined" sx={{ borderRadius: 3, p: 3, boxShadow: 2 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search lender..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Paper variant="outlined" sx={{ maxHeight: 500, overflow: "auto", borderRadius: 2, p: 1 }}>
              <Table size="small" stickyHeader>
                <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lender</TableCell>
                    {loanTypes.map(lt => (
                      <TableCell key={lt._id} align="center" sx={{ fontWeight: 600 }}>
                        {lt.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLenders.map((lender, idx) => (
                    <TableRow key={lender._id} hover sx={{ "& td": { py: 1.2 } }}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{lender.name}</TableCell>
                      {loanTypes.map(lt => (
                        <TableCell key={lt._id} align="center">
                          <Switch
                            checked={!!localMatrix[lender._id]?.[lt._id]}
                            onChange={() => handleToggle(lender._id, lt._id)}
                            sx={{
                              "& .MuiSwitch-thumb": { width: 18, height: 18 },
                              "& .MuiSwitch-track": { borderRadius: 20, backgroundColor: theme.palette.grey[300] },
                              "& .Mui-checked + .MuiSwitch-track": { backgroundColor: theme.palette.primary.main },
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                disabled={!changes.length || loading}
                onClick={handleSave}
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                  height: 42,
                  fontWeight: 600,
                  textTransform: "none",
                  background: theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Save Changes"}
              </Button>
            </Box>
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
