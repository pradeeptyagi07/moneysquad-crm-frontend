// pages/Offers.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, TextField, InputAdornment, Fab, Tooltip, Slide,
  useTheme, useMediaQuery, Tabs, Tab, Snackbar, Alert, TablePagination,
  Skeleton, Card, CardContent
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { Add, Search, FilterList } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

// IMPORTANT: import the premium card we just edited
import OfferDetailsDialog from "./components/OfferDetailsDialog";
import CreateOfferDialog from "./components/CreateOfferDialog";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  fetchAllOffers, deleteOffer, clearOffersState, setSelectedOffer, type BankOffer,
} from "../../store/slices/offersSlice";
import OfferCardPremiumV5 from "./components/OfferCard";

// Transition component for dialogs
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ------------------ expiry helpers (single source of truth) ------------------ */

// robust parsing for multiple shapes: number | Date | "DD/MM/YYYY" | "YYYY-MM-DD" | ISO
// --- Inclusive-by-date parsing: ALWAYS normalize to local end-of-day ---
const parseExpiry = (v: unknown): Date | null => {
  if (!v) return null;

  // Helper to clamp to local end-of-day
  const toLocalEOD = (d: Date) => {
    if (isNaN(d.getTime())) return null;
    const e = new Date(d);
    e.setHours(23, 59, 59, 999);
    return e;
  };

  if (typeof v === "number") {
    // Treat numeric timestamps as a date and push to EOD of that date
    const d = new Date(v);
    return toLocalEOD(d);
  }
  if (v instanceof Date) {
    return toLocalEOD(v);
  }
  if (typeof v === "string") {
    const s = v.trim();

    // DD/MM/YYYY or DD-MM-YYYY
    const dmy = s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
    if (dmy) {
      const [, dd, mm, yyyy] = dmy;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return toLocalEOD(d);
    }

    // YYYY-MM-DD (optional Z)
    const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:Z)?$/);
    if (ymd) {
      const [, yyyy, mm, dd] = ymd;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return toLocalEOD(d);
    }

    // Fallback: parse, then clamp to EOD
    const d = new Date(s);
    return toLocalEOD(d);
  }

  return null;
};

const pickValidity = (offer: Partial<BankOffer> & Record<string, any>) =>
  offer.offerValidity ?? offer.validity ?? offer.expiryDate ?? offer.expiry ?? offer.validTill ?? null;

const getExpiryTs = (offer: BankOffer): number => {
  const raw = pickValidity(offer as any);
  const d = parseExpiry(raw);
  return d ? d.getTime() : Number.POSITIVE_INFINITY;
};

// NOTE the strict ">" so it expires only AFTER the date is fully over.
const isOfferExpired = (offer: BankOffer): boolean => {
  const ts = getExpiryTs(offer);
  if (!isFinite(ts)) return false; // no expiry -> not expired
  return Date.now() > ts;
};


// Sorter: non-expired first, then featured first, then nearest expiry, then bank name
const byExpiryThenFeatured = (
  a: BankOffer & { _expired?: boolean; _expiryTs?: number },
  b: BankOffer & { _expired?: boolean; _expiryTs?: number },
) => {
    const aExpired = !!a._expired;
    const bExpired = !!b._expired;
    if (aExpired !== bExpired) return aExpired ? 1 : -1;

    const aFeat = !!a.isFeatured;
    const bFeat = !!b.isFeatured;
    if (aFeat !== bFeat) return aFeat ? -1 : 1;

    const aTs = a._expiryTs ?? Number.POSITIVE_INFINITY;
    const bTs = b._expiryTs ?? Number.POSITIVE_INFINITY;
    if (aTs !== bTs) return aTs - bTs;

    return (a.bankName || "").localeCompare(b.bankName || "");
};

/* ------------------ component ------------------ */

const Offers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState(0);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const { userRole } = useAuth();

  const dispatch = useAppDispatch();
  const { offers, loading, error, success } = useAppSelector((state) => state.offers);
  const selectedOffer = useAppSelector((state) => state.offers.selectedOffer);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  useEffect(() => { setPage(0); }, [searchTerm, filterTab, rowsPerPage]);

  const [snackbar, setSnackbar] = useState({
    open: false, message: "", severity: "success" as "success" | "error",
  });

  useEffect(() => { dispatch(fetchAllOffers()); }, [dispatch]);

  useEffect(() => {
    if (success) {
      setSnackbar({ open: true, message: success, severity: "success" });
      setTimeout(() => dispatch(clearOffersState()), 5000);
    }
    if (error) {
      setSnackbar({ open: true, message: error, severity: "error" });
      setTimeout(() => dispatch(clearOffersState()), 5000);
    }
  }, [success, error, dispatch]);

  const handleOpenDialog = (offer: BankOffer) => { setSelectedOfferId(offer._id); setOpenDialog(true); };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTimeout(() => { setSelectedOfferId(null); dispatch(setSelectedOffer(null)); }, 300);
  };
  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => { setOpenCreateDialog(false); dispatch(setSelectedOffer(null)); };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleFilterChange = (_: React.SyntheticEvent, newVal: number) => setFilterTab(newVal);
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(e.target.value, 10)); setPage(0);
  };
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const handleDeleteOffer = (id: string) => dispatch(deleteOffer(id));
  const handleEditOffer = (offer: BankOffer) => { dispatch(setSelectedOffer(offer)); setOpenCreateDialog(true); };

  // Compute once, keep consistent across sort & UI
  const computed = Array.isArray(offers)
    ? offers.map((o) => ({ ...o, _expiryTs: getExpiryTs(o), _expired: isOfferExpired(o) }))
    : [];

  const filteredOffers = computed
    .filter((offer) => {
      const search = searchTerm.toLowerCase();
      const fields = [offer.bankName, offer.loanType, offer.offerHeadline]
        .filter(Boolean).map((f) => f!.toLowerCase());
      const matchesSearch = search ? fields.some((f) => f.includes(search)) : true;
      if (!matchesSearch) return false;

      const lt = (offer.loanType || "").toLowerCase();
      switch (filterTab) {
        case 1: return !!offer.isFeatured;
        case 2: return /(?:^|\b)(pl|personal)(?:\b|$)/i.test(lt);
        case 3: return /(?:^|\b)(bl|business)(?:\b|$)/i.test(lt);
        case 4: return /sepl/i.test(lt);
        default: return true;
      }
    })
    .sort(byExpiryThenFeatured);

  const paginatedOffers = filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Bank Offers</Typography>
          {userRole === "admin" && (
            <Tooltip title="Create New Offer">
              <Fab
                color="primary"
                onClick={handleOpenCreateDialog}
                sx={{
                  boxShadow: "0 8px 16px rgba(37,99,235,0.2)",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  "&:hover": { background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)" },
                }}
              >
                <Add />
              </Fab>
            </Tooltip>
          )}
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search offers by bank or loan type..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
                sx: { borderRadius: 2 },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <FilterList sx={{ mr: 1, color: "text.secondary" }} />
              <Tabs
                value={filterTab}
                onChange={handleFilterChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{ "& .MuiTab-root": { minWidth: "auto", px: 2 } }}
              >
                <Tab label="All" />
                <Tab label="Featured" />
                <Tab label="Personal Loans" />
                <Tab label="Business Loans" />
                <Tab label="SEPL Loans" />
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Skeletons */}
      {loading && offers.length === 0 && showSkeleton && (
        <Grid container spacing={2}>
          {Array.from({ length: rowsPerPage }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 6px 18px rgba(0,0,0,0.1)" }}>
                <Skeleton variant="rectangular" height={220} width="100%" />
                <CardContent>
                  <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width="30%" height={30} sx={{ mb: 2, borderRadius: 1 }} />
                  <Skeleton width="80%" height={24} sx={{ mb: 1 }} />
                  <Skeleton width="70%" height={24} sx={{ mb: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Skeleton width="40%" height={20} />
                    <Skeleton width="40%" height={20} />
                  </Box>
                  <Box mt={2}><Skeleton variant="rectangular" width="100%" height={40} /></Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No results */}
      {!loading && paginatedOffers.length === 0 && (
        <Box textAlign="center" my={8} p={3} bgcolor="background.paper" borderRadius={2}>
          <Typography variant="h6" color="text.secondary">No offers found</Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? "Try adjusting your search or filters"
                        : "There are no offers available at the moment. Check back later or create a new offer."}
          </Typography>
        </Box>
      )}

      {/* Offer cards */}
      <Grid container spacing={4}>
        {!loading && paginatedOffers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer._id}>
            <OfferCardPremiumV5
              offer={offer}
              expired={offer._expired}
              expiryTs={offer._expiryTs}
              onViewDetails={handleOpenDialog}
              onDeleteOffer={userRole === "admin" ? handleDeleteOffer : undefined}
              onEditOffer={userRole === "admin" ? handleEditOffer : undefined}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {!loading && filteredOffers.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <TablePagination
            component="div"
            count={filteredOffers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[9, 27, 36]}
          />
        </Box>
      )}

      {/* Dialogs & Snackbar */}
      {selectedOfferId && (
        <OfferDetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          offerId={selectedOfferId}
          userRole={userRole}
          TransitionComponent={Transition}
        />
      )}
      {userRole === "admin" && (
        <CreateOfferDialog open={openCreateDialog} onClose={handleCloseCreateDialog} editOffer={selectedOffer} />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Offers;
