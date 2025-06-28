// src/components/Leads/DisbursementDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import {
  disburseLead,
  editDisbursement,
  fetchAllLeads,
  Lead,
} from "../../../store/slices/leadSlice";

interface DisbursementData {
  loanAmount: number;
  tenureMonths: number;
  interestRatePA: number;
  processingFee: number;
  insuranceCharges: number;
  loanScheme: string;
  lanNumber: string;
  actualDisbursedDate: string;
}

interface DisbursementDialogProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const loanSchemeOptions = ["Fresh", "Top-up", "Other"];

const DisbursementDialog: React.FC<DisbursementDialogProps> = ({
  open,
  onClose,
  lead,
}) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<DisbursementData>({
    loanAmount: 0,
    tenureMonths: 0,
    interestRatePA: 0,
    processingFee: 0,
    insuranceCharges: 0,
    loanScheme: "",
    lanNumber: "",
    actualDisbursedDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Populate or reset form whenever the dialog opens or the lead changes
  useEffect(() => {
    if (lead?.disbursedData) {
      setForm({
        loanAmount: lead.disbursedData.loanAmount,
        tenureMonths: lead.disbursedData.tenureMonths,
        interestRatePA: lead.disbursedData.interestRatePA,
        processingFee: lead.disbursedData.processingFee,
        insuranceCharges: lead.disbursedData.insuranceCharges,
        loanScheme: lead.disbursedData.loanScheme,
        lanNumber: lead.disbursedData.lanNumber,
        actualDisbursedDate: lead.disbursedData.actualDisbursedDate.slice(0, 10),
      });
    } else {
      setForm({
        loanAmount: 0,
        tenureMonths: 0,
        interestRatePA: 0,
        processingFee: 0,
        insuranceCharges: 0,
        loanScheme: "",
        lanNumber: "",
        actualDisbursedDate: "",
      });
    }
    setSnackbar((s) => ({ ...s, open: false }));
    setLoading(false);
  }, [lead]);

  // If the dialog is closed or no lead is passed, render nothing
  if (!open || !lead) {
    return null;
  }

  const isEdit = Boolean(lead.disbursedData);
  const title = isEdit ? "Edit Disbursement" : "New Disbursement";
  const submitLabel = isEdit ? "Update" : "Save";

  const handleChange = (field: keyof DisbursementData, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        typeof prev[field] === "number" ? Number(value) : (value as string),
    }));
  };

  const isFormValid = Object.values(form).every((v) =>
    typeof v === "number" ? v > 0 : (v as string).trim() !== ""
  );

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);

    try {
      const thunk = isEdit ? editDisbursement : disburseLead;
      await dispatch(thunk({ leadId: lead.id, disbData: form })).unwrap();

      // Refresh the list
      dispatch(fetchAllLeads());

      // Show success snackbar (dialog stays open until snackbar closes)
      setSnackbar({
        open: true,
        message: isEdit
          ? "Disbursement updated successfully!"
          : "Disbursement saved successfully!",
        severity: "success",
      });
    } catch (error: any) {
      // error here is the rejectWithValue payload (a string) or an Error
      const message =
        typeof error === "string"
          ? error
          : error.message || "An unexpected error occurred.";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Lead ID
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {lead.leadId}
            </Typography>
          </Paper>

          <Grid container spacing={2}>
            {/* Loan Amount */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Loan Amount"
                type="number"
                value={form.loanAmount}
                onChange={(e) =>
                  handleChange("loanAmount", e.target.value)
                }
              />
            </Grid>

            {/* Tenure */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Tenure (months)"
                type="number"
                value={form.tenureMonths}
                onChange={(e) =>
                  handleChange("tenureMonths", e.target.value)
                }
              />
            </Grid>

            {/* Interest Rate */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Interest Rate (PA)"
                type="number"
                value={form.interestRatePA}
                onChange={(e) =>
                  handleChange("interestRatePA", e.target.value)
                }
              />
            </Grid>

            {/* Processing Fee */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Processing Fee (%)"
                type="number"
                value={form.processingFee}
                onChange={(e) =>
                  handleChange("processingFee", e.target.value)
                }
              />
            </Grid>

            {/* Insurance Charges */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Insurance Charges"
                type="number"
                value={form.insuranceCharges}
                onChange={(e) =>
                  handleChange("insuranceCharges", e.target.value)
                }
              />
            </Grid>

            {/* Loan Scheme */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                select
                fullWidth
                label="Loan Scheme"
                value={form.loanScheme}
                onChange={(e) =>
                  handleChange("loanScheme", e.target.value)
                }
              >
                {loanSchemeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* LAN Number */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="LAN Number"
                value={form.lanNumber}
                onChange={(e) =>
                  handleChange("lanNumber", e.target.value)
                }
              />
            </Grid>

            {/* Actual Disbursed Date */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                type="date"
                label="Actual Disbursed Date"
                InputLabelProps={{ shrink: true }}
                value={form.actualDisbursedDate}
                onChange={(e) =>
                  handleChange("actualDisbursedDate", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid || loading}
          >
            {loading ? <CircularProgress size={20} /> : submitLabel}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar stays mounted until it auto-hides, then we close the dialog */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={(_e, _reason) => {
          setSnackbar((s) => ({ ...s, open: false }));
          onClose();
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DisbursementDialog;
