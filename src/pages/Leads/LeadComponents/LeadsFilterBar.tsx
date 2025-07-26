"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  Box,
  TextField,
  Paper,
  Grid,
  Autocomplete,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  styled,
  Divider,
  Menu,
  MenuItem,
  Button,
  Collapse,
  Chip,
  Typography,
} from "@mui/material"
import {
  Search,
  Refresh,
  RestartAlt,
  Business,
  AccountBalance,
  SupervisorAccount,
  AssignmentInd,
  ExpandMore,
  ExpandLess,
  FilterList,
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { fetchLoanTypes } from "../../../store/slices/lenderLoanSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAuth } from "../../../hooks/useAuth"

const CompactFilterControl = styled(FormControl)(({ theme }) => ({
  position: "relative",
  "& .MuiInputLabel-root": {
    position: "absolute",
    top: -28,
    left: 4,
    backgroundColor: "transparent",
    padding: "0 4px",
    color: "#667eea",
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    height: 36,
    fontSize: "0.875rem",
    "& fieldset": {
      borderColor: "#e2e8f0",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "#667eea",
      borderWidth: "1px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
      borderWidth: "2px",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
    "& .MuiInputBase-input": {
      padding: "8px 12px",
      fontSize: "0.875rem",
    },
  },
  "& .MuiAutocomplete-inputRoot .MuiAutocomplete-input": {
    padding: "8px 12px",
    fontSize: "0.875rem",
  },
}))

const ActionButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: "10px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#64748b",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
    color: "#fff",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  "&.active": {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
  },
}))

const AdvancedFilterToggle = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  textTransform: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  padding: "6px 12px",
  minWidth: "auto",
  color: "#64748b",
  borderColor: "#e2e8f0",
  "&:hover": {
    backgroundColor: "#f8fafc",
    borderColor: "#667eea",
    color: "#667eea",
  },
}))

interface FilterOption {
  value: string
  label: string
}

interface DateRangeType {
  startDate: Date | null
  endDate: Date | null
}

interface LeadsFilterBarProps {
  showFilters?: boolean
  statusFilter: string
  loanTypeFilter: string
  searchTerm: string
  partnerFilter: string
  lenderFilter: string
  managerFilter: string
  associateFilter: string
  dateRange?: DateRangeType
  onStatusChange: (v: string) => void
  onLoanTypeChange: (v: string) => void
  onSearchChange: (v: string) => void
  onPartnerChange: (v: string) => void
  onLenderChange: (v: string) => void
  onManagerChange: (v: string) => void
  onAssociateChange: (v: string) => void
  onDateRangeChange?: (range: DateRangeType) => void
  partners: FilterOption[]
  lenders: FilterOption[]
  managers: FilterOption[]
  associates: FilterOption[]
  onReset: () => void
  onRefresh?: () => void
  onExportCsv?: () => void
  onExportExcel?: () => void
}

const LeadsFilterBar: React.FC<LeadsFilterBarProps> = ({
  showFilters = false,
  statusFilter,
  loanTypeFilter,
  searchTerm,
  partnerFilter,
  lenderFilter,
  managerFilter,
  associateFilter,
  dateRange,
  onStatusChange,
  onLoanTypeChange,
  onSearchChange,
  onPartnerChange,
  onLenderChange,
  onManagerChange,
  onAssociateChange,
  onDateRangeChange,
  partners,
  lenders,
  managers,
  associates,
  onReset,
  onRefresh,
  onExportCsv,
  onExportExcel,
}) => {
  const dispatch = useAppDispatch()
  const { userRole } = useAuth()
  const [fetched, setFetched] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const loanTypes = useAppSelector((s) => s.lenderLoan.loanTypes)

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchLoanTypes())
      setFetched(true)
    }
  }, [dispatch, fetched])

  const statusOptions = useMemo<FilterOption[]>(
    () => [
      { value: "all", label: "All Status" },
      { value: "new lead", label: "New Lead" },
      { value: "pending", label: "Pending" },
      { value: "login", label: "Login" },
      { value: "approved", label: "Approved" },
      { value: "disbursed", label: "Disbursed" },
      { value: "closed", label: "Closed" },
      { value: "rejected", label: "Rejected" },
      { value: "expired", label: "Expired" },
    ],
    [],
  )

  const loanOptions = useMemo<FilterOption[]>(
    () => [{ value: "all", label: "All Loans" }, ...loanTypes.map((l) => ({ value: l.name, label: l.name }))],
    [loanTypes],
  )

  const hasActiveFilters = useMemo(
    () =>
      statusFilter !== "all" ||
      loanTypeFilter !== "all" ||
      searchTerm !== "" ||
      partnerFilter !== "all" ||
      lenderFilter !== "all" ||
      managerFilter !== "all" ||
      associateFilter !== "all" ||
      dateRange?.startDate !== null ||
      dateRange?.endDate !== null,
    [statusFilter, loanTypeFilter, searchTerm, partnerFilter, lenderFilter, managerFilter, associateFilter, dateRange],
  )

  const hasAdvancedFilters = useMemo(
    () => partnerFilter !== "all" || lenderFilter !== "all" || managerFilter !== "all" || associateFilter !== "all",
    [partnerFilter, lenderFilter, managerFilter, associateFilter],
  )

  const showPartner = ["admin", "manager"].includes(userRole)
  const showManager = ["admin", "partner"].includes(userRole)
  const showAssociate = userRole === "partner"
  const canExport = ["admin", "partner"].includes(userRole) && (onExportCsv || onExportExcel)

  const handleStartDateChange = (date: Date | null) => {
    if (onDateRangeChange) {
      onDateRangeChange({
        startDate: date,
        endDate: dateRange?.endDate || null,
      })
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    if (onDateRangeChange) {
      onDateRangeChange({
        startDate: dateRange?.startDate || null,
        endDate: date,
      })
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Collapse in={showFilters} timeout={400}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(102, 126, 234, 0.1)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          {/* Primary Filters Row */}
          <Grid container spacing={2} alignItems="flex-start">
            {/* Search */}
            <Grid item xs={12} md={2.5}>
              <CompactFilterControl fullWidth>
                <InputLabel>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, }}>
                    <Search fontSize="small" />
                    Search Applicant
                  </Box>
                </InputLabel>
                <TextField
                sx={{mt:"4px"}}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Name, email, ID..."
                  size="small"
                  fullWidth
                />
              </CompactFilterControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={2}>
              <CompactFilterControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Autocomplete
                 sx={{mt:"4px"}}
                  options={statusOptions}
                  getOptionLabel={(o) => o.label}
                  value={statusOptions.find((o) => o.value === statusFilter) || statusOptions[0]}
                  onChange={(_, v) => onStatusChange(v?.value || "all")}
                  size="small"
                  renderInput={(params) => <TextField {...params} />}
                />
              </CompactFilterControl>
            </Grid>

            {/* Loan Type */}
            <Grid item xs={12} md={2}>
              <CompactFilterControl fullWidth>
                <InputLabel>Loan Type</InputLabel>
                <Autocomplete
                 sx={{mt:"4px"}}
                  options={loanOptions}
                  getOptionLabel={(o) => o.label}
                  value={loanOptions.find((o) => o.value === loanTypeFilter) || loanOptions[0]}
                  onChange={(_, v) => onLoanTypeChange(v?.value || "all")}
                  size="small"
                  renderInput={(params) => <TextField {...params} />}
                />
              </CompactFilterControl>
            </Grid>

            {/* From Date */}
            <Grid item xs={12} md={1.5}>
              <CompactFilterControl fullWidth>
                <InputLabel>From Date</InputLabel>
                <DatePicker
                 sx={{mt:"4px"}}
                  value={dateRange?.startDate || null}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </CompactFilterControl>
            </Grid>

            {/* To Date */}
            <Grid item xs={12} md={1.5}>
              <CompactFilterControl fullWidth>
                <InputLabel>To Date</InputLabel>
                <DatePicker
                 sx={{mt:"4px"}}
                  value={dateRange?.endDate || null}
                  onChange={handleEndDateChange}
                  minDate={dateRange?.startDate || undefined}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </CompactFilterControl>
            </Grid>

            {/* Actions - Inline Layout */}
            <Grid item xs={12} md={2.5}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 1, flexWrap: "wrap" }}>
                <Tooltip title="Advanced Filters">
                  <AdvancedFilterToggle
                    variant="outlined"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    endIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                      backgroundColor: hasAdvancedFilters ? "#667eea" : "transparent",
                      color: hasAdvancedFilters ? "#fff" : "#64748b",
                      borderColor: hasAdvancedFilters ? "#667eea" : "#e2e8f0",
                    }}
                  >
                    <FilterList fontSize="small" sx={{ mr: 0.5 }} />
                    {hasAdvancedFilters && (
                      <Chip
                        size="small"
                        label="•"
                        sx={{
                          height: 16,
                          minWidth: 16,
                          backgroundColor: "rgba(255,255,255,0.3)",
                          color: "inherit",
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                    )}
                  </AdvancedFilterToggle>
                </Tooltip>

                <Tooltip title="Refresh">
                  <ActionButton onClick={onRefresh} disabled={!onRefresh}>
                    <Refresh fontSize="small" />
                  </ActionButton>
                </Tooltip>

                <Tooltip title="Reset Filters">
                  <ActionButton onClick={onReset} className={hasActiveFilters ? "active" : ""}>
                    <RestartAlt fontSize="small" />
                  </ActionButton>
                </Tooltip>

                {canExport && (
                  <Tooltip title="Export Data">
                    <ActionButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                      <ExpandMore fontSize="small" />
                    </ActionButton>
                  </Tooltip>
                )}

                {canExport && (
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 100,
                        borderRadius: 2,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    {onExportCsv && (
                      <MenuItem
                        onClick={() => {
                          onExportCsv()
                          setMenuAnchor(null)
                        }}
                        sx={{ fontSize: "0.875rem", py: 1 }}
                      >
                        Export CSV
                      </MenuItem>
                    )}
                    {onExportExcel && (
                      <MenuItem
                        onClick={() => {
                          onExportExcel()
                          setMenuAnchor(null)
                        }}
                        sx={{ fontSize: "0.875rem", py: 1 }}
                      >
                        Export Excel
                      </MenuItem>
                    )}
                  </Menu>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Filters - Collapsible */}
          <Collapse in={showAdvanced} timeout={300}>
            <Box sx={{ mt: 1}}>
              <Divider sx={{ mb: 2, opacity: 0.6 }} />


              <Grid container spacing={2} alignItems="flex-start">
                {showPartner && (
                  <Grid item xs={12} md={3}>
                    <CompactFilterControl fullWidth>
                    
                      <InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Business fontSize="small" />
                          Partner
                        </Box>
                      </InputLabel>
                      <Autocomplete
                                                                                     sx={{mt:"8px"}}

                        options={[{ value: "all", label: "All Partners" }, ...partners]}
                        getOptionLabel={(o) => o.label}
                        value={
                          [{ value: "all", label: "All Partners" }, ...partners].find((o) => o.value === partnerFilter)!
                        }
                        onChange={(_, v) => onPartnerChange(v?.value || "all")}
                        size="small"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </CompactFilterControl>
                  </Grid>
                )}

                <Grid item xs={12} md={3}>
                  <CompactFilterControl fullWidth>
                    <InputLabel>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccountBalance fontSize="small" />
                        Lender
                      </Box>
                    </InputLabel>
                    <Autocomplete
                                                               sx={{mt:"8px"}}

                      options={[{ value: "all", label: "All Lenders" }, ...lenders]}
                      getOptionLabel={(o) => o.label}
                      value={
                        [{ value: "all", label: "All Lenders" }, ...lenders].find((o) => o.value === lenderFilter)!
                      }
                      onChange={(_, v) => onLenderChange(v?.value || "all")}
                      size="small"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </CompactFilterControl>
                </Grid>

                {showManager && (
                  <Grid item xs={12} md={3}>
                    <CompactFilterControl fullWidth>
                      <InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <SupervisorAccount fontSize="small" />
                          Manager
                        </Box>
                      </InputLabel>
                      <Autocomplete
                                           sx={{mt:"8px"}}

                        options={[{ value: "all", label: "All Managers" }, ...managers]}
                        getOptionLabel={(o) => o.label}
                        value={
                          [{ value: "all", label: "All Managers" }, ...managers].find((o) => o.value === managerFilter)!
                        }
                        onChange={(_, v) => onManagerChange(v?.value || "all")}
                        size="small"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </CompactFilterControl>
                  </Grid>
                )}

                {showAssociate && (
                  <Grid item xs={12} md={3}>
                    <CompactFilterControl fullWidth>
                      <InputLabel>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AssignmentInd fontSize="small" />
                          Associate
                        </Box>
                      </InputLabel>
                      <Autocomplete
                                           sx={{mt:"8px"}}

                        options={[{ value: "all", label: "All Associates" }, ...associates]}
                        getOptionLabel={(o) => o.label}
                        value={
                          [{ value: "all", label: "All Associates" }, ...associates].find(
                            (o) => o.value === associateFilter,
                          )!
                        }
                        onChange={(_, v) => onAssociateChange(v?.value || "all")}
                        size="small"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </CompactFilterControl>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </Paper>
      </Collapse>
    </LocalizationProvider>
  )
}

export default LeadsFilterBar
