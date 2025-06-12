// src/pages/Leads/components/StatusUpdateDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { fetchAllLeads, Lead, updateLeadStatus } from "../../../store/slices/leadSLice";

type LeadStatus =
  | "pending"
  | "login"
  | "approved"
  | "rejected"
  | "disbursed"
  | "closed"
  | "expired";

const rejectionOptions = [
  "Bad CIBIL Score / DPDs",
  "Recent EMI Bounces",
  "Past Settlement History",
  "Scorecard Reject",
  "Overleverage / Not eligible",
  "Hunter/Fraud Reject",
  "Income Criteria Not Matched",
  "Negative Profile / Area",
  "Insufficient Documents",
  "Negative Verification/FIs",
  "Multiple CIBIL Enqueries",
  "Large I/W Cheque returns",
  "Decline in Sales",
  "Poor Average Bank Balance",
  "Business in Loss",
  "High Debt Turnover Ratio",
  "New Loans taken recently",
  "High Obligation Turnover Ratio",
  "Already Login from elsewhere",
  "Recent Reject",
  "Others",
];

const closeReasonOptions = [
  "Customer Not Interested",
  "Cancelled by lender",
  "Not Doable/Junk Lead",
];

// Valid next‐status transitions
const statusTransitions: Record<LeadStatus, LeadStatus[]> = {
  pending: ["login"],
  login: ["approved", "rejected"],
  approved: ["disbursed", "closed"],
  disbursed: ["closed"],
  rejected: ["approved"],
  closed: [],
  expired: ["expired", "login"],
};

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  open,
  onClose,
  lead,
}) => {
  const dispatch = useAppDispatch();
  console.log("data",lead)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>("pending");
  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionProof, setRejectionProof] = useState<File | null>(null);
  const [approvedAmount, setApprovedAmount] = useState<string>("");
  const [closeReason, setCloseReason] = useState<string>("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Whenever we open with a new lead, reset everything
  // and capture the “original” status in both state & label.
  useEffect(() => {
    if (open && lead) {
      const orig: LeadStatus = (lead.status ?? "pending") as LeadStatus;
      setSelectedStatus(orig);
      setComment("");
      setRejectionReason("");
      setRejectionProof(null);
      setApprovedAmount("");
      setCloseReason("");
      setIsSubmitting(false);
    }
  }, [open, lead]);

  if (!open || !lead?.id) return null;

  // Use the lead’s STATUS for the label & for choosing next statuses
  const originalStatus = (lead.status ?? "pending") as LeadStatus;
  const currentStatusLabel =
    originalStatus.charAt(0).toUpperCase() + originalStatus.slice(1);

  const nextStatuses = statusTransitions[originalStatus] || [];

  const canSubmit = () => {
    if (!comment.trim() || selectedStatus === originalStatus) return false;
    if (selectedStatus === "rejected") return Boolean(rejectionReason.trim());
    if (selectedStatus === "approved") return Boolean(approvedAmount.trim());
    if (selectedStatus === "closed") return Boolean(closeReason.trim());
    return true;
  };

  const handleUpdate = async () => {
    if (!canSubmit()) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        updateLeadStatus({
          leadId: lead.id,
          statusData: {
            action: selectedStatus,
            comment,
            rejectReason:
              selectedStatus === "rejected" ? rejectionReason : undefined,
            rejectImage: rejectionProof || undefined,
            approvedAmount:
              selectedStatus === "approved" ? approvedAmount : undefined,
            closeReason:
              selectedStatus === "closed" ? closeReason : undefined,
          },
        })
      ).unwrap();

      dispatch(fetchAllLeads());
      setSnackbar({
        open: true,
        message: "Status updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        setSnackbar((s) => ({ ...s, open: false }));
        onClose();
      }, 800);
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err.message || String(err);
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Update Lead Status</Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* Lead ID */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Lead ID
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {lead.leadId}
            </Typography>
          </Box>

          {/* Current Status */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Current Status
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {currentStatusLabel}
            </Typography>
          </Box>

          {/* New Status */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={selectedStatus}
              label="New Status"
              onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
            >
              {nextStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Comment */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Rejection */}
          {selectedStatus === "rejected" && (
            <>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Rejection Reason</InputLabel>
                <Select
                  value={rejectionReason}
                  label="Rejection Reason"
                  onChange={(e) => setRejectionReason(e.target.value)}
                >
                  {rejectionOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 1 }}
              >
                Upload Rejection Proof (Optional)
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setRejectionProof(e.target.files?.[0] || null)
                  }
                />
              </Button>
              {rejectionProof && (
                <Typography variant="caption" color="textSecondary">
                  Selected file: {rejectionProof.name}
                </Typography>
              )}
            </>
          )}

          {/* Approval */}
          {selectedStatus === "approved" && (
            <TextField
              fullWidth
              type="number"
              label="Approved Amount"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
          )}

          {/* Closed */}
          {selectedStatus === "closed" && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Close Reason</InputLabel>
              <Select
                value={closeReason}
                label="Close Reason"
                onChange={(e) => setCloseReason(e.target.value)}
              >
                {closeReasonOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!canSubmit() || isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={20} /> : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StatusUpdateDialog;
