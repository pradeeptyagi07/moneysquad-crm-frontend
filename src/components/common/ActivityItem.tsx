import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface ActivityItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  iconBg,
  title,
  description,
  time,
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        mb: 3,
        p: 2,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: '0 4px 12px rgba(148, 163, 184, 0.1)',
        }
      }}
    >
      <Avatar 
        sx={{ 
          bgcolor: iconBg, 
          color: 'white', 
          mr: 2, 
          width: 44, 
          height: 44,
          boxShadow: `0 4px 12px ${iconBg}40`
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600,
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {description}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.disabled',
            display: 'block',
            fontWeight: 500
          }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

export default ActivityItem;