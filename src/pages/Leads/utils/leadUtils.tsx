import type { Theme } from "@mui/material"
import type { LeadStatus } from "../../../data/leadTypes"
import { AccessTime, CheckCircle, Close, Pending, MonetizationOn, Archive, HourglassEmpty } from "@mui/icons-material"

// Format currency values
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get color for lead status
export const getStatusColor = (status: LeadStatus, theme: Theme): string => {
  switch (status) {
    case "pending":
      return theme.palette.warning.main
    case "login":
      return theme.palette.info.main
    case "approved":
      return theme.palette.success.main
    case "rejected":
      return theme.palette.error.main
    case "disbursed":
      return theme.palette.primary.main
    case "closed":
      return theme.palette.success.dark
    case "expired":
      return theme.palette.text.disabled
    default:
      return theme.palette.text.primary
  }
}

// Get icon for lead status
export const getStatusIcon = (status: LeadStatus) => {
  switch (status) {
    case "pending":
      return <Pending fontSize="small" />
    case "login":
      return <AccessTime fontSize="small" />
    case "approved":
      return <CheckCircle fontSize="small" />
    case "rejected":
      return <Close fontSize="small" />
    case "disbursed":
      return <MonetizationOn fontSize="small" />
    case "closed":
      return <Archive fontSize="small" />
    case "expired":
      return <HourglassEmpty fontSize="small" />
    default:
      return <Pending fontSize="small" />
  }
}
