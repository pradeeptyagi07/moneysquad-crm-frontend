// src/components/Leads/LeadsFilterBar.tsx

import React from "react";
import {
  Paper,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

interface LeadsFilterBarProps {
  statusFilter: string;
  loanTypeFilter: string;
  searchTerm: string;
  onStatusChange: (value: string) => void;
  onLoanTypeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const LeadsFilterBar: React.FC<LeadsFilterBarProps> = ({
  statusFilter,
  loanTypeFilter,
  searchTerm,
  onStatusChange,
  onLoanTypeChange,
  onSearchChange,
  onReset,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="disbursed">Disbursed</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
          </TextField>
        </Grid>

        {/* Loan Type Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Loan Type"
            value={loanTypeFilter}
            onChange={(e) => onLoanTypeChange(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="PL-Term Loan">PL-Term Loan</MenuItem>
            <MenuItem value="PL-Overdraft">PL-Overdraft</MenuItem>
            <MenuItem value="BL-Term Loan">BL-Term Loan</MenuItem>
            <MenuItem value="BL-Overdraft">CBL-Overdraft</MenuItem>
            <MenuItem value="SEPL-Term Loan">SEPL-Term Loan</MenuItem>
            <MenuItem value="SEPL-Overdraft">SEPL-Overdraft</MenuItem>
          </TextField>
        </Grid>

        {/* Search Field */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Search"
            placeholder="Name, Email…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Reset Button */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button size="small" startIcon={<Clear />} onClick={onReset}>
          Reset
        </Button>
      </Box>
    </Paper>
  );
};

export default LeadsFilterBar;
