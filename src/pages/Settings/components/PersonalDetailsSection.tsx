"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, TextField, Button, Grid, Paper, MenuItem, Alert, Snackbar } from "@mui/material"
import { Edit, Save, Cancel } from "@mui/icons-material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import RequestChangeDialog from "./RequestChangeDialog"

interface PersonalDetailsSectionProps {
  user?: any
  isAdmin?: boolean
}

const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  user = {
    dateOfBirth: "1990-01-01",
    gender: "Male",
    nationality: "Indian",
    idType: "Aadhar",
    idNumber: "XXXX-XXXX-XXXX",
    emergencyContactName: "Jane Doe",
    emergencyContactRelation: "Spouse",
    emergencyContactPhone: "+91 9876543211",
  },
  isAdmin = false,
}) => {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
    gender: user.gender || "",
    nationality: user.nationality || "",
    idType: user.idType || "",
    idNumber: user.idNumber || "",
    emergencyContactName: user.emergencyContactName || "",
    emergencyContactRelation: user.emergencyContactRelation || "",
    emergencyContactPhone: user.emergencyContactPhone || "",
  })
  const [openRequestDialog, setOpenRequestDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }))
  }

  const handleSave = () => {
    if (isAdmin) {
      // Admin can directly save changes
      console.log("Personal details updated:", formData)
      setSnackbar({
        open: true,
        message: "Personal details updated successfully!",
        severity: "success",
      })
      setEditing(false)
    } else {
      // Partners and Managers need to request changes
      setOpenRequestDialog(true)
    }
  }

  const handleRequestSubmit = (reason: string) => {
    console.log("Change request submitted:", { ...formData, reason })
    setOpenRequestDialog(false)
    setSnackbar({
      open: true,
      message: "Change request submitted successfully!",
      severity: "success",
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
      gender: user.gender || "",
      nationality: user.nationality || "",
      idType: user.idType || "",
      idNumber: user.idNumber || "",
      emergencyContactName: user.emergencyContactName || "",
      emergencyContactRelation: user.emergencyContactRelation || "",
      emergencyContactPhone: user.emergencyContactPhone || "",
    })
    setEditing(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="#334155">
          Personal Details
        </Typography>
        {!editing && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
            sx={{
              borderColor: "#0f766e",
              color: "#0f766e",
              "&:hover": {
                borderColor: "#0e6660",
                backgroundColor: "rgba(15, 118, 110, 0.04)",
              },
            }}
          >
            {isAdmin ? "Edit" : "Request Changes"}
          </Button>
        )}
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 4,
          background: "linear-gradient(145deg, #ffffff, #f9fafb)",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                disabled={!editing}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: editing ? "outlined" : "filled",
                    InputProps: {
                      readOnly: !editing,
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              InputProps={{
                readOnly: !editing,
              }}
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              InputProps={{
                readOnly: !editing,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="ID Type"
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              InputProps={{
                readOnly: !editing,
              }}
            >
              <MenuItem value="">Select ID Type</MenuItem>
              <MenuItem value="passport">Passport</MenuItem>
              <MenuItem value="driving_license">Driving License</MenuItem>
              <MenuItem value="national_id">National ID</MenuItem>
              <MenuItem value="voter_id">Voter ID</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID Number"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              InputProps={{
                readOnly: !editing,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 600, color: "#475569" }}>
              Emergency Contact
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              InputProps={{
                readOnly: !editing,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Relationship"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={handleChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              InputProps={{
                readOnly: !editing,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              InputProps={{
                readOnly: !editing,
              }}
            />
          </Grid>
        </Grid>

        {editing && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              sx={{
                borderColor: "#94a3b8",
                color: "#64748b",
                "&:hover": {
                  borderColor: "#64748b",
                  backgroundColor: "rgba(100, 116, 139, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                backgroundColor: "#0f766e",
                "&:hover": {
                  backgroundColor: "#0e6660",
                },
              }}
            >
              {isAdmin ? "Save Changes" : "Request Changes"}
            </Button>
          </Box>
        )}
      </Paper>

      <Alert
        severity="info"
        sx={{
          mb: 2,
          borderRadius: 2,
          backgroundColor: "rgba(3, 105, 161, 0.08)",
          color: "#0369a1",
          "& .MuiAlert-icon": {
            color: "#0369a1",
          },
        }}
      >
        Changes to your personal details require approval from an administrator. Your request will be reviewed within
        1-2 business days.
      </Alert>

      <RequestChangeDialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        onSubmit={handleRequestSubmit}
        title="Request Personal Details Changes"
        changes={Object.entries(formData)
          .filter(([key, value]) => {
            if (key === "dateOfBirth") {
              return (
                formData.dateOfBirth &&
                user.dateOfBirth &&
                formData.dateOfBirth.toISOString() !== new Date(user.dateOfBirth).toISOString()
              )
            }
            return value !== user[key]
          })
          .map(([key, value]) => ({
            field: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            oldValue:
              key === "dateOfBirth" && user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : user[key] || "Not set",
            newValue:
              key === "dateOfBirth" && value ? (value as Date).toLocaleDateString() : (value as string) || "Not set",
          }))}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PersonalDetailsSection
