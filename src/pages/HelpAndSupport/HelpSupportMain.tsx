// HelpSupportMain.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  useTheme,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SupportCards from "./SupportCards";
import LeadDocumentSection from "./LeadDocumentSection";
import ContactInfoCards from "./ContactInfoCards";
import EditHelpSupportDialog from "./EditHelpSupportDialog";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  fetchSupportData,
  selectSupportData,
  selectSupportLoading,
  selectSupportError,
  clearError,
} from "../../store/slices/resourceAndSupportSlice";
import { useAuth } from "../../hooks/useAuth";

const HelpSupportMain = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";

  const supportData = useAppSelector(selectSupportData);
  const loading = useAppSelector(selectSupportLoading);
  const error = useAppSelector(selectSupportError);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSupportData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const transformedSupportData = supportData && {
    email: {
      title: "Email Support",
      description: "Reach out to us via email",
      contact: supportData.email.contact,
      timing: supportData.email.timing,
    },
    phone: {
      title: "Phone Support",
      description: "Speak with our support team",
      contact: supportData.phone.contact,
      timing: supportData.phone.timing,
    },
    whatsapp: {
      title: "WhatsApp",
      description: "Chat with us instantly",
      contact: supportData.whatsapp.contact,
      timing: supportData.whatsapp.timing,
    },
    office: {
      title: "Office Visit",
      description: "Book an appointment to visit",
      contact: supportData.office.contact,
      timing: supportData.office.timing,
    },
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading support information...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mb={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!supportData || !transformedSupportData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="body1" color="text.secondary">
          No support data available
        </Typography>
      </Box>
    );
  }

  // Gradient for section titles
  const gradientText = {
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 1 },
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h3" fontWeight={700} >
          Help & Support
        </Typography>
        {isAdmin && (
          <IconButton
            onClick={() => setIsDialogOpen(true)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      {/* Email/Phone/WhatsApp/Office Section */}
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          mb: 3,
        }}
      >
       
        <SupportCards data={transformedSupportData} />
      </Box>

      {/* Document Submission Section */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          mb: 4,
          backgroundColor: "#fff",
        }}
      >
       
        <LeadDocumentSection data={supportData.leadEmails} />
      </Paper>

      {/* Additional Contacts Section */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 1, md: 2 },
          borderRadius: 2,
          mb: 1,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={2}
        >
          Additional Contacts
        </Typography>
        <ContactInfoCards
          data={{
            grievance: supportData.grievance,
            payout: supportData.payout,
          }}
        />
      </Paper>

      {/* Admin Edit Dialog */}
      {isAdmin && (
        <EditHelpSupportDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          supportData={supportData}
        />
      )}
    </Box>
  );
};

export default HelpSupportMain;
