"use client"

import type React from "react"
import { useEffect } from "react"
import { Box, Typography, Card, CardContent, Grid, Chip, Paper, CircularProgress } from "@mui/material"
import { AccountBalance, Description, CheckCircle, Schedule, Cancel } from "@mui/icons-material"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import {
  fetchPartnerRequests,
  selectPartnerRequests,
  selectFetchLoading,
  selectFetchError,
} from "../../../store/slices/changeRequestSlice"
import { useAppSelector } from "../../../hooks/useAppSelector"

const RequestChangeSummary: React.FC = () => {
  const dispatch = useAppDispatch()
  const requests = useAppSelector(selectPartnerRequests)
  const loading = useAppSelector(selectFetchLoading)
  const error = useAppSelector(selectFetchError)

  useEffect(() => {
    dispatch(fetchPartnerRequests())
  }, [dispatch])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning"
      case "approved":
        return "success"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Schedule fontSize="small" />
      case "approved":
        return <CheckCircle fontSize="small" />
      case "rejected":
        return <Cancel fontSize="small" />
      default:
        return null
    }
  }

  // Process requests data
  const bankRequests = requests.filter((req) => req.requestType === "bankDetails")
  const documentRequests = requests.filter((req) => req.requestType === "documents")

  // Calculate summary
  const summary = {
    pending: requests.filter((req) => req.status === "pending").length,
    approved: requests.filter((req) => req.status === "approved").length,
    rejected: requests.filter((req) => req.status === "rejected").length,
  }

  // Helper function to get changed fields for bank details
  const getBankChanges = (previousData: any, currentData: any) => {
    const changes: string[] = []
    Object.keys(currentData).forEach((key) => {
      if (previousData[key] !== currentData[key]) {
        // Convert camelCase to readable format
        const readableKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
        changes.push(readableKey)
      }
    })
    return changes
  }

  // Helper function to get document names and count
  const getDocumentInfo = (currentData: any) => {
    const documentNames: string[] = []
    let fileCount = 0

    Object.keys(currentData).forEach((key) => {
      // Convert camelCase to readable format
      const readableName = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      documentNames.push(readableName)

      // Count files (some might be arrays)
      if (Array.isArray(currentData[key])) {
        fileCount += currentData[key].length
      } else {
        fileCount += 1
      }
    })

    return { documentNames, fileCount }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Summary Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ textAlign: "center", bgcolor: "#fff3e0", py: 1 }}>
            <CardContent sx={{ py: "8px !important" }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#f57c00" }}>
                {summary.pending}
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
                {summary.approved}
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
                {summary.rejected}
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
              {bankRequests.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  No bank detail change requests
                </Typography>
              ) : (
                bankRequests.map((request) => {
                  const changes = getBankChanges(request.previousData, request.currentData)
                  return (
                    <Card key={request._id} sx={{ border: "1px solid #e0e0e0" }}>
                      <CardContent sx={{ py: "12px !important" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {request._id.slice(-8).toUpperCase()}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(request.status)}
                            label={request.status.toUpperCase()}
                            color={getStatusColor(request.status) as any}
                            size="small"
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                          {formatDate(request.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          {changes.length > 0 ? changes.join(", ") : "No changes detected"}
                        </Typography>
                        {/* Show approve/reject message if available */}
                        {request.status === "approved" && request.approveMessage && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.75rem", color: "#4caf50", mt: 0.5, fontStyle: "italic" }}
                          >
                            ✓ {request.approveMessage}
                          </Typography>
                        )}
                        {request.status === "rejected" && request.rejectMessage && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.75rem", color: "#f44336", mt: 0.5, fontStyle: "italic" }}
                          >
                            ✗ {request.rejectMessage}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
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
              {documentRequests.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  No document change requests
                </Typography>
              ) : (
                documentRequests.map((request) => {
                  const { documentNames, fileCount } = getDocumentInfo(request.currentData)
                  return (
                    <Card key={request._id} sx={{ border: "1px solid #e0e0e0" }}>
                      <CardContent sx={{ py: "12px !important" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {request._id.slice(-8).toUpperCase()}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(request.status)}
                            label={request.status.toUpperCase()}
                            color={getStatusColor(request.status) as any}
                            size="small"
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                          {formatDate(request.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          {documentNames.join(", ")} ({fileCount} files)
                        </Typography>
                        {/* Show approve/reject message if available */}
                        {request.status === "approved" && request.approveMessage && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.75rem", color: "#4caf50", mt: 0.5, fontStyle: "italic" }}
                          >
                            ✓ {request.approveMessage}
                          </Typography>
                        )}
                        {request.status === "rejected" && request.rejectMessage && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.75rem", color: "#f44336", mt: 0.5, fontStyle: "italic" }}
                          >
                            ✗ {request.rejectMessage}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RequestChangeSummary
