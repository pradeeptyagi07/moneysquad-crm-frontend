import { Grid } from "@mui/material"
import AdminSnapshotCards from "./AdminSnapshotCards"
import AdminDisbursalTrend from "./AdminDisbursalTrend"
import AdminTopPerformers from "./AdminTopPerformers"
import AdminLoanFunnel from "./AdminLoanFunnel"
import AdminProductMetrics from "./AdminProductMetrics"
import AdminPartnerPerformance from "./AdminPartnerPerformance"
import AdminManagerPerformance from "./AdminManagerPerformance"
import AdminFilterPanel from "./AdminFilterPanel"
import AdminRejectionReasons from "./AdminRejectionReason"

const AdminDashboard = () => {
  return (
    <div className="space-y-0">
  
      {/* Filter Panel */}
      <AdminFilterPanel />

      {/* Snapshot Cards */}
      <AdminSnapshotCards />

      {/* First Row - Disbursal Trends and Top Performers */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <AdminDisbursalTrend />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AdminTopPerformers />
        </Grid>
      </Grid>

      {/* Second Row - Loan Funnel and Rejection Reasons */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <AdminLoanFunnel />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AdminRejectionReasons />
        </Grid>
      </Grid>

      {/* Third Row - Product Metrics (Full Width) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AdminProductMetrics />
        </Grid>
      </Grid>

      {/* Fourth Row - Partner Performance Report (Full Width) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AdminPartnerPerformance />
        </Grid>
      </Grid>

      {/* Fifth Row - Manager Performance Report (Full Width) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AdminManagerPerformance />
        </Grid>
      </Grid>
    </div>
  )
}

export default AdminDashboard
