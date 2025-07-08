import React, { useState } from 'react';
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  styled,
  SelectChangeEvent
} from '@mui/material';
import { FilterList, TrendingUp, Person, CalendarMonth } from '@mui/icons-material';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 180,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#5569FF',
        boxShadow: '0 0 0 1px rgba(85, 105, 255, 0.2)'
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#5569FF',
        borderWidth: '2px',
        boxShadow: '0 4px 12px rgba(85, 105, 255, 0.25)'
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e5e7eb',
      borderWidth: '1px'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: 600,
    fontSize: '0.875rem',
    '&.Mui-focused': {
      color: '#5569FF'
    },
    '&.MuiInputLabel-shrink': {
      color: '#5569FF',
      fontWeight: 700
    }
  },
  '& .MuiSelect-select': {
    padding: '10px 14px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151'
  }
}));

const GlobalFilters: React.FC = () => {
  const [loanType, setLoanType] = useState('all');
  const [associateId, setAssociateId] = useState('all');
  const [month, setMonth] = useState('current');

  const handleLoanTypeChange = (event: SelectChangeEvent) => {
    setLoanType(event.target.value);
  };

  const handleAssociateChange = (event: SelectChangeEvent) => {
    setAssociateId(event.target.value);
  };

  const handleMonthChange = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (loanType !== 'all') count++;
    if (associateId !== 'all') count++;
    if (month !== 'current') count++;
    return count;
  };

  return (
    <Card
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: '#5569FF15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #5569FF30'
            }}
          >
            <FilterList sx={{ fontSize: '1.1rem', color: '#5569FF' }} />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '1rem',
                lineHeight: 1.2
              }}
            >
              Global Filters
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.75rem'
              }}
            >
              Customize your dashboard view
            </Typography>
          </Box>

          {getActiveFiltersCount() > 0 && (
            <Chip
              label={`${getActiveFiltersCount()} active`}
              size="small"
              sx={{
                backgroundColor: '#5569FF',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '22px',
                borderRadius: '6px',
                '& .MuiChip-label': {
                  px: 1.2
                }
              }}
            />
          )}
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2.5, 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <StyledFormControl size="small">
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: '0.9rem' }} />
                Loan Type
              </Box>
            </InputLabel>
            <Select
              value={loanType}
              onChange={handleLoanTypeChange}
              label="Loan Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="personal">Personal Loan</MenuItem>
              <MenuItem value="business">Business Loan</MenuItem>
              <MenuItem value="home">Home Loan</MenuItem>
              <MenuItem value="vehicle">Vehicle Loan</MenuItem>
              <MenuItem value="education">Education Loan</MenuItem>
            </Select>
          </StyledFormControl>

          <StyledFormControl size="small">
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: '0.9rem' }} />
                Associate ID
              </Box>
            </InputLabel>
            <Select
              value={associateId}
              onChange={handleAssociateChange}
              label="Associate ID"
            >
              <MenuItem value="all">All Associates</MenuItem>
              <MenuItem value="ASC001">ASC001 - John Doe</MenuItem>
              <MenuItem value="ASC002">ASC002 - Jane Smith</MenuItem>
              <MenuItem value="ASC003">ASC003 - Mike Johnson</MenuItem>
              <MenuItem value="ASC004">ASC004 - Sarah Wilson</MenuItem>
              <MenuItem value="ASC005">ASC005 - David Brown</MenuItem>
            </Select>
          </StyledFormControl>

          <StyledFormControl size="small">
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth sx={{ fontSize: '0.9rem' }} />
                Month
              </Box>
            </InputLabel>
            <Select
              value={month}
              onChange={handleMonthChange}
              label="Month"
            >
              <MenuItem value="current">Current Month</MenuItem>
              <MenuItem value="last">Last Month</MenuItem>
              <MenuItem value="jan">January 2024</MenuItem>
              <MenuItem value="feb">February 2024</MenuItem>
              <MenuItem value="mar">March 2024</MenuItem>
              <MenuItem value="apr">April 2024</MenuItem>
              <MenuItem value="may">May 2024</MenuItem>
              <MenuItem value="jun">June 2024</MenuItem>
              <MenuItem value="jul">July 2024</MenuItem>
              <MenuItem value="aug">August 2024</MenuItem>
              <MenuItem value="sep">September 2024</MenuItem>
              <MenuItem value="oct">October 2024</MenuItem>
              <MenuItem value="nov">November 2024</MenuItem>
              <MenuItem value="dec">December 2024</MenuItem>
            </Select>
          </StyledFormControl>
        </Box>
      </Box>
    </Card>
  );
};

export default GlobalFilters;