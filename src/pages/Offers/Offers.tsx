"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Fab,
  Tooltip,
  Slide,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  TablePagination,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material"
import type { TransitionProps } from "@mui/material/transitions"
import { Add, Search, FilterList } from "@mui/icons-material"
import { useAuth } from "../../hooks/useAuth"
import OfferCard from "./components/OfferCard"
import OfferDetailsDialog from "./components/OfferDetailsDialog"
import CreateOfferDialog from "./components/CreateOfferDialog"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import {
  fetchAllOffers,
  deleteOffer,
  clearOffersState,
  setSelectedOffer,
  type BankOffer,
} from "../../store/slices/offersSlice"

// Transition component for dialogs
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Offers: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // 1s delay to show skeleton before real data
  const [showSkeleton, setShowSkeleton] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Dialog & filter/search state
  const [openDialog, setOpenDialog] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTab, setFilterTab] = useState(0)
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const { userRole } = useAuth()

  // Redux state & dispatch
  const dispatch = useAppDispatch()
  const { offers, loading, error, success } = useAppSelector((state) => state.offers)
  const selectedOffer = useAppSelector((state) => state.offers.selectedOffer)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(9)

  // Snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // Initial fetch
  useEffect(() => {
    dispatch(fetchAllOffers())
  }, [dispatch])

  // Show success / error messages
  useEffect(() => {
    if (success) {
      setSnackbar({ open: true, message: success, severity: "success" })
      setTimeout(() => dispatch(clearOffersState()), 5000)
    }
    if (error) {
      setSnackbar({ open: true, message: error, severity: "error" })
      setTimeout(() => dispatch(clearOffersState()), 5000)
    }
  }, [success, error, dispatch])

  // Handlers
  const handleOpenDialog = (offer: BankOffer) => {
    setSelectedOfferId(offer._id)
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setTimeout(() => {
      setSelectedOfferId(null)
      dispatch(setSelectedOffer(null))
    }, 300)
  }
  const handleOpenCreateDialog = () => setOpenCreateDialog(true)
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
    dispatch(setSelectedOffer(null))
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)
  const handleFilterChange = (_: React.SyntheticEvent, newVal: number) => setFilterTab(newVal)
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(e.target.value, 10))
    setPage(0)
  }
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }))
  const handleDeleteOffer = (id: string) => dispatch(deleteOffer(id))
  const handleEditOffer = (offer: BankOffer) => {
    dispatch(setSelectedOffer(offer))
    setOpenCreateDialog(true)
  }

  // Helper function to check if offer is expired
  const isOfferExpired = (offer: BankOffer): boolean => {
    if (!offer.offerValidity) return false
    const expiryDate = new Date(offer.offerValidity)
    const currentDate = new Date()
    return expiryDate.getTime() < currentDate.getTime()
  }

  // Filter & paginate logic with proper sorting
  const filteredOffers = Array.isArray(offers)
    ? offers
        .filter((offer) => {
          // Search filter
          const searchFields = [offer.bankName, offer.loanType, offer.offerHeadline]
            .filter(Boolean)
            .map((field) => field!.toLowerCase())

          const matchesSearch = searchFields.some((field) => field.includes(searchTerm.toLowerCase()))

          if (!matchesSearch) return false

          // Tab filters
          switch (filterTab) {
            case 1: // Featured
              return offer.isFeatured
            case 2: // Personal Loans
              return offer.loanType.toLowerCase().includes("pl") || offer.loanType.toLowerCase().includes("personal")
            case 3: // Business Loans
              return offer.loanType.toLowerCase().includes("bl") || offer.loanType.toLowerCase().includes("business")
            case 4: // SEPL Loans
              return offer.loanType.toLowerCase().includes("sepl")
            default: // All
              return true
          }
        })
        .sort((a, b) => {
          // Check if offers are expired
          const aExpired = isOfferExpired(a)
          const bExpired = isOfferExpired(b)

          console.log(`Sorting: ${a.bankName} (expired: ${aExpired}) vs ${b.bankName} (expired: ${bExpired})`)

          // If one is expired and the other isn't, put expired at the end
          if (aExpired && !bExpired) {
            console.log(`Moving ${a.bankName} to end (expired)`)
            return 1
          }
          if (!aExpired && bExpired) {
            console.log(`Moving ${b.bankName} to end (expired)`)
            return -1
          }

          // If both have same expiration status, sort by featured status
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1

          // If both have same expiration and featured status, maintain original order
          return 0
        })
    : []

  const paginatedOffers = filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Debug logging
  useEffect(() => {
    if (filteredOffers.length > 0) {
      console.log("Filtered offers order:")
      filteredOffers.forEach((offer, index) => {
        console.log(
          `${index + 1}. ${offer.bankName} - Expired: ${isOfferExpired(offer)} - Validity: ${offer.offerValidity}`,
        )
      })
    }
  }, [filteredOffers])

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
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                  },
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
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
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

      {/* Skeleton loading matching card shape */}
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
                  <Box mt={2}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No results */}
      {!loading && paginatedOffers.length === 0 && (
        <Box textAlign="center" my={8} p={3} bgcolor="background.paper" borderRadius={2}>
          <Typography variant="h6" color="text.secondary">
            No offers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? "Try adjusting your search or filters"
              : "There are no offers available at the moment. Check back later or create a new offer."}
          </Typography>
        </Box>
      )}

      {/* Offer cards */}
      <Grid container spacing={4}>
        {!loading &&
          paginatedOffers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer._id}>
              <OfferCard
                offer={offer}
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
  )
}

export default Offers
