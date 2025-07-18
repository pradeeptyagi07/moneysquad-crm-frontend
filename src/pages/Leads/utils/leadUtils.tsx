import type { Theme } from "@mui/material";
import type { LeadStatus } from "../../../data/leadTypes";
import {
  AccessTime,
  CheckCircle,
  Close,
  Pending,
  MonetizationOn,
  Archive,
  HourglassEmpty,
  PersonAdd,
} from "@mui/icons-material";

// Format currency values
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
;
// Get color for lead status
export const getStatusColor = (status: LeadStatus, theme: Theme): string => {
  switch (status) {
    case "new lead":
      return "#6BC6D4";
    case "pending":
      return "#FFD85A";
    case "login":
      return "#8B9EFF";
    case "approved":
      return "#6FD58A";
    case "rejected":
      return "#F0808B";
    case "disbursed":
      return " #12AA9E";
    case "closed":
      return "#A9B1B7";
    case "expired":
      return theme.palette.text.disabled;
    default:
      return theme.palette.text.secondary;
  }
};

// Get icon for lead status
export function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return Pending;
    case "login":
      return AccessTime;
    case "approved":
      return CheckCircle;
    case "rejected":
      return Close;
    case "disbursed":
      return MonetizationOn;
    case "closed":
      return Archive;
    case "expired":
      return HourglassEmpty;
    case "new lead":
      return PersonAdd;
    default:
      return Pending;
  }
}
