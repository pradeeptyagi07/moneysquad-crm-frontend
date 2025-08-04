"use client"

// src/components/GlobalFilters.tsx
import type React from "react"
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Card,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  type SelectChangeEvent,
  Divider,
} from "@mui/material"
import { FilterList, TrendingUp, Person, CalendarMonth, Business, Group } from "@mui/icons-material"
import type { AppDispatch, RootState } from "../../../store"
import { fetchAssociates } from "../../../store/slices/associateSlice"
import { fetchLoanTypes } from "../../../store/slices/lenderLoanSlice"
import { useAuth } from "../../../hooks/useAuth"
import WelcomeMessage from "./WelcomeMessage"
import { fetchManagers } from "../../../store/slices/teamSLice"
import { fetchAllPartners } from "../../../store/slices/managePartnerSlice"

const StyledFormControl = styled(FormControl)(() => ({
  minWidth: 160,
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#fff",
    transition: "all 0.3s ease-in-out",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5569FF",
      boxShadow: "0 0 0 1px rgba(85,105,255,0.2)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5569FF",
      borderWidth: 2,
      boxShadow: "0 4px 12px rgba(85,105,255,0.25)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e5e7eb",
      borderWidth: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6b7280",
    fontWeight: 600,
    fontSize: "0.8rem",
    "&.Mui-focused": { color: "#5569FF" },
    "&.MuiInputLabel-shrink": { color: "#5569FF", fontWeight: 700 },
  },
  "& .MuiSelect-select": {
    padding: "8px 12px",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#374151",
  },
}))

interface Props {
  loanType: string
  onLoanTypeChange: (v: string) => void
  associateId: string
  onAssociateChange: (v: string) => void
  month: string
  onMonthChange: (v: string) => void
  managerId: string
  onManagerChange: (v: string) => void
  partnerId: string
  onPartnerChange: (v: string) => void
}

interface MonthOption {
  value: string
  label: string
}

const GlobalFilters: React.FC<Props> = ({
  loanType,
  onLoanTypeChange,
  associateId,
  onAssociateChange,
  month,
  onMonthChange,
  managerId,
  onManagerChange,
  partnerId,
  onPartnerChange,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { userRole } = useAuth()
  const associates = useSelector((s: RootState) => s.associate.associates)
  const loanTypes = useSelector((s: RootState) => s.lenderLoan.loanTypes)
  const managers = useSelector((s: RootState) => s.team.managers)
  const partners = useSelector((s: RootState) => s.managePartners.partners)

  // Generate month options using Date object
  const monthOptions = useMemo(() => {
    const options: MonthOption[] = [
      { value: "current", label: "Current Month" },
      { value: "last", label: "Last Month" },
    ]

    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    // Add past 24 months (2 years)
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // getMonth() is 0-indexed

      const monthStr = month.toString().padStart(2, "0")
      const value = `${year}-${monthStr}`

      // Format the month name
      const monthName = date.toLocaleString("default", { month: "long" })
      const label = `${monthName} ${year}`

      options.push({ value, label })
    }

    return options
  }, [])

  useEffect(() => {
    dispatch(fetchAssociates())
    dispatch(fetchLoanTypes())
    // Only fetch managers and partners for admin users
    if (userRole === "admin") {
      dispatch(fetchManagers())
      dispatch(fetchAllPartners())
    }
  }, [dispatch, userRole])

  const activeCount =
    (loanType !== "all" ? 1 : 0) +
    (associateId !== "all" ? 1 : 0) +
    (month !== "current" ? 1 : 0) +
    (userRole === "admin" && managerId !== "all" ? 1 : 0) +
    (userRole === "admin" && partnerId !== "all" ? 1 : 0)

  const handleLoanTypeChange = (e: SelectChangeEvent) => onLoanTypeChange(e.target.value)
  const handleAssociateChange = (e: SelectChangeEvent) => onAssociateChange(e.target.value)
  const handleMonthChange = (e: SelectChangeEvent) => {
    console.log("Month changed to:", e.target.value)
    onMonthChange(e.target.value)
  }
  const handleManagerChange = (e: SelectChangeEvent) => {
    console.log("Manager changed to:", e.target.value)
    onManagerChange(e.target.value)
  }
  const handlePartnerChange = (e: SelectChangeEvent) => {
    console.log("Partner changed to:", e.target.value)
    onPartnerChange(e.target.value)
  }

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        background: "linear-gradient(135deg,#fff 0%,#f8fafc 100%)",
        mb: 3,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        alignItems={{ xs: "flex-start", lg: "center" }}
        justifyContent="space-between"
        gap={3}
      >
        {/* Welcome Message Section - Left */}
        <Box flex={1} minWidth={0}>
          <WelcomeMessage />
        </Box>

        {/* Divider for larger screens */}
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <Divider
            orientation="vertical"
            sx={{
              height: 60,
              borderColor: "#e5e7eb",
              opacity: 0.6,
            }}
          />
        </Box>

        {/* Divider for smaller screens */}
        <Box sx={{ display: { xs: "block", lg: "none" }, width: "100%" }}>
          <Divider sx={{ borderColor: "#e5e7eb", opacity: 0.6 }} />
        </Box>

        {/* Filters Section - Right */}
        <Box>
          {/* Filters Header */}
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: "linear-gradient(135deg, #5569FF 0%, #4338CA 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px rgba(85, 105, 255, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <FilterList sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={700} fontSize="1rem" color="#374151">
                Filters
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                Customize your dashboard view
              </Typography>
            </Box>
            {activeCount > 0 && (
              <Chip
                label={`${activeCount} active`}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #5569FF 0%, #4338CA 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  height: 22,
                  boxShadow: "0 2px 4px rgba(85, 105, 255, 0.3)",
                }}
              />
            )}
          </Box>

          {/* Filter Controls */}
          <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
            {/* Loan Type */}
            <StyledFormControl size="small">
              <InputLabel id="loan-type-label">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TrendingUp sx={{ fontSize: 14 }} />
                  Loan Type
                </Box>
              </InputLabel>
              <Select
                labelId="loan-type-label"
                id="loan-type-select"
                value={loanType}
                label="Loan Type"
                onChange={handleLoanTypeChange}
              >
                <MenuItem value="all">All Types</MenuItem>
                {loanTypes.map((lt: any) => (
                  <MenuItem key={lt._id} value={lt._id}>
                    {lt.name}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            {/* Associate – only visible for partners */}
            {userRole === "partner" && (
              <StyledFormControl size="small">
                <InputLabel id="associate-label">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Person sx={{ fontSize: 14 }} />
                    Associate
                  </Box>
                </InputLabel>
                <Select
                  labelId="associate-label"
                  id="associate-select"
                  value={associateId}
                  label="Associate"
                  onChange={handleAssociateChange}
                >
                  <MenuItem value="all">All Associates</MenuItem>
                  {associates.map((a: any) => (
                    <MenuItem key={a._id} value={a._id}>
                      {a.firstName} {a.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            )}

            {/* Month */}
            <StyledFormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="month-label">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <CalendarMonth sx={{ fontSize: 14 }} />
                  Month
                </Box>
              </InputLabel>
              <Select
                labelId="month-label"
                id="month-select"
                value={month}
                label="Month"
                onChange={handleMonthChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {monthOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            {/* Manager Filter - Only visible for admin */}
            {userRole === "admin" && (
              <StyledFormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="manager-label">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Business sx={{ fontSize: 14 }} />
                    Manager
                  </Box>
                </InputLabel>
                <Select
                  labelId="manager-label"
                  id="manager-select"
                  value={managerId}
                  label="Manager"
                  onChange={handleManagerChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Managers</MenuItem>
                  {managers.map((manager: any) => (
                    <MenuItem key={manager._id} value={manager._id}>
                      {manager.firstName} {manager.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            )}

            {/* Partner Filter - Only visible for admin */}
            {userRole === "admin" && (
              <StyledFormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="partner-label">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Group sx={{ fontSize: 14 }} />
                    Partner
                  </Box>
                </InputLabel>
                <Select
                  labelId="partner-label"
                  id="partner-select"
                  value={partnerId}
                  label="Partner"
                  onChange={handlePartnerChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Partners</MenuItem>
                  {partners.map((partner: any) => (
                    <MenuItem key={partner._id} value={partner._id}>
                      {partner.basicInfo?.fullName || "N/A"}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default GlobalFilters
