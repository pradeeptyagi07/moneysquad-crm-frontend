"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Card,
  CardContent,
  Divider,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Edit, Save, Cancel, AccountBalance, Visibility, VisibilityOff, CheckCircle, Error } from "@mui/icons-material"
import RequestChangeDialog from "./RequestChangeDialog"

interface BankDetailsSectionProps {
  user?: any
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
  user = {
    bankDetails: {
      accountHolderName: "John Doe",
      accountNumber: "XXXX-XXXX-XXXX-1234",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      accountType: "Savings",
      panNumber: "ABCDE1234F",
      gstNumber: "22AAAAA0000A1Z5",
    },
  },
}) => {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    accountHolderName: user.bankDetails?.accountHolderName || "",
    accountNumber: user.bankDetails?.accountNumber || "",
    bankName: user.bankDetails?.bankName || "",
    ifscCode: user.bankDetails?.ifscCode || "",
    accountType: user.bankDetails?.accountType || "Savings",
    panNumber: user.bankDetails?.panNumber || "",
    gstNumber: user.bankDetails?.gstNumber || "",
  })
  const [openRequestDialog, setOpenRequestDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })
  const [showAccountNumber, setShowAccountNumber] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setOpenRequestDialog(true)
  }

  const handleRequestSubmit = (reason: string) => {
    console.log("Bank details change request submitted:", { ...formData, reason })
    setOpenRequestDialog(false)
    setSnackbar({
      open: true,
      message: "Bank details change request submitted successfully!",
      severity: "success",
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      accountHolderName: user.bankDetails?.accountHolderName || "",
      accountNumber: user.bankDetails?.accountNumber || "",
      bankName: user.bankDetails?.bankName || "",
      ifscCode: user.bankDetails?.ifscCode || "",
      accountType: user.bankDetails?.accountType || "Savings",
      panNumber: user.bankDetails?.panNumber || "",
      gstNumber: user.bankDetails?.gstNumber || "",
    })
    setEditing(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const toggleShowAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber)
  }

  // For demo purposes, let's assume these are verified
  const verificationStatus = {
    panVerified: true,
    bankVerified: true,
    gstVerified: false,
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="#0f172a">
          Bank Account Details
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
            Request Changes
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            elevation={1}
            sx={{
              borderRadius: 2,
              mb: 4,
              background: "linear-gradient(145deg, #ffffff, #f9fafb)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                      endAdornment: verificationStatus.bankVerified ? (
                        <InputAdornment position="end">
                          <Tooltip title="Verified">
                            <CheckCircle sx={{ color: "#10b981" }} />
                          </Tooltip>
                        </InputAdornment>
                      ) : undefined,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    name="accountNumber"
                    type={showAccountNumber ? "text" : "password"}
                    value={formData.accountNumber}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle account number visibility"
                            onClick={toggleShowAccountNumber}
                            edge="end"
                          >
                            {showAccountNumber ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                      endAdornment: verificationStatus.bankVerified ? (
                        <InputAdornment position="end">
                          <Tooltip title="Verified">
                            <CheckCircle sx={{ color: "#10b981" }} />
                          </Tooltip>
                        </InputAdornment>
                      ) : undefined,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                      endAdornment: verificationStatus.bankVerified ? (
                        <InputAdornment position="end">
                          <Tooltip title="Verified">
                            <CheckCircle sx={{ color: "#10b981" }} />
                          </Tooltip>
                        </InputAdornment>
                      ) : undefined,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!editing} variant={editing ? "outlined" : "filled"}>
                    <InputLabel id="account-type-label">Account Type</InputLabel>
                    <Select
                      labelId="account-type-label"
                      id="account-type"
                      name="accountType"
                      value={formData.accountType}
                      label="Account Type"
                      onChange={handleSelectChange}
                      readOnly={!editing}
                    >
                      <MenuItem value="Savings">Savings</MenuItem>
                      <MenuItem value="Current">Current</MenuItem>
                      <MenuItem value="Salary">Salary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PAN Number"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                      endAdornment: verificationStatus.panVerified ? (
                        <InputAdornment position="end">
                          <Tooltip title="Verified">
                            <CheckCircle sx={{ color: "#10b981" }} />
                          </Tooltip>
                        </InputAdornment>
                      ) : undefined,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="GST Number (Optional)"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editing,
                      endAdornment:
                        formData.gstNumber && !verificationStatus.gstVerified ? (
                          <InputAdornment position="end">
                            <Tooltip title="Verification Pending">
                              <Error sx={{ color: "#f59e0b" }} />
                            </Tooltip>
                          </InputAdornment>
                        ) : undefined,
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
                    Request Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={1}
            sx={{
              borderRadius: 2,
              mb: 4,
              background: "linear-gradient(145deg, #ffffff, #f9fafb)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#0f172a"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <AccountBalance sx={{ mr: 1, fontSize: 20, color: "#0f766e" }} />
                Verification Status
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" color="#475569">
                    Bank Account
                  </Typography>
                  <Chip label="Verified" size="small" icon={<CheckCircle />} color="success" sx={{ fontWeight: 500 }} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" color="#475569">
                    PAN Card
                  </Typography>
                  <Chip label="Verified" size="small" icon={<CheckCircle />} color="success" sx={{ fontWeight: 500 }} />
                </Box>
                {formData.gstNumber && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="#475569">
                      GST Registration
                    </Typography>
                    <Chip label="Pending" size="small" color="warning" sx={{ fontWeight: 500 }} />
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={500} color="#475569" sx={{ mb: 2 }}>
                Last Commission Payout
              </Typography>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="caption" color="#64748b">
                    Amount
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#0f172a">
                    ₹15,000.00
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="caption" color="#64748b">
                    Date
                  </Typography>
                  <Typography variant="body2" color="#0f172a">
                    15 Apr 2023
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="#64748b">
                    Status
                  </Typography>
                  <Chip
                    label="Completed"
                    size="small"
                    color="success"
                    sx={{
                      height: 20,
                      fontSize: "0.625rem",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
        Changes to your bank details require verification and approval. Please ensure all information is accurate as
        this will be used for commission payouts.
      </Alert>

      <Alert
        severity="warning"
        sx={{
          mb: 2,
          borderRadius: 2,
          backgroundColor: "rgba(180, 83, 9, 0.08)",
          color: "#b45309",
          "& .MuiAlert-icon": {
            color: "#b45309",
          },
        }}
      >
        For security reasons, you may be asked to provide additional verification documents when changing bank details.
      </Alert>

      <RequestChangeDialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        onSubmit={handleRequestSubmit}
        title="Request Bank Details Changes"
        changes={Object.entries(formData)
          .filter(([key, value]) => value !== (user.bankDetails?.[key] || "") && key !== "profileImage")
          .map(([key, value]) => ({
            field: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            oldValue: user.bankDetails?.[key] || "Not set",
            newValue: value as string,
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

export default BankDetailsSection
