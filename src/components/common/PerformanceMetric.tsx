import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface PerformanceMetricProps {
  label: string;
  value: string;
  color: string;
  progress: number;
}

const PerformanceMetric: React.FC<PerformanceMetricProps> = ({
  label,
  value,
  color,
  progress,
}) => {
  return (
    <Box 
      sx={{ 
        mb: 3,
        p: 2,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(148, 163, 184, 0.1)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: color
          }}
        >
          {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(226, 232, 240, 0.4)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            background: `linear-gradient(90deg, ${color}99 0%, ${color} 100%)`,
          },
        }}
      />
    </Box>
  );
};

export default PerformanceMetric;