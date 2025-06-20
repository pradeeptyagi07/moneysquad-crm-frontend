import type React from "react"
import { Box, Typography, Card, CardContent, Grid, Chip, Paper } from "@mui/material"
import { AccountBalance, Description, CheckCircle, Schedule, Cancel } from "@mui/icons-material"

// Mock data for requests
const mockRequestData = {
  summary: {
    pending: 2,
    approved: 5,
    rejected: 1,
  },
  bankRequests: [
    {
      id: "REQ-BD-001",
      requestDate: "2024-01-15T10:30:00Z",
      status: "PENDING",
      changes: ["Account Number", "IFSC Code"],
    },
    {
      id: "REQ-BD-002",
      requestDate: "2024-01-10T14:20:00Z",
      status: "APPROVED",
      changes: ["Branch Name"],
    },
    {
      id: "REQ-BD-003",
      requestDate: "2024-01-05T09:15:00Z",
      status: "REJECTED",
      changes: ["Account Holder Name"],
    },
  ],
  documentRequests: [
    {
      id: "REQ-DOC-001",
      requestDate: "2024-01-12T16:45:00Z",
      status: "PENDING",
      documents: ["PAN Card", "Aadhar Front"],
      fileCount: 2,
    },
    {
      id: "REQ-DOC-002",
      requestDate: "2024-01-08T11:30:00Z",
      status: "APPROVED",
      documents: ["Bank Statement", "Address Proof"],
      fileCount: 2,
    },
    {
      id: "REQ-DOC-003",
      requestDate: "2024-01-03T13:20:00Z",
      status: "APPROVED",
      documents: ["GST Certificate"],
      fileCount: 1,
    },
  ],
}

const RequestChangeSummary: React.FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "APPROVED":
        return "success"
      case "REJECTED":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Schedule fontSize="small" />
      case "APPROVED":
        return <CheckCircle fontSize="small" />
      case "REJECTED":
        return <Cancel fontSize="small" />
      default:
        return null
    }
  }

  return (
    <Box>
      {/* Summary Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ textAlign: "center", bgcolor: "#fff3e0", py: 1 }}>
            <CardContent sx={{ py: "8px !important" }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#f57c00" }}>
                {mockRequestData.summary.pending}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: "center", bgcolor: "#e8f5e8", py: 1 }}>
            <CardContent sx={{ py: "8px !important" }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#4caf50" }}>
                {mockRequestData.summary.approved}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Approved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: "center", bgcolor: "#ffebee", py: 1 }}>
            <CardContent sx={{ py: "8px !important" }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#f44336" }}>
                {mockRequestData.summary.rejected}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Side by Side Requests */}
      <Grid container spacing={3}>
        {/* Bank Details Requests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AccountBalance sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Bank Details Changes
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {mockRequestData.bankRequests.map((request) => (
                <Card key={request.id} sx={{ border: "1px solid #e0e0e0" }}>
                  <CardContent sx={{ py: "12px !important" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {request.id}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(request.status)}
                        label={request.status}
                        color={getStatusColor(request.status) as any}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      {formatDate(request.requestDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {request.changes.join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Document Requests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Description sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Document Changes
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {mockRequestData.documentRequests.map((request) => (
                <Card key={request.id} sx={{ border: "1px solid #e0e0e0" }}>
                  <CardContent sx={{ py: "12px !important" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {request.id}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(request.status)}
                        label={request.status}
                        color={getStatusColor(request.status) as any}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      {formatDate(request.requestDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {request.documents.join(", ")} ({request.fileCount} files)
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RequestChangeSummary
