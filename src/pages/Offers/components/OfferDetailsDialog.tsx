"use client";

import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import {
  Close,
  Share,
  Star,
  Person,
  AttachMoney,
  Work,
  CreditScore,
  Edit,
} from "@mui/icons-material";
import CreateOfferDialog from "./CreateOfferDialog";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import {
  fetchOfferById,
  setSelectedOffer,
} from "../../../store/slices/offersSlice";

interface OfferDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  offerId: string;
  userRole: string;
}

// Transition component for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OfferDetailsDialog: React.FC<OfferDetailsDialogProps> = ({
  open,
  onClose,
  offerId,
  userRole,
}) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const dispatch = useAppDispatch();
  const { selectedOffer, detailsLoading, error } = useAppSelector(
    (state) => state.offers
  );

  // Fetch offer details when dialog opens
  useEffect(() => {
    if (open && offerId) {
      dispatch(fetchOfferById(offerId));
    }

    // Clear selected offer when dialog closes
    return () => {
      if (!open) {
        dispatch(setSelectedOffer(null));
      }
    };
  }, [open, offerId, dispatch]);

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleDialogClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {detailsLoading
                ? "Loading Offer Details..."
                : selectedOffer
                ? `${selectedOffer.bankName} - Offer Details`
                : "Offer Details"}
              {selectedOffer?.isFeatured && (
                <Chip
                  icon={<Star fontSize="small" />}
                  label="Featured"
                  size="small"
                  color="warning"
                  sx={{ ml: 1, fontWeight: 500 }}
                />
              )}
            </Typography>
            <Box>
              {userRole === "admin" && selectedOffer && (
                <IconButton onClick={handleOpenEditDialog} sx={{ mr: 1 }}>
                  <Edit />
                </IconButton>
              )}
              <IconButton onClick={handleDialogClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailsLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="error">{error}</Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleDialogClose}
              >
                Close
              </Button>
            </Box>
          ) : selectedOffer ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {selectedOffer.bankImage && (
                  <Box
                    component="img"
                    src={selectedOffer.bankImage}
                    alt="Bank Banner"
                    sx={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: 2,
                      mb: 2,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                {selectedOffer.offerHeadline && (
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {selectedOffer.offerHeadline}
                  </Typography>
                )}
                <Typography variant="h6" gutterBottom>
                  {selectedOffer.loanType}
                </Typography>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ borderRadius: 2, mb: 2 }}
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500 }}>
                          Interest Rate
                        </TableCell>
                        <TableCell>{selectedOffer.interestRate}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500 }}>
                          Processing Fee
                        </TableCell>
                        <TableCell>₹{selectedOffer.processingFee}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500 }}>
                          Maximum Amount
                        </TableCell>
                        <TableCell>
                          ₹{selectedOffer.maximumAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500 }}>
                          Commission
                        </TableCell>
                        <TableCell
                          sx={{ color: "success.main", fontWeight: 600 }}
                        >
                          {selectedOffer.commissionPercent}%
                        </TableCell>
                      </TableRow>
                      {selectedOffer.offerValidity && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Valid Till
                          </TableCell>
                          <TableCell>
                            {new Date(
                              selectedOffer.offerValidity
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Key Features
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedOffer.keyFeatures &&
                  selectedOffer.keyFeatures.length > 0 ? (
                    selectedOffer.keyFeatures.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No features specified for this offer.
                    </Typography>
                  )}
                </Box>

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Eligibility & Requirements
                </Typography>
                {selectedOffer.eligibility ? (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Eligibility Criteria
                    </Typography>
                    <List dense>
                      {selectedOffer.eligibility.minAge && (
                        <ListItem>
                          <ListItemIcon>
                            <Person fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Age"
                            secondary={`${selectedOffer.eligibility.minAge} - ${selectedOffer.eligibility.maxAge} years`}
                          />
                        </ListItem>
                      )}
                      {selectedOffer.eligibility.minIncome && (
                        <ListItem>
                          <ListItemIcon>
                            <AttachMoney fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Minimum Income"
                            secondary={`₹${selectedOffer.eligibility.minIncome}`}
                          />
                        </ListItem>
                      )}
                      {selectedOffer.eligibility.employmentType && (
                        <ListItem>
                          <ListItemIcon>
                            <Work fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Employment Type"
                            secondary={selectedOffer.eligibility.employmentType}
                          />
                        </ListItem>
                      )}
                      {selectedOffer.eligibility.maxCreditScore && (
                        <ListItem>
                          <ListItemIcon>
                            <CreditScore fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Maximum Credit Score"
                            secondary={selectedOffer.eligibility.maxCreditScore}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                ) : (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Please contact the bank for detailed eligibility criteria
                    and documentation requirements.
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Terms & Conditions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This offer is subject to the bank's terms and conditions.
                  Please refer to the bank's official website for complete
                  details.
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography>No offer details available</Typography>
            </Box>
          )}
        </DialogContent>
        {selectedOffer && (
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
                  borderRadius: 6,
                  fontWeight: 600,
                  bgcolor: "#5E17EB",
                  "&:hover": {
                    bgcolor: "#4A11C0",
                  },
                }}
              >
                Apply Now
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>

      {/* Edit Offer Dialog */}
      {userRole === "admin" && selectedOffer && (
        <CreateOfferDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          editOffer={selectedOffer}
        />
      )}
    </>
  );
};

export default OfferDetailsDialog;
