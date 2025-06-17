import React, { useState } from "react";
import { Box, Typography, IconButton, Stack, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SupportCards from "./SupportCards";
import LeadDocumentSection from "./LeadDocumentSection";
import ContactInfoCards from "./ContactInfoCards";
import EditHelpSupportDialog from "./EditHelpSupportDialog";

const HelpSupportMain = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [supportData, setSupportData] = useState({
    email: {
      title: "Email Support",
      description: "Reach out to us via email",
      contact: "support@moneysquad.in",
      timing: "Mon–Sat, 9 AM to 6 PM",
    },
    phone: {
      title: "Phone Support",
      description: "Speak with our support team",
      contact: "+91 98765 43210",
      timing: "Mon–Sat, 10 AM to 6 PM",
    },
    whatsapp: {
      title: "WhatsApp",
      description: "Chat with us instantly",
      contact: "+91 99999 88888",
      timing: "24/7 Available",
    },
    office: {
      title: "Office Visit",
      description: "Book an appointment to visit",
      contact: "Delhi, India",
      timing: "Mon–Fri, 10 AM to 5 PM",
    },
  });

  const [leadEmails, setLeadEmails] = useState({
    pl: { to: "pl@moneysquad.in", cc: "pradeep@moneysquad.in" },
    bl: { to: "bl@moneysquad.in", cc: "pradeep@moneysquad.in" },
    sep: { to: "bl@moneysquad.in", cc: "pradeep@moneysquad.in" },
  });

  const [contactData, setContactData] = useState({
    grievance: {
      name: "Pradeep Tyagi",
      phone: "+91 97115 00707",
      email: "pradeep@moneysquad.in",
    },
    payout: {
      name: "Pradeep Tyagi",
      phone: "+91 97115 00707",
      email: "pradeep@moneysquad.in",
    },
  });

  return (
    <Box position="relative">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" fontWeight={600}>
          Help & Support
        </Typography>
        <IconButton
          onClick={() => setIsDialogOpen(true)}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          <EditIcon />
        </IconButton>
      </Stack>

      <SupportCards data={supportData} />
      <Divider sx={{ my: 4 }} />
      <LeadDocumentSection data={leadEmails} />
      <Divider sx={{ my: 4 }} />
      <ContactInfoCards data={contactData} />

      <EditHelpSupportDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        supportData={supportData}
        setSupportData={setSupportData}
        leadEmails={leadEmails}
        setLeadEmails={setLeadEmails}
        contactData={contactData}
        setContactData={setContactData}
      />
    </Box>
  );
};

export default HelpSupportMain;
