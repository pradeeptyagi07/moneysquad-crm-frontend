// src/pages/Leads/components/StatusUpdateDialog.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Skeleton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import {
  fetchAllLeads,
  Lead,
  updateLeadStatus,
  fetchLeadById,
  fetchArchivedLeads,
} from "../../../store/slices/leadSLice";

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
  pending: ["login", "closed"],
  login: ["approved", "rejected", "closed"],
  approved: ["disbursed", "closed", "rejected"],
  disbursed: ["closed"],
  rejected: ["approved", "closed"],
  closed: [],
  expired: ["login"],
};

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  lead?: Lead | null; // incoming prop
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  open,
  onClose,
  lead: propLead,
}) => {
  const dispatch = useAppDispatch();

  // freshest lead fetched on open
  const [freshLead, setFreshLead] = useState<Lead | null | undefined>(undefined);
  const [isFetchingLead, setIsFetchingLead] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // form state
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

  // Choose freshest available lead (freshLead overrides propLead if present)
  const lead: Lead | undefined | null =
    freshLead !== undefined && freshLead !== null ? freshLead : propLead;

  // Fetch lead by ID when dialog opens or propLead.id changes
  useEffect(() => {
    if (open && propLead?.id) {
      setIsFetchingLead(true);
      setFetchError(null);
      dispatch(fetchLeadById(propLead.id))
        .unwrap()
        .then((fetched) => {
          setFreshLead(fetched);
        })
        .catch((err: any) => {
          const msg =
            typeof err === "string" ? err : err?.message || "Failed to fetch lead";
          setFetchError(msg);
          setFreshLead(undefined);
        })
        .finally(() => {
          setIsFetchingLead(false);
        });
    } else if (!open) {
      // reset on close
      setFreshLead(undefined);
      setFetchError(null);
    }
  }, [open, propLead?.id, dispatch]);

  // Reset form state whenever dialog opens with available lead
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

  const originalStatus = (lead?.status ?? "pending") as LeadStatus;
  const currentStatusLabel =
    originalStatus.charAt(0).toUpperCase() + originalStatus.slice(1);
  const nextStatuses = statusTransitions[originalStatus] || [];

  const canSubmit = useMemo(() => {
    if (!comment.trim() || selectedStatus === originalStatus) return false;
    if (selectedStatus === "rejected") return Boolean(rejectionReason.trim());
    if (selectedStatus === "approved") return Boolean(approvedAmount.trim());
    if (selectedStatus === "closed") return Boolean(closeReason.trim());
    return true;
  }, [
    comment,
    selectedStatus,
    originalStatus,
    rejectionReason,
    approvedAmount,
    closeReason,
  ]);

  const handleUpdate = async () => {
    if (!canSubmit || !lead?.id) return;
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
      dispatch(fetchArchivedLeads());

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
        {/* Missing lead fallback */}
        {(!lead?.id && !isFetchingLead) && (
          <Box p={3}>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Update Lead Status</Typography>
                <IconButton onClick={onClose} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Alert severity="error" sx={{ mb: 2 }}>
                Lead data is unavailable. Please retry or refresh the parent list.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Close</Button>
            </DialogActions>
          </Box>
        )}

        {/* Normal content */}
        {(lead?.id || isFetchingLead) && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Update Lead Status</Typography>
                <IconButton onClick={onClose} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ position: "relative" }}>
              {fetchError && (
                <Box mb={2}>
                  <Alert severity="warning">
                    Failed to refresh lead: {fetchError}. Using fallback data.
                  </Alert>
                </Box>
              )}

              {/* Lead ID */}
              <Box mb={3} sx={{ transition: "opacity 0.3s", opacity: isFetchingLead ? 0.6 : 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Lead ID
                </Typography>
                {isFetchingLead ? (
                  <Skeleton width="40%" height={24} />
                ) : (
                  <Typography variant="body1" fontWeight={500}>
                    {lead?.leadId || "—"}
                  </Typography>
                )}
              </Box>

              {/* Current Status */}
              <Box mb={3} sx={{ transition: "opacity 0.3s", opacity: isFetchingLead ? 0.6 : 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Current Status
                </Typography>
                {isFetchingLead ? (
                  <Skeleton width="30%" height={24} />
                ) : (
                  <Typography variant="body1" fontWeight={500}>
                    {currentStatusLabel}
                  </Typography>
                )}
              </Box>

              {/* New Status */}
              <FormControl fullWidth sx={{ mb: 3, transition: "opacity 0.3s", opacity: isFetchingLead ? 0.6 : 1 }}>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="New Status"
                  onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
                  disabled={isFetchingLead}
                >
                  {nextStatuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Comment */}
              {isFetchingLead ? (
                <Skeleton variant="rectangular" height={80} sx={{ mb: 3 }} />
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 3, transition: "opacity 0.3s", opacity: isSubmitting ? 0.7 : 1 }}
                  disabled={isFetchingLead}
                />
              )}

              {/* Rejection */}
              {selectedStatus === "rejected" && (
                <>
                  <FormControl fullWidth sx={{ mb: 3, transition: "opacity 0.3s", opacity: isFetchingLead ? 0.6 : 1 }}>
                    <InputLabel>Rejection Reason</InputLabel>
                    {isFetchingLead ? (
                      <Skeleton width="60%" height={56} />
                    ) : (
                      <Select
                        value={rejectionReason}
                        label="Rejection Reason"
                        onChange={(e) => setRejectionReason(e.target.value)}
                        disabled={isFetchingLead}
                      >
                        {rejectionOptions.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 1, transition: "opacity 0.3s", opacity: isFetchingLead ? 0.6 : 1 }}
                    disabled={isFetchingLead}
                  >
                    Upload Rejection Proof (Optional)
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        setRejectionProof(e.target.files?.[0] || null)
                      }
                      disabled={isFetchingLead}
                    />
                  </Button>
                  {rejectionProof && !isFetchingLead && (
                    <Typography variant="caption" color="textSecondary">
                      Selected file: {rejectionProof.name}
                    </Typography>
                  )}
                </>
              )}

              {/* Approval */}
              {selectedStatus === "approved" && (
                <>
                  {isFetchingLead ? (
                    <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
                  ) : (
                    <TextField
                      fullWidth
                      type="number"
                      label="Approved Amount"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      sx={{ mb: 3, transition: "opacity 0.3s", opacity: isSubmitting ? 0.7 : 1 }}
                      required
                      disabled={isFetchingLead}
                    />
                  )}
                </>
              )}

              {/* Closed */}
              {selectedStatus === "closed" && (
                <FormControl fullWidth sx={{ mb: 3, transition: "opacity 0.3s", opacity: isFetchingLead ? 0.6 : 1 }}>
                  <InputLabel>Close Reason</InputLabel>
                  {isFetchingLead ? (
                    <Skeleton width="50%" height={56} />
                  ) : (
                    <Select
                      value={closeReason}
                      label="Close Reason"
                      onChange={(e) => setCloseReason(e.target.value)}
                      disabled={isFetchingLead}
                    >
                      {closeReasonOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting || isFetchingLead}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                variant="contained"
                disabled={!canSubmit || isSubmitting || isFetchingLead}
              >
                {isSubmitting ? <CircularProgress size={20} /> : "Update Status"}
              </Button>
            </DialogActions>
          </>
        )}
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
