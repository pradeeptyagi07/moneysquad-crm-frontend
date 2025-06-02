import type React from "react"
import { Box, Typography, Paper, Grid, Divider } from "@mui/material"

interface AddressDetailsSectionProps {
  partner: Partner
}

const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({ partner }) => {
  const address = partner.addressDetails || {}

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
          3
        </Box>
        Address Details
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Address Line 1
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {address.addressLine1 || "-"}
          </Typography>
        </Grid>

        {address.addressLine2 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Address Line 2
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {address.addressLine2}
            </Typography>
          </Grid>
        )}

        {address.landmark && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Landmark
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {address.landmark}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            City
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {address.city || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Pincode
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {address.pincode || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Address Type
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            {address.addressType || "-"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default AddressDetailsSection
