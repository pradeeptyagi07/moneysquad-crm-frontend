"use client"

import React, { useState } from "react"
import { Box, Tabs, Tab } from "@mui/material"
import DisbursedLeadsTable from "./components/DisbursedLeadsTable"
import PartnerPayoutTable from "./components/PartnerPayoutTable"
import PayoutHistoryTable from "./components/PayoutHistoryTable"
import CommissionGridView from "./components/CommissionGridView"
import CommissionGridEditor from "./components/CommissionGridEditor"
import { useAuth } from "../../hooks/useAuth"

const CommissionDashboard: React.FC = () => {
  const { userRole } = useAuth()
  const [tab, setTab] = useState("disbursed")

  const isAdmin = userRole === "admin"
  const isPartner = userRole === "partner"

  const visibleTabs = [
    { label: "Disbursed Leads", value: "disbursed" },
    ...(isAdmin ? [{ label: "Partner Payout", value: "payout" }] : []),
    ...(isPartner ? [{ label: "My Payout History", value: "history" }] : []),
    { label: "Commission Grid", value: "grid" }
  ]

  return (
    <Box p={2}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2 }}>
        {visibleTabs.map((t) => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      {tab === "disbursed" && <DisbursedLeadsTable />}
      {tab === "payout" && isAdmin && <PartnerPayoutTable />}
      {tab === "history" && isPartner && <PayoutHistoryTable />}
      {tab === "grid" &&
        (isAdmin ? <CommissionGridEditor /> : <CommissionGridView />)}
    </Box>
  )
}

export default CommissionDashboard
