"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  AccountBalance,
  Edit,
  Business,
  Receipt,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import {
  selectUserData,
  selectUserDataLoading,
  selectUserDataError,
  isPartnerUser,
} from "../../../store/slices/userDataSlice";
import {
  submitChangeRequest,
  selectChangeRequestLoading,
  selectChangeRequestError,
} from "../../../store/slices/changeRequestSlice";
import { fetchBanks } from "../../../store/slices/lenderLoanSlice";

interface BankDetailsSectionProps {
  user?: {
    accountHolderName?: string;
    accountType?: string;
    relationshipWithAccountHolder?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
    isGstBillingApplicable?: string;
  };
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = () => {
  const dispatch = useAppDispatch();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [newData, setNewData] = useState({
    accountHolderName: "",
    accountType: "",
    relationshipWithAccountHolder: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    isGstBillingApplicable: "",
  });
  const [reason, setReason] = useState("");

  // Get user data from Redux store
  const userData = useAppSelector(selectUserData);
  const loading = useAppSelector(selectUserDataLoading);
  const error = useAppSelector(selectUserDataError);
  const changeRequestLoading = useAppSelector(selectChangeRequestLoading);
  const changeRequestError = useAppSelector(selectChangeRequestError);

  const banks = useAppSelector((state) => state.lenderLoan.banks || []);

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  // Use Redux data if available, otherwise fallback to empty
  const user =
    userData && isPartnerUser(userData)
      ? userData.bankDetails
      : {
          accountHolderName: "",
          accountType: "",
          relationshipWithAccountHolder: "",
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          branchName: "",
          isGstBillingApplicable: "",
        };

  const handleRequestUpdate = () => {
    // Pre-fill with current data
    setNewData({
      accountHolderName: user.accountHolderName || "",
      accountType: user.accountType || "",
      relationshipWithAccountHolder: user.relationshipWithAccountHolder || "",
      accountNumber: user.accountNumber || "",
      ifscCode: user.ifscCode || "",
      bankName: user.bankName || "",
      branchName: user.branchName || "",
      isGstBillingApplicable: user.isGstBillingApplicable || "",
    });
    setUpdateModalOpen(true);
  };

  const handleConfirmRequest = async () => {
    try {
      const requestData = {
        requestType: "bankDetails" as const,
        previousData: {
          accountType: user.accountType || "",
          accountHolderName: user.accountHolderName || "",
          bankName: user.bankName || "",
          accountNumber: user.accountNumber || "",
          ifscCode: user.ifscCode || "",
          branchName: user.branchName || "",
          relationshipWithAccountHolder:
            user.relationshipWithAccountHolder || "",
          isGstBillingApplicable: user.isGstBillingApplicable || "",
        },
        currentData: {
          accountType: newData.accountType,
          accountHolderName: newData.accountHolderName,
          bankName: newData.bankName,
          accountNumber: newData.accountNumber,
          ifscCode: newData.ifscCode,
          branchName: newData.branchName,
          relationshipWithAccountHolder: newData.relationshipWithAccountHolder,
          isGstBillingApplicable: newData.isGstBillingApplicable,
        },
        reason: reason,
      };

      await dispatch(submitChangeRequest(requestData)).unwrap();

      setSnackbarMessage("Bank details change request submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setUpdateModalOpen(false);
      setReason("");
    } catch (error) {
      setSnackbarMessage("Failed to submit change request. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return "";
    return `****${accountNumber.slice(-4)}`;
  };

  const toggleAccountNumber = () => setShowAccountNumber(!showAccountNumber);

  const getBankIcon = (bankName: string) => {
    // You can add bank-specific icons here
    return <AccountBalance sx={{ fontSize: 40, color: "#1976d2" }} />;
  };

  const accountTypes = ["Savings", "Current", "Others"];
  const relationshipOptions = ["Self", "Company", "Spouse", "Parent", "Others"];
  const gstOptions = ["Yes", "No"];

  const showGstBilling =
    newData.accountType === "Current" || newData.accountType === "Others";

  if (loading) {
    return <div>Loading bank details...</div>;
  }

  if (error) {
    return <div>Error loading bank details: {error}</div>;
  }

  return (
    <Box>
      {/* Premium Bank Card Display */}
      <Card
        elevation={3}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3,
          mb: 3,
          overflow: "visible",
          position: "relative",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {getBankIcon(user.bankName || "")}
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {user.bankName}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user.branchName}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={user.accountType}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Account Number
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h5" fontWeight={600} letterSpacing={2}>
                {showAccountNumber
                  ? user.accountNumber
                  : maskAccountNumber(user.accountNumber || "")}
              </Typography>
              <IconButton
                onClick={toggleAccountNumber}
                sx={{ color: "white", opacity: 0.8 }}
              >
                {showAccountNumber ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Account Holder
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.accountHolderName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                IFSC Code
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.ifscCode}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleRequestUpdate}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Request Update
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Additional Info Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Business color="primary" />
              <Typography variant="subtitle2" fontWeight={600}>
                Relationship
              </Typography>
            </Box>
            <Typography variant="body1">
              {user.relationshipWithAccountHolder}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Receipt color="primary" />
              <Typography variant="subtitle2" fontWeight={600}>
                GST Billing Applicable
              </Typography>
            </Box>
            <Chip
              label={user.isGstBillingApplicable || "No"}
              color={
                user.isGstBillingApplicable === "Yes" ? "success" : "default"
              }
              size="small"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Update Request Modal */}
      <Dialog
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Request Bank Details Update
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit your updated bank details for admin approval
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Current Data Column */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={2}
                color="text.secondary"
              >
                Current Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: "#f8fafc",
                    p: 2,
                    borderRadius: 2,
                    minHeight: "56px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Account Holder Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.accountHolderName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f8fafc",
                    p: 2,
                    borderRadius: 2,
                    minHeight: "56px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Account Type
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.accountType}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f8fafc",
                    p: 2,
                    borderRadius: 2,
                    minHeight: "56px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Relationship
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.relationshipWithAccountHolder}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f8fafc",
                    p: 2,
                    borderRadius: 2,
                    minHeight: "56px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Account Number
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {maskAccountNumber(user.accountNumber || "")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f8fafc",
                    p: 2,
                    borderRadius: 2,
                    minHeight: "56px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mb: 0.5 }}
                  >
                    IFSC Code
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.ifscCode}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f8fafc",
                    p: 2,
                    borderRadius: 2,
                    minHeight: "56px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Bank Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.bankName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f8fafc",
                    p: 2,
                    borderRadius: 2,
                    minHeight: "56px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Branch Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.branchName}
                  </Typography>
                </Box>
                {(user.accountType === "Current" ||
                  user.accountType === "Others") && (
                  <Box
                    sx={{
                      backgroundColor: "#f8fafc",
                      p: 2,
                      borderRadius: 2,
                      minHeight: "56px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", mb: 0.5 }}
                    >
                      GST Billing Applicable
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.isGstBillingApplicable || "No"}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* New Data Column */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={2}
                color="primary"
              >
                New Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  value={newData.accountHolderName}
                  onChange={(e) =>
                    setNewData((prev) => ({
                      ...prev,
                      accountHolderName: e.target.value,
                    }))
                  }
                  size="small"
                  sx={{ minHeight: "56px" }}
                />
                <TextField
                  select
                  fullWidth
                  label="Account Type"
                  value={newData.accountType}
                  onChange={(e) =>
                    setNewData((prev) => ({
                      ...prev,
                      accountType: e.target.value,
                    }))
                  }
                  size="small"
                  sx={{ minHeight: "56px" }}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Type</option>
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Relationship with Account Holder"
                  value={newData.relationshipWithAccountHolder}
                  onChange={(e) =>
                    setNewData((prev) => ({
                      ...prev,
                      relationshipWithAccountHolder: e.target.value,
                    }))
                  }
                  size="small"
                  sx={{ minHeight: "56px" }}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Relationship</option>
                  {relationshipOptions.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={newData.accountNumber}
                  onChange={(e) =>
                    setNewData((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  size="small"
                  sx={{ minHeight: "56px" }}
                />
                <TextField
                  fullWidth
                  label="IFSC Code"
                  value={newData.ifscCode}
                  onChange={(e) =>
                    setNewData((prev) => ({
                      ...prev,
                      ifscCode: e.target.value,
                    }))
                  }
                  size="small"
                  sx={{ minHeight: "56px" }}
                  helperText="Format: First 4 letters + 0 + 6 characters (e.g., HDFC0123456)"
                />
                <Autocomplete
                  fullWidth
                  options={banks.map((bank) => bank.name)}
                  value={newData.bankName || ""}
                  onChange={(_, value) =>
                    setNewData((prev) => ({ ...prev, bankName: value || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bank Name"
                      size="small"
                      sx={{ minHeight: "56px" }}
                      placeholder="Start typing to search..."
                    />
                  )}
                  freeSolo
                  autoHighlight
                  clearOnEscape
                />

                <TextField
                  fullWidth
                  label="Branch Name"
                  value={newData.branchName}
                  onChange={(e) =>
                    setNewData((prev) => ({
                      ...prev,
                      branchName: e.target.value,
                    }))
                  }
                  size="small"
                  sx={{ minHeight: "56px" }}
                />
                {showGstBilling && (
                  <TextField
                    select
                    fullWidth
                    label="GST Billing Applicable"
                    value={newData.isGstBillingApplicable}
                    onChange={(e) =>
                      setNewData((prev) => ({
                        ...prev,
                        isGstBillingApplicable: e.target.value,
                      }))
                    }
                    size="small"
                    sx={{ minHeight: "56px" }}
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select Option</option>
                    {gstOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Reason for Update */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Reason for Update *"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for this update request..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setUpdateModalOpen(false)}
            disabled={changeRequestLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmRequest}
            disabled={reason.trim() === "" || changeRequestLoading}
            sx={{ borderRadius: 2 }}
            startIcon={
              changeRequestLoading ? <CircularProgress size={20} /> : null
            }
          >
            {changeRequestLoading ? "Submitting..." : "Confirm Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BankDetailsSection;
