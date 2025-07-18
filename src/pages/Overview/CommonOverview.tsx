"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Grid } from "@mui/material"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store"
import {
  fetchFunnelData,
  fetchSnapshotData,
  fetchRejectionReasonCount,
  fetchMatrix,
} from "../../store/slices/dashboardSlice"
import { useAuth } from "../../hooks/useAuth"
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

  const [loanType, setLoanType] = useState("all")
  const [associateId, setAssociateId] = useState("all")
  const [month, setMonth] = useState("current")
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)

  // Check if partner documents have been accepted
  useEffect(() => {
    if (userRole === "partner") {
      const documentsAccepted = localStorage.getItem("partner_documents_accepted")
      if (!documentsAccepted) {
        setShowDocumentDialog(true)
      }
    }
  }, [userRole])

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

  const handleDocumentAccept = () => {
    setShowDocumentDialog(false)
  }

  const handleDocumentClose = () => {
    // For partners, we don't allow closing without accepting
    // You might want to redirect them or show a warning
    if (userRole === "partner") {
      // Optionally show a warning or prevent closing
      return
    }
    setShowDocumentDialog(false)
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
      />
    </>
  )
}

export default CommonOverview
