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
    <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 8 }, bgcolor: "#F9FAFB" }}>
      {/* Section Title */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 800,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: "text",
          color: "transparent",
          mb: { xs: 4, md: 6 },
        }}
      >
        Contact Details
      </Typography>

      {/* Cards Grid */}
      <Grid container spacing={6} justifyContent="center">
        {(["grievance", "payout"] as (keyof typeof data)[]).map((key) => {
          const info = data[key];
          return (
            <Grid key={key} item xs={12} md={6} lg={5}>
              <Paper
                elevation={4}
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  bgcolor: "#fff",
                  overflow: "hidden",
                  transition: "transform 0.4s, box-shadow 0.4s",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.06)}`,
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 12px 36px ${alpha(theme.palette.common.black, 0.1)}`,
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 6,
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                  p: { xs: 3, md: 5 },
                }}
              >
                {/* Card Header */}
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.primary"
                  mb={3}
                >
                  {labelMap[key]}
                </Typography>

                <Stack spacing={3}>
                  {[
                    { label: "Name", field: "name" as const },
                    { label: "Phone", field: "phone" as const },
                    { label: "Email", field: "email" as const },
                  ].map(({ label, field }) => (
                    <Box key={field}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                        sx={{ letterSpacing: '0.5px' }}
                      >
                        {label}
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{
                          bgcolor: alpha(theme.palette.divider, 0.06),
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                        }}
                      >
                        <Typography
                          variant={field === "name" ? "h6" : "body1"}
                          sx={{
                            flexGrow: 1,
                            fontWeight: field === "name" ? 700 : 500,
                            fontFamily: field === "name" ? 'inherit' : 'ui-monospace, Monaco, Cascadia Code, monospace',
                          }}
                        >
                          {info[field]}
                        </Typography>
                        {field !== "name" && (
                          <Tooltip title={`Copy ${label}`}>
                            <IconButton
                              onClick={() =>
                                handleCopy(
                                  info[field],
                                  `${labelMap[key]} ${label}`
                                )
                              }
                              sx={{
                                width: 36,
                                height: 36,
                                color: theme.palette.primary.main,
                                bgcolor: alpha(theme.palette.primary.main, 0.15),
                                transition: "transform 0.2s, bgcolor 0.2s",
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.25),
                                  transform: "scale(1.2)",
                                },
                              }}
                            >
                              <ContentCopyIcon />
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
        autoHideDuration={2500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          {copiedLabel} copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactInfoCards;
