import { Box, Container, Typography, IconButton } from "@mui/material"
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material"

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper", // Use theme background
        borderTop: 1,
        borderColor: "divider",
        color: "text.primary",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
            © 2025 MoneySquad. All rights reserved.
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {[
              { icon: <Facebook sx={{ fontSize: 20 }} />, href: "#" },
              { icon: <Twitter sx={{ fontSize: 20 }} />, href: "#" },
              { icon: <LinkedIn sx={{ fontSize: 20 }} />, href: "#" },
              { icon: <Instagram sx={{ fontSize: 20 }} />, href: "#" },
            ].map((social, index) => (
              <IconButton
                key={index}
                href={social.href}
                sx={{
                  color: "text.secondary",
                  width: 36,
                  height: 36,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "action.hover",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
