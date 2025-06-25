"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import SupportCards from "./SupportCards"
import LeadDocumentSection from "./LeadDocumentSection"
import ContactInfoCards from "./ContactInfoCards"
import EditHelpSupportDialog from "./EditHelpSupportDialog"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import {
  fetchSupportData,
  selectSupportData,
  selectSupportLoading,
  selectSupportError,
  clearError,
} from "../../store/slices/resourceAndSupportSlice"
import { useAuth } from "../../hooks/useAuth"

const HelpSupportMain = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const dispatch = useAppDispatch()

  const supportData = useAppSelector(selectSupportData)
  const loading = useAppSelector(selectSupportLoading)
  const error = useAppSelector(selectSupportError)

  const { userRole } = useAuth() // ✅ Get role from AuthContext
  const isAdmin = userRole === "admin"  // ✅ Define admin logic

  useEffect(() => {
    dispatch(fetchSupportData())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // Transform API data to component format
  const transformedSupportData = supportData
    ? {
        email: {
          title: "Email Support",
          description: "Reach out to us via email",
          contact: supportData.email.contact,
          timing: supportData.email.timing,
        },
        phone: {
          title: "Phone Support",
          description: "Speak with our support team",
          contact: supportData.phone.contact,
          timing: supportData.phone.timing,
        },
        whatsapp: {
          title: "WhatsApp",
          description: "Chat with us instantly",
          contact: supportData.whatsapp.contact,
          timing: supportData.whatsapp.timing,
        },
        office: {
          title: "Office Visit",
          description: "Book an appointment to visit",
          contact: supportData.office.contact,
          timing: supportData.office.timing,
        },
      }
    : null

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading support information...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  if (!supportData || !transformedSupportData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="body1" color="text.secondary">
          No support data available
        </Typography>
      </Box>
    )
  }

  return (
    <Box position="relative">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" fontWeight={600}>
          Help & Support
        </Typography>
        {isAdmin && (
          <IconButton
            onClick={() => setIsDialogOpen(true)}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            <EditIcon />
          </IconButton>
        )}
      </Stack>

      <SupportCards data={transformedSupportData} />
      <Divider sx={{ my: 4 }} />
      <LeadDocumentSection data={supportData.leadEmails} />
      <Divider sx={{ my: 4 }} />
      <ContactInfoCards data={{ grievance: supportData.grievance, payout: supportData.payout }} />

      {isAdmin && (
        <EditHelpSupportDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          supportData={supportData}
        />
      )}
    </Box>
  )
}

export default HelpSupportMain
