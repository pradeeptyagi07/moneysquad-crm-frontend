// src/pages/Overview/AssociateOverview.tsx

import React from "react";
import { Box, Typography, Card, Button, useTheme, useMediaQuery } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const AssociateOverview: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.background.default,
        p: isMobile ? 2 : 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 720,
          width: "100%",
          bgcolor: theme.palette.background.paper,
          borderRadius: 6,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          p: isMobile ? 4 : 8,
          textAlign: "center",
        }}
      >
        <Construction
          sx={{
            fontSize: isMobile ? 48 : 72,
            color: theme.palette.primary.main,
            mb: 3,
          }}
        />
        <Typography
          variant={isMobile ? "h4" : "h2"}
          sx={{
            fontWeight: 900,
            mb: 2,
            color: theme.palette.primary.dark,
          }}
        >
          Associate Dashboard Coming Soon
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600, mx: "auto", lineHeight: 1.5 }}
        >
          We’re building something amazing! Meanwhile, you can navigate to your Leads or explore current Offers:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/associate/leads"
            sx={{ px: 5, py: 1.75, fontWeight: 700 }}
          >
            View Leads
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/associate/offers"
            sx={{
              px: 5,
              py: 1.75,
              fontWeight: 700,
              borderWidth: 2,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Recent Offers
          </Button>
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          Settings section is under active development. Stay tuned!
        </Typography>
      </Card>
    </Box>
  );
};

export default AssociateOverview;
