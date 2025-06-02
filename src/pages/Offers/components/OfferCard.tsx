"use client";

import type React from "react";
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
import { Percent, Star, Edit, Delete, MoreVert } from "@mui/icons-material";
import { useState } from "react";
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
  const open = Boolean(anchorEl);

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

  // grab colors for this loanType, or fallback
  const { gradient, textColor } =
    loanTypeColors[offer.loanType] ?? loanTypeColors.Other;

  return (
    <Zoom
      in
      style={{
        transitionDelay: `${parseInt(offer._id.slice(-4), 16) % 500}ms`,
      }}
    >
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          bgcolor: "white",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {/* Banner Image */}
        {offer.bankImage && (
          <Box
            sx={{
              position: "relative",
              height: 160,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={offer.bankImage}
              alt={offer.bankName}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {offer.isFeatured && (
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  bgcolor: "#FFA000",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  color: "white",
                }}
              >
                <Star fontSize="small" />
              </Box>
            )}
          </Box>
        )}

        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "#374151",
              mb: 0.5,
            }}
          >
            {offer.bankName}
          </Typography>

          <Box
            sx={{
              mb: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              label={offer.loanType}
              size="small"
              sx={{
                borderRadius: 4,
                background: gradient,
                color: textColor,
                fontWeight: 500,
                fontSize: "0.7rem",
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
              <Percent fontSize="small" sx={{ mr: 0.3 }} />
              {offer.commissionPercent}%
            </Typography>
          </Box>

          {offer.offerHeadline && (
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.3, mb: 1 }}
            >
              {offer.offerHeadline}
            </Typography>
          )}

          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Interest Rate
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {offer.interestRate}%
            </Typography>
          </Box>

          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Processing Fee
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                ₹{offer.processingFee}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Maximum Amount
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                ₹{offer.maximumAmount.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            onClick={() => onViewDetails(offer)}
            sx={{
              py: 1,
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.9rem",
              bgcolor: "#5E17EB",
              "&:hover": { bgcolor: "#4A11C0" },
            }}
          >
            View Details
          </Button>
        </CardContent>

        {userRole === "admin" && (
          <Box sx={{ position: "absolute", top: 10, left: 10 }}>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ bgcolor: "#f0f0f0", "&:hover": { bgcolor: "#e0e0e0" } }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2, minWidth: 120 },
              }}
            >
              <MenuItem onClick={handleEdit}>
                <Edit fontSize="small" sx={{ mr: 1, color: "#2196F3" }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <Delete fontSize="small" sx={{ mr: 1, color: "#F44336" }} />{" "}
                Delete
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Card>
    </Zoom>
  );
};

export default OfferCard;
