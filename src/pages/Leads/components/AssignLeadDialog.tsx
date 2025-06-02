// src/pages/Leads/components/AssignLeadDialog.tsx
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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { fetchManagers } from "../../../store/slices/teamSLice";
import { assignLead, fetchAllLeads } from "../../../store/slices/leadSLice";
import type { Lead } from "../../../store/slices/leadSLice";

interface AssignLeadDialogProps {
  open: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

const AssignLeadDialog: React.FC<AssignLeadDialogProps> = ({ open, onClose, lead }) => {
  const dispatch = useAppDispatch();

  // do not render without lead or when closed
  if (!open || !lead) return null;

  // Manager list
  const { managers, loading: mgrLoading, error: mgrError } = useAppSelector(
    (state) => state.team
  );

  // Local state
  const [selectedMgr, setSelectedMgr] = useState<string>("");
  const [loadingAssign, setLoadingAssign] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch managers on open
  useEffect(() => {
    dispatch(fetchManagers());
    setSelectedMgr("");
    setSnackbar({ open: false, message: "", severity: "success" });
  }, [dispatch]);

  // assign handler
  const handleAssign = async () => {
    setLoadingAssign(true);
    try {
      await dispatch(assignLead({ leadId: lead.id!, managerAssigned: selectedMgr })).unwrap();
      dispatch(fetchAllLeads());
      setSnackbar({ open: true, message: "Manager assigned successfully!", severity: "success" });
      setTimeout(() => {
        setSnackbar((s) => ({ ...s, open: false }));
        onClose();
      }, 1000);
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err.message || String(err);
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoadingAssign(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Assign Lead to Manager</Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Typography gutterBottom>
            <strong>Lead ID:</strong> {lead.leadId || lead.id}
          </Typography>

          {mgrLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : mgrError ? (
            <Typography color="error">{mgrError}</Typography>
          ) : (
            <FormControl fullWidth>
              <InputLabel>Select Manager</InputLabel>
              <Select
                value={selectedMgr}
                onChange={(e) => setSelectedMgr(e.target.value)}
                label="Select Manager"
              >
                {managers.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.firstName} {m.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loadingAssign}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={!selectedMgr || loadingAssign}
          >
            {loadingAssign ? <CircularProgress size={20} /> : "Assign"}
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
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssignLeadDialog;
