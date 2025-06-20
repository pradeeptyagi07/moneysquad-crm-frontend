"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, Box, Typography, Tabs, Tab, IconButton, Chip, Avatar } from "@mui/material"
import { Close, AccountBalance, Description, Person } from "@mui/icons-material"
import BankChangeRequestCard from "./BankChangeRequestCard"
import DocumentChangeRequestCard from "./DocumentChangeRequestCard"
import type { Partner } from "../../../store/slices/managePartnerSlice"
import type { PartnerChangeRequests } from "../types/changeRequestTypes"

interface PartnerChangeRequestDialogProps {
  open: boolean
  onClose: () => void
  partner: Partner | null
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`change-request-tabpanel-${index}`}
      aria-labelledby={`change-request-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const PartnerChangeRequestDialog: React.FC<PartnerChangeRequestDialogProps> = ({ open, onClose, partner }) => {
  const [tabValue, setTabValue] = useState(0)
  const [changeRequests, setChangeRequests] = useState<PartnerChangeRequests | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration - replace with actual API call
  const mockChangeRequests: PartnerChangeRequests = {
    partnerId: partner?.partnerId || "",
    partnerName: partner?.basicInfo?.fullName || "",
    bankRequests: [
      {
        id: "bank_req_1",
        type: "bank",
        submittedAt: "2024-01-15T10:30:00Z",
        reason: "Changed primary bank account for better transaction rates",
        status: "pending",
        currentData: {
          bankName: "HDFC Bank",
          accountNumber: "****1234",
          ifscCode: "HDFC0001234",
          accountHolderName: "John Doe",
          branchName: "Mumbai Central",
        },
        requestedData: {
          bankName: "State Bank of India",
          accountNumber: "****5678",
          ifscCode: "SBIN0005678",
          accountHolderName: "John Doe",
          branchName: "Mumbai Fort",
        },
      },
    ],
    documentRequests: [
      {
        id: "doc_req_1",
        type: "document",
        documentType: "panCard",
        submittedAt: "2024-01-14T14:20:00Z",
        reason: "Updated PAN card with corrected name spelling",
        status: "pending",
        currentDocument: {
          id: "doc_1",
          name: "pan_old.pdf",
          url: "/placeholder.svg?height=400&width=600",
          type: "application/pdf",
          size: 245760,
          uploadedAt: "2023-12-01T10:00:00Z",
        },
        newDocument: {
          id: "doc_2",
          name: "pan_new.pdf",
          url: "/placeholder.svg?height=400&width=600",
          type: "application/pdf",
          size: 267890,
          uploadedAt: "2024-01-14T14:20:00Z",
        },
      },
      {
        id: "doc_req_2",
        type: "document",
        documentType: "aadharCard",
        submittedAt: "2024-01-13T09:15:00Z",
        reason: "Address change in Aadhar card",
        status: "pending",
        currentDocument: {
          id: "doc_3",
          name: "aadhar_old.pdf",
          url: "/placeholder.svg?height=400&width=600",
          type: "application/pdf",
          size: 189456,
          uploadedAt: "2023-11-15T12:30:00Z",
        },
        newDocument: {
          id: "doc_4",
          name: "aadhar_new.pdf",
          url: "/placeholder.svg?height=400&width=600",
          type: "application/pdf",
          size: 201234,
          uploadedAt: "2024-01-13T09:15:00Z",
        },
      },
    ],
    totalPending: 3,
  }

  useEffect(() => {
    if (open && partner) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setChangeRequests(mockChangeRequests)
        setLoading(false)
      }, 500)
    }
  }, [open, partner])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleApproveRequest = (requestId: string, adminNotes?: string) => {
    console.log("Approving request:", requestId, adminNotes)
    // Implement API call to approve request
  }

  const handleDeclineRequest = (requestId: string, reason: string) => {
    console.log("Declining request:", requestId, reason)
    // Implement API call to decline request
  }

  if (!partner) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "70vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          py: 3,
          pr: 8, // Add right padding to prevent collision with close button
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={partner.documents?.profilePhoto} sx={{ width: 48, height: 48 }}>
            <Person />
          </Avatar>
          <Box sx={{ flex: 1, mr: 2 }}>
            {" "}
            {/* Add margin right */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Change Requests - {partner.basicInfo?.fullName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Partner ID: {partner.partnerId}
            </Typography>
          </Box>
          <Chip
            label={`${changeRequests?.totalPending || 0} Pending`}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              mr: 1, // Add margin to prevent collision
            }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16, // Increase right position
            top: 16, // Increase top position
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: "transparent" }}>
        <Box sx={{ bgcolor: "white", borderRadius: "0 0 24px 24px", overflow: "hidden" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "grey.50",
              "& .MuiTab-root": {
                minHeight: 64,
                fontWeight: 600,
                minWidth: 200, // Set minimum width for tabs
              },
            }}
          >
            <Tab
              icon={<AccountBalance />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Bank Requests</span>
                  <Chip
                    label={changeRequests?.bankRequests?.length || 0}
                    size="small"
                    color="primary"
                    sx={{ minWidth: 24, height: 20 }}
                  />
                </Box>
              }
              iconPosition="start"
            />
            <Tab
              icon={<Description />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Document Requests</span>
                  <Chip
                    label={changeRequests?.documentRequests?.length || 0}
                    size="small"
                    color="primary"
                    sx={{ minWidth: 24, height: 20 }}
                  />
                </Box>
              }
              iconPosition="start"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              {loading ? (
                <Typography>Loading bank requests...</Typography>
              ) : changeRequests?.bankRequests?.length ? (
                changeRequests.bankRequests.map((request) => (
                  <BankChangeRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApproveRequest}
                    onDecline={handleDeclineRequest}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <AccountBalance sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No Bank Change Requests
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    All bank details are up to date
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              {loading ? (
                <Typography>Loading document requests...</Typography>
              ) : changeRequests?.documentRequests?.length ? (
                changeRequests.documentRequests.map((request) => (
                  <DocumentChangeRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApproveRequest}
                    onDecline={handleDeclineRequest}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Description sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No Document Change Requests
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    All documents are up to date
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default PartnerChangeRequestDialog
