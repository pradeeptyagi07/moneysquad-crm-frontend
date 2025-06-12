"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  updateAssociate,
  fetchAssociates,
  clearAssociateState,
} from "../../../store/slices/associateSlice";
import type { Associate } from "./AssociateTable";

interface EditAssociateDialogProps {
  open: boolean;
  onClose: () => void;
  associate: Associate | null;
  onSaveSuccess: () => void;
}

const EditAssociateDialog: React.FC<EditAssociateDialogProps> = ({
  open,
  onClose,
  associate,
  onSaveSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { success, error, loading } = useAppSelector(
    (state) => state.associate
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    location: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showSnackbar, setShowSnackbar] = useState(false);

  // clear snackbars whenever dialog closes
  useEffect(() => {
    if (!open) {
      setShowSnackbar(false);
      dispatch(clearAssociateState());
    }
  }, [open, dispatch]);

  // preload form
  useEffect(() => {
    if (associate) {
      setFormData({
        firstName: associate.firstName,
        lastName: associate.lastName,
        email: associate.email,
        mobile: associate.mobile,
        location: associate.location,
      });
    }
  }, [associate]);

  // after update
  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      dispatch(fetchAssociates());
      dispatch(clearAssociateState());
      onSaveSuccess();
      onClose();
    }
  }, [success, dispatch, onClose, onSaveSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "Required";
    if (!formData.lastName.trim()) errs.lastName = "Required";
    if (!formData.email.trim()) errs.email = "Required";
    if (!formData.mobile.trim()) errs.mobile = "Required";
    if (!formData.location.trim()) errs.location = "Required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (associate && validate()) {
      dispatch(updateAssociate({ id: associate._id, data: formData }));
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(clearAssociateState());
          onClose();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight={700}>
              Edit Associate
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

        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="mobile"
                label="Mobile Number"
                fullWidth
                value={formData.mobile}
                onChange={handleChange}
                error={!!fieldErrors.mobile}
                helperText={fieldErrors.mobile}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange}
                error={!!fieldErrors.location}
                helperText={fieldErrors.location}
              />
            </Grid>
          </Grid>
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
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ borderRadius: 2 }}
          >
            {loading ? "Saving..." : "Save Changes"}
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
          <Alert severity="success">Associate updated!</Alert>
        )}
      </Snackbar>
    </>
  );
};

export default EditAssociateDialog;
