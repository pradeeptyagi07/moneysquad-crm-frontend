// src/components/dashboard/components/PerformanceMetrics.tsx

import React, { useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  styled,
  linearProgressClasses,
  alpha,
  CircularProgress,
  Alert
} from '@mui/material';
import { Timeline, Speed, AccountBalance, Adjust } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatrix } from '../../../store/slices/dashboardSlice';
import type { RootState, AppDispatch } from '../../../store';

// Styled LinearProgress components
const LinearProgressPrimary = styled(LinearProgress)(
  () => `
    height: 6px;
    border-radius: 8px;
    &.${linearProgressClasses.colorPrimary} {
      background-color: ${alpha('#5569FF', 0.3)};
    }
    & .${linearProgressClasses.bar} {
      border-radius: 8px;
      background-color: #5569FF;
    }
  `
);
const LinearProgressError = styled(LinearProgress)(
  () => `
    height: 6px;
    border-radius: 8px;
    &.${linearProgressClasses.colorPrimary} {
      background-color: ${alpha('#FF1943', 0.3)};
    }
    & .${linearProgressClasses.bar} {
      border-radius: 8px;
      background-color: #FF1943;
    }
  `
);
const LinearProgressWarning = styled(LinearProgress)(
  () => `
    height: 6px;
    border-radius: 8px;
    &.${linearProgressClasses.colorPrimary} {
      background-color: ${alpha('#FFA319', 0.3)};
    }
    & .${linearProgressClasses.bar} {
      border-radius: 8px;
      background-color: #FFA319;
    }
  `
);
const LinearProgressSuccess = styled(LinearProgress)(
  () => `
    height: 6px;
    border-radius: 8px;
    &.${linearProgressClasses.colorPrimary} {
      background-color: ${alpha('#57CA22', 0.3)};
    }
    & .${linearProgressClasses.bar} {
      border-radius: 8px;
      background-color: #57CA22;
    }
  `
);

const PerformanceMetrics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userRole } = useAuth();
  const { matrix, matrixLoading, matrixError } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchMatrix());
  }, [dispatch]);

  // if (matrixLoading) {
  //   return (
  //     <Box display="flex" justifyContent="center" p={4}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  if (matrixError) {
    return <Alert severity="error">{matrixError}</Alert>;
  }

  if (!matrix) {
    return null;
  }

  const metrics = [
    {
      title: 'Disbursal Rate',
      value: `${matrix.disbursalRatePct}%`,
      target: '85%',
      progress: matrix.disbursalRatePct,
      delta: matrix.disbursalRatePct,
      icon: <Timeline />,
      color: '#5569FF',
      Progress: LinearProgressPrimary
    },
    {
      title: 'Avg. TAT Days',
      value: `${matrix.avgDisbursalTATdays.toFixed(1)}`,
      target: '3.5',
      progress: matrix.avgDisbursalTATdays > 0
        ? Math.min((matrix.avgDisbursalTATdays / 3.5) * 100, 100)
        : 0,
      delta: matrix.avgDisbursalTATdays - 3.5,
      icon: <Speed />,
      color: '#FF1943',
      Progress: LinearProgressError
    },
    {
      title: 'Avg. Loan Amount',
      value: `₹${(matrix.avgLoanAmount / 1000).toFixed(0)}K`,
      target: 'N/A',
      progress: matrix.avgLoanAmount > 0 ? 100 : 0,
      delta: matrix.avgLoanAmount,
      icon: <AccountBalance />,
      color: '#57CA22',
      Progress: LinearProgressSuccess
    },
  ];

  if (userRole === 'partner') {
    metrics.push({
      title: 'Target Achieved',
      value: matrix.targetAchievedPct != null ? `${matrix.targetAchievedPct}%` : '0%',
      target: '100%',
      progress: matrix.targetAchievedPct ?? 0,
      delta: matrix.targetAchievedPct ?? 0,
      icon: <Adjust />,
      color: '#FFA319',
      Progress: LinearProgressWarning
    });
  }

  return (
    <Card sx={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.25rem' }}>
          Performance Indicators
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mt: 0.5 }}>
          Key performance metrics overview
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{
              backgroundColor: '#f8fafc',
              '& .MuiTableCell-head': {
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 600,
                color: '#374151',
                fontSize: '0.875rem',
                py: 0.1
              }
            }}>
              <TableCell>Metric</TableCell>
              <TableCell align="center">Current / Target</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="center">Change</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {metrics.map((m, i) => {
              const isLast = i === metrics.length - 1;
              return (
                <TableRow
                  key={i}
                  sx={{
                    borderBottom: !isLast ? '1px solid #f3f4f6' : 'none',
                    '&:hover': { backgroundColor: '#f8fafc' },
                    '& .MuiTableCell-root': {
                      borderBottom: !isLast ? '1px solid #f3f4f6' : 'none',
                      py: 2.3
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '10px',
                        backgroundColor: `${m.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${m.color}30`
                      }}>
                        {React.cloneElement(m.icon, { sx: { fontSize: '1.25rem', color: m.color } })}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.75rem' }}>
                        {m.title}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: m.color, fontSize: '1.1rem' }}>
                        {m.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500, mt: 0.5 }}>
                        {m.target}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ width: '100%', maxWidth: 120, mx: 'auto' }}>
                      <m.Progress
                        variant="determinate"
                        value={Math.min(m.progress, 100)}
                        sx={{ mb: 0.5 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        {Math.round(m.progress)}%
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={`${m.delta >= 0 ? '+' : ''}${m.delta}%`}
                      size="small"
                      sx={{
                        backgroundColor: m.delta >= 0 ? '#f0fdf4' : '#fef2f2',
                        color: m.delta >= 0 ? '#166534' : '#dc2626',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: '28px',
                        borderRadius: '6px',
                        border: `1px solid ${m.delta >= 0 ? '#bbf7d0' : '#fecaca'}`,
                        '& .MuiChip-label': { px: 1.5, fontWeight: 700 }
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default PerformanceMetrics;
