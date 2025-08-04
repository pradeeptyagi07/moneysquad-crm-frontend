"use client"

import type React from "react"
import { useState } from "react"
import { Box, Card, Typography, Chip, Button, styled, TextField, Autocomplete } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { Clear, AdminPanelSettings } from "@mui/icons-material"
import { useSelector } from "react-redux"
import type { RootState } from "../../../../store"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  background: "linear-gradient(135deg, #fff 0%, #f8fafc 100%)",
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  padding: "6px 12px",
  fontSize: "0.75rem",
  "&.active": {
    background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
    },
  },
  "&:hover": {
    backgroundColor: "rgba(255, 107, 53, 0.04)",
  },
}))

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF6B35",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF6B35",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FF6B35",
  },
}))

interface AdminFilterPanelProps {
  onFiltersChange?: (filters: any) => void
}

const AdminFilterPanel: React.FC<AdminFilterPanelProps> = ({ onFiltersChange }) => {
  const userData = useSelector((state: RootState) => state.userData.userData)

  const [selectedPeriod, setSelectedPeriod] = useState("Month")
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null)
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  // Mock data
  const loanTypeOptions = ["Personal Loan", "Home Loan", "Business Loan", "Car Loan", "Education Loan"]
  const partnerOptions = ["Alpha Financial", "Beta Lending", "Gamma Capital", "Delta Finance", "Epsilon Corp"]
  const periodOptions = ["Today", "7 Days", "Month", "Quarter", "Year", "Custom"]

  // Get admin user name and welcome message
  const getAdminWelcomeData = () => {
    if (!userData) {
      return {
        name: "Admin",
        message: "Command Center Active — Monitor and optimize platform performance.",
      }
    }

    // For admin users - correctly map from userData slice
    const adminData = userData as any
    let name = "Admin"

    if (adminData.role === "admin" && adminData.firstName && adminData.lastName) {
      name = `${adminData.firstName} ${adminData.lastName}`
    } else if (adminData.basicInfo?.fullName) {
      name = adminData.basicInfo.fullName
    } else if (adminData.fullName) {
      name = adminData.fullName
    } else if (adminData.name) {
      name = adminData.name
    }

    const message = "Command Center Active — Monitor and optimize platform performance."

    return { name, message }
  }

  const { name, message } = getAdminWelcomeData()

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    if (period !== "Custom") {
      setFromDate(null)
      setToDate(null)
    }
  }

  const clearAllFilters = () => {
    setSelectedLoanType(null)
    setSelectedPartner(null)
    setFromDate(null)
    setToDate(null)
    setSelectedPeriod("Month")
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (selectedLoanType) count++
    if (selectedPartner) count++
    if (fromDate && toDate) count++
    return count
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <StyledCard sx={{ p: 2, mb:2 }}>
      {/* Compact Header with Admin Welcome Message */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdminPanelSettings sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#374151" sx={{ fontSize: "0.95rem" }}>
              {getTimeOfDay()}, {name}! 👑
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem", lineHeight: 1.2 }}>
              {message}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1.5}>
          {getActiveFilterCount() > 0 && (
            <Chip
              label={`${getActiveFilterCount()} Active`}
              size="small"
              sx={{
                background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 24,
              }}
            />
          )}
          <Button
            startIcon={<Clear sx={{ fontSize: 16 }} />}
            onClick={clearAllFilters}
            sx={{
              color: "#6b7280",
              textTransform: "none",
              fontSize: "0.75rem",
              minWidth: "auto",
              px: 1,
            }}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Time Period Buttons */}
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={1} sx={{ fontSize: "0.8rem" }}>
          Time Period
        </Typography>
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {periodOptions.map((period) => (
            <StyledButton
              key={period}
              className={selectedPeriod === period ? "active" : ""}
              onClick={() => handlePeriodChange(period)}
              size="small"
            >
              {period}
            </StyledButton>
          ))}
        </Box>
      </Box>

      {/* Filter Dropdowns and Custom Date Range in Same Line */}
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-start">
        {/* Loan Types - Single Selection with Search */}
        <StyledAutocomplete
          size="small"
          sx={{ minWidth: 180, flex: 1 }}
          options={loanTypeOptions}
          value={selectedLoanType}
          onChange={(_, newValue) => setSelectedLoanType(newValue)}
          renderInput={(params) => <TextField {...params} label="Loan Types" />}
          clearOnEscape
          freeSolo={false}
          filterOptions={(options, { inputValue }) =>
            options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
          }
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option}
            </Box>
          )}
        />

        {/* Partners - Single Selection with Search */}
        <StyledAutocomplete
          size="small"
          sx={{ minWidth: 180, flex: 1 }}
          options={partnerOptions}
          value={selectedPartner}
          onChange={(_, newValue) => setSelectedPartner(newValue)}
          renderInput={(params) => <TextField {...params} label="Partners" />}
          clearOnEscape
          freeSolo={false}
          filterOptions={(options, { inputValue }) =>
            options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
          }
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option}
            </Box>
          )}
        />

        {/* Custom Date Range - Inline with other filters */}
        {selectedPeriod === "Custom" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" gap={1} alignItems="center">
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: 120 },
                  },
                }}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: 120 },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
        )}
      </Box>
    </StyledCard>
  )
}

export default AdminFilterPanel
