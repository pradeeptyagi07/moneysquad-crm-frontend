"use client"

import type React from "react"
import { useState } from "react"
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, InputAdornment } from "@mui/material"
import { Search, FilterList, Clear } from "@mui/icons-material"
import type { CommissionFilter } from "../types/commissionTypes"

interface CommissionFiltersProps {
  filters: CommissionFilter
  onFilterChange: (filters: CommissionFilter) => void
  showTierFilter?: boolean
}

const CommissionFilters: React.FC<CommissionFiltersProps> = ({ filters, onFilterChange, showTierFilter = false }) => {
  const [localFilters, setLocalFilters] = useState<CommissionFilter>(filters)
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (field: keyof CommissionFilter, value: string) => {
    const updatedFilters = { ...localFilters, [field]: value }
    setLocalFilters(updatedFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      month: "All",
      applicantType: "All",
      status: "All",
      tier: "All",
      lenderName: "",
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }

  const getLastMonth = () => {
    const now = new Date()
    now.setMonth(now.getMonth() - 1)
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={localFilters.month || "All"}
              label="Month"
              onChange={(e) => handleFilterChange("month", e.target.value)}
            >
              <MenuItem value="All">All Months</MenuItem>
              <MenuItem value={getCurrentMonth()}>Current Month</MenuItem>
              <MenuItem value={getLastMonth()}>Last Month</MenuItem>
              <MenuItem value="2024-04">April 2024</MenuItem>
              <MenuItem value="2024-05">May 2024</MenuItem>
              <MenuItem value="2024-06">June 2024</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={localFilters.status || "All"}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <TextField
            label="Search Lender"
            fullWidth
            value={localFilters.lenderName || ""}
            onChange={(e) => handleFilterChange("lenderName", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={3}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              size="medium"
            >
              More Filters
            </Button>
            <Button variant="outlined" startIcon={<Clear />} onClick={handleReset} size="medium">
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>

      {showFilters && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel>Applicant Type</InputLabel>
              <Select
                value={localFilters.applicantType || "All"}
                label="Applicant Type"
                onChange={(e) => handleFilterChange("applicantType", e.target.value)}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Salaried">Salaried Individual</MenuItem>
                <MenuItem value="Business">Business (SENP)</MenuItem>
                <MenuItem value="Professional">Professional (SEP)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {showTierFilter && (
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tier</InputLabel>
                <Select
                  value={localFilters.tier || "All"}
                  label="Tier"
                  onChange={(e) => handleFilterChange("tier", e.target.value)}
                >
                  <MenuItem value="All">All Tiers</MenuItem>
                  <MenuItem value="Gold">Gold</MenuItem>
                  <MenuItem value="Diamond">Diamond</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={handleApplyFilters} fullWidth>
                Apply Filters
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" onClick={() => handleFilterChange("month", getCurrentMonth())} fullWidth>
                Current Month
              </Button>
              <Button variant="outlined" onClick={() => handleFilterChange("month", getLastMonth())} fullWidth>
                Last Month
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default CommissionFilters
