// src/pages/Leads/components/DisbursementDialog.tsx
"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { disburseLead } from "../../../store/slices/leadSLice";
import type { Lead } from "../../../store/slices/leadSLice";

interface DisbursementData {
  loanAmount: number;
  tenure: number;
  interestRate: number;
  processingFee: number;
  insuranceCharges: number;
  loanScheme: string;
  lanNumber: string;
  actualDisbursedDate: string;
}

interface DisbursementDialogProps {
  open: boolean;
  onClose: () => void;
  lead: Lead;
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
    tenure: 0,
    interestRate: 0,
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

  const handleChange = (
    field: keyof DisbursementData,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        typeof prev[field] === "number" ? Number(value) : (value as string),
    }));
  };

  const isFormValid = Object.values(form).every((value) =>
    typeof value === "number" ? value > 0 : value.trim() !== ""
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // unwrap() will throw if the thunk was rejected
      await dispatch(
        disburseLead({
          leadId: lead.id!,
          disbData: {
            loanAmount: form.loanAmount,
            tenureMonths: form.tenure,
            interestRatePA: form.interestRate,
            processingFee: form.processingFee,
            insuranceCharges: form.insuranceCharges,
            loanScheme: form.loanScheme,
            lanNumber: form.lanNumber,
            actualDisbursedDate: form.actualDisbursedDate,
          },
        })
      ).unwrap();

      // close the dialog right away
      onClose();

      // then show a success toast
      setSnackbar({
        open: true,
        message: "Disbursement saved!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: typeof err === "string" ? err : err.message || "An error occurred",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Disbursement Details</Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Lead ID
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {lead.leadId}
            </Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Applicant
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {lead.applicant.name}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Loan Amount"
                type="number"
                value={form.loanAmount}
                onChange={(e) => handleChange("loanAmount", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Tenure (months)"
                type="number"
                value={form.tenure}
                onChange={(e) => handleChange("tenure", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Interest Rate (PA)"
                type="number"
                value={form.interestRate}
                onChange={(e) => handleChange("interestRate", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Processing Fee (%)"
                type="number"
                value={form.processingFee}
                onChange={(e) => handleChange("processingFee", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Insurance Charges"
                type="number"
                value={form.insuranceCharges}
                onChange={(e) => handleChange("insuranceCharges", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                select
                fullWidth
                label="Loan Scheme"
                value={form.loanScheme}
                onChange={(e) => handleChange("loanScheme", e.target.value)}
              >
                {loanSchemeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="LAN Number"
                value={form.lanNumber}
                onChange={(e) => handleChange("lanNumber", e.target.value)}
              />
            </Grid>
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
            disabled={loading || !isFormValid}
          >
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Always render the Snackbar so it can show after onClose() */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
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
