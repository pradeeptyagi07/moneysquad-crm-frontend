// OfferCardPremiumV5.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Zoom,
  IconButton,
  Menu,
  MenuItem,
  styled,
  useTheme,
} from "@mui/material";
import { Star, Edit, Delete, MoreVert, AccessTime } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { loanTypeColors, type BankOffer } from "../../../store/slices/offersSlice";

interface OfferCardProps {
  offer: BankOffer;
  onViewDetails: (offer: BankOffer) => void;
  onDeleteOffer?: (id: string) => void;
  onEditOffer?: (offer: BankOffer) => void;
}

const PremiumCard = styled(Card)(({ theme }) => ({
  position: "relative",
  width: 380,
  borderRadius: theme.spacing(4),
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow: "0 14px 28px rgba(0,0,0,0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
}));

const OfferCardPremiumV5: React.FC<OfferCardProps> = ({
  offer,
  onViewDetails,
  onDeleteOffer,
  onEditOffer,
}) => {
  const theme = useTheme();
  const { userRole } = useAuth();

  // expiration timer
  const [timeLeft, setTimeLeft] = useState("");
  const expirationDate = useMemo(() => {
    if (!offer.offerValidity) return null;
    const d = new Date(offer.offerValidity);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [offer.offerValidity]);

  useEffect(() => {
    if (!expirationDate) return;
    const tick = () => {
      const diff = expirationDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Expired");
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [expirationDate]);

  const isExpired = !!expirationDate && expirationDate.getTime() < Date.now();

  const fmt = (s: string) => {
    const d = new Date(s);
    return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
      .map((n) => String(n).padStart(2, "0"))
      .join("/");
  };

  const { gradient, textColor } =
    loanTypeColors[offer.loanType] || loanTypeColors.Other;

  // admin menu handlers
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
    onEditOffer?.(offer);
  };
  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
    onDeleteOffer?.(offer._id);
  };

  return (
    <Zoom in style={{ transitionDelay: "0ms" }}>
      <PremiumCard
        onClick={() => !isExpired && onViewDetails(offer)}
        sx={{
          cursor: isExpired ? "default" : "pointer",
          ...(isExpired && { filter: "grayscale(100%)", opacity: 0.6 }),
        }}
      >
        {/* Offer image with overlay */}
        {offer.bankImage && (
          <Box
            component="img"
            src={offer.bankImage}
            alt="Offer"
            sx={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              borderTopLeftRadius: theme.spacing(4),
              borderTopRightRadius: theme.spacing(4),
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.7))",
              },
            }}
          />
        )}

        {/* Loan-type chip */}
        <Box sx={{ position: "absolute", top: 33, right: 33, zIndex: 2, }}>
          <Chip
            label={offer.loanType}
            size="small"
            sx={{ px: 1, fontWeight: 600, background: gradient, color: textColor ,borderRadius:5}}
          />
        </Box>

        <CardContent sx={{ pt: 1, px: 1, pb: 1 }}>
          {/* Date/time bar */}
          {offer.offerValidity && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 0,
                mb: 1,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                height: 36,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {timeLeft}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Expires {fmt(offer.offerValidity)}
              </Typography>
            </Box>
          )}

          {/* Bank name + glowing featured star */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h5" noWrap sx={{ fontWeight: 700 }}>
              {offer.bankName}
            </Typography>
            {offer.isFeatured && !isExpired && (
              <Box
                sx={{
                  ml: 1,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "warning.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 0 8px rgba(255,193,7,0.6), 0 0 16px rgba(255,193,7,0.4)",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%,100%": {
                      transform: "scale(1)",
                      boxShadow:
                        "0 0 8px rgba(255,193,7,0.6), 0 0 16px rgba(255,193,7,0.4)",
                    },
                    "50%": {
                      transform: "scale(1.15)",
                      boxShadow: "0 0 24px rgba(255,193,7,0.8)",
                    },
                  },
                }}
              >
                <Star fontSize="small" sx={{ color: "#fff" }} />
              </Box>
            )}
          </Box>

          {/* Headline */}
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {offer.offerHeadline}
          </Typography>

          {/* Accent divider */}
          <Box
            sx={{ width: 80, height: 3, bgcolor: "primary.main", borderRadius: 1, mb: 3 }}
          />

          {/* Rates grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ textTransform: "uppercase", mb: 0.5 }}>
                Interest Rate
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {offer.interestRate}%
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ textTransform: "uppercase", mb: 0.5 }}>
                Processing Fee
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {offer.processingFeeType === "percentage"
                  ? `${offer.processingFee}%`
                  : `₹${offer.processingFee}`}
              </Typography>
            </Grid>
          </Grid>

          {/* View Details button */}
          <Button
            fullWidth
            disabled={isExpired}
            onClick={() => onViewDetails(offer)}
            sx={{
              textTransform: "none",
              borderRadius: theme.spacing(3),
              py: 1.2,
              background: "#12AA9E",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              "&:hover": { background: "#0e8c7f" },
            }}
          >
            View Details
          </Button>
        </CardContent>

        {/* Admin menu */}
        {userRole === "admin" && (
          <>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ position: "absolute", top: 12, left: 12, bgcolor: "grey.100" }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{ onClick: (e) => e.stopPropagation() }}
              PaperProps={{ sx: { borderRadius: 2 } }}
            >
              <MenuItem onClick={handleEdit}>
                <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </PremiumCard>
    </Zoom>
  );
};

export default OfferCardPremiumV5;
