// OfferCard.tsx
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
  useTheme,
} from "@mui/material";
import { Star, Edit, Delete, MoreVert, AccessTime } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import {
  loanTypeColors,
  type BankOffer,
} from "../../../store/slices/offersSlice";

interface OfferCardProps {
  offer: BankOffer;
  onViewDetails: (offer: BankOffer) => void;
  onDeleteOffer?: (id: string) => void;
  onEditOffer?: (offer: BankOffer) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onViewDetails,
  onDeleteOffer,
  onEditOffer,
}) => {
  const { userRole } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [timeLeft, setTimeLeft] = useState("");
  const theme = useTheme();

  // Compute end-of-day expiration
  const expirationDate = useMemo(() => {
    if (!offer.offerValidity) return null;
    const d = new Date(offer.offerValidity);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [offer.offerValidity]);

  // Countdown timer
  useEffect(() => {
    if (!expirationDate) return;
    const update = () => {
      const diff = expirationDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [expirationDate]);

  const isExpired =
    expirationDate !== null && expirationDate.getTime() < Date.now();

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return [
      String(d.getDate()).padStart(2, "0"),
      String(d.getMonth() + 1).padStart(2, "0"),
      d.getFullYear(),
    ].join("/");
  };

  const { gradient, textColor } =
    loanTypeColors[offer.loanType] || loanTypeColors.Other;

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
      <Card
        onClick={() => !isExpired && onViewDetails(offer)}
        sx={{
          p: 0,
          height: "100%",
          borderRadius: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.3s, box-shadow 0.3s",
          cursor: isExpired ? "default" : "pointer",
          ...(isExpired && {
            filter: "grayscale(100%)",
            opacity: 0.6,
            pointerEvents: "auto",
          }),
          "&:hover": {
            transform: isExpired ? "none" : "translateY(-4px)",
            boxShadow: isExpired
              ? "0 6px 18px rgba(0,0,0,0.1)"
              : "0 10px 30px rgba(0,0,0,0.15)",
            "& .offer-image": {
              transform: isExpired ? "none" : "scale(1.05)",
            },
          },
        }}
      >
        {/* image with hover zoom */}
        {offer.bankImage && (
          <Box
            className="offer-image"
            component="img"
            src={offer.bankImage}
            alt="Offer image"
            sx={{
              objectFit: "cover",
              objectPosition: "center",
              height: 220,
              width: "100%",
              transition: "transform 0.5s ease",
            }}
          />
        )}

        {/* loan-type chip */}
        <Box
          sx={{
            position: "absolute",
            top: theme.spacing(1.5),
            right: theme.spacing(1.5),
            zIndex: 2,
          }}
        >
          <Chip
            label={offer.loanType}
            size="small"
            sx={{
              px: 0.8,
              py: 0,
              borderRadius: 1.5,
              fontSize: "0.7rem",
              fontWeight: 550,
              minHeight: "20px",
              background: gradient,
              color: textColor,
            }}
          />
        </Box>

        {/* validity bar */}
        {offer.offerValidity && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1.5,
              bgcolor: "background.paper",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: 2,
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTime sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {timeLeft}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Expires on {formatDate(offer.offerValidity)}
            </Typography>
          </Box>
        )}

<CardContent sx={{ p: 2, px:6, position: 'relative', overflow: 'visible' }}>
  {/* Featured Star Badge */}
  {offer.isFeatured && !isExpired && (
    <Box
      sx={{
        position: 'absolute',
        top: 22,
        right: 22,
        width: 32,
        height: 32,
        borderRadius: '50%',
        bgcolor: 'warning.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 4,
        animation: 'pulse 2s ease-in-out infinite',
        '@keyframes pulse': {
          '0%,100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,193,7,0.4)' },
          '50%':     { transform: 'scale(1.2)', boxShadow: '0 0 0 12px rgba(255,193,7,0)' },
        },
      }}
    >
      <Star fontSize="small" sx={{ color: 'common.white' }} />
    </Box>
  )}

  {/* Bank Name */}
  <Typography
    variant="h4"
    sx={{
      fontWeight: 700,
      color: '#1E293B',
      letterSpacing: 0.5,
      mb: 0.5,
    }}
  >
    {offer.bankName}
  </Typography>

  {/* Headline */}
  <Typography
    variant="subtitle2"
    sx={{
      fontWeight: 600,
      color: 'text.secondary',
      mb: 1.5,
      lineHeight: 1.3,
    }}
  >
    {offer.offerHeadline}
  </Typography>

  {/* Accent Divider */}
  <Box
    sx={{
      width: 60,
      height: 2.5,
      bgcolor: 'primary.light',
      borderRadius: 1,
      mb: 2,
    }}
  />

  {/* Rates Grid */}
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={6}>
      <Typography
        variant="body1"
        sx={{ display: 'block', mb: 0.5, letterSpacing: 1, color: '#1E293B' }}
      >
        Interest Rate
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
        {offer.interestRate}%
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography
        variant="body1"
        sx={{ display: 'block', mb: 0.5, letterSpacing: 1, color: '#1E293B' }}
      >
        Processing Fee
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
        {offer.processingFeeType === 'percentage'
          ? `${offer.processingFee}%`
          : `₹${offer.processingFee}`}
      </Typography>
    </Grid>
  </Grid>

  {/* View Details Button */}
  <Button
    fullWidth
    variant="outlined"
    disabled={isExpired}
    onClick={() => onViewDetails(offer)}
    sx={{
      textTransform: 'none',
      borderRadius: 5,
      py: 1,
      fontWeight: 700,
      color:"#1E293B",
      borderColor:"#1E293B"
    }}
  >
    View Details
  </Button>
</CardContent>


        {/* admin menu */}
        {userRole === "admin" && (
          <>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bgcolor: "grey.100",
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                sx: { borderRadius: 2, pointerEvents: "auto" },
              }}
            >
              <MenuItem
                onClick={handleEdit}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                }}
              >
                <Edit
                  sx={{ color: (theme) => theme.palette.primary.main }}
                  fontSize="small"
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Edit
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleDelete}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                }}
              >
                <Delete
                  sx={{ color: (theme) => theme.palette.primary.main }}
                  fontSize="small"
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Delete
                </Typography>
              </MenuItem>
            </Menu>
          </>
        )}
      </Card>
    </Zoom>
  );
};

export default OfferCard;
