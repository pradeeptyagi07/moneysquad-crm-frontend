// src/components/Associates/AddAssociateDialog.tsx

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
import { clearAssociateState, createAssociate, fetchAssociates } from "../../../store/slices/associateSlice";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";


interface AddAssociateDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  location: "",
};

const AddAssociateDialog: React.FC<AddAssociateDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { success, error, loading } = useAppSelector((state) => state.associate);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSnackbar, setShowSnackbar] = useState(false);

  // On successful create: show snackbar, refresh list, reset form
  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      dispatch(fetchAssociates());
      setFormData(initialFormData);
      dispatch(clearAssociateState());
      onClose();
    }
  }, [success, dispatch, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErr: Record<string, string> = {};
    if (!formData.firstName.trim()) newErr.firstName = "First name required";
    if (!formData.lastName.trim()) newErr.lastName = "Last name required";
    if (!formData.email.trim()) newErr.email = "Email required";
    if (!formData.mobile.trim()) newErr.mobile = "Mobile required";
    if (!formData.location.trim()) newErr.location = "Location required";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      dispatch(createAssociate(formData));
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              Add New Associate
            </Typography>
            <IconButton onClick={() => { dispatch(clearAssociateState()); onClose(); }} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            {(["firstName","lastName","email","mobile","location"] as const).map((field) => (
              <Grid item xs={12} md={field==="location"?12:6} key={field}>
                <TextField
                  name={field}
                  label={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  fullWidth
                  value={formData[field]}
                  onChange={handleChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => { dispatch(clearAssociateState()); onClose(); }}
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
            {loading ? "Creating..." : "Add Associate"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar || Boolean(error)}
        autoHideDuration={4000}
        onClose={() => { setShowSnackbar(false); dispatch(clearAssociateState()); }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Alert severity="success">Associate created!</Alert>
        )}
      </Snackbar>
    </>
  );
};

export default AddAssociateDialog;
