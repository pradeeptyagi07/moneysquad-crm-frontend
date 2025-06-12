"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Star, Edit, Delete, MoreVert } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { loanTypeColors, type BankOffer } from "../../../store/slices/offersSlice";

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

  // Calculate time remaining
  useEffect(() => {
    if (!offer.offerValidity) return;
    const update = () => {
      const diff = new Date(offer.offerValidity).getTime() - Date.now();
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
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [offer.offerValidity]);

  const isExpired = !!offer.offerValidity && new Date(offer.offerValidity) < new Date();
  const { gradient, textColor } = loanTypeColors[offer.loanType] || loanTypeColors.Other;

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
    <Zoom in style={{ transitionDelay: `0ms` }}>
      <Card
        onClick={() => !isExpired && onViewDetails(offer)}
        sx={{
          height: '100%',
          borderRadius: 3,
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
          opacity: isExpired ? 0.5 : 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Image Section */}
        {offer.bankImage && (
          <Box sx={{ position: 'relative', height: 180, width: '100%' }}>
            <Box
              component="img"
              src={offer.bankImage}
              alt={offer.bankName}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Featured Pulse */}
            {offer.isFeatured && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'featurePulse 2s ease-in-out infinite',
                  '@keyframes featurePulse': {
                    '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,193,7,0.4)' },
                    '50%': { transform: 'scale(1.2)', boxShadow: '0 0 0 12px rgba(255,193,7,0)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,193,7,0.4)' },
                  },
                }}
              >
                <Star sx={{ color: 'common.white', fontSize: 20 }} />
              </Box>
            )}
          </Box>
        )}

        {/* Validity & Timer */}
        {offer.offerValidity && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            py: 1,
            bgcolor: 'grey.50',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {timeLeft}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Valid until {new Date(offer.offerValidity).toLocaleDateString()}
            </Typography>
          </Box>
        )}

        {/* Content */}
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {offer.bankName}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Chip
              label={offer.loanType}
              size="small"
              sx={{
                px: 1,
                borderRadius: 2,
                fontWeight: 600,
                background: gradient,
                color: textColor,
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {offer.offerHeadline}
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Interest Rate</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{offer.interestRate}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Processing Fee</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>₹{offer.processingFee}</Typography>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            disabled={isExpired}
            sx={{ mt: 1, borderRadius: 3, textTransform: 'none' }}
          >
            View Details
          </Button>
        </CardContent>

        {/* Admin Menu */}
        {userRole === 'admin' && (
          <>  
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                pointerEvents: 'auto',
                zIndex: 2,
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: 'grey.100',
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              onClick={e => e.stopPropagation()}
              PaperProps={{ sx: { borderRadius: 2, pointerEvents: 'auto' } }}
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
      </Card>
    </Zoom>
  );
};

export default OfferCard;
