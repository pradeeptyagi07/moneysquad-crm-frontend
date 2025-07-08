// ContactInfoCards.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

interface ContactInfoCardsProps {
  data: Record<"grievance" | "payout", ContactInfo>;
}

const labelMap: Record<keyof ContactInfoCardsProps["data"], string> = {
  grievance: "Grievance Officer",
  payout: "Payout Concern",
};

export const ContactInfoCards: React.FC<ContactInfoCardsProps> = ({ data }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLabel(label);
      setSnackbarOpen(true);
    });
  };
  const handleClose = () => setSnackbarOpen(false);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#F5F7FA" }}>
      {/* Section Title */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          mb: { xs: 3, md: 5 },
        }}
      >
        Contact Details
      </Typography>

      {/* Cards Grid */}
      <Grid container spacing={4} justifyContent="center">
        {(["grievance", "payout"] as (keyof typeof data)[]).map((key) => {
          const info = data[key];
          return (
            <Grid key={key} item xs={12} md={6} lg={5}>
              <Paper
                elevation={2}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                  p: { xs: 2.5, md: 4 },
                }}
              >
                {/* Card Header */}
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="text.primary"
                  mb={2}
                >
                  {labelMap[key]}
                </Typography>

                <Stack spacing={2}>
                  {[
                    { label: "Name", field: "name" as const },
                    { label: "Phone", field: "phone" as const },
                    { label: "Email", field: "email" as const },
                  ].map(({ label, field }, idx) => (
                    <Box key={field}>
                      <Divider sx={{ mb: 1 }} />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {label}
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          backgroundColor: alpha(theme.palette.divider, 0.04),
                          borderRadius: 1.5,
                          px: 2,
                          py: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            flexGrow: 1,
                            color: theme.palette.text.primary,
                            fontFamily: field === "name" ? "inherit" : "monospace",
                            fontWeight: field === "name" ? 600 : 500,
                          }}
                        >
                          {info[field]}
                        </Typography>
                        {field !== "name" && (
                          <Tooltip title={`Copy ${label}`}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(
                                  info[field],
                                  `${labelMap[key]} ${label}`
                                )
                              }
                              sx={{
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.1
                                ),
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  ),
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                                width: 32,
                                height: 32,
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Copy Confirmation Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {copiedLabel} copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactInfoCards;
