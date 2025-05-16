"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Tabs, Tab } from "@mui/material"
import CommissionFilters from "./components/CommissionFilters"
import DisbursedLeadsTable from "./components/DisbursedLeadsTable"
import PartnerPayoutsTable from "./components/PartnerPayoutsTable"
import CommissionRatesTable from "./components/CommissionRatesTable"
import { mockDisbursedLeads, mockPartnerPayouts, mockCommissionRates } from "./data/mockCommissionData"
import type { CommissionFilter } from "./types/commissionTypes"

const AdminCommissions: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [tierTabValue, setTierTabValue] = useState(0)
  const [leads, setLeads] = useState(() => mockDisbursedLeads)
  const [payouts, setPayouts] = useState(() => mockPartnerPayouts)
  const [commissionRates, setCommissionRates] = useState(() => mockCommissionRates)
  const [filters, setFilters] = useState<CommissionFilter>({
    month: "All", // Default to "All" to show all data
    applicantType: "All",
    status: "All",
    lenderName: "",
  })

  // Filter leads based on filters
  const filteredLeads = leads.filter((lead) => {
    // Month filter will be based on a lead date field - this is a simplification
    if (filters.month && filters.month !== "All") {
      // In a real app, filter by month from lead.date
      return false
    }

    // If lender name filter is applied, check if lead lender name includes the search term
    if (
      filters.lenderName &&
      filters.lenderName.trim() !== "" &&
      !lead.lenderName.toLowerCase().includes(filters.lenderName.toLowerCase())
    ) {
      return false
    }

    // If status filter is applied, check if lead status matches
    if (filters.status && filters.status !== "All" && lead.status !== filters.status) {
      return false
    }

    return true
  })

  // Filter payouts based on filters
  const filteredPayouts = payouts.filter((payout) => {
    // Filter implementation here
    // For this simplified version, we'll return all payouts
    return true
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleTierTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTierTabValue(newValue)
  }

  const handleFilterChange = (newFilters: CommissionFilter) => {
    setFilters(newFilters)
  }

  const handleUpdateLead = (id: string, field: string, value: any) => {
    setLeads((prevLeads) => prevLeads.map((lead) => (lead.id === id ? { ...lead, [field]: value } : lead)))
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setPayouts((prevPayouts) =>
      prevPayouts.map((payout) => (payout.id === id ? { ...payout, status: newStatus } : payout)),
    )
  }

  const handleUpdateCommission = (id: string, newPercentage: number) => {
    setCommissionRates((prevRates) =>
      prevRates.map((rate) => (rate.id === id ? { ...rate, commissionPercentage: newPercentage } : rate)),
    )
  }

  const handleExportData = () => {
    console.log("Exporting data...")
    // In a real app, implement export functionality here
  }

  const getCommissionTier = () => {
    switch (tierTabValue) {
      case 0:
        return "Silver"
      case 1:
        return "Gold"
      case 2:
        return "Diamond"
      default:
        return "Silver"
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Commissions Management
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Disbursed Leads" />
        <Tab label="Partner Payouts" />
        <Tab label="Commission Rates" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <CommissionFilters filters={filters} onFilterChange={handleFilterChange} />
          <DisbursedLeadsTable leads={filteredLeads} onUpdateLead={handleUpdateLead} onExportData={handleExportData} />
        </>
      )}

      {tabValue === 1 && (
        <>
          <CommissionFilters filters={filters} onFilterChange={handleFilterChange} />
          <PartnerPayoutsTable payouts={filteredPayouts} onUpdateStatus={handleUpdateStatus} />
        </>
      )}

      {tabValue === 2 && (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Commission Rate Structure
            </Typography>
            <Typography variant="body2" gutterBottom>
              Set and manage commission rates for different partner tiers. Partners can only view their own tier rates.
            </Typography>
          </Box>

          <Tabs value={tierTabValue} onChange={handleTierTabChange} sx={{ mb: 3 }}>
            <Tab label="Silver Tier" />
            <Tab label="Gold Tier" />
            <Tab label="Diamond Tier" />
          </Tabs>

          <CommissionRatesTable
            commissionRates={commissionRates}
            isAdmin={true}
            onUpdateCommission={handleUpdateCommission}
            tier={getCommissionTier()}
            userRole="admin"
          />
        </>
      )}
    </Box>
  )
}

export default AdminCommissions
