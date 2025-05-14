import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  People,
  CheckCircle,
  Schedule,
  Cancel,
  Visibility,
  Comment,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Commission {
  id: string;
  leadName: string;
  loanType: string;
  loanAmount: string;
  commission: string;
  status: 'pending' | 'paid' | 'processing';
  date: string;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Commission Earnings',
      data: [50000, 75000, 60000, 90000, 80000, 120000],
      borderColor: '#2563eb',
      tension: 0.4,
    },
  ],
};

const initialCommissions: Commission[] = [
  {
    id: '1',
    leadName: 'Rahul Sharma',
    loanType: 'Personal Loan',
    loanAmount: '₹5,00,000',
    commission: '₹10,000',
    status: 'paid',
    date: '2024-02-20',
  },
  {
    id: '2',
    leadName: 'Priya Patel',
    loanType: 'Home Loan',
    loanAmount: '₹50,00,000',
    commission: '₹75,000',
    status: 'processing',
    date: '2024-02-19',
  },
  {
    id: '3',
    leadName: 'Amit Kumar',
    loanType: 'Business Loan',
    loanAmount: '₹10,00,000',
    commission: '₹20,000',
    status: 'pending',
    date: '2024-02-18',
  },
];

const Commissions: React.FC = () => {
  const [commissions] = useState<Commission[]>(initialCommissions);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (commission: Commission) => {
    setSelectedCommission(commission);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCommission(null);
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  const totalEarnings = commissions.reduce((sum, commission) => {
    return sum + parseInt(commission.commission.replace(/[^0-9]/g, ''));
  }, 0);

  const pendingAmount = commissions
    .filter((commission) => commission.status !== 'paid')
    .reduce((sum, commission) => {
      return sum + parseInt(commission.commission.replace(/[^0-9]/g, ''));
    }, 0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Commission Earnings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Earnings
              </Typography>
              <Typography variant="h4" color="primary">
                ₹{totalEarnings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 0.5 }} />
                +12.5% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Pending Amount
              </Typography>
              <Typography variant="h4" color="warning.main">
                ₹{pendingAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From {commissions.filter((c) => c.status !== 'paid').length} leads
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4" color="success.main">
                85%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Earnings Trend
              </Typography>
              <Line options={chartOptions} data={chartData} height={80} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lead Name</TableCell>
                  <TableCell>Loan Details</TableCell>
                  <TableCell>Commission</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{mr: 2}}>{commission.leadName[0]}</Avatar>
                        {commission.leadName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{commission.loanType}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Amount: {commission.loanAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {commission.commission}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                        color={getStatusChipColor(commission.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(commission.date).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(commission)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Commission Details</DialogTitle>
        <DialogContent>
          {selectedCommission && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lead Information
                  </Typography>
                  <Typography variant="body1">{selectedCommission.leadName}</Typography>
                  <Typography variant="body2">{selectedCommission.loanType}</Typography>
                  <Typography variant="body2">Loan Amount: {selectedCommission.loanAmount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Commission Information
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {selectedCommission.commission}
                  </Typography>
                  <Chip
                    label={selectedCommission.status.charAt(0).toUpperCase() + selectedCommission.status.slice(1)}
                    color={getStatusChipColor(selectedCommission.status) as any}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button
            variant="contained"
            onClick={handleCloseDialog}
            disabled={selectedCommission?.status === 'paid'}
          >
            Track Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Commissions;