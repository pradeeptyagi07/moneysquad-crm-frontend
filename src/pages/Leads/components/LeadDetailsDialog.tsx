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
import {
  formatCurrency,
  getStatusColor,
  getStatusIcon,
} from "../utils/leadUtils";
import { clearCurrentLead, fetchLeadById } from "../../../store/slices/leadSLice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

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
  const { currentLead: lead, loading } = useAppSelector((s) => s.leads);

  useEffect(() => {
    if (open) dispatch(fetchLeadById(leadId));
    return () => {
      dispatch(clearCurrentLead());
    };
  }, [open, leadId, dispatch]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lead Details</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading || !lead ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Lead ID & Status */}
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="overline" color="textSecondary">
                  Lead ID
                </Typography>
                <Typography variant="h6">{lead.leadId}</Typography>
              </Box>
              <Chip
                icon={getStatusIcon(lead.status)}
                label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                sx={{
                  bgcolor: `${getStatusColor(lead.status, theme)}15`,
                  color: getStatusColor(lead.status, theme),
                  fontWeight: 500,
                  mb: 2,
                }}
              />
            </Grid>

            {/* Applicant Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Applicant Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{lead.applicantName}</Typography>
                  </Grid>
                  {lead.businessName && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Business Name
                      </Typography>
                      <Typography variant="body1">{lead.businessName}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{lead.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Mobile
                    </Typography>
                    <Typography variant="body1">{lead.mobile}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Pincode
                    </Typography>
                    <Typography variant="body1">{lead.pincode.pincode}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {lead.pincode.city}, {lead.pincode.state}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Loan Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Loan Details
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Type
                    </Typography>
                    <Typography variant="body1">{lead.loan.type}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Amount
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(lead.loan.amount)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Disbursement Details */}
            {lead.disbursedData && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Disbursement Details
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(lead.disbursedData.loanAmount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Tenure (months)
                      </Typography>
                      <Typography variant="body1">
                        {lead.disbursedData.tenureMonths}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Interest Rate (PA)
                      </Typography>
                      <Typography variant="body1">
                        {lead.disbursedData.interestRatePA}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Processing Fee
                      </Typography>
                      <Typography variant="body1">
                        {lead.disbursedData.processingFee}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Insurance Charges
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(lead.disbursedData.insuranceCharges)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Scheme
                      </Typography>
                      <Typography variant="body1">
                        {lead.disbursedData.loanScheme}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        LAN Number
                      </Typography>
                      <Typography variant="body1">
                        {lead.disbursedData.lanNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Disbursed On
                      </Typography>
                      <Typography variant="body1">
                        {new Date(lead.disbursedData.actualDisbursedDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Assignment */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Assignment
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Partner
                    </Typography>
                    <Typography variant="body1">
                      {lead.partnerId.basicInfo.fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Manager
                    </Typography>
                    {lead.manager ? (
                      <Typography variant="body1">
                        {lead.manager.firstName} {lead.manager.lastName}
                      </Typography>
                    ) : (
                      <Chip label="Unassigned" variant="outlined" />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(lead.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      Last Status Update
                    </Typography>
                    <Typography variant="body1">
                      {new Date(lead.statusUpdatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Comments */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Comments
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {lead.comments || "No comments."}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailsDialog;
