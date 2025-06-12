"use client"

import { Box, Typography, Paper } from "@mui/material"
import CommissionRateTable from "./CommissionRateTable"
import { useAuth } from "../../../hooks/useAuth"

const allGrids = {
  gold: [
    { lenderName: "HDFC Bank", termLoan: "2.5", overdraft: "2.3", remarks: "Gold grid logic" },
    { lenderName: "Axis Bank", termLoan: "2.4", overdraft: "2.2", remarks: "" }
  ],
  diamond: [
    { lenderName: "ICICI Bank", termLoan: "2.7", overdraft: "2.5", remarks: "Diamond grid notes" }
  ],
  platinum: [
    { lenderName: "Kotak Bank", termLoan: "3.0", overdraft: "2.8", remarks: "Platinum elite cases" }
  ]
}

const CommissionGridView = () => {
  const { user } = useAuth()
  const role = user?.role || "partner"
  const assignedGrid = user?.assignedGrid || "gold"
  const isLeadSharing = role === "lead-sharing"

  return (
    <Box>
      {/* Show info card only if user is in lead-sharing role */}
      {!isLeadSharing && (
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
            To earn higher commissions (2.5% - 3%), switch to the <strong>File Sharing</strong> role.
            In this role, you will be required to upload complete loan documents via the{" "}
            <strong>Resources</strong> tab and coordinate with our team via <strong>Help & Support</strong>.
          </Typography>
        </Paper>
      )}

      {/* Show grid with no heading for partner */}
      <CommissionRateTable data={allGrids[assignedGrid]} title={undefined} />
    </Box>
  )
}

export default CommissionGridView
