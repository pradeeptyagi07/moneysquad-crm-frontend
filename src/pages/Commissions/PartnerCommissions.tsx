"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Alert, Tabs, Tab } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"
import CommissionFilters from "./components/CommissionFilters"
import PartnerCommissionTable from "./components/PartnerCommissionTable"
import {
  mockPartnerCommissionSummary,
  mockDisbursedLeads,
  disclaimers,
  mockCommissionRates,
} from "./data/mockCommissionData"
import type { CommissionFilter } from "./types/commissionTypes"
import DisclaimerSection from "./components/DisclaimerSection"
import CommissionSummaryCards from "./components/CommissionSummaryCards"
import CommissionRatesTable from "./components/CommissionRatesTable"

const PartnerCommissions: React.FC = () => {
  const { userName } = useAuth()
  const [commissions, setCommissions] = useState(() => mockPartnerCommissionSummary)
  const [tabValue, setTabValue] = useState(0)
  const [filters, setFilters] = useState<CommissionFilter>({
    month: "All", // Default to "All" to show all data
    applicantType: "All",
    status: "All",
    lenderName: "",
  })

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Filter commissions based on filters
  const filteredCommissions = commissions.filter((commission) => {
    // If month filter is applied and not "All", check if commission month matches
    if (filters.month && filters.month !== "All" && commission.month !== filters.month) {
      return false
    }

    // If status filter is applied and not "All", check if commission status matches
    if (filters.status && filters.status !== "All" && commission.status !== filters.status) {
      return false
    }

    // If lender name filter is applied, check if commission lender name includes the search term
    if (
      filters.lenderName &&
      filters.lenderName.trim() !== "" &&
      !commission.lenderName.toLowerCase().includes(filters.lenderName.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Calculate summary metrics
  const totalEarnings = filteredCommissions.reduce((sum, commission) => sum + commission.grossPayout, 0)
  const pendingAmount = filteredCommissions
    .filter((commission) => commission.status !== "Paid")
    .reduce((sum, commission) => sum + commission.grossPayout, 0)
  const paidAmount = filteredCommissions
    .filter((commission) => commission.status === "Paid")
    .reduce((sum, commission) => sum + commission.grossPayout, 0)

  // Get lead count
  const leadCount = mockDisbursedLeads.filter((lead) => lead.partnerName === userName).length

  const handleFilterChange = (newFilters: CommissionFilter) => {
    setFilters(newFilters)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Commissions
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Payouts" />
        <Tab label="Commission Rates" />
      </Tabs>

      {tabValue === 0 ? (
        <>
          <CommissionFilters filters={filters} onFilterChange={handleFilterChange} />

          <CommissionSummaryCards
            totalEarnings={totalEarnings}
            pendingAmount={pendingAmount}
            paidAmount={paidAmount}
            leadCount={leadCount}
          />

          {filteredCommissions.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No commission payouts found for the selected filters.
            </Alert>
          ) : (
            <PartnerCommissionTable commissions={filteredCommissions} />
          )}

          <DisclaimerSection disclaimers={disclaimers} />
        </>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            Your Commission Rates (Silver Tier)
          </Typography>
          <CommissionRatesTable
            commissionRates={mockCommissionRates}
            isAdmin={false}
            tier="Silver"
            userRole="partner"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            * Commission rates are subject to change based on performance and management discretion.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            * Contact your manager for information about upgrading to higher tier rates.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default PartnerCommissions
