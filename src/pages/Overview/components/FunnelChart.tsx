// src/components/FunnelChart.tsx
import React from 'react';
import {
  Card,
  Typography,
  Box,
  LinearProgress,
  styled,
  linearProgressClasses,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FunnelStage } from '../../../store/slices/dashboardSlice';


const LinearProgressPrimary = styled(LinearProgress)(() => `
  height: 8px;
  border-radius: 8px;
  &.${linearProgressClasses.colorPrimary} {
    background-color: ${alpha('#5569FF', 0.1)};
  }
  & .${linearProgressClasses.bar} {
    border-radius: 8px;
    background-color: #5569FF;
  }
`);

const LinearProgressError = styled(LinearProgress)(() => `
  height: 8px;
  border-radius: 8px;
  &.${linearProgressClasses.colorPrimary} {
    background-color: ${alpha('#FF1943', 0.1)};
  }
  & .${linearProgressClasses.bar} {
    border-radius: 8px;
    background-color: #FF1943;
  }
`);

const LinearProgressSuccess = styled(LinearProgress)(() => `
  height: 8px;
  border-radius: 8px;
  &.${linearProgressClasses.colorPrimary} {
    background-color: ${alpha('#57CA22', 0.1)};
  }
  & .${linearProgressClasses.bar} {
    border-radius: 8px;
    background-color: #57CA22;
  }
`);

const LinearProgressWarning = styled(LinearProgress)(() => `
  height: 8px;
  border-radius: 8px;
  &.${linearProgressClasses.colorPrimary} {
    background-color: ${alpha('#FFA319', 0.1)};
  }
  & .${linearProgressClasses.bar} {
    border-radius: 8px;
    background-color: #FFA319;
  }
`);

const FunnelChart: React.FC = () => {
  const { funnelStages, funnelLoading, funnelError } = useSelector(
    (state: RootState) => state.dashboard
  );

  if (funnelLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (funnelError) {
    return <Alert severity="error">{funnelError}</Alert>;
  }

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
        return '#5569FF';
      case 1:
        return '#FF1943';
      case 2:
        return '#57CA22';
      case 3:
        return '#FFA319';
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
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Conversion Funnel
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Lead progression through stages
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {funnelStages.map((stage: FunnelStage, index: number) => {
          const ProgressComponent = getProgressComponent(index);
          const stageColor = getStageColor(index);
          const showConversion = index !== 0;
          const isLast = index === funnelStages.length - 1;

          return (
            <Box
              key={index}
              sx={{
                borderBottom: !isLast ? '1px solid #f3f4f6' : 'none',
                '&:hover': { backgroundColor: '#f8fafc' },
              }}
            >
              <Box sx={{ p: 3, pt: 2.5 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1.5}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: stageColor,
                        boxShadow: `0 2px 4px ${stageColor}40`,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: '#1e293b' }}
                      >
                        {stage.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Total {stage.name.toLowerCase()} leads
                      </Typography>
                    </Box>
                  </Box>

                  <Box textAlign="right">
                    <Typography
                      variant="h5"
                      sx={{ color: stageColor, fontWeight: 700 }}
                    >
                      {stage.count.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af', mt: 0.5 }}>
                      {showConversion
                        ? `${stage.conversionPct}% conversion`
                        : '100% base'}
                    </Typography>
                  </Box>
                </Box>

                <ProgressComponent
                  variant="determinate"
                  value={stage.conversionPct}
                />

                {/* Bottom row now shows Current Count */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={0.6}
                >
                  <Typography variant="subtitle2" sx={{ color: '#9ca3af' }}>
                    Current Count
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#9ca3af' }}>
                    {stage.currentCount.toLocaleString()}
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
