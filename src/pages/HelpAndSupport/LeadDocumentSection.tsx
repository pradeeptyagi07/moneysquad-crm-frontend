// LeadDocumentSection.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  alpha,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";

interface LeadDocumentSectionProps {
  data: Record<
    string,
    {
      to: string;
      cc: string;
    }
  >;
}

const labelMap: Record<string, string> = {
  pl: "Salaried Individual",
  bl: "Business Owner",
  sep: "Professional",
};

const iconMap: Record<string, JSX.Element> = {
  pl: <PersonIcon fontSize="small" />,
  bl: <BusinessIcon fontSize="small" />,
  sep: <WorkIcon fontSize="small" />,
};

const colorMap: Record<string, string> = {
  pl: "#6366F1",
  bl: "#10B981",
  sep: "#F59E0B",
};

const LeadDocumentSection: React.FC<LeadDocumentSectionProps> = ({ data }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedText(label);
        setSnackbarOpen(true);
      })
      .catch(console.error);
  };
  const closeSnackbar = () => setSnackbarOpen(false);

  return (
    <Box>
      {/* Section Header */}
      <Box mb={3}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Document Submission Email-IDs
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Endpoints for each customer category
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={3}>
        {Object.entries(data).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Stack spacing={2}>
                {/* Category Header */}
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      background: `linear-gradient(135deg, ${colorMap[key]} 0%, ${alpha(
                        colorMap[key],
                        0.8
                      )} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: `0 4px 12px ${alpha(colorMap[key], 0.3)}`,
                    }}
                  >
                    {iconMap[key]}
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {labelMap[key]}
                  </Typography>
                  <Chip
                    label={key.toUpperCase()}
                    size="small"
                    sx={{
                      ml: "auto",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      backgroundColor: alpha(colorMap[key], 0.1),
                      color: colorMap[key],
                    }}
                  />
                </Stack>

                <Divider />

                {/* Primary Email */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    mb={0.5}
                  >
                    <EmailIcon sx={{ fontSize: 14 }} />
                    Primary
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      backgroundColor: alpha(colorMap[key], 0.05),
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 1,
                      border: `1px solid ${alpha(colorMap[key], 0.1)}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        color: theme.palette.text.primary,    // <–– now black
                        flexGrow: 1,
                      }}
                    >
                      {value.to}
                    </Typography>
                    <Tooltip title="Copy primary email">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleCopy(value.to, `${labelMap[key]} (Primary)`)
                        }
                        sx={{
                          color: colorMap[key],
                          "&:hover": {
                            backgroundColor: alpha(colorMap[key], 0.2),
                          },
                          width: 28,
                          height: 28,
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                {/* CC Email */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    mb={0.5}
                  >
                    <EmailIcon sx={{ fontSize: 14 }} />
                    CC
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      backgroundColor: alpha(colorMap[key], 0.05),
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 1,
                      border: `1px solid ${alpha(colorMap[key], 0.1)}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        color: theme.palette.text.primary,    // <–– now black
                        flexGrow: 1,
                      }}
                    >
                      {value.cc}
                    </Typography>
                    <Tooltip title="Copy CC email">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleCopy(value.cc, `${labelMap[key]} (CC)`)
                        }
                        sx={{
                          color: colorMap[key],
                          "&:hover": {
                            backgroundColor: alpha(colorMap[key], 0.2),
                          },
                          width: 28,
                          height: 28,
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Copy Confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {copiedText} copied!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadDocumentSection;
