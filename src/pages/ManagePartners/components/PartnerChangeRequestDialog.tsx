"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, Box, Typography, Tabs, Tab, IconButton, Chip, Avatar } from "@mui/material"
import { Close, AccountBalance, Description, Person } from "@mui/icons-material"
import BankChangeRequestCard from "./BankChangeRequestCard"
import DocumentChangeRequestCard from "./DocumentChangeRequestCard"
import type { Partner } from "../../../store/slices/managePartnerSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import {
  fetchAdminRequests,
  selectAdminRequests,
  selectAdminFetchLoading,
  selectAdminFetchError,
  updateRequestStatus,
  selectActionLoading,
  clearActionState,
} from "../../../store/slices/changeRequestSlice"
import { useAppSelector } from "../../../hooks/useAppSelector"

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
  const dispatch = useAppDispatch()
  const [tabValue, setTabValue] = useState(0)

  // Redux selectors
  const requests = useAppSelector(selectAdminRequests)
  const loading = useAppSelector(selectAdminFetchLoading)
  const error = useAppSelector(selectAdminFetchError)
  const actionLoading = useAppSelector(selectActionLoading)

  // Filter requests by type
  const bankRequests = requests.filter((req) => req.requestType === "bankDetails")
  const documentRequests = requests.filter((req) => req.requestType === "documents")
  const totalPending = requests.filter((req) => req.status === "pending").length

  useEffect(() => {
    if (open && partner?._id) {
      // Use the actual _id from partner data, not partnerId
      console.log("Fetching requests for partner _id:", partner._id)
      dispatch(fetchAdminRequests(partner._id))
    }
  }, [open, partner?._id, dispatch])

  useEffect(() => {
    // Clear action state when dialog closes
    if (!open) {
      dispatch(clearActionState())
    }
  }, [open, dispatch])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleApproveRequest = async (requestId: string, adminNotes?: string) => {
    try {
      await dispatch(
        updateRequestStatus({
          requestId,
          status: "approved",
          message: adminNotes,
        }),
      ).unwrap()

      // Refresh requests after successful action using _id
      if (partner?._id) {
        console.log("Refreshing requests after approve...")
        dispatch(fetchAdminRequests(partner._id))
      }
    } catch (error) {
      console.error("Failed to approve request:", error)
    }
  }

  const handleDeclineRequest = async (requestId: string, reason: string) => {
    try {
      await dispatch(
        updateRequestStatus({
          requestId,
          status: "rejected",
          message: reason,
        }),
      ).unwrap()

      // Refresh requests after successful action using _id
      if (partner?._id) {
        console.log("Refreshing requests after decline...")
        dispatch(fetchAdminRequests(partner._id))
      }
    } catch (error) {
      console.error("Failed to decline request:", error)
    }
  }

  // Transform API data to match existing component structure
  const transformBankRequest = (apiRequest: any) => ({
    id: apiRequest._id,
    type: "bank",
    submittedAt: apiRequest.createdAt,
    reason: apiRequest.reason || "No reason provided",
    status: apiRequest.status,
    currentData: {
      accountType: apiRequest.previousData.accountType,
      accountHolderName: apiRequest.previousData.accountHolderName,
      bankName: apiRequest.previousData.bankName,
      accountNumber: apiRequest.previousData.accountNumber,
      ifscCode: apiRequest.previousData.ifscCode,
      branchName: apiRequest.previousData.branchName,
      relationshipWithAccountHolder: apiRequest.previousData.relationshipWithAccountHolder,
      isGstBillingApplicable: apiRequest.previousData.isGstBillingApplicable,
    },
    requestedData: {
      accountType: apiRequest.currentData.accountType,
      accountHolderName: apiRequest.currentData.accountHolderName,
      bankName: apiRequest.currentData.bankName,
      accountNumber: apiRequest.currentData.accountNumber,
      ifscCode: apiRequest.currentData.ifscCode,
      branchName: apiRequest.currentData.branchName,
      relationshipWithAccountHolder: apiRequest.currentData.relationshipWithAccountHolder,
      isGstBillingApplicable: apiRequest.currentData.isGstBillingApplicable,
    },
  })

  // Transform document request to show all documents in one card
  const transformDocumentRequest = (apiRequest: any) => ({
    id: apiRequest._id,
    type: "document",
    submittedAt: apiRequest.createdAt,
    reason: apiRequest.reason || "No reason provided",
    status: apiRequest.status,
    previousData: apiRequest.previousData,
    currentData: apiRequest.currentData,
  })

  // Enhanced empty state component
  const EmptyState = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
        }}
      >
        <Icon sx={{ fontSize: 48, color: "grey.400" }} />
      </Box>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 400, mx: "auto" }}>
        {description}
      </Typography>
    </Box>
  )

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
          pr: 8,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={partner.documents?.profilePhoto} sx={{ width: 48, height: 48 }}>
            <Person />
          </Avatar>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Change Requests - {partner.basicInfo?.fullName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Partner ID: {partner.partnerId}
            </Typography>
          </Box>
          <Chip
            label={`${totalPending} Pending`}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              mr: 1,
            }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
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
                minWidth: 200,
              },
            }}
          >
            <Tab
              icon={<AccountBalance />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Bank Requests</span>
                  <Chip label={bankRequests.length} size="small" color="primary" sx={{ minWidth: 24, height: 20 }} />
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
                    label={documentRequests.length}
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
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Loading bank requests...
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    Please wait while we fetch the latest requests
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                    Error Loading Requests
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    {error}
                  </Typography>
                </Box>
              ) : bankRequests.length ? (
                bankRequests.map((request) => (
                  <BankChangeRequestCard
                    key={request._id}
                    request={transformBankRequest(request)}
                    onApprove={handleApproveRequest}
                    onDecline={handleDeclineRequest}
                  />
                ))
              ) : (
                <EmptyState
                  icon={AccountBalance}
                  title="No Bank Change Requests"
                  description="This partner hasn't submitted any bank details change requests yet. All bank information appears to be up to date."
                />
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              {loading ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Loading document requests...
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    Please wait while we fetch the latest requests
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                    Error Loading Requests
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    {error}
                  </Typography>
                </Box>
              ) : documentRequests.length ? (
                documentRequests.map((request) => (
                  <DocumentChangeRequestCard
                    key={request._id}
                    request={transformDocumentRequest(request)}
                    onApprove={handleApproveRequest}
                    onDecline={handleDeclineRequest}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Description}
                  title="No Document Change Requests"
                  description="This partner hasn't submitted any document change requests yet. All documents appear to be current and properly uploaded."
                />
              )}
            </Box>
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default PartnerChangeRequestDialog
