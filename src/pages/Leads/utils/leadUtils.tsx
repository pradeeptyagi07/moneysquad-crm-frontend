import type { Theme } from "@mui/material"
import type { LeadStatus } from "../../../data/leadTypes"
import { AccessTime, CheckCircle, Close, Pending, MonetizationOn, Archive, HourglassEmpty, PersonAdd } from "@mui/icons-material"

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
      return theme.palette.error.main
    case "approved":
      return theme.palette.info.main
    case "rejected":
      return theme.palette.error.main
    case "disbursed":
      return theme.palette.primary.main
    case "closed":
      return theme.palette.success.dark
    case "expired":
      return theme.palette.text.disabled
    default:
      return theme.palette.text.secondary
  }
}

// Get icon for lead status
export function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return Pending
    case "login":
      return AccessTime
    case "approved":
      return CheckCircle
    case "rejected":
      return Close
    case "disbursed":
      return MonetizationOn
    case "closed":
      return Archive
    case "expired":
      return HourglassEmpty
    case "new lead":
      return PersonAdd
    default:
      return Pending
  }
}
