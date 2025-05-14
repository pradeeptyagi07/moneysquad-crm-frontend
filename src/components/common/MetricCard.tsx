import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  iconBg: string;
  targetValue: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  icon,
  iconBg,
  targetValue,
}) => {
  return (
    <Card className="card-hover" sx={{ 
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      position: 'relative',
      overflow: 'visible',
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: 24,
          zIndex: 2,
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${iconBg} 0%, ${iconBg}dd 100%)`,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <CardContent sx={{ pt: 4 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{ mb: 1, fontSize: '0.875rem' }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(135deg, #1e293b 0%, #334155 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          {value}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Typography 
            variant="body2" 
            color="success.main" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 500,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <ArrowUpward sx={{ mr: 0.5, fontSize: '1rem' }} />
            {subValue}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Target
            </Typography>
            <Typography variant="body2" fontWeight="600" color="primary.main">
              {targetValue}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;