// src/pages/Leads/components/LeadDetailsDialog.tsx
"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import {
  fetchLeadById,
  clearCurrentLead,
} from "../../../store/slices/leadSLice";
import {
  formatCurrency,
  getStatusColor,
  getStatusIcon,
} from "../utils/leadUtils";

interface LeadDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
}

const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({
  open,
  onClose,
  leadId,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { currentLead: lead, loading } = useAppSelector((state) => state.leads);

  // fetch when opened
  useEffect(() => {
    if (open && leadId) {
      dispatch(fetchLeadById(leadId));
    }
    return () => {
      dispatch(clearCurrentLead());
    };
  }, [open, leadId, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lead Details</Typography>
          <IconButton edge="end" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading || !lead ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="overline" color="textSecondary">
                  Lead ID
                </Typography>
                <Typography variant="h6">{lead.leadId || lead.id}</Typography>
              </Box>
              <Chip
                icon={getStatusIcon(lead.status!)}
                label={
                  lead.status
                    ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1)
                    : "NA"
                }
                sx={{
                  bgcolor: `${getStatusColor(lead.status!, theme)}15`,
                  color: getStatusColor(lead.status!, theme),
                  fontWeight: 500,
                  mb: 2,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Applicant Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {lead.applicant.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Profile
                    </Typography>
                    <Typography variant="body1">
                      {lead.applicant.profile}
                    </Typography>
                  </Grid>
                  {lead.profile === "Business" && lead.lenderType && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Business Name
                      </Typography>
                      <Typography variant="body1">{lead.lenderType}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Mobile Number
                    </Typography>
                    <Typography variant="body1">
                      {lead.applicant.mobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {lead.applicant.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Pincode
                    </Typography>
                    <Typography variant="body1">
                      {lead.applicant.pincode}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Loan Details
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Loan Type
                    </Typography>
                    <Typography variant="body1">{lead.loan.type}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Loan Amount
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(
                        typeof lead.loan.amount === "string"
                          ? +lead.loan.amount
                          : lead.loan.amount
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Lender Type
                    </Typography>
                    <Typography variant="body1">
                      {lead.lenderType || "Not Provided"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {lead.disbursedData && (
  <Grid item xs={12}>
    <Typography variant="subtitle1" gutterBottom fontWeight={600}>
      Disbursed Info
    </Typography>
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            Loan Amount
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {formatCurrency(lead.disbursedData.loanAmount)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            Tenure (Months)
          </Typography>
          <Typography variant="body1">
            {lead.disbursedData.tenureMonths}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            Interest Rate (PA)
          </Typography>
          <Typography variant="body1">
            {lead.disbursedData.interestRatePA}%
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            Processing Fee
          </Typography>
          <Typography variant="body1">
            {formatCurrency(lead.disbursedData.processingFee)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            Insurance Charges
          </Typography>
          <Typography variant="body1">
            {formatCurrency(lead.disbursedData.insuranceCharges)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            Loan Scheme
          </Typography>
          <Typography variant="body1">
            {lead.disbursedData.loanScheme}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            LAN Number
          </Typography>
          <Typography variant="body1">
            {lead.disbursedData.lanNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary">
            Disbursed Date
          </Typography>
          <Typography variant="body1">
            {new Date(lead.disbursedData.actualDisbursedDate).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  </Grid>
)}


            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Assignment Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Partner
                    </Typography>
                    <Typography variant="body1">
                      {lead.partnerId?.basicInfo?.fullName || "NA"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Manager
                    </Typography>
                    {lead.manager ? (
                      <Typography variant="body1">{lead.manager}</Typography>
                    ) : (
                      <Chip
                        size="small"
                        label="Unassigned"
                        variant="outlined"
                        sx={{
                          bgcolor: theme.palette.grey[100],
                          color: theme.palette.text.secondary,
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleString()
                        : "NA"}
                    </Typography>
                  </Grid>
                  {lead.updatedAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(lead.updatedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Additional Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Comments
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {lead.loan.comments || "No comments provided"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailsDialog;
