"use client"

import { useEffect, useState } from "react"
import { Box, Typography, CircularProgress, Alert, Tabs, Tab, Paper } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { fetchCommissionData } from "../../store/slices/commissionSlice"
import { fetchUserData } from "../../store/slices/userDataSlice"
import CommissionGridEditor from "./components/CommissionGridEditor"
import DisbursedLeadsTable from "./components/DisbursedLeadsTable"
import PartnerPayoutTable from "./components/PartnerPayoutTable"
import PayoutHistoryTable from "./components/PayoutHistoryTable"
import { useAppSelector } from "../../hooks/useAppSelector"
import { isPartnerUser } from "../../store/slices/userDataSlice"

const CommissionDashboard = () => {
  const { userRole } = useAuth()
  const dispatch = useAppDispatch()
  const { plans, loading, error } = useAppSelector((state) => state.commission)
  const { userData } = useAppSelector((state) => state.userData)
  const [activeTab, setActiveTab] = useState(0)
  const [hasLoadedCommissionData, setHasLoadedCommissionData] = useState(false)

  // No API calls on mount - clean initial load
  useEffect(() => {
    // Removed all API calls from initial mount
  }, [dispatch])

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue)

    // Check if we're switching to Commission Grid tab and haven't loaded data yet
    const isCommissionGridTab = (userRole === "admin" && newValue === 2) || (userRole === "partner" && newValue === 2)

    if (isCommissionGridTab && !hasLoadedCommissionData) {
      // Load both userData and commission data when Commission Grid tab is clicked
      dispatch(fetchUserData())
      dispatch(fetchCommissionData())
      setHasLoadedCommissionData(true)
    }
  }

  const adminTabLabels = ["Disbursed Leads", "Partner Payouts", "Commission Grid"]
  const partnerTabLabels = ["Disbursed Leads", "Payout History", "My Commission Grid"]

  const tabLabels = userRole === "admin" ? adminTabLabels : partnerTabLabels

  // Check if partner has leadSharing role
  const isLeadSharingPartner =
    userRole === "partner" && isPartnerUser(userData) && userData.personalInfo?.roleSelection === "leadSharing"

  // Show loading only when on Commission Grid tab and loading
  const showCommissionLoading =
    ((userRole === "admin" && activeTab === 2) || (userRole === "partner" && activeTab === 2)) &&
    loading &&
    !hasLoadedCommissionData

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Commission Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {/* Show loading only for Commission Grid tab */}
      {showCommissionLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      )}

      {/* Show error only for Commission Grid tab */}
      {error && ((userRole === "admin" && activeTab === 2) || (userRole === "partner" && activeTab === 2)) && (
        <Box>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Disbursed Leads Tab - Both Admin and Partner */}
      {activeTab === 0 && <DisbursedLeadsTable />}

      {/* Admin-only tabs */}
      {userRole === "admin" && (
        <>
          {activeTab === 1 && <PartnerPayoutTable />}
          {activeTab === 2 && !showCommissionLoading && !error && <CommissionGridEditor plans={plans} />}
        </>
      )}

      {/* Partner-only tabs */}
      {userRole === "partner" && (
        <>
          {activeTab === 1 && <PayoutHistoryTable />}
          {activeTab === 2 && !showCommissionLoading && !error && (
            <>
              {isLeadSharingPartner ? (
                <Paper
                  elevation={1}
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: "#fff8f0",
                    border: "1px solid #ffe0b2",
                  }}
                >
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Lead Sharing Info
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Commission Rate is <strong>fixed at 1.5%</strong> across all lenders and loan types.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To earn higher commissions (2.5% - 3%), switch to the <strong>File Sharing</strong> role. In this
                    role, you will be required to upload complete loan documents via the <strong>Resources</strong> tab
                    and coordinate with our team via <strong>Help & Support</strong>.
                  </Typography>
                </Paper>
              ) : (
                <CommissionGridEditor plans={plans} />
              )}
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default CommissionDashboard
