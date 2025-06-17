import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  useTheme,
  Chip,
  IconButton,
  alpha,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const iconMap: Record<string, JSX.Element> = {
  email: <EmailIcon fontSize="large" />,
  phone: <PhoneIcon fontSize="large" />,
  whatsapp: <WhatsAppIcon fontSize="large" />,
  office: <LocationOnIcon fontSize="large" />,
};

const colorMap: Record<string, string> = {
  email: "#FF6B6B",
  phone: "#6C5CE7",
  whatsapp: "#25D366",
  office: "#FF7675",
};

const SupportCards = ({ data }: { data: Record<string, any> }) => {
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

  const getStatusChip = (key: string) => {
    if (key === "whatsapp") {
      return (
        <Chip
          label="Instant"
          size="small"
          sx={{
            backgroundColor: alpha("#25D366", 0.15),
            color: "#25D366",
            fontWeight: 700,
            fontSize: "0.7rem",
            height: "20px",
          }}
        />
      );
    }
    return null;
  };

  return (
    <Grid container spacing={4}>
      {Object.entries(data).map(([key, value], index) => (
        <Grid item xs={12} sm={6} md={3} key={key}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 4,
              height: "100%",
              background: `linear-gradient(135deg, ${alpha(colorMap[key], 0.05)} 0%, ${alpha(colorMap[key], 0.02)} 100%)`,
              border: `1px solid ${alpha(colorMap[key], 0.1)}`,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: `0 20px 40px ${alpha(colorMap[key], 0.15)}`,
                border: `1px solid ${alpha(colorMap[key], 0.2)}`,
                "& .action-button": {
                  opacity: 1,
                  transform: "scale(1)",
                },
                "& .icon-container": {
                  transform: "scale(1.1) rotate(5deg)",
                },
              },
            }}
          >
            {/* Decorative gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle, ${alpha(colorMap[key], 0.1)} 0%, transparent 70%)`,
                borderRadius: "50%",
                transform: "translate(30px, -30px)",
              }}
            />
            
            {/* Premium badge for first card */}
            {index === 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 2,
                }}
              >
                <Chip
                  label="Priority"
                  size="small"
                  sx={{
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: "22px",
                  }}
                />
              </Box>
            )}

            <Stack spacing={2} sx={{ p: 2.5, height: "100%", position: "relative" }}>
              {/* Header with icon and status */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box
                  className="icon-container"
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    background: `linear-gradient(135deg, ${colorMap[key]} 0%, ${alpha(colorMap[key], 0.8)} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    transition: "all 0.3s ease",
                    boxShadow: `0 6px 20px ${alpha(colorMap[key], 0.3)}`,
                  }}
                >
                  {iconMap[key]}
                </Box>
                {getStatusChip(key)}
              </Stack>

              {/* Content */}
              <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                    fontSize: "1.1rem",
                  }}
                >
                  {value.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.5,
                    opacity: 0.8,
                    fontSize: "0.85rem",
                  }}
                >
                  {value.description}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      sx={{ 
                        color: colorMap[key],
                        fontSize: "0.9rem",
                      }}
                    >
                      {value.contact}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleCopyToClipboard(value.contact, value.title)}
                      sx={{
                        color: colorMap[key],
                        backgroundColor: alpha(colorMap[key], 0.1),
                        "&:hover": {
                          backgroundColor: alpha(colorMap[key], 0.2),
                        },
                        width: 32,
                        height: 32,
                      }}
                    >
                      <ContentCopyIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                  
                  <Chip
                    label={value.timing}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: alpha(colorMap[key], 0.3),
                      color: colorMap[key],
                      backgroundColor: alpha(colorMap[key], 0.05),
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      height: "22px",
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      ))}
      
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
          variant="filled"
          sx={{ width: '100%' }}
        >
          {copiedText} copied to clipboard!
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SupportCards;