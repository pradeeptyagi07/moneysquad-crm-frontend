import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material';
import {
  Search,
  Add,
  FileDownload,
  People,
  CheckCircle,
  Schedule,
  Cancel,
  Visibility,
  Comment,
} from '@mui/icons-material';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  loanType: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.s@example.com',
    loanType: 'Personal Loan',
    amount: '₹5,00,000',
    status: 'approved',
    date: '2024-02-20',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    email: 'priya.p@example.com',
    loanType: 'Home Loan',
    amount: '₹50,00,000',
    status: 'pending',
    date: '2024-02-19',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    phone: '+91 76543 21098',
    email: 'amit.k@example.com',
    loanType: 'Business Loan',
    amount: '₹10,00,000',
    status: 'rejected',
    date: '2024-02-18',
  },
];

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event: any) => {
    setFilterStatus(event.target.value);
  };

  const handleOpenDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLead(null);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Leads Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* Handle new lead */}}
        >
          Add New Lead
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search leads..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={handleStatusFilter}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={() => {/* Handle export */}}
              >
                Export Leads
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Loan Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>{lead.name[0]}</Avatar>
                    {lead.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{lead.phone}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lead.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{lead.loanType}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Amount: {lead.amount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    color={getStatusChipColor(lead.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(lead)}>
                    <Visibility />
                  </IconButton>
                  <IconButton>
                    <Comment />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Personal Information
                  </Typography>
                  <Typography variant="body1">{selectedLead.name}</Typography>
                  <Typography variant="body2">{selectedLead.phone}</Typography>
                  <Typography variant="body2">{selectedLead.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Loan Information
                  </Typography>
                  <Typography variant="body1">{selectedLead.loanType}</Typography>
                  <Typography variant="body2">Amount: {selectedLead.amount}</Typography>
                  <Chip
                    label={selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                    color={getStatusChipColor(selectedLead.status) as any}
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
          <Button variant="contained" onClick={handleCloseDialog}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;