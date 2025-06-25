"use client"

import React from "react"
import { useState, useEffect } from "react"
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
  CircularProgress,
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

// Transition component for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Offers: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [openDialog, setOpenDialog] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTab, setFilterTab] = useState(0)
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const { userRole } = useAuth()

  // Redux state
  const dispatch = useAppDispatch()
  const { offers, loading, error, success } = useAppSelector((state) => state.offers)
  const selectedOffer = useAppSelector((state) => state.offers.selectedOffer)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  // Fetch offers on component mount
  useEffect(() => {
    dispatch(fetchAllOffers())
  }, [dispatch])

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      setSnackbar({
        open: true,
        message: success,
        severity: "success",
      })
      // Clear success message after showing snackbar
      setTimeout(() => {
        dispatch(clearOffersState())
      }, 5000)
    }
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: "error",
      })
      // Clear error message after showing snackbar
      setTimeout(() => {
        dispatch(clearOffersState())
      }, 5000)
    }
  }, [success, error, dispatch])

  const handleOpenDialog = (offer: BankOffer) => {
    setSelectedOfferId(offer._id)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setTimeout(() => {
      setSelectedOfferId(null)
      dispatch(setSelectedOffer(null))
    }, 300) // Wait for dialog close animation
  }

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
    dispatch(setSelectedOffer(null))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (event: React.SyntheticEvent, newValue: number) => {
    setFilterTab(newValue)
  }

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const handleDeleteOffer = (id: string) => {
    dispatch(deleteOffer(id))
  }

  const handleEditOffer = (offer: BankOffer) => {
    dispatch(setSelectedOffer(offer))
    setOpenCreateDialog(true)
  }

  // Filter offers based on search term and tab
  const filteredOffers = Array.isArray(offers)
    ? offers.filter((offer) => {
        const matchesSearch =
          offer.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (offer.offerHeadline && offer.offerHeadline.toLowerCase().includes(searchTerm.toLowerCase()))

        if (filterTab === 0) return matchesSearch // All
        if (filterTab === 1) return matchesSearch && offer.isFeatured // Featured
        if (filterTab === 2) return matchesSearch && offer.loanType.startsWith("PL") // Personal Loans (PL-)
        if (filterTab === 3) return matchesSearch && offer.loanType.startsWith("BL") // Business Loans (BL-)
        if (filterTab === 4) return matchesSearch && offer.loanType.startsWith("SEPL") // SEPL Loans (SEPL-)

        return matchesSearch
      })
    : []

  // Get paginated offers
  const paginatedOffers = filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box>
      {/* Header with search and filter */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4">Bank Offers</Typography>
          {userRole === "admin" && (
            <Tooltip title="Create New Offer">
              <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenCreateDialog}
                sx={{
                  boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)",
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FilterList sx={{ mr: 1, color: "text.secondary" }} />
              <Tabs
                value={filterTab}
                onChange={handleFilterChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    minWidth: "auto",
                    px: 2,
                  },
                }}
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

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty state */}
      {!loading && paginatedOffers.length === 0 && (
        <Box sx={{ textAlign: "center", my: 8, p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No offers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? "Try adjusting your search or filters"
              : "There are no offers available at the moment. Check back later or create a new offer."}
          </Typography>
        </Box>
      )}

      {/* Offer Cards */}
      <Grid container spacing={2}>
        {paginatedOffers.map((offer) => (
          <Grid item xs={12} sm={6} md={3} key={offer._id}>
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
      {filteredOffers.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <TablePagination
            component="div"
            count={filteredOffers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[8, 16, 24]}
          />
        </Box>
      )}

      {/* Offer Details Dialog */}
      {selectedOfferId && (
        <OfferDetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          offerId={selectedOfferId}
          userRole={userRole}
        />
      )}

      {/* Create Offer Dialog - Only for Admin */}
      {userRole === "admin" && (
        <CreateOfferDialog open={openCreateDialog} onClose={handleCloseCreateDialog} editOffer={selectedOffer} />
      )}

      {/* Snackbar for notifications */}
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