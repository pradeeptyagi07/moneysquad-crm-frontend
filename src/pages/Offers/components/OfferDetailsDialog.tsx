"use client"

import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Paper,
  IconButton,
  Grid,
  CardMedia,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slide,
} from "@mui/material"
import type { TransitionProps } from "@mui/material/transitions"
import {
  Close,
  Share,
  Star,
  Person,
  AttachMoney,
  Work,
  CreditScore,
  Business,
  School,
  Diamond,
  Description,
} from "@mui/icons-material"
import type { BankOffer } from "../types"

interface OfferDetailsDialogProps {
  open: boolean
  onClose: () => void
  offer: BankOffer
  userRole: string
}

// Transition component for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const OfferDetailsDialog: React.FC<OfferDetailsDialogProps> = ({ open, onClose, offer, userRole }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Transition}>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {offer.bankName} - Offer Details
            {offer.isFeatured && (
              <Chip
                icon={<Star fontSize="small" />}
                label="Featured"
                size="small"
                color="warning"
                sx={{ ml: 1, fontWeight: 500 }}
              />
            )}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="240"
              image={offer.logo}
              alt={offer.bankName}
              sx={{ borderRadius: 2, objectFit: "cover" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {offer.headline && (
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {offer.headline}
              </Typography>
            )}
            <Typography variant="h6" gutterBottom>
              {offer.loanType}
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Interest Rate</TableCell>
                    <TableCell>{offer.interestRate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Processing Fee</TableCell>
                    <TableCell>{offer.processingFee}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Maximum Amount</TableCell>
                    <TableCell>{offer.maxAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Commission</TableCell>
                    <TableCell sx={{ color: "success.main", fontWeight: 600 }}>{offer.commission}</TableCell>
                  </TableRow>
                  {offer.validity && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500 }}>Valid Till</TableCell>
                      <TableCell>{offer.validity}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="subtitle1" gutterBottom>
              Key Features
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {offer.features.map((feature, index) => (
                <Chip key={index} label={feature} sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Eligibility & Requirements
            </Typography>
            {offer.eligibilityCriteria ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Eligibility Criteria
                    </Typography>
                    <List dense>
                      {offer.eligibilityCriteria.minAge && (
                        <ListItem>
                          <ListItemIcon>
                            <Person fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Age"
                            secondary={`${offer.eligibilityCriteria.minAge} - ${offer.eligibilityCriteria.maxAge} years`}
                          />
                        </ListItem>
                      )}
                      {offer.eligibilityCriteria.minIncome && (
                        <ListItem>
                          <ListItemIcon>
                            <AttachMoney fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Minimum Income" secondary={offer.eligibilityCriteria.minIncome} />
                        </ListItem>
                      )}
                      {offer.eligibilityCriteria.employmentType && (
                        <ListItem>
                          <ListItemIcon>
                            <Work fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Employment Type"
                            secondary={offer.eligibilityCriteria.employmentType}
                          />
                        </ListItem>
                      )}
                      {offer.eligibilityCriteria.minCreditScore && (
                        <ListItem>
                          <ListItemIcon>
                            <CreditScore fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Minimum Credit Score"
                            secondary={offer.eligibilityCriteria.minCreditScore}
                          />
                        </ListItem>
                      )}
                      {offer.eligibilityCriteria.businessVintage && (
                        <ListItem>
                          <ListItemIcon>
                            <Business fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Business Vintage"
                            secondary={offer.eligibilityCriteria.businessVintage}
                          />
                        </ListItem>
                      )}
                      {offer.eligibilityCriteria.courseEligibility && (
                        <ListItem>
                          <ListItemIcon>
                            <School fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Course Eligibility"
                            secondary={offer.eligibilityCriteria.courseEligibility}
                          />
                        </ListItem>
                      )}
                      {offer.eligibilityCriteria.goldPurity && (
                        <ListItem>
                          <ListItemIcon>
                            <Diamond fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Gold Purity" secondary={offer.eligibilityCriteria.goldPurity} />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Required Documents
                    </Typography>
                    {offer.eligibilityCriteria.documents && (
                      <List dense>
                        {offer.eligibilityCriteria.documents.map((doc, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Description fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={doc} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" paragraph>
                Please contact the bank for detailed eligibility criteria and documentation requirements.
              </Typography>
            )}

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Terms & Conditions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This offer is subject to the bank's terms and conditions. Please refer to the bank's official website for
              complete details.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          startIcon={<Share />}
          onClick={() => {
            /* Handle share */
          }}
        >
          Share Offer
        </Button>
        {userRole !== "partner" && (
          <Button
            variant="contained"
            onClick={() => {
              /* Handle apply */
            }}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            Apply Now
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default OfferDetailsDialog
