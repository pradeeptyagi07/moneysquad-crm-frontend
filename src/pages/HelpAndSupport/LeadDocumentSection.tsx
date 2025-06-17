import React, { useState } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Stack, 
  Chip,
  IconButton,
  Grid,
  alpha,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";

const LeadDocumentSection = ({ data }: { data: Record<string, any> }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(label);
      setSnackbarOpen(true);
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const labelMap = {
    pl: "Salaried Individual",
    bl: "Business Owner",
    sep: "Professional",
  };

  const iconMap = {
    pl: <PersonIcon fontSize="small" />,
    bl: <BusinessIcon fontSize="small" />,
    sep: <WorkIcon fontSize="small" />,
  };

  const colorMap = {
    pl: "#6366F1",
    bl: "#10B981", 
    sep: "#F59E0B",
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Document Submission Email-IDs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
          Lead document submission endpoints for different customer categories
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {Object.entries(data).map(([key, value], index) => (
          <Box key={key}>
            <Box
              sx={{
                p: 2.5,
                background: index % 2 === 0 
                  ? alpha(colorMap[key as keyof typeof colorMap], 0.02)
                  : "transparent",
                borderLeft: `4px solid ${colorMap[key as keyof typeof colorMap]}`,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {/* Category Info */}
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${colorMap[key as keyof typeof colorMap]} 0%, ${alpha(colorMap[key as keyof typeof colorMap], 0.8)} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: `0 4px 12px ${alpha(colorMap[key as keyof typeof colorMap], 0.25)}`,
                      }}
                    >
                      {iconMap[key as keyof typeof iconMap]}
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                        {labelMap[key as keyof typeof labelMap]}
                      </Typography>
                      <Chip
                        label={key.toUpperCase()}
                        size="small"
                        sx={{
                          height: "18px",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          backgroundColor: alpha(colorMap[key as keyof typeof colorMap], 0.1),
                          color: colorMap[key as keyof typeof colorMap],
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>

                {/* To Email */}
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <EmailIcon sx={{ fontSize: "12px" }} />
                      Primary
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: alpha(colorMap[key as keyof typeof colorMap], 0.05),
                        borderRadius: 1.5,
                        px: 1.5,
                        py: 1,
                        border: `1px solid ${alpha(colorMap[key as keyof typeof colorMap], 0.1)}`,
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: colorMap[key as keyof typeof colorMap],
                          flexGrow: 1,
                          mr: 1,
                        }}
                      >
                        {value.to}
                      </Typography>
                      
                      <Tooltip title="Copy email">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyToClipboard(value.to, `${labelMap[key as keyof typeof labelMap]} primary email`)}
                          sx={{
                            color: colorMap[key as keyof typeof colorMap],
                            "&:hover": {
                              backgroundColor: alpha(colorMap[key as keyof typeof colorMap], 0.1),
                            },
                            width: 24,
                            height: 24,
                          }}
                        >
                          <ContentCopyIcon sx={{ fontSize: "12px" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>

                {/* CC Email */}
                <Grid item xs={12} sm={5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <EmailIcon sx={{ fontSize: "12px" }} />
                      CC
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: alpha(colorMap[key as keyof typeof colorMap], 0.05),
                        borderRadius: 1.5,
                        px: 1.5,
                        py: 1,
                        border: `1px solid ${alpha(colorMap[key as keyof typeof colorMap], 0.1)}`,
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: colorMap[key as keyof typeof colorMap],
                          flexGrow: 1,
                          mr: 1,
                        }}
                      >
                        {value.cc}
                      </Typography>
                      
                      <Tooltip title="Copy CC email">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyToClipboard(value.cc, `${labelMap[key as keyof typeof labelMap]} CC email`)}
                          sx={{
                            color: colorMap[key as keyof typeof colorMap],
                            "&:hover": {
                              backgroundColor: alpha(colorMap[key as keyof typeof colorMap], 0.1),
                            },
                            width: 24,
                            height: 24,
                          }}
                        >
                          <ContentCopyIcon sx={{ fontSize: "12px" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            {/* Divider between rows */}
            {index < Object.entries(data).length - 1 && (
              <Box sx={{ height: 1, backgroundColor: alpha(theme.palette.divider, 0.08) }} />
            )}
          </Box>
        ))}
      </Paper>

      {/* Snackbar for copy confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="outlined"
          sx={{ 
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #4CAF50',
          }}
        >
          {copiedText} copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadDocumentSection;