import React from "react";
import { Box, Typography, Card, Button, useTheme, useMediaQuery } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const ManagerOverview: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        p: isMobile ? 2 : 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 720,
          width: '100%',
          bgcolor: theme.palette.background.paper,
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          p: isMobile ? 4 : 8,
          textAlign: 'center',
        }}
      >
        <Construction
          sx={{
            fontSize: isMobile ? 48 : 72,
            color: theme.palette.secondary.main,
            mb: 3,
          }}
        />
        <Typography
          variant={isMobile ? 'h4' : 'h2'}
          sx={{
            fontWeight: 900,
            mb: 2,
            color: theme.palette.secondary.dark,
          }}
        >
          Manager Dashboard Coming Soon
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.5 }}
        >
          We’re putting the finishing touches on your dashboard! In the meantime, you can manage leads assigned to you by the admin:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 3,
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/manager/leads"
            sx={{ px: 5, py: 1.75, fontWeight: 700 }}
          >
            My Leads
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/manager/overview"
            sx={{
              px: 5,
              py: 1.75,
              fontWeight: 700,
              borderWidth: 2,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Overview
          </Button>
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          Full dashboard features are under development. Stay tuned for updates!
        </Typography>
      </Card>
    </Box>
  );
};

export default ManagerOverview;
