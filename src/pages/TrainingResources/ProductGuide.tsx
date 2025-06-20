"use client"

import type React from "react"
import { useState } from "react"
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

interface Product {
  type: string
  interestRate: string
  processingFees: string
  loanAmount: string
  tenure: string
}

const initialGuide: Product[] = [
  {
    type: "PL -- Term Loan",
    interestRate: "10.5% - 18%",
    processingFees: "4999 - 1%",
    loanAmount: "₹1L - ₹1Cr",
    tenure: "1-8 years",
  },
  {
    type: "PL -- Overdraft",
    interestRate: "13.5% - 16%",
    processingFees: "1% - 2%",
    loanAmount: "₹1L - ₹1Cr",
    tenure: "1-8 years",
  },
  {
    type: "BL -- Term Loan",
    interestRate: "14% - 24%",
    processingFees: "1% - 2%",
    loanAmount: "₹5L - ₹5Cr",
    tenure: "1-5 years",
  },
  {
    type: "BL -- Overdraft",
    interestRate: "15% - 19%",
    processingFees: "1.5% - 2%",
    loanAmount: "₹10L - ₹3Cr",
    tenure: "1-5 years",
  },
  {
    type: "SEP -- Term Loan",
    interestRate: "10.5% - 14%",
    processingFees: "9999 - 2%",
    loanAmount: "₹5L - ₹3Cr",
    tenure: "1-5 years",
  },
  {
    type: "SEP -- Overdraft",
    interestRate: "11.5% - 15%",
    processingFees: "1% - 2%",
    loanAmount: "₹5L - ₹2Cr",
    tenure: "1-5 years",
  },
]

const ProductGuide: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [guide, setGuide] = useState<Product[]>(initialGuide)
  const theme = useTheme()

  const handleSave = (updatedGuide: Product[]) => {
    setGuide(updatedGuide)
  }

  const getLoanTypeClass = (type: string) => {
    if (type.includes("Term Loan")) return "term-loan"
    if (type.includes("Overdraft")) return "overdraft"
    return ""
  }

  return (
    <StyledCard>
      <HeaderBox>
        <Box display="flex" alignItems="center" gap={2}>
          <TrendingUpIcon sx={{ fontSize: 28, color: "primary.main" }} />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Product Guide
          </Typography>
        </Box>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            color: "primary.main",
            "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
          }}
        >
          <EditIcon />
        </IconButton>
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
              <TableRow key={idx}>
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

      <EditProductGuideDialog open={open} onClose={() => setOpen(false)} data={guide} onSave={handleSave} />
    </StyledCard>
  )
}

export default ProductGuide
