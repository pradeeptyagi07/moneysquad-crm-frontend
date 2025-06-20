"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Box, FormControl, InputLabel, Select, MenuItem, Grid, TextField, Autocomplete } from "@mui/material"
import { useAuth } from "../../../hooks/useAuth"
import { useAppSelector } from "../../../hooks/useAppSelector"

// Filter types
interface DisbursedLeadsFilters {
  month?: number
  year?: number
  lender?: string
  payoutStatus?: string
  partner?: string
  associate?: string
}

interface PartnerPayoutFilters {
  month?: number
  year?: number
  paymentStatus?: string
  gstApplicable?: boolean
  gstStatus?: string
}

// Add this interface after the existing ones
interface PayoutHistoryFilters {
  month?: number
  year?: number
  paymentStatus?: string
  gstStatus?: string
}

// Props for DisbursedLeads (old way)
interface DisbursedLeadsProps {
  filterType: "disbursed-leads"
  onFiltersChange: (filters: DisbursedLeadsFilters) => void
  userRole?: string
}

// Props for PartnerPayout (new way)
interface PartnerPayoutProps {
  filterType: "partner-payout"
  onMonthYearChange: (month: number, year: number) => void
  onOtherFiltersChange: (paymentStatus: string, gstApplicable: boolean | null, gstStatus: string) => void
  currentApiParams: { month: number; year: number } | null
}

// Props for CommissionGrid
interface CommissionGridProps {
  filterType: "commission-grid"
  onFiltersChange: (filters: any) => void
}

// Add this to the props interfaces
interface PayoutHistoryProps {
  filterType: "payout-history"
  onFiltersChange: (filters: PayoutHistoryFilters) => void
}

// Update the FilterProps type
type FilterProps = DisbursedLeadsProps | PartnerPayoutProps | CommissionGridProps | PayoutHistoryProps

const UniversalFilterBar: React.FC<FilterProps> = (props) => {
  const { userRole: authUserRole } = useAuth()
  const currentUserRole =
    props.filterType === "disbursed-leads" ? (props as DisbursedLeadsProps).userRole || authUserRole : authUserRole
  const isAdmin = currentUserRole === "admin"
  const isPartner = currentUserRole === "partner"

  // Get data from Redux store
  const { disbursedLeads } = useAppSelector((state) => state.commission)

  // Get current month and year
  const currentDate = new Date()
  const currentMonthYear = `${currentDate.toLocaleDateString("en-US", { month: "short" })}'${currentDate.getFullYear().toString().slice(-2)}`

  // Common filter states
  const [month, setMonth] = useState(currentMonthYear)

  // DisbursedLeads specific filters
  const [lender, setLender] = useState<string | null>(null)
  const [payoutStatus, setPayoutStatus] = useState("all")
  const [partner, setPartner] = useState<string | null>(null)
  const [associate, setAssociate] = useState<string | null>(null)

  // PartnerPayout specific filters
  const [paymentStatus, setPaymentStatus] = useState("all")
  const [gstApplicable, setGstApplicable] = useState("all")
  const [gstStatus, setGstStatus] = useState("all")

  // Add payout history filter states after the existing ones
  const [payoutHistoryPaymentStatus, setPayoutHistoryPaymentStatus] = useState("all")
  const [payoutHistoryGstStatus, setPayoutHistoryGstStatus] = useState("all")

  // Extract unique values from API data for DisbursedLeads
  const { uniqueLenders, uniquePartners, uniqueAssociates } = useMemo(() => {
    const lenders = new Set<string>()
    const partners = new Set<string>()
    const associates = new Set<string>()

    disbursedLeads.forEach((lead) => {
      lenders.add(lead.lender.name)
      partners.add(`${lead.partner.name} (${lead.partner.partnerId})`)
      associates.add(`${lead.associate.name} (${lead.associate.associateDisplayId})`)
    })

    return {
      uniqueLenders: Array.from(lenders).sort(),
      uniquePartners: Array.from(partners).sort(),
      uniqueAssociates: Array.from(associates).sort(),
    }
  }, [disbursedLeads])

  // Generate month options
  const monthOptions = useMemo(() => {
    const months = []
    const currentDate = new Date()

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthStr = date.toLocaleDateString("en-US", { month: "short" })
      const yearStr = date.getFullYear().toString().slice(-2)
      months.push({
        value: `${monthStr}'${yearStr}`,
        label: `${monthStr}'${yearStr}`,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      })
    }
    return months
  }, [])

  // Sync month state with API params for PartnerPayout
  useEffect(() => {
    if (props.filterType === "partner-payout" && (props as PartnerPayoutProps).currentApiParams) {
      const apiParams = (props as PartnerPayoutProps).currentApiParams!
      const monthOptionion = monthOptions.find((opt) => opt.month === apiParams.month && opt.year === apiParams.year)
      const monthOption = monthOptionion
      if (monthOption && monthOption.value !== month) {
        console.log("🔄 Syncing month display with API params:", monthOption.value)
        setMonth(monthOption.value)
      }
    }
  }, [(props as PartnerPayoutProps).currentApiParams, monthOptions, month, props.filterType, props])

  // Handle DisbursedLeads filters (old way with useEffect)
  useEffect(() => {
    if (props.filterType === "disbursed-leads") {
      const selectedMonth = monthOptions.find((m) => m.value === month)
      if (!selectedMonth) return

      const filters: DisbursedLeadsFilters = {
        month: selectedMonth.month,
        year: selectedMonth.year,
        lender: lender || undefined,
        payoutStatus: payoutStatus !== "all" ? payoutStatus : undefined,
        partner: isAdmin && partner ? partner : undefined,
        associate: isPartner && associate ? associate : undefined,
      }

      console.log("📤 DisbursedLeads filters:", filters)
      ;(props as DisbursedLeadsProps).onFiltersChange(filters)
    }
  }, [month, lender, payoutStatus, partner, associate, props.filterType, isAdmin, isPartner, monthOptions])

  // Handle PartnerPayout month change (new way)
  const handlePartnerPayoutMonthChange = (monthValue: string) => {
    if (props.filterType === "partner-payout") {
      console.log("📅 PartnerPayout month changed to:", monthValue)
      setMonth(monthValue)

      const selectedOption = monthOptions.find((option) => option.value === monthValue)
      if (selectedOption) {
        ;(props as PartnerPayoutProps).onMonthYearChange(selectedOption.month, selectedOption.year)
      }
    }
  }

  // Handle PartnerPayout payment status change
  const handlePaymentStatusChange = (value: string) => {
    if (props.filterType === "partner-payout") {
      console.log("💰 Payment status changed to:", value)
      setPaymentStatus(value)

      // Call with updated values immediately
      const gstApplicableValue = gstApplicable === "all" ? null : gstApplicable === "yes"
      ;(props as PartnerPayoutProps).onOtherFiltersChange(value, gstApplicableValue, gstStatus)
    }
  }

  // Handle PartnerPayout GST applicable change
  const handleGstApplicableChange = (value: string) => {
    if (props.filterType === "partner-payout") {
      console.log("📋 GST applicable changed to:", value)
      setGstApplicable(value)

      // Call with updated values immediately
      const gstApplicableValue = value === "all" ? null : value === "yes"
      ;(props as PartnerPayoutProps).onOtherFiltersChange(paymentStatus, gstApplicableValue, gstStatus)
    }
  }

  // Handle PartnerPayout GST status change
  const handleGstStatusChange = (value: string) => {
    if (props.filterType === "partner-payout") {
      console.log("📊 GST status changed to:", value)
      setGstStatus(value)

      // Call with updated values immediately
      const gstApplicableValue = gstApplicable === "all" ? null : gstApplicable === "yes"
      ;(props as PartnerPayoutProps).onOtherFiltersChange(paymentStatus, gstApplicableValue, value)
    }
  }

  // Add useEffect for payout history filters
  useEffect(() => {
    if (props.filterType === "payout-history") {
      const selectedMonth = monthOptions.find((m) => m.value === month)
      if (!selectedMonth) return

      const filters: PayoutHistoryFilters = {
        month: selectedMonth.month,
        year: selectedMonth.year,
        paymentStatus: payoutHistoryPaymentStatus !== "all" ? payoutHistoryPaymentStatus : undefined,
        gstStatus: payoutHistoryGstStatus !== "all" ? payoutHistoryGstStatus : undefined,
      }

      console.log("📤 PayoutHistory filters:", filters)
      ;(props as PayoutHistoryProps).onFiltersChange(filters)
    }
  }, [month, payoutHistoryPaymentStatus, payoutHistoryGstStatus, props.filterType, monthOptions])

  const renderDisbursedLeadsFilters = () => (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Month</InputLabel>
          <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Autocomplete
          size="small"
          options={uniqueLenders}
          value={lender}
          onChange={(_, newValue) => setLender(newValue)}
          renderInput={(params) => <TextField {...params} label="Search Lender" placeholder="Type to search..." />}
          noOptionsText="No lenders found"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Payout Status</InputLabel>
          <Select value={payoutStatus} label="Payout Status" onChange={(e) => setPayoutStatus(e.target.value)}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {isAdmin && (
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            size="small"
            options={uniquePartners}
            value={partner}
            onChange={(_, newValue) => setPartner(newValue)}
            renderInput={(params) => <TextField {...params} label="Search Partner" placeholder="Type to search..." />}
            noOptionsText="No partners found"
          />
        </Grid>
      )}

      {isPartner && (
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            size="small"
            options={uniqueAssociates}
            value={associate}
            onChange={(_, newValue) => setAssociate(newValue)}
            renderInput={(params) => <TextField {...params} label="Search Associate" placeholder="Type to search..." />}
            noOptionsText="No associates found"
          />
        </Grid>
      )}
    </>
  )

  const renderPartnerPayoutFilters = () => (
    <>
      {/* Month Filter */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Month</InputLabel>
          <Select value={month} label="Month" onChange={(e) => handlePartnerPayoutMonthChange(e.target.value)}>
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Payment Status Filter */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={paymentStatus}
            label="Payment Status"
            onChange={(e) => handlePaymentStatusChange(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Partially Paid">Partially Paid</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* GST Applicable Filter */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>GST Applicable</InputLabel>
          <Select
            value={gstApplicable}
            label="GST Applicable"
            onChange={(e) => handleGstApplicableChange(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* GST Status Filter */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>GST Status</InputLabel>
          <Select value={gstStatus} label="GST Status" onChange={(e) => handleGstStatusChange(e.target.value)}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="GST Not Applicable">GST Not Applicable</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </>
  )

  const renderCommissionGridFilters = () => (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth size="small">
        <InputLabel>Commission Type</InputLabel>
        <Select value="all" label="Commission Type">
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="standard">Standard</MenuItem>
          <MenuItem value="premium">Premium</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  )

  // Add the render function for payout history filters
  const renderPayoutHistoryFilters = () => (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Month</InputLabel>
          <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={payoutHistoryPaymentStatus}
            label="Payment Status"
            onChange={(e) => setPayoutHistoryPaymentStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Partially Paid">Partially Paid</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>GST Status</InputLabel>
          <Select
            value={payoutHistoryGstStatus}
            label="GST Status"
            onChange={(e) => setPayoutHistoryGstStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="GST Not Applicable">GST Not Applicable</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </>
  )

  return (
    <Box mb={2} px={1}>
      <Grid container spacing={2} alignItems="center">
        {props.filterType === "disbursed-leads" && renderDisbursedLeadsFilters()}
        {props.filterType === "partner-payout" && renderPartnerPayoutFilters()}
        {props.filterType === "commission-grid" && renderCommissionGridFilters()}
        {props.filterType === "payout-history" && renderPayoutHistoryFilters()}
      </Grid>
    </Box>
  )
}

export default UniversalFilterBar
