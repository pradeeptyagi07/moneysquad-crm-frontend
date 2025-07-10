// src/components/GlobalFilters.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  SelectChangeEvent,
} from '@mui/material';
import { FilterList, TrendingUp, Person, CalendarMonth } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../../store';
import { fetchAssociates } from '../../../store/slices/associateSlice';
import { fetchLoanTypes } from '../../../store/slices/lenderLoanSlice';
import { useAuth } from '../../../hooks/useAuth';

const StyledFormControl = styled(FormControl)(() => ({
  minWidth: 180,
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#fff',
    transition: 'all 0.3s ease-in-out',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#5569FF',
      boxShadow: '0 0 0 1px rgba(85,105,255,0.2)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#5569FF',
      borderWidth: 2,
      boxShadow: '0 4px 12px rgba(85,105,255,0.25)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e5e7eb',
      borderWidth: 1,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: 600,
    fontSize: '0.875rem',
    '&.Mui-focused': { color: '#5569FF' },
    '&.MuiInputLabel-shrink': { color: '#5569FF', fontWeight: 700 },
  },
  '& .MuiSelect-select': {
    padding: '10px 14px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
  },
}));

interface Props {
  loanType: string;
  onLoanTypeChange: (v: string) => void;
  associateId: string;
  onAssociateChange: (v: string) => void;
  month: string;
  onMonthChange: (v: string) => void;
}

const GlobalFilters: React.FC<Props> = ({
  loanType,
  onLoanTypeChange,
  associateId,
  onAssociateChange,
  month,
  onMonthChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userRole } = useAuth();                        // ← get userRole
  const associates = useSelector((s: RootState) => s.associate.associates);
  const loanTypes  = useSelector((s: RootState) => s.lenderLoan.loanTypes);

  useEffect(() => {
    dispatch(fetchAssociates());
    dispatch(fetchLoanTypes());
  }, [dispatch]);

  const activeCount =
    (loanType !== 'all'      ? 1 : 0) +
    (associateId !== 'all'   ? 1 : 0) +
    (month !== 'current'     ? 1 : 0);

  const handleLoanTypeChange = (e: SelectChangeEvent) => onLoanTypeChange(e.target.value);
  const handleAssociateChange = (e: SelectChangeEvent) => onAssociateChange(e.target.value);
  const handleMonthChange     = (e: SelectChangeEvent) => onMonthChange(e.target.value);

  return (
    <Card sx={{
      p: 2.5,
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg,#fff 0%,#f8fafc 100%)'
    }}>
      {/* header */}
      <Box display="flex" alignItems="center" gap={2} mb={2.5}>
        <Box sx={{
          width: 36,
          height: 36,
          borderRadius: 1.25,
          backgroundColor: '#5569FF15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #5569FF30',
        }}>
          <FilterList sx={{ color: '#5569FF' }} />
        </Box>
        <Box flex={1}>
          <Typography variant="h6" fontWeight={700}>Global Filters</Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            Customize your dashboard view
          </Typography>
        </Box>
        {activeCount > 0 && (
          <Chip
            label={`${activeCount} active`}
            size="small"
            sx={{
              backgroundColor: '#5569FF',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
        )}
      </Box>

      {/* controls */}
      <Box display="flex" gap={2.5} flexWrap="wrap" alignItems="center">
        {/* Loan Type */}
        <StyledFormControl size="small">
          <InputLabel id="loan-type-label"><TrendingUp sx={{ mr: 1 }} />Loan Type</InputLabel>
          <Select
            labelId="loan-type-label"
            id="loan-type-select"
            value={loanType}
            label="Loan Type"
            onChange={handleLoanTypeChange}
          >
            <MenuItem value="all">All Types</MenuItem>
            {loanTypes.map((lt: any) => (
              <MenuItem key={lt._id} value={lt._id}>{lt.name}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        {/* Associate – only visible for partners */}
        {userRole === 'partner' && (
          <StyledFormControl size="small">
            <InputLabel id="associate-label"><Person sx={{ mr: 1 }} />Associate</InputLabel>
            <Select
              labelId="associate-label"
              id="associate-select"
              value={associateId}
              label="Associate"
              onChange={handleAssociateChange}
            >
              <MenuItem value="all">All Associates</MenuItem>
              {associates.map((a: any) => (
                <MenuItem key={a._id} value={a._id}>
                  {a.associateDisplayId} – {a.firstName} {a.lastName}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        )}

        {/* Month */}
        <StyledFormControl size="small">
          <InputLabel id="month-label"><CalendarMonth sx={{ mr: 1 }} />Month</InputLabel>
          <Select
            labelId="month-label"
            id="month-select"
            value={month}
            label="Month"
            onChange={handleMonthChange}
          >
            <MenuItem value="current">Current Month</MenuItem>
            <MenuItem value="last">Last Month</MenuItem>
            <MenuItem value="2024-01">January 2024</MenuItem>
            <MenuItem value="2024-02">February 2024</MenuItem>
            <MenuItem value="2024-03">March 2024</MenuItem>
            {/* …etc */}
          </Select>
        </StyledFormControl>
      </Box>
    </Card>
  );
};

export default GlobalFilters;
