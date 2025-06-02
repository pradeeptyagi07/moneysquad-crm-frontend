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
import { fetchAllLeads, updateLeadStatus } from "../../../store/slices/leadSLice";
import type { Lead, LeadStatus } from "../../../data/leadTypes";

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

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({ open, onClose, lead }) => {
  const dispatch = useAppDispatch();

  // local submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>("pending");
  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionProof, setRejectionProof] = useState<File | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // reset local state whenever dialog opens
  useEffect(() => {
    if (open && lead) {
      setSelectedStatus(lead.status as LeadStatus);
      setComment("");
      setRejectionReason("");
      setRejectionProof(null);
      setIsSubmitting(false);
    }
  }, [open, lead]);

  if (!open || !lead || !lead.id) return null;

  const getAvailableStatuses = (): LeadStatus[] => {
    switch (lead.status) {
      case "pending":   return ["login"];
      case "login":     return ["approved", "rejected"];
      case "approved":  return ["disbursed", "closed"];
      case "disbursed": return ["closed"];
      case "rejected":  return ["approved"];
      case "closed":    return ["closed"];
      case "expired":   return ["expired", "login"];
      default:          return ["pending","login","approved","rejected","disbursed","closed","expired"];
    }
  };

  const canSubmit = () => {
    if (!comment.trim() || selectedStatus === lead.status) return false;
    if (selectedStatus === "rejected") {
      return Boolean(rejectionReason.trim());
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!canSubmit()) return;
    setIsSubmitting(true);
    try {
      await dispatch(updateLeadStatus({
        leadId: lead.id!,
        statusData: {
          action: selectedStatus,
          comment,
          rejectReason: selectedStatus === "rejected" ? rejectionReason : undefined,
          rejectImage: rejectionProof || undefined,
        },
      })).unwrap();

      // refresh and close
      dispatch(fetchAllLeads());
      setSnackbar({ open: true, message: "Status updated successfully!", severity: "success" });
      setTimeout(() => {
        setSnackbar(s => ({ ...s, open: false }));
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
            <IconButton onClick={onClose} size="small"><Close /></IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary">Lead ID</Typography>
            <Typography variant="body1" fontWeight={500}>{lead.leadId}</Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary">Applicant</Typography>
            <Typography variant="body1" fontWeight={500}>{lead.applicant.name}</Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary">Current Status</Typography>
            <Typography variant="body1" fontWeight={500}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={selectedStatus}
              label="New Status"
              onChange={e => setSelectedStatus(e.target.value as LeadStatus)}
            >
              {getAvailableStatuses().map(s => (
                <MenuItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth multiline rows={3}
            label="Comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            sx={{ mb: 3 }}
          />

          {selectedStatus === "rejected" && (
            <>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Rejection Reason</InputLabel>
                <Select
                  value={rejectionReason}
                  label="Rejection Reason"
                  onChange={e => setRejectionReason(e.target.value)}
                >
                  {rejectionOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" component="label" fullWidth sx={{ mb: 1 }}>
                Upload Rejection Proof (Optional)
                <input
                  type="file"
                  hidden
                  onChange={e => setRejectionProof(e.target.files?.[0] || null)}
                />
              </Button>
              {rejectionProof && (
                <Typography variant="caption" color="textSecondary">
                  Selected file: {rejectionProof.name}
                </Typography>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!canSubmit() || isSubmitting}
          >
            {isSubmitting
              ? <CircularProgress size={20} />
              : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StatusUpdateDialog;
