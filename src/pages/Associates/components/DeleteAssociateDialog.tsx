"use client";

import React, { useState, useEffect } from "react";
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
import {
  deleteAssociate,
  fetchAssociates,
  clearAssociateState,
} from "../../../store/slices/associateSlice";

interface DeleteAssociateDialogProps {
  open: boolean;
  onClose: () => void;
  associateId: string;
  associateName: string;
}

const DeleteAssociateDialog: React.FC<DeleteAssociateDialogProps> = ({
  open,
  onClose,
  associateId,
  associateName,
}) => {
  const dispatch = useAppDispatch();
  const { success, error, loading } = useAppSelector(
    (state) => state.associate
  );
  const [showSnackbar, setShowSnackbar] = useState(false);

  // clear snackbars when closing
  useEffect(() => {
    if (!open) {
      setShowSnackbar(false);
      dispatch(clearAssociateState());
    }
  }, [open, dispatch]);

  // after delete
  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      dispatch(fetchAssociates());
      dispatch(clearAssociateState());
      onClose();
    }
  }, [success, dispatch, onClose]);

  const handleDelete = () => {
    dispatch(deleteAssociate(associateId));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(clearAssociateState());
          onClose();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: "error.main" }}>
              Delete Associate
            </Typography>
            <IconButton
              onClick={() => {
                dispatch(clearAssociateState());
                onClose();
              }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={2}>
            <WarningAmber sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography variant="h6" align="center" gutterBottom>
              Delete {associateName}?
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              dispatch(clearAssociateState());
              onClose();
            }}
            variant="outlined"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={open && (showSnackbar || Boolean(error))}
        autoHideDuration={4000}
        onClose={() => {
          setShowSnackbar(false);
          dispatch(clearAssociateState());
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Alert severity="success">Associate deleted!</Alert>
        )}
      </Snackbar>
    </>
  );
};

export default DeleteAssociateDialog;
