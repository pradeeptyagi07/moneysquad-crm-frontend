"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Grid, Alert, Snackbar } from "@mui/material"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store"
import {
  fetchFunnelData,
  fetchSnapshotData,
  fetchRejectionReasonCount,
  fetchMatrix,
} from "../../store/slices/dashboardSlice"
import {
  fetchUserData,
  acceptPartnerAgreement,
  selectUserData,
  selectAcceptingAgreement,
  selectAgreementError,
  isPartnerUser,
  clearError,
} from "../../store/slices/userDataSlice"
import { useAuth } from "../../hooks/useAuth"
import { useAppSelector } from "../../hooks/useAppSelector"
import PerformanceMetrics from "./components/PerformanceMetrics"
import FunnelChart from "./components/FunnelChart"
import RejectionReasonsChart from "./components/RejectionReasonChart"
import SnapshotCards from "./components/SnapshotCards"
import TrendsChart from "./components/TrendsChart"
import GlobalFilters from "./components/GlobalFilters"
import DocumentAgreementDialog from "../../components/Layout/DocumentAgreementDialog"

function computePeriod(month: string): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = now.getMonth() + 1
  const pad2 = (n: number) => n.toString().padStart(2, "0")

  if (month === "last") {
    const lastMonth = mm === 1 ? 12 : mm - 1
    const yearOfLast = mm === 1 ? yyyy - 1 : yyyy
    return `${yearOfLast}-${pad2(lastMonth)}`
  }
  return `${yyyy}-${pad2(mm)}`
}

const CommonOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { userRole } = useAuth()

  // Redux selectors
  const userData = useAppSelector(selectUserData)
  const acceptingAgreement = useAppSelector(selectAcceptingAgreement)
  const agreementError = useAppSelector(selectAgreementError)

  // Dashboard filters
  const [loanType, setLoanType] = useState("all")
  const [associateId, setAssociateId] = useState("all")
  const [month, setMonth] = useState("current")

  // Agreement dialog state
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)
  const [agreementAcceptedLocally, setAgreementAcceptedLocally] = useState(false)

  // Notification state
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationSeverity, setNotificationSeverity] = useState<"success" | "error">("success")

  // Fetch user data only once on component mount for partners
  useEffect(() => {
    if (userRole === "partner") {
      dispatch(fetchUserData()).then((result) => {
        if (result.type === "userData/fetchUserData/fulfilled") {
          const user = result.payload
          if (isPartnerUser(user) && (user.agreementAccepted === false || user.agreementAccepted === undefined)) {
            // Only show dialog if not already accepted locally
            if (!agreementAcceptedLocally) {
              setShowDocumentDialog(true)
            }
          }
        }
      })
    }
  }, [userRole, dispatch, agreementAcceptedLocally])

  // Handle agreement error notifications
  useEffect(() => {
    if (agreementError) {
      setNotificationMessage(agreementError)
      setNotificationSeverity("error")
      setShowNotification(true)
      dispatch(clearError())
      // Reset local acceptance flag on error
      setAgreementAcceptedLocally(false)
    }
  }, [agreementError, dispatch])

  // Fetch dashboard data
  useEffect(() => {
    const params: any = {}
    if (loanType !== "all") params.loanType = loanType
    if (associateId !== "all") params.associateId = associateId
    if (month !== "current") params.period = computePeriod(month)

    dispatch(fetchFunnelData(params))
    dispatch(fetchSnapshotData(params))
    dispatch(fetchRejectionReasonCount(params))
    dispatch(fetchMatrix(params))
  }, [loanType, associateId, month, dispatch])

  const handleDocumentAccept = async () => {
    try {
      await dispatch(acceptPartnerAgreement()).unwrap()

      // Mark as accepted locally to prevent dialog from showing again
      setAgreementAcceptedLocally(true)

      // Hide dialog and show success message
      setShowDocumentDialog(false)
      setNotificationMessage("Agreement accepted successfully!")
      setNotificationSeverity("success")
      setShowNotification(true)
    } catch (error) {
      console.error("Failed to accept agreement:", error)
      // Error notification will be handled by the useEffect for agreementError
    }
  }

  const handleDocumentClose = () => {
    // For partners, show warning that agreement is required
    if (userRole === "partner") {
      setNotificationMessage("Please accept the agreement to continue using the platform.")
      setNotificationSeverity("error")
      setShowNotification(true)
      return
    }
    setShowDocumentDialog(false)
  }

  const handleNotificationClose = () => {
    setShowNotification(false)
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <GlobalFilters
            loanType={loanType}
            onLoanTypeChange={setLoanType}
            associateId={associateId}
            onAssociateChange={setAssociateId}
            month={month}
            onMonthChange={setMonth}
          />
        </Grid>

        <Grid item xs={12}>
          <SnapshotCards />
        </Grid>

        <Grid item xs={12} lg={6}>
          <TrendsChart loanType={loanType} associateId={associateId} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <PerformanceMetrics />
        </Grid>

        <Grid item xs={12} lg={6}>
          <FunnelChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RejectionReasonsChart />
        </Grid>
      </Grid>

      {/* Document Agreement Dialog for Partners */}
      <DocumentAgreementDialog
        open={showDocumentDialog}
        onClose={handleDocumentClose}
        onAccept={handleDocumentAccept}
        loading={acceptingAgreement}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notificationSeverity}
          variant="outlined"
          sx={{ width: "100%" }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default CommonOverview
