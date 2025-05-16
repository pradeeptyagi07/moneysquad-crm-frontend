"use client"

import React from "react"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Typography,
} from "@mui/material"
import { Person, CheckCircle, Cancel, CompareArrows } from "@mui/icons-material"
import type { Partner } from "../types/partnerTypes"

// Mock edit request data structure
interface EditRequest {
  requestId: string
  partnerId: string
  partnerName: string
  partnerEmail: string
  requestDate: string
  fieldName: string
  oldValue: string
  newValue: string
  status: "pending" | "approved" | "rejected"
}

// Mock data for edit requests
const mockEditRequests: EditRequest[] = [
  {
    requestId: "REQ001",
    partnerId: "PTR001",
    partnerName: "Rajesh Kumar",
    partnerEmail: "rajesh.kumar@example.com",
    requestDate: "2025-05-10T10:30:00",
    fieldName: "mobileNumber",
    oldValue: "+91 9876543210",
    newValue: "+91 9876543212",
    status: "pending",
  },
  {
    requestId: "REQ002",
    partnerId: "PTR002",
    partnerName: "Priya Sharma",
    partnerEmail: "priya.sharma@example.com",
    requestDate: "2025-05-12T14:15:00",
    fieldName: "addressLine1",
    oldValue: "456 Business Park",
    newValue: "789 Corporate Tower",
    status: "pending",
  },
  {
    requestId: "REQ003",
    partnerId: "PTR004",
    partnerName: "Sneha Reddy",
    partnerEmail: "sneha.reddy@example.com",
    requestDate: "2025-05-14T09:45:00",
    fieldName: "bankName",
    oldValue: "Axis Bank",
    newValue: "HDFC Bank",
    status: "pending",
  },
]

interface PartnerEditRequestsTableProps {
  partners: Partner[]
}

const PartnerEditRequestsTable: React.FC<PartnerEditRequestsTableProps> = ({ partners }) => {
  const [editRequests, setEditRequests] = React.useState<EditRequest[]>(mockEditRequests)

  const handleApproveRequest = (requestId: string) => {
    // In a real app, this would call an API to approve the request
    setEditRequests(
      editRequests.map((req) => (req.requestId === requestId ? { ...req, status: "approved" as const } : req)),
    )
  }

  const handleRejectRequest = (requestId: string) => {
    // In a real app, this would call an API to reject the request
    setEditRequests(
      editRequests.map((req) => (req.requestId === requestId ? { ...req, status: "rejected" as const } : req)),
    )
  }

  if (editRequests.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No edit requests found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Partner edit requests will appear here
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "grey.50" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Partner</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Request Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Current Value</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Requested Value</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editRequests.map((request) => {
            const partner = partners.find((p) => p.partnerId === request.partnerId)

            return (
              <TableRow key={request.requestId} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={partner?.profilePhoto} sx={{ mr: 2, bgcolor: "primary.main" }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {request.partnerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.partnerEmail}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(request.requestDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(request.requestDate).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {request.fieldName
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{request.oldValue}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        bgcolor: "success.lighter",
                        color: "success.dark",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {request.newValue}
                    </Typography>
                    <CompareArrows sx={{ mx: 1, color: "text.disabled", fontSize: 16 }} />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      request.status === "pending" ? "Pending" : request.status === "approved" ? "Approved" : "Rejected"
                    }
                    size="small"
                    color={
                      request.status === "pending" ? "warning" : request.status === "approved" ? "success" : "error"
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  {request.status === "pending" ? (
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton
                        color="success"
                        onClick={() => handleApproveRequest(request.requestId)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleRejectRequest(request.requestId)} size="small">
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      {request.status === "approved" ? "Approved" : "Rejected"}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PartnerEditRequestsTable
