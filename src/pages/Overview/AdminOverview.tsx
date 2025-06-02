import React from "react";
import { Box, Typography, Card, useTheme, useMediaQuery } from "@mui/material";
import { Construction } from "@mui/icons-material";

const AdminOverview: React.FC = () => {
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
          maxWidth: 800,
          width: '100%',
          bgcolor: theme.palette.background.paper,
          borderRadius: 8,
          boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
          p: isMobile ? 4 : 8,
          textAlign: 'center',
        }}
      >
        <Construction
          sx={{
            fontSize: isMobile ? 56 : 88,
            color: theme.palette.primary.main,
            mb: 3,
          }}
        />
        <Typography
          variant={isMobile ? 'h4' : 'h1'}
          sx={{
            fontWeight: 900,
            mb: 2,
            color: theme.palette.primary.dark,
          }}
        >
          Admin Dashboard Coming Soon
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 700, mx: 'auto', lineHeight: 1.5 }}
        >
          We're putting the finishing touches on the Admin console! Meanwhile, you can use the following features:
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ mb: 4, maxWidth: 600, mx: 'auto', textAlign: 'left', lineHeight: 1.6 }}
        >
          • Manage your Team members assigned to you<br />
          • Manage Partner records and profiles<br />
          • Manage and track all Leads in the system
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Additional admin sections are under active development. Check back soon for full access!
        </Typography>
      </Card>
    </Box>
  );
};

export default AdminOverview;
