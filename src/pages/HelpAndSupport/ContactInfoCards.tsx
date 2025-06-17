import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ContactInfoCards = ({ data }: { data: Record<string, any> }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLabel(label);
      setSnackbarOpen(true);
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const labelMap = {
    grievance: "Grievance Officer",
    payout: "Payout Concern",
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc' }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: "center", 
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.8rem', md: '2.5rem' }
        }}
      >
        Contact Details
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {Object.entries(data).map(([key, value]) => (
          <Grid item xs={12} md={6} key={key}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  color: '#1e293b',
                  mb: 2.5,
                  fontSize: '1.1rem'
                }}
              >
                {labelMap[key as keyof typeof labelMap]}
              </Typography>
              
              <Stack spacing={2}>
                {["name", "phone", "email"].map((field) => (
                  <Box key={field} sx={{ position: 'relative' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          flex: 1,
                          color: field === 'name' ? '#1e293b' : '#475569',
                          fontWeight: field === 'name' ? 600 : 500,
                          fontSize: field === 'name' ? '1rem' : '0.95rem',
                          fontFamily: field === 'name' ? 'inherit' : 'monospace',
                          letterSpacing: field === 'name' ? 'normal' : '0.02em'
                        }}
                      >
                        {value[field]}
                      </Typography>
                      
                      {field !== 'name' && (
                        <Tooltip title={`Copy ${field}`} placement="top">
                          <IconButton
                            onClick={() => handleCopy(value[field], `${labelMap[key as keyof typeof labelMap]} ${field}`)}
                            size="small"
                            sx={{
                              color: '#6366f1',
                              backgroundColor: 'rgba(99, 102, 241, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                transform: 'scale(1.05)',
                              },
                              transition: 'all 0.2s ease',
                              width: 32,
                              height: 32,
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

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
          {copiedLabel} copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactInfoCards;
