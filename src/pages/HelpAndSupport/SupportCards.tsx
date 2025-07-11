"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  useTheme,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  alpha,
  Box,
  Fade,
  Slide,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SupportData {
  title: string;
  description: string;
  contact: string;
  timing: string;
}

interface SupportCardsProps {
  data: Record<"email" | "phone" | "whatsapp" | "office", SupportData>;
}

const SupportCards: React.FC<SupportCardsProps> = ({ data }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const colorMap: Record<keyof SupportCardsProps['data'], string> = {
    email: "#8b5cf6", // Purple
    phone: "#f59e0b", // Amber
    whatsapp: "#059669", // Emerald
    office: "#dc2626", // Red
  };

  const iconMap: Record<keyof SupportCardsProps['data'], JSX.Element> = {
    email: <EmailIcon sx={{ fontSize: 32 }} />,
    phone: <PhoneIcon sx={{ fontSize: 32 }} />,
    whatsapp: <WhatsAppIcon sx={{ fontSize: 32 }} />,
    office: <LocationOnIcon sx={{ fontSize: 32 }} />,
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(label);
      setSnackbarOpen(true);
    });
  };

  const getStatusInfo = (key: keyof SupportCardsProps['data']) => {
    const statusMap = {
      email: "24/7 Available",
      phone: "Business Hours",
      whatsapp: "Instant Response",
      office: "Visit Us"
    };
    return statusMap[key];
  };

  const entries = Object.entries(data) as [keyof SupportCardsProps['data'], SupportData][];

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="stretch">
        {entries.map(([key, val], idx) => {
          const isPriority = idx === 0;
          const color = colorMap[key];
          
          return (
            <Grid item xs={12} sm={6} lg={3} key={key} sx={{ display: 'flex' }}>
              <Fade in timeout={600 + idx * 150}>
                <Card
                  elevation={0}
                  sx={{
                    position: 'relative',
                    borderRadius: 6,
                    overflow: 'visible',
                    border: `2px solid ${alpha(color, 0.12)}`,
                    bgcolor: 'background.paper',
                    width: '100%',
                    minHeight: 280, // Further reduced from 360 to make cards more compact
                    maxWidth: 280, // Added max width constraint
                    display: 'flex',
                    flexDirection: 'column',
                    background: `linear-gradient(135deg, ${alpha(color, 0.03)} 0%, transparent 100%)`,
                    transform: isPriority ? 'scale(1.02)' : 'scale(1)', // Reduced scale
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Faster transition
                    '&:hover': {
                      transform: isPriority ? 'translateY(-4px) scale(1.02)' : 'translateY(-4px)', // Subtle movement
                      boxShadow: `0 8px 25px ${alpha(color, 0.15)}`, // Reduced shadow
                      border: `2px solid ${alpha(color, 0.25)}`, // Reduced border opacity
                      background: `linear-gradient(135deg, ${alpha(color, 0.06)} 0%, transparent 100%)`,
                      '& .card-icon': {
                        transform: 'scale(1.05)', // Reduced icon scale
                      },
                      '& .copy-btn': {
                        backgroundColor: color,
                        color: 'white',
                        transform: 'scale(1.05)', // Reduced button scale
                      },
                    },
                  }}
                >
                  {/* Priority Badge */}
                  {isPriority && (
                    <>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                          borderLeft: '60px solid transparent',
                          borderTop: `60px solid ${color}`,
                          borderTopRightRadius: 24,
                          zIndex: 1,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 2,
                          color: 'white',
                          transform: 'rotate(45deg)',
                        }}
                      >
                        <StarIcon sx={{ fontSize: 20 }} />
                      </Box>
                    </>
                  )}

                  <CardContent sx={{ 
                    p: { xs: 2, sm: 2.5, md: 3 }, // Further reduced padding
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1.5, // Further reduced gap
                  }}>
                    {/* Icon and Status */}
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1}>
                      <Box
                        className="card-icon"
                        sx={{
                          width: { xs: 38, sm: 42, md: 46 }, // Further reduced icon box size
                          height: { xs: 38, sm: 42, md: 46 },
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                          color: '#fff',
                          boxShadow: `0 8px 20px ${alpha(color, 0.25)}`, // Reduced shadow
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${alpha('#fff', 0.25)} 0%, transparent 100%)`,
                          },
                        }}
                      >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                          {React.cloneElement(iconMap[key], { sx: { fontSize: 24 } })} {/* Reduced icon size */}
                        </Box>
                      </Box>
                      
                      <Chip
                        label={getStatusInfo(key)}
                        size="small"
                        sx={{
                          backgroundColor: alpha(color, 0.1),
                          color: color,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 28,
                          px: 1.5,
                          border: `1px solid ${alpha(color, 0.25)}`,
                          borderRadius: 2,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </Stack>

                    {/* Content */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1rem', sm: '1.1rem' }, // Further reduced font size
                          color: 'text.primary',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.2,
                        }}
                      >
                        {val.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          lineHeight: 1.4,
                          fontSize: '0.8rem', // Further reduced font size
                          fontWeight: 400,
                          flex: 1,
                        }}
                      >
                        {val.description}
                      </Typography>
                    </Box>

                    {/* Contact Info */}
                    <Box
                      sx={{
                        p: 1.4,  // Further reduced padding
                        borderRadius: 2,
                        backgroundColor: alpha(color, 0.06),
                        border: `1px solid ${alpha(color, 0.15)}`,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        mt: 'auto',
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'ui-monospace, Monaco, "Cascadia Code", monospace',
                            fontWeight: 600,
                            color: color,
                            fontSize: '0.8rem', // Further reduced font size
                            letterSpacing: '0.025em',
                            wordBreak: 'break-all',
                            flex: 1,
                            mr: 1,
                          }}
                        >
                          {val.contact}
                        </Typography>
                        <IconButton
                          className="copy-btn"
                          onClick={() => handleCopy(val.contact, val.title)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(color, 0.15),
                            color: color,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: color,
                              color: 'white',
                              transform: 'scale(1.05)', // Reduced scale
                            },
                          }}
                        >
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>
                      
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          backgroundColor: alpha(color, 0.12),
                          border: `1px solid ${alpha(color, 0.25)}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: color,
                            fontSize: '0.75rem', // Reduced font size
                            letterSpacing: '0.025em',
                          }}
                        >
                          {val.timing}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          icon={<CheckCircleIcon />}
          sx={{
            borderRadius: 4,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            minWidth: 300,
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            },
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {copiedText} copied to clipboard!
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default SupportCards;