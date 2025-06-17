import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";

const EditHelpSupportDialog = ({
  open,
  onClose,
  supportData,
  setSupportData,
  leadEmails,
  setLeadEmails,
  contactData,
  setContactData,
}: any) => {
  const [localSupport, setLocalSupport] = useState(supportData);
  const [localLeads, setLocalLeads] = useState(leadEmails);
  const [localContacts, setLocalContacts] = useState(contactData);
  const theme = useTheme();

  useEffect(() => {
    setLocalSupport(supportData);
    setLocalLeads(leadEmails);
    setLocalContacts(contactData);
  }, [supportData, leadEmails, contactData, open]);

  const handleSave = () => {
    setSupportData(localSupport);
    setLeadEmails(localLeads);
    setContactData(localContacts);
    onClose();
  };

  const gradientTitle = {
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    mb: 2,
    mt: 3,
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: '#f8fafc',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
  };

  const sectionDivider = {
    my: 4,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Edit Help & Support Information
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f9fafb', p: 4 }}>
        {/* Section 1: Support Info */}
        <Typography variant="h6" sx={gradientTitle}>
          Support Methods
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(localSupport).map(([key, value]: any) => (
            <React.Fragment key={key}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={`${value.title} Contact`}
                  value={value.contact}
                  onChange={(e) =>
                    setLocalSupport({
                      ...localSupport,
                      [key]: { ...value, contact: e.target.value },
                    })
                  }
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={`${value.title} Timing`}
                  value={value.timing}
                  onChange={(e) =>
                    setLocalSupport({
                      ...localSupport,
                      [key]: { ...value, timing: e.target.value },
                    })
                  }
                  sx={inputStyle}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        <Divider sx={sectionDivider} />

        {/* Section 2: Lead Submission Emails */}
        <Typography variant="h6" sx={gradientTitle}>
          Lead Document Submission Emails
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(localLeads).map(([key, value]: any) => (
            <React.Fragment key={key}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`${key.toUpperCase()} To Email`}
                  value={value.to}
                  onChange={(e) =>
                    setLocalLeads({
                      ...localLeads,
                      [key]: { ...value, to: e.target.value },
                    })
                  }
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`${key.toUpperCase()} CC Email`}
                  value={value.cc}
                  onChange={(e) =>
                    setLocalLeads({
                      ...localLeads,
                      [key]: { ...value, cc: e.target.value },
                    })
                  }
                  sx={inputStyle}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        <Divider sx={sectionDivider} />

        {/* Section 3: Contact Info */}
        <Typography variant="h6" sx={gradientTitle}>
          Grievance & Payout Contact
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(localContacts).map(([key, value]: any) => (
            <React.Fragment key={key}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label={`${key.toUpperCase()} Name`}
                  value={value.name}
                  onChange={(e) =>
                    setLocalContacts({
                      ...localContacts,
                      [key]: { ...value, name: e.target.value },
                    })
                  }
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label={`${key.toUpperCase()} Phone`}
                  value={value.phone}
                  onChange={(e) =>
                    setLocalContacts({
                      ...localContacts,
                      [key]: { ...value, phone: e.target.value },
                    })
                  }
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label={`${key.toUpperCase()} Email`}
                  value={value.email}
                  onChange={(e) =>
                    setLocalContacts({
                      ...localContacts,
                      [key]: { ...value, email: e.target.value },
                    })
                  }
                  sx={inputStyle}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHelpSupportDialog;
