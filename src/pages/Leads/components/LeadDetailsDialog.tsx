"use client"

import type React from "react"
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
} from "@mui/material"
import { Close } from "@mui/icons-material"
import type { Lead } from "../../../data/leadTypes"
import { formatCurrency, getStatusColor, getStatusIcon } from "../utils/leadUtils"
import { useTheme } from "@mui/material/styles"

interface LeadDetailsDialogProps {
  open: boolean
  onClose: () => void
  lead: Lead
}

const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({ open, onClose, lead }) => {
  const theme = useTheme()

  // If lead is undefined, don't render the dialog content
  if (!lead) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Lead Details</Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>No lead selected</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lead Details</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="overline" color="textSecondary">
                Lead ID
              </Typography>
              <Typography variant="h6">{lead.id}</Typography>
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
                  <Typography variant="body1">{lead.applicantName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Profile
                  </Typography>
                  <Typography variant="body1">{lead.applicantProfile}</Typography>
                </Grid>
                {lead.businessName && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Business Name
                    </Typography>
                    <Typography variant="body1">{lead.businessName}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Mobile Number
                  </Typography>
                  <Typography variant="body1">{lead.mobileNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{lead.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Pincode
                  </Typography>
                  <Typography variant="body1">{lead.pincode}</Typography>
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
                  <Typography variant="body1">{lead.loanType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Loan Amount
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatCurrency(lead.loanAmount)}
                  </Typography>
                </Grid>
                {lead.lender && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Lender
                    </Typography>
                    <Typography variant="body1">{lead.lender}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Assignment Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Created By
                  </Typography>
                  <Typography variant="body1">{lead.createdBy}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">{new Date(lead.createdAt).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Assigned To
                  </Typography>
                  <Typography variant="body1">
                    {lead.assignedTo || <Chip size="small" label="Unassigned" variant="outlined" />}
                  </Typography>
                </Grid>
                {lead.updatedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">{new Date(lead.updatedAt).toLocaleString()}</Typography>
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
                {lead.comments || "No comments provided"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeadDetailsDialog
