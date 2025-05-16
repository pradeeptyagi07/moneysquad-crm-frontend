"use client"

import type React from "react"
import { useState } from "react"
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import type { TeamMemberFormData } from "../types/teamTypes"

interface AddManagerDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (managerData: TeamMemberFormData) => void
}

const initialFormData: TeamMemberFormData = {
  name: "",
  email: "",
  mobile: "",
  location: "",
  role: "",
}

const roleOptions = ["Team Lead", "Sales Manager", "Regional Manager", "Account Manager", "Senior Manager"]

const AddManagerDialog: React.FC<AddManagerDialogProps> = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState<TeamMemberFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear error when field is edited
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required"
    } else if (!/^\+?[0-9\s()-]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number is invalid"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.role) {
      newErrors.role = "Role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd(formData)
      setFormData(initialFormData)
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Add New Manager
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              placeholder="Enter manager's full name"
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
              placeholder="Enter email address"
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
              placeholder="Enter mobile number"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="location"
              label="Location"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              error={!!errors.location}
              helperText={errors.location}
              variant="outlined"
              placeholder="City, State"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 2,
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Add Manager
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddManagerDialog
