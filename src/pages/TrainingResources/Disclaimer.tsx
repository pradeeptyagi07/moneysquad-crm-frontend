import { Card, CardContent, Typography, Box, Chip } from "@mui/material"
import { styled } from "@mui/material/styles"
import InfoIcon from "@mui/icons-material/Info"
import StarIcon from "@mui/icons-material/Star"

const PremiumCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(255, 193, 7, 0.2)",
  background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
  position: "relative",
  overflow: "visible",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
  },
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
  borderRadius: 12,
  border: "1px solid rgba(255, 193, 7, 0.3)",
}))

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  "& .MuiTypography-root": {
    lineHeight: 1.7,
    color: theme.palette.text.secondary,
  },
}))

const HighlightChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#ff6b6b",
  color: "white",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 24,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}))

const ImportantNote = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: "#f8f9fa",
  borderRadius: 8,
  borderLeft: "4px solid #007bff",
}))

const Disclaimer = () => {
  return (
    <PremiumCard>
      <CardContent sx={{ p: 3 }}>
        <HeaderSection>
          <InfoIcon sx={{ color: "#ff9800", fontSize: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Important Disclaimer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Please read the following information carefully
            </Typography>
          </Box>
          <HighlightChip icon={<StarIcon sx={{ fontSize: 16 }} />} label="MANDATORY" />
        </HeaderSection>

        <ContentSection>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            Documents marked with <strong style={{ color: "#ff6b6b" }}>*</strong> are mandatory to process the loan
            application. Other documents can be required for higher loan amounts, big ticket profiles or on a specific
            lender query.
          </Typography>

          <ImportantNote>
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#007bff" }}>
              📞 Special Profiles Support
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              For any other profiles like HUFs, Trusts, and other special profiles – kindly contact the support team or
              your relationship manager.
            </Typography>
          </ImportantNote>
        </ContentSection>
      </CardContent>
    </PremiumCard>
  )
}

export default Disclaimer
