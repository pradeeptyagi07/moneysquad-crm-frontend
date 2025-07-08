import React from 'react';
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
  alpha
} from '@mui/material';
import { Timeline, Speed, AccountBalance, Adjust } from '@mui/icons-material';
import { performanceData } from '../data/dashboardData';
import { useAuth } from '../../../hooks/useAuth';

// Styled LinearProgress components using your exact custom colors
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
  const { userRole } = useAuth();

  const getMetricData = () => {
    const baseMetrics = [
      {
        title: 'Disbursal Rate',
        value: `${performanceData.disbursalRate.value}%`,
        target: `${performanceData.disbursalRate.target}%`,
        progress: (performanceData.disbursalRate.value / performanceData.disbursalRate.target) * 100,
        delta: performanceData.disbursalRate.delta,
        icon: <Timeline />,
        color: '#5569FF',
        progressComponent: LinearProgressPrimary
      },
      {
        title: 'Avg. TAT Days',
        value: `${performanceData.avgTAT.value}`,
        target: `${performanceData.avgTAT.target}`,
        progress: (performanceData.avgTAT.target / performanceData.avgTAT.value) * 100,
        delta: performanceData.avgTAT.delta,
        icon: <Speed />,
        color: '#FF1943',
        progressComponent: LinearProgressError
      },
      {
        title: 'Avg. Loan Amount',
        value: `₹${(performanceData.avgLoanAmount.value / 1000).toFixed(0)}K`,
        target: null,
        progress: 75, // Static progress for display
        delta: performanceData.avgLoanAmount.delta,
        icon: <AccountBalance />,
        color: '#57CA22',
        progressComponent: LinearProgressSuccess
      }
    ];

    if (userRole === 'partner') {
      baseMetrics.push({
        title: 'Target Achieved',
        value: `${performanceData.targetAchieved.value}%`,
        target: `${performanceData.targetAchieved.target}%`,
        progress: performanceData.targetAchieved.value,
        delta: performanceData.targetAchieved.delta,
        icon: <Adjust />,
        color: '#FFA319',
        progressComponent: LinearProgressWarning
      });
    }

    return baseMetrics;
  };

  const metrics = getMetricData();

  return (
    <Card
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            fontSize: '1.25rem'
          }}
        >
          Performance Indicators
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.875rem',
            mt: 0.5
          }}
        >
          Key performance metrics overview
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f8fafc',
                '& .MuiTableCell-head': {
                  borderBottom: '1px solid #e5e7eb',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.875rem',
                  py: 2
                }
              }}
            >
              <TableCell>Metric</TableCell>
              <TableCell align="center">Current</TableCell>
              <TableCell align="center">Target</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="center">Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map((metric, index) => {
              const ProgressComponent = metric.progressComponent;
              const isLast = index === metrics.length - 1;
              
              return (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: !isLast ? '1px solid #f3f4f6' : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f8fafc'
                    },
                    '& .MuiTableCell-root': {
                      borderBottom: !isLast ? '1px solid #f3f4f6' : 'none',
                      py: 2.5
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          backgroundColor: `${metric.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${metric.color}30`
                        }}
                      >
                        {React.cloneElement(metric.icon, {
                          sx: { 
                            fontSize: '1.25rem',
                            color: metric.color
                          }
                        })}
                      </Box>
                      
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '0.95rem',
                            lineHeight: 1.2
                          }}
                        >
                          {metric.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            fontSize: '0.8rem'
                          }}
                        >
                          Performance metric
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: metric.color,
                        fontSize: '1.1rem'
                      }}
                    >
                      {metric.value}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      {metric.target || 'N/A'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ width: '100%', maxWidth: 120, mx: 'auto' }}>
                      <ProgressComponent 
                        variant="determinate" 
                        value={Math.min(metric.progress, 100)}
                        sx={{ mb: 0.5 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6b7280',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        {Math.round(metric.progress)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={`${metric.delta >= 0 ? '+' : ''}${metric.delta}%`}
                      size="small"
                      sx={{
                        backgroundColor: metric.delta >= 0 ? '#f0fdf4' : '#fef2f2',
                        color: metric.delta >= 0 ? '#166534' : '#dc2626',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: '28px',
                        borderRadius: '6px',
                        border: `1px solid ${metric.delta >= 0 ? '#bbf7d0' : '#fecaca'}`,
                        '& .MuiChip-label': {
                          px: 1.5,
                          fontWeight: 700
                        }
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