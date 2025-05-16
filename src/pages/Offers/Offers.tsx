"use client"

import React from "react"
import { useState } from "react"
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
} from "@mui/material"
import type { TransitionProps } from "@mui/material/transitions"
import { Add, Search, FilterList } from "@mui/icons-material"
import { useAuth } from "../../hooks/useAuth"
import OfferCard from "./components/OfferCard"
import OfferDetailsDialog from "./components/OfferDetailsDialog"
import CreateOfferDialog from "./components/CreateOfferDialog"
import type { BankOffer } from "./types"

// Transition component for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

// Initial offers data
const initialOffers: BankOffer[] = [
  {
    id: "1",
    bankName: "HDFC Bank",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Personal Loan",
    headline: "Special Festival Offer",
    validity: "31/12/2024",
    interestRate: "10.50%",
    processingFee: "1%",
    maxAmount: "₹40,00,000",
    features: ["Quick Approval", "Minimal Documentation", "Flexible Tenure"],
    commission: "2%",
    isFeatured: true,
    createdAt: "2023-12-15",
    eligibilityCriteria: {
      minAge: 23,
      maxAge: 58,
      minIncome: "₹25,000",
      employmentType: "Salaried",
      minCreditScore: 700,
      documents: ["PAN Card", "Aadhar Card", "Latest 3 months salary slips", "Bank statements for 3 months"],
    },
  },
  {
    id: "2",
    bankName: "ICICI Bank",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Home Loan",
    headline: "Dream Home Offer",
    validity: "15/11/2024",
    interestRate: "8.75%",
    processingFee: "0.5%",
    maxAmount: "₹5,00,00,000",
    features: ["Low Interest Rate", "Long Tenure", "Balance Transfer"],
    commission: "1.5%",
    isFeatured: false,
    createdAt: "2024-01-10",
    eligibilityCriteria: {
      minAge: 25,
      maxAge: 65,
      minIncome: "₹40,000",
      employmentType: "Salaried/Self-employed",
      minCreditScore: 750,
      documents: [
        "PAN Card",
        "Aadhar Card",
        "Income Tax Returns",
        "Property documents",
        "Bank statements for 6 months",
      ],
    },
  },
  {
    id: "3",
    bankName: "Axis Bank",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Business Loan",
    headline: "Business Growth Booster",
    validity: "30/09/2024",
    interestRate: "12.00%",
    processingFee: "1.5%",
    maxAmount: "₹75,00,000",
    features: ["No Collateral", "GST Returns Based", "Quick Disbursement"],
    commission: "2.5%",
    isFeatured: false,
    createdAt: "2024-02-05",
    eligibilityCriteria: {
      minAge: 25,
      maxAge: 65,
      minIncome: "Not Applicable",
      businessVintage: "Minimum 2 years",
      minCreditScore: 720,
      documents: ["PAN Card", "Aadhar Card", "Business Registration", "GST Returns", "Bank statements for 12 months"],
    },
  },
  {
    id: "4",
    bankName: "SBI Bank",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Education Loan",
    headline: "Future Scholar Program",
    validity: "31/08/2024",
    interestRate: "9.25%",
    processingFee: "0.5%",
    maxAmount: "₹50,00,000",
    features: ["Collateral Free up to ₹7.5L", "Moratorium Period", "Tax Benefits"],
    commission: "1.2%",
    isFeatured: false,
    createdAt: "2024-03-10",
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 35,
      minIncome: "Not Applicable",
      courseEligibility: "Approved courses only",
      documents: ["PAN Card", "Aadhar Card", "Admission Letter", "Academic Records", "Co-applicant details"],
    },
  },
  {
    id: "5",
    bankName: "Kotak Mahindra",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Car Loan",
    headline: "Drive Away Deal",
    validity: "31/10/2024",
    interestRate: "9.00%",
    processingFee: "1%",
    maxAmount: "₹80,00,000",
    features: ["Quick Approval", "Flexible Tenure", "No Foreclosure Charges"],
    commission: "1.8%",
    isFeatured: true,
    createdAt: "2024-03-15",
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 65,
      minIncome: "₹30,000",
      employmentType: "Salaried/Self-employed",
      minCreditScore: 700,
      documents: ["PAN Card", "Aadhar Card", "Income Proof", "Bank statements for 3 months", "Vehicle quotation"],
    },
  },
  {
    id: "6",
    bankName: "Yes Bank",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Gold Loan",
    headline: "Golden Opportunity",
    validity: "15/12/2024",
    interestRate: "11.50%",
    processingFee: "0.5%",
    maxAmount: "₹25,00,000",
    features: ["Instant Disbursal", "No Income Proof", "Flexible Repayment"],
    commission: "2.0%",
    isFeatured: false,
    createdAt: "2024-04-05",
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 70,
      minIncome: "Not Required",
      goldPurity: "Minimum 18 Karats",
      documents: ["PAN Card", "Aadhar Card", "Gold Ornaments", "Ownership proof of gold"],
    },
  },
  {
    id: "7",
    bankName: "IndusInd Bank",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Personal Loan",
    headline: "Instant Cash Offer",
    validity: "30/11/2024",
    interestRate: "11.25%",
    processingFee: "1.25%",
    maxAmount: "₹30,00,000",
    features: ["Digital Process", "Minimal Documentation", "Flexible Tenure"],
    commission: "2.2%",
    isFeatured: false,
    createdAt: "2024-04-15",
    eligibilityCriteria: {
      minAge: 23,
      maxAge: 60,
      minIncome: "₹20,000",
      employmentType: "Salaried",
      minCreditScore: 680,
      documents: ["PAN Card", "Aadhar Card", "Latest 3 months salary slips", "Bank statements for 3 months"],
    },
  },
  {
    id: "8",
    bankName: "IDFC First Bank",
    logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    loanType: "Home Loan",
    headline: "First Home Advantage",
    validity: "31/12/2024",
    interestRate: "8.50%",
    processingFee: "0.5%",
    maxAmount: "₹3,50,00,000",
    features: ["Low Interest Rate", "Zero Prepayment Charges", "Long Tenure"],
    commission: "1.6%",
    isFeatured: false,
    createdAt: "2024-05-01",
    eligibilityCriteria: {
      minAge: 23,
      maxAge: 70,
      minIncome: "₹35,000",
      employmentType: "Salaried/Self-employed",
      minCreditScore: 725,
      documents: [
        "PAN Card",
        "Aadhar Card",
        "Income Tax Returns",
        "Property documents",
        "Bank statements for 6 months",
      ],
    },
  },
]

const Offers: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [offers, setOffers] = useState<BankOffer[]>(initialOffers)
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTab, setFilterTab] = useState(0)
  const { userRole } = useAuth()

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const handleOpenDialog = (offer: BankOffer) => {
    setSelectedOffer(offer)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedOffer(null)
  }

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
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

  const handleCreateOffer = (newOffer: BankOffer) => {
    setOffers([newOffer, ...offers])
    setSnackbar({
      open: true,
      message: "Offer created successfully!",
      severity: "success",
    })
  }

  // Filter offers based on search term and tab
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.headline && offer.headline.toLowerCase().includes(searchTerm.toLowerCase()))

    if (filterTab === 0) return matchesSearch // All
    if (filterTab === 1) return matchesSearch && offer.isFeatured // Featured
    if (filterTab === 2) return matchesSearch && offer.loanType === "Personal Loan" // Personal Loans
    if (filterTab === 3) return matchesSearch && offer.loanType === "Home Loan" // Home Loans
    if (filterTab === 4) return matchesSearch && offer.loanType === "Business Loan" // Business Loans

    return matchesSearch
  })

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
                <Tab label="Home Loans" />
                <Tab label="Business Loans" />
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Offer Cards */}
      <Grid container spacing={2}>
        {paginatedOffers.map((offer) => (
          <Grid item xs={12} sm={6} md={3} key={offer.id}>
            <OfferCard offer={offer} onViewDetails={handleOpenDialog} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
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

      {/* Offer Details Dialog */}
      {selectedOffer && (
        <OfferDetailsDialog open={openDialog} onClose={handleCloseDialog} offer={selectedOffer} userRole={userRole} />
      )}

      {/* Create Offer Dialog - Only for Admin */}
      {userRole === "admin" && (
        <CreateOfferDialog
          open={openCreateDialog}
          onClose={handleCloseCreateDialog}
          onCreateOffer={handleCreateOffer}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Offers
