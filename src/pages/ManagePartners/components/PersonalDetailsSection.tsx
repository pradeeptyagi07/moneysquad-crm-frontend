import type React from "react"
import { Box, Typography, Paper, Grid, Divider } from "@mui/material"
import { format } from "date-fns"

interface PersonalInfoSectionProps {
  partner: Partner
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ partner }) => {
  const personalInfo = partner.personalInfo || {}

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy")
    } catch {
      return "-"
    }
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 1,
            fontSize: "0.875rem",
            fontWeight: 700,
          }}
        >
          2
        </Box>
        Personal Information
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Current Profession
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {personalInfo.currentProfession || "-"}
          </Typography>
        </Grid>

        {personalInfo.dateOfBirth && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {formatDate(personalInfo.dateOfBirth)}
            </Typography>
          </Grid>
        )}

        {personalInfo.emergencyContactNumber && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Emergency Contact Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {personalInfo.emergencyContactNumber}
            </Typography>
          </Grid>
        )}

        {personalInfo.focusProduct && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Focus Product
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {personalInfo.focusProduct}
            </Typography>
          </Grid>
        )}

        {personalInfo.roleSelection && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Role Selection
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {personalInfo.roleSelection}
            </Typography>
          </Grid>
        )}

        {personalInfo.experienceInSellingLoans && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Experience in Selling Loans
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {personalInfo.experienceInSellingLoans}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

export default PersonalInfoSection
