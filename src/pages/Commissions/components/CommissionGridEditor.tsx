"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import {
  Box,
  Typography,
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
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  TablePagination,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Search, Edit, TrendingUp, Info, Diamond, Star, EmojiEvents } from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import {
  updateCommissionEntry,
  clearError,
  type CommissionPlan,
  type CommissionEntry,
} from "../../../store/slices/commissionSlice"
import { useAppSelector } from "../../../hooks/useAppSelector"
import TermsAndConditionsDialog from "./TermsAndConditionsDialog"

interface CommissionGridEditorProps {
  plans: CommissionPlan[]
}

const CommissionGridEditor: React.FC<CommissionGridEditorProps> = ({ plans }) => {
  const { userRole } = useAuth()
  const dispatch = useAppDispatch()
  const { updating, error } = useAppSelector((state) => state.commission)

  // Find plans by commission type to ensure correct mapping
  const goldPlan = plans.find((plan) => plan.commissionType.toLowerCase() === "gold")
  const platinumPlan = plans.find((plan) => plan.commissionType.toLowerCase() === "platinum")
  const diamondPlan = plans.find((plan) => plan.commissionType.toLowerCase() === "diamond")

  // Create ordered plans array
  const orderedPlans = [goldPlan, platinumPlan, diamondPlan].filter(Boolean) as CommissionPlan[]

  const [activePlan, setActivePlan] = useState("")
  const [activeSheet, setActiveSheet] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [termsDialogOpen, setTermsDialogOpen] = useState(false)
  const [selectedPlanType, setSelectedPlanType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [editData, setEditData] = useState({
    termLoan: "",
    overdraft: "",
    remark: "",
    planId: "",
    sheetName: "",
    lenderId: "",
    lenderName: "",
  })

  // Initialize active plan and sheet
  useEffect(() => {
    if (orderedPlans.length > 0 && !activePlan) {
      setActivePlan(orderedPlans[0]._id)
    }
  }, [orderedPlans, activePlan])

  const currentPlan = orderedPlans.find((p) => p._id === activePlan)

  useEffect(() => {
    if (currentPlan && currentPlan.sheets.length > 0 && !activeSheet) {
      setActiveSheet(currentPlan.sheets[0].sheetType)
    }
  }, [currentPlan, activeSheet])

  const currentSheet = currentPlan?.sheets.find((s) => s.sheetType === activeSheet)

  // Filter entries based on search term and exclude non-lender entries
  const filteredEntries = useMemo(() => {
    if (!currentSheet) return []

    return currentSheet.entries.filter((entry) => {
      // Filter out entries that are not actual lenders
      const isActualLender =
        entry.termLoan > 0 ||
        entry.overdraft > 0 ||
        (!entry.lenderName.toLowerCase().includes("terms") &&
          !entry.lenderName.toLowerCase().includes("backend") &&
          !entry.lenderName.toLowerCase().includes("commission rates") &&
          !entry.lenderName.toLowerCase().includes("tds") &&
          !entry.lenderName.toLowerCase().includes("payouts") &&
          !entry.lenderName.toLowerCase().includes("subvention") &&
          !entry.lenderName.toLowerCase().includes("post-disbursal") &&
          !entry.lenderName.toLowerCase().includes("disputes") &&
          !entry.lenderName.toLowerCase().includes("lenders") &&
          !entry.lenderName.toLowerCase().includes("overleveraging") &&
          !entry.lenderName.toLowerCase().includes("partner to be") &&
          !entry.lenderName.toLowerCase().includes("refer the partner") &&
          !entry.lenderName.toLowerCase().includes("moneysquad") &&
          !entry.lenderName.toLowerCase().includes("9th floor") &&
          !entry.lenderName.toLowerCase().includes("website") &&
          !entry.lenderName.toLowerCase().includes("contact support") &&
          !entry.lenderName.toLowerCase().includes("email support") &&
          !entry.lenderName.toLowerCase().includes("files to be sent") &&
          !entry.lenderName.toLowerCase().includes("escalations") &&
          !entry.lenderName.toLowerCase().includes("visit website") &&
          !entry.lenderName.toLowerCase().includes("delhi") &&
          !entry.lenderName.toLowerCase().includes("altmoney"))

      if (!isActualLender) return false

      return entry.lenderName.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [currentSheet, searchTerm])

  // Paginate filtered entries
  const paginatedEntries = useMemo(() => {
    const startIndex = page * rowsPerPage
    return filteredEntries.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredEntries, page, rowsPerPage])

  const handlePlanChange = (_: any, newValue: string) => {
    setActivePlan(newValue)
    const newPlan = orderedPlans.find((p) => p._id === newValue)
    if (newPlan && newPlan.sheets.length > 0) {
      setActiveSheet(newPlan.sheets[0].sheetType)
    }
    setPage(0)
    setSearchTerm("")
  }

  const handleSheetChange = (_: any, newValue: string) => {
    setActiveSheet(newValue)
    setPage(0)
    setSearchTerm("")
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenDialog = (entry: CommissionEntry, planId: string, sheetName: string) => {
    setEditData({
      termLoan: entry.termLoan.toFixed(2),
      overdraft: entry.overdraft.toFixed(2),
      remark: entry.remark,
      planId,
      sheetName,
      lenderId: entry._id,
      lenderName: entry.lenderName,
    })
    setDialogOpen(true)
  }

  const handleSaveDialog = async () => {
    try {
      await dispatch(
        updateCommissionEntry({
          planId: editData.planId,
          sheetName: editData.sheetName,
          lenderId: editData.lenderId,
          data: {
            termLoan: Number.parseFloat(editData.termLoan),
            overdraft: Number.parseFloat(editData.overdraft),
            remark: editData.remark,
          },
        }),
      ).unwrap()
      setDialogOpen(false)
    } catch {}
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    dispatch(clearError())
  }

  const handleOpenTermsDialog = (planType: string) => {
    setSelectedPlanType(planType)
    setTermsDialogOpen(true)
  }

  const getPlanTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "gold":
        return "#FFD700"
      case "platinum":
        return "#E5E4E2"
      case "diamond":
        return "#B9F2FF"
      default:
        return "#1976d2"
    }
  }

  const getPlanTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "gold":
        return <EmojiEvents sx={{ color: getPlanTypeColor(type) }} />
      case "platinum":
        return <Star sx={{ color: getPlanTypeColor(type) }} />
      case "diamond":
        return <Diamond sx={{ color: getPlanTypeColor(type) }} />
      default:
        return <TrendingUp sx={{ color: getPlanTypeColor(type) }} />
    }
  }

  // Debug: Log the current plan data to verify correct mapping
  console.log("=== COMMISSION PLAN DEBUG ===")
  console.log("All Plans:", plans)
  console.log("Gold Plan:", goldPlan)
  console.log("Platinum Plan:", platinumPlan)
  console.log("Diamond Plan:", diamondPlan)
  console.log("Current Plan:", currentPlan)
  console.log("Active Plan ID:", activePlan)
  console.log("Current Sheet:", currentSheet)

  // For partners, show read-only view
  if (userRole === "partner") {
    const partnerPlan = orderedPlans.length > 0 ? orderedPlans[0] : null
    if (!partnerPlan) {
      return (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" color="error" align="center">
              No commission plan assigned
            </Typography>
          </CardContent>
        </Card>
      )
    }

    return (
      <Box>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h5" fontWeight="bold">
                My Commission Grid
              </Typography>
              <Tooltip title="View Terms & Conditions">
                <IconButton onClick={() => handleOpenTermsDialog("")} sx={{ ml: "auto" }}>
                  <Info color="primary" />
                </IconButton>
              </Tooltip>
            </Box>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by lender name..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <Tabs value={activeSheet} onChange={handleSheetChange} sx={{ mb: 2 }}>
              {partnerPlan.sheets.map((sheet) => (
                <Tab key={sheet._id} label={sheet.sheetType} value={sheet.sheetType} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>S.No.</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Lender Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Term Loan %</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Overdraft %</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEntries.map((entry, index) => (
                  <TableRow key={entry._id} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{entry.lenderName}</TableCell>
                    <TableCell>
                      <Chip label={`${entry.termLoan.toFixed(2)}%`} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${entry.overdraft.toFixed(2)}%`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{entry.remark || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredEntries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <TermsAndConditionsDialog
          open={termsDialogOpen}
          onClose={() => setTermsDialogOpen(false)}
          planType=""
          isPartnerView={true}
        />
      </Box>
    )
  }

  // Admin view with edit capabilities
  return (
    <Box>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Commission Grid Editor (Admin)
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by lender name..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          {/* Plan Selection */}
          <Tabs value={activePlan} onChange={handlePlanChange} sx={{ mb: 2 }}>
            {orderedPlans.map((plan) => (
              <Tab
                key={plan._id}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {getPlanTypeIcon(plan.commissionType)}
                    {plan.commissionType.toUpperCase()}
                    <Tooltip title="View Terms & Conditions">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenTermsDialog(plan.commissionType)
                        }}
                        sx={{ ml: 1, p: 0.5 }}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                value={plan._id}
              />
            ))}
          </Tabs>

          {/* Sheet Selection */}
          {currentPlan && (
            <Tabs value={activeSheet} onChange={handleSheetChange} sx={{ mb: 2 }}>
              {currentPlan.sheets.map((sheet) => (
                <Tab key={sheet._id} label={sheet.sheetType} value={sheet.sheetType} />
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      {currentSheet && (
        <Card elevation={2}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>S.No.</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Lender Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Term Loan %</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Overdraft %</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEntries.map((entry, index) => (
                  <TableRow key={entry._id} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{entry.lenderName}</TableCell>
                    <TableCell>
                      <Chip label={`${entry.termLoan.toFixed(2)}%`} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${entry.overdraft.toFixed(2)}%`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{entry.remark || "-"}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(entry, activePlan, activeSheet)}
                        disabled={updating}
                        sx={{ minWidth: "auto" }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredEntries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Edit />
            Edit Commission - {editData.lenderName}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Term Loan %"
              fullWidth
              margin="dense"
              type="number"
              inputProps={{ step: "0.01", min: "0", max: "100" }}
              value={editData.termLoan}
              onChange={(e) => setEditData({ ...editData, termLoan: e.target.value })}
              variant="outlined"
            />
            <TextField
              label="Overdraft %"
              fullWidth
              type="number"
              inputProps={{ step: "0.01", min: "0", max: "100" }}
              value={editData.overdraft}
              onChange={(e) => setEditData({ ...editData, overdraft: e.target.value })}
              variant="outlined"
            />
            <TextField
              label="Remarks"
              fullWidth
              multiline
              rows={3}
              value={editData.remark}
              onChange={(e) => setEditData({ ...editData, remark: e.target.value })}
              variant="outlined"
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={handleCloseDialog} disabled={updating} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleSaveDialog}
                variant="contained"
                disabled={updating}
                startIcon={updating ? <CircularProgress size={16} /> : null}
              >
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <TermsAndConditionsDialog
        open={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
        planType={selectedPlanType}
        isPartnerView={false}
      />
    </Box>
  )
}

export default CommissionGridEditor
