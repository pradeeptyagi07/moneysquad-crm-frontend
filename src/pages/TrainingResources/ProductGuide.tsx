"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../store"
import {
  fetchProductInfo,
  updateProductGuides,
  selectProductInfo,
  selectProductInfoLoading,
  selectProductInfoUpdateLoading,
  selectProductInfoUpdateSuccess,
  clearProductInfoUpdateSuccess,
  type ProductGuideItem,
} from "../../store/slices/resourceAndSupportSlice"

import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
  useTheme,
  alpha,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import EditProductGuideDialog from "./EditProductGuideDialog"
import { useAuth } from "../../hooks/useAuth"

const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  overflow: "hidden",
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}))

const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableHead-root": {
    backgroundColor: theme.palette.grey[100],
    "& .MuiTableCell-head": {
      color: theme.palette.text.primary,
      fontWeight: 600,
      fontSize: "0.95rem",
      borderBottom: `2px solid ${theme.palette.divider}`,
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
      },
      "&:nth-of-type(even)": {
        backgroundColor: alpha(theme.palette.grey[50], 0.5),
      },
    },
    "& .MuiTableCell-root": {
      fontSize: "0.9rem",
      padding: theme.spacing(1.5),
    },
  },
}))

const LoanTypeChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.85rem",
  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  color: "white",
  "&.term-loan": {
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  "&.overdraft": {
    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
}))

const ProductGuide: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const productInfo = useSelector(selectProductInfo)
  const loading = useSelector(selectProductInfoLoading)
  const updateLoading = useSelector(selectProductInfoUpdateLoading)
  const updateSuccess = useSelector(selectProductInfoUpdateSuccess)

  const { userRole } = useAuth() // ✅ Use from context
  const isAdmin = userRole === "admin" || userRole === "superadmin" // ✅ Define admin logic

  const [open, setOpen] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    if (!productInfo) {
      dispatch(fetchProductInfo())
    }
  }, [dispatch, productInfo])

  useEffect(() => {
    if (updateSuccess) {
      setOpen(false)
      dispatch(clearProductInfoUpdateSuccess())
    }
  }, [updateSuccess, dispatch])

  const handleSave = (updatedGuide: ProductGuideItem[]) => {
    const guidesWithoutId = updatedGuide.map(({ _id, ...guide }) => guide)
    dispatch(updateProductGuides(guidesWithoutId))
  }

  const getLoanTypeClass = (type: string) => {
    if (type.includes("Term Loan")) return "term-loan"
    if (type.includes("Overdraft")) return "overdraft"
    return ""
  }

  if (loading) {
    return (
      <StyledCard>
        <HeaderBox>
          <Box display="flex" alignItems="center" gap={2}>
            <TrendingUpIcon sx={{ fontSize: 28, color: "primary.main" }} />
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Product Guide
            </Typography>
          </Box>
        </HeaderBox>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography>Loading...</Typography>
        </CardContent>
      </StyledCard>
    )
  }

  const guide = productInfo?.guides || []

  return (
    <StyledCard>
      <HeaderBox>
        <Box display="flex" alignItems="center" gap={2}>
          <TrendingUpIcon sx={{ fontSize: 28, color: "primary.main" }} />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Product Guide
          </Typography>
        </Box>
        {isAdmin && (
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
            }}
          >
            <EditIcon />
          </IconButton>
        )}
      </HeaderBox>

      <CardContent sx={{ p: 0 }}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Loan Type</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Processing Fees</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Tenure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guide.map((product, idx) => (
              <TableRow key={product._id || idx}>
                <TableCell>
                  <LoanTypeChip label={product.type} className={getLoanTypeClass(product.type)} />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} color="primary">
                    {product.interestRate}
                  </Typography>
                </TableCell>
                <TableCell>{product.processingFees}</TableCell>
                <TableCell>
                  <Typography fontWeight={600} color="success.main">
                    {product.loanAmount}
                  </Typography>
                </TableCell>
                <TableCell>{product.tenure}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </CardContent>

      {isAdmin && (
        <EditProductGuideDialog
          open={open}
          onClose={() => setOpen(false)}
          data={guide}
          onSave={handleSave}
          loading={updateLoading}
        />
      )}
    </StyledCard>
  )
}

export default ProductGuide
