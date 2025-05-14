import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Paper,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Share, Visibility, Close } from '@mui/icons-material';

interface BankOffer {
  id: string;
  bankName: string;
  logo: string;
  loanType: string;
  interestRate: string;
  processingFee: string;
  maxAmount: string;
  features: string[];
  commission: string;
}

const initialOffers: BankOffer[] = [
  {
    id: '1',
    bankName: 'HDFC Bank',
    logo: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    loanType: 'Personal Loan',
    interestRate: '10.50%',
    processingFee: '1%',
    maxAmount: '₹40,00,000',
    features: ['Quick Approval', 'Minimal Documentation', 'Flexible Tenure'],
    commission: '2%',
  },
  {
    id: '2',
    bankName: 'ICICI Bank',
    logo: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    loanType: 'Home Loan',
    interestRate: '8.75%',
    processingFee: '0.5%',
    maxAmount: '₹5,00,00,000',
    features: ['Low Interest Rate', 'Long Tenure', 'Balance Transfer'],
    commission: '1.5%',
  },
  {
    id: '3',
    bankName: 'Axis Bank',
    logo: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    loanType: 'Business Loan',
    interestRate: '12.00%',
    processingFee: '1.5%',
    maxAmount: '₹75,00,000',
    features: ['No Collateral', 'GST Returns Based', 'Quick Disbursement'],
    commission: '2.5%',
  },
];

const Offers: React.FC = () => {
  const [offers] = useState<BankOffer[]>(initialOffers);
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (offer: BankOffer) => {
    setSelectedOffer(offer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOffer(null);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Bank Offers
      </Typography>

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} md={4} key={offer.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={offer.logo}
                alt={offer.bankName}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {offer.bankName}
                </Typography>
                <Chip
                  label={offer.loanType}
                  color="primary"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Interest Rate
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {offer.interestRate}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Processing Fee
                  </Typography>
                  <Typography variant="body1">{offer.processingFee}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Maximum Amount
                  </Typography>
                  <Typography variant="body1">{offer.maxAmount}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  {offer.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleOpenDialog(offer)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedOffer?.bankName} - Offer Details</Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOffer && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedOffer.logo}
                  alt={selectedOffer.bankName}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {selectedOffer.loanType}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Interest Rate</TableCell>
                        <TableCell>{selectedOffer.interestRate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Processing Fee</TableCell>
                        <TableCell>{selectedOffer.processingFee}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maximum Amount</TableCell>
                        <TableCell>{selectedOffer.maxAmount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Commission</TableCell>
                        <TableCell>{selectedOffer.commission}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Key Features
                </Typography>
                <Box>
                  {selectedOffer.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Share />}
            onClick={() => {/* Handle share */}}
          >
            Share Offer
          </Button>
          <Button
            variant="contained"
            onClick={() => {/* Handle apply */}}
          >
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Offers;