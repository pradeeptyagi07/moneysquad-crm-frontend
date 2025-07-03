// src/components/Footer.tsx
import { Box, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";

interface FooterProps {
  sx?: object;
}

const Footer: React.FC<FooterProps> = ({ sx }) => (
  <Box
    component="footer"
    sx={{
      bgcolor: "background.paper",
      borderTop: 1,
      borderColor: "divider",
      py: 1,
      px: { xs: 1, sm: 2 },
      ...sx,
    }}
  >
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontSize: "0.8rem",
          textAlign: { xs: "center", md: "left" },
          flexGrow: { xs: 1, md: 0 },
        }}
      >
        © 2025 MoneySquad. All rights reserved.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        {[Facebook, Twitter, LinkedIn, Instagram].map((Icon, i) => (
          <IconButton
            key={i}
            href="#"
            sx={{
              color: "text.secondary",
              width: 36,
              height: 36,
              "&:hover": {
                color: "primary.main",
                backgroundColor: "action.hover",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Icon fontSize="small" />
          </IconButton>
        ))}
      </Box>
    </Box>
  </Box>
);

export default Footer;
