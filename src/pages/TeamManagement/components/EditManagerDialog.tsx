"use client"

import { useState, useEffect } from "react"
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
  Switch,
  FormControlLabel,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { clearTeamState, updateManager } from "../../../store/slices/teamSLice"


interface EditManagerDialogProps {
  open: boolean
  onClose: () => void
  manager: any | null
}

const EditManagerDialog: React.FC<EditManagerDialogProps> = ({ open, onClose, manager }) => {
  const dispatch = useAppDispatch()
  const { success, error } = useAppSelector((state) => state.team)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    location: "",
  })
  const [status, setStatus] = useState<"active" | "inactive">("active")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

  useEffect(() => {
    if (manager) {
      setFormData({
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        mobile: manager.mobile,
        location: manager.location,
      })
      setStatus(manager.status)
    }
  }, [manager])

  useEffect(() => {
    if (!submitting) return
    if (success) {
      setShowSnackbar(true)
      setSubmitting(false)
      onClose()
    } else if (error) {
      setSubmitting(false)
    }
  }, [success, error, submitting, onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.checked ? "active" : "inactive")
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    else if (!/^\+?[0-9\s()-]{10,15}$/.test(formData.mobile)) newErrors.mobile = "Invalid mobile number"
    if (!formData.location.trim()) newErrors.location = "Location is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm() && manager) {
      dispatch(clearTeamState())
      setSubmitting(true)
      dispatch(updateManager({ id: manager._id, data: { ...formData, status } }))
    }
  }

  if (!manager) return null

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Edit Manager
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Manager ID: {manager.managerId || "N/A"}
                </Typography>
                <FormControlLabel
                  control={<Switch checked={status === "active"} onChange={handleStatusChange} color="success" />}
                  label={status === "active" ? "Active" : "Inactive"}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                type="email"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="mobile"
                label="Mobile Number"
                fullWidth
                value={formData.mobile}
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: 2, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Manager updated successfully!
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditManagerDialog;
