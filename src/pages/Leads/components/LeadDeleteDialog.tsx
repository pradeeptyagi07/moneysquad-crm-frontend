// src/pages/Leads/components/LeadDeleteDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close, WarningAmber } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { deleteLead } from "../../../store/slices/leadSLice";

interface LeadDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
}

const LeadDeleteDialog: React.FC<LeadDeleteDialogProps> = ({ open, onClose, leadId, leadName }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.leads.loading);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteLead(leadId)).unwrap();
      setSnackbarOpen(true);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb:1, pt:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight:700, color:"error.main" }}>
              Delete Lead
            </Typography>
            <IconButton onClick={onClose} size="small"><Close /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={2}>
            <WarningAmber sx={{ fontSize:64, color:"error.main", mb:2 }} />
            <Typography variant="h6" align="center" gutterBottom>
              Are you sure you want to delete {leadName}?
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary">
              This action cannot be undone. All data for this lead will be permanently removed.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px:3, py:2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius:2 }} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius:2 }} disabled={loading}>
            Delete Lead
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width:"100%" }}>
          Lead deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default LeadDeleteDialog;
