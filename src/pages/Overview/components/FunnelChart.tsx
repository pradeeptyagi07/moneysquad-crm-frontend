import React from 'react';
import {
  Card,
  Typography,
  Box,
  LinearProgress,
  styled,
  linearProgressClasses,
  alpha
} from '@mui/material';
import { funnelData } from '../data/dashboardData';

// Styled LinearProgress components using your exact custom colors
const LinearProgressPrimary = styled(LinearProgress)(
  () => `
        height: 8px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#5569FF', 0.1)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #5569FF;
        }
    `
);

const LinearProgressError = styled(LinearProgress)(
  () => `
        height: 8px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#FF1943', 0.1)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #FF1943;
        }
    `
);

const LinearProgressSuccess = styled(LinearProgress)(
  () => `
        height: 8px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#57CA22', 0.1)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #57CA22;
        }
    `
);

const LinearProgressWarning = styled(LinearProgress)(
  () => `
        height: 8px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#FFA319', 0.1)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #FFA319;
        }
    `
);

const FunnelChart: React.FC = () => {
  const getProgressComponent = (index: number) => {
    switch (index) {
      case 0:
        return LinearProgressPrimary;
      case 1:
        return LinearProgressError;
      case 2:
        return LinearProgressSuccess;
      case 3:
        return LinearProgressWarning;
      default:
        return LinearProgressPrimary;
    }
  };

  const getStageColor = (index: number) => {
    switch (index) {
      case 0:
        return '#5569FF'; // Blue
      case 1:
        return '#FF1943'; // Red
      case 2:
        return '#57CA22'; // Green
      case 3:
        return '#FFA319'; // Orange
      default:
        return '#5569FF';
    }
  };

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
          Conversion Funnel
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.875rem',
            mt: 0.5
          }}
        >
          Lead progression through stages
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {funnelData.map((stage, index) => {
          const ProgressComponent = getProgressComponent(index);
          const stageColor = getStageColor(index);
          const showConversion = stage.stage !== 'Added';
          const isLast = index === funnelData.length - 1;
          
          return (
            <Box 
              key={index} 
              sx={{ 
                borderBottom: !isLast ? '1px solid #f3f4f6' : 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              <Box sx={{ p: 3, py: 2.5 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1.5}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Stage indicator dot */}
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: stageColor,
                        boxShadow: `0 2px 4px ${stageColor}40`
                      }}
                    />
                    
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: '#1e293b',
                          lineHeight: 1.2
                        }}
                      >
                        {stage.stage}
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      >
                        Total {stage.stage.toLowerCase()} leads
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: stageColor,
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        lineHeight: 1,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
                      }}
                    >
                      {stage.value.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#9ca3af',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        mt: 0.5
                      }}
                    >
                      {showConversion ? `${stage.conversion}% conversion` : '100% base'}
                    </Typography>
                  </Box>
                </Box>
                
                <ProgressComponent 
                  variant="determinate" 
                  value={stage.conversion}
                  sx={{ 
                    height: 8,
                    borderRadius: '8px'
                  }}
                />
                
                <Box
                  display="flex"
                  sx={{
                    mt: 0.6
                  }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                    variant="subtitle2"
                  >
                    Target
                  </Typography>
                  <Typography
                    sx={{
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                    variant="subtitle2"
                  >
                    100%
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default FunnelChart;