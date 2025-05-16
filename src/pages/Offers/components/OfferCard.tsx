"use client"

import type React from "react"
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, Grid, Zoom } from "@mui/material"
import { Percent, Star } from "@mui/icons-material"
import type { BankOffer } from "../types"
// Import the loanTypeColors
import { loanTypeColors } from "../types"

interface OfferCardProps {
  offer: BankOffer
  onViewDetails: (offer: BankOffer) => void
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onViewDetails }) => {
  return (
    <Zoom in={true} style={{ transitionDelay: `${Number.parseInt(offer.id) * 100}ms` }}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        {offer.isFeatured && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              bgcolor: "rgba(245, 158, 11, 0.9)",
              color: "white",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
            }}
          >
            <Star fontSize="small" sx={{ fontSize: "0.9rem" }} />
          </Box>
        )}

        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="100"
            image={offer.logo}
            alt={offer.bankName}
            sx={{
              objectFit: "cover",
              filter: "brightness(0.85)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              p: 1.5,
              pt: 3,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 600 }}>
              {offer.bankName}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Box sx={{ mb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip
              label={offer.loanType}
              size="small"
              sx={{
                borderRadius: 1.5,
                background:
                  loanTypeColors[offer.loanType]?.gradient || "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: loanTypeColors[offer.loanType]?.textColor || "#ffffff",
                fontWeight: 500,
                fontSize: "0.7rem",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "success.main",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                fontSize: "0.75rem",
              }}
            >
              <Percent fontSize="small" sx={{ mr: 0.2, fontSize: "0.8rem" }} />
              {offer.commission}
            </Typography>
          </Box>

          {offer.headline && (
            <Typography
              variant="subtitle2"
              sx={{
                mt: 1,
                fontWeight: 600,
                fontSize: "0.85rem",
                lineHeight: 1.2,
                height: 40,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {offer.headline}
            </Typography>
          )}

          {offer.validity && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mb: 1.5,
                fontSize: "0.7rem",
              }}
            >
              Valid till: {offer.validity}
            </Typography>
          )}

          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Interest Rate
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.1rem",
              }}
            >
              {offer.interestRate}
            </Typography>
          </Box>

          <Grid container spacing={1} sx={{ mb: 1.5 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Processing Fee
              </Typography>
              <Typography variant="body2" fontWeight={500} fontSize="0.8rem">
                {offer.processingFee}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Maximum Amount
              </Typography>
              <Typography variant="body2" fontWeight={500} fontSize="0.8rem">
                {offer.maxAmount}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            onClick={() => onViewDetails(offer)}
            sx={{
              py: 0.8,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.8rem",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
                background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
              },
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Zoom>
  )
}

export default OfferCard
