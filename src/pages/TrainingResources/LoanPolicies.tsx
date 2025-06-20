"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
  Paper,
  useTheme,
  alpha,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"
import PolicyIcon from "@mui/icons-material/Policy"
import CalculateIcon from "@mui/icons-material/Calculate"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EditEligibilityDialog from "./EditEligibilityDialog"
import EditCalculationDialog from "./EditCalculationDialog"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: `1px solid ${theme.palette.divider}`,
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(3, 0, 2, 0),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}))

const LoanCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  height: "100%",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
    transition: "all 0.3s ease",
  },
}))

const LoanTypeHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.spacing(0.5),
  textAlign: "center",
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: theme.spacing(0.5),
  },
}))

const initialPolicies = {
  eligibilityCriteria: {
    "PL -- Term Loan": ["Net Salary: 15000+", "Age: 21-59 Years", "CIBIL: 650+", "Work Experience: 3+ Months"],
    "PL -- Overdraft": ["Net Salary: 25000+", "Age: 21-59 Years", "CIBIL: 690+", "Work Experience: 6+ Months"],
    "BL -- Term Loan": [
      "Minimum Turnover: 30 Lakhs",
      "Age: 23-65 Years",
      "CIBIL: 650+",
      "Vintage: 6+ Months",
      "Average Balance: 30,000+",
    ],
    "BL -- Overdraft": [
      "Minimum Turnover: 80 Lakhs+",
      "Age: 23-65 Years",
      "CIBIL: 690+",
      "Vintage: 2+ Years",
      "Average Balance: 1 Lakh+",
    ],
    "SEP -- Term Loan": ["Age: 23-59 Years", "CIBIL: 680+", "Professional Certificate: 6+ Months old"],
    "SEP -- Overdraft": ["Net Salary: 15000+", "Age: 21-59 Years", "CIBIL: 650+", "Work Experience: 3+ Months"],
  },
  eligibilityCalculation: {
    "PL -- Term Loan": [
      "Loan amount from one lender is mostly 10-30 times of net salary.",
      "After loan, monthly obligations to be not more than 75% of net salary.",
      "Existing Loans and Card dues can be clubbed to create a single loan.",
      "Applicant working in top Corporates/Govt have higher chances of approval.",
    ],
    "PL -- Overdraft": [
      "OD amount from one lender is usually 10-20 times of net salary.",
      "Monthly obligations not more than 75% of net salary.",
      "Preferred for top corporate/Govt employees.",
    ],
    "BL -- Term Loan": [
      "Loan Amount is usually up to 10x Avg. Bank Balance.",
      "10 Cr Turnover → 40–50L loan possible.",
      "1 Cr Turnover → ~70K EMI possible.",
      "Higher loan = better interest & charges.",
    ],
    "BL -- Overdraft": [
      "OD usually 7–10x Avg. Bank Balance.",
      "10 Cr Turnover → 30–40L OD possible.",
      "Higher OD = better terms.",
    ],
    "SEP -- Term Loan": [
      "Older certificate = higher loan eligibility.",
      "High annual receipts (5 Cr+) → 50L+ loan possible.",
    ],
    "SEP -- Overdraft": ["Older certificate = more OD eligibility.", "Receipts of 5 Cr+ → 50L+ OD possible."],
  },
}

const LoanPolicies: React.FC = () => {
  const [policies, setPolicies] = useState(initialPolicies)
  const [openEligibility, setOpenEligibility] = useState(false)
  const [openCalculation, setOpenCalculation] = useState(false)
  const theme = useTheme()

  return (
    <StyledCard>
      <HeaderBox>
        <Box display="flex" alignItems="center" gap={2}>
          <PolicyIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Loan Policies
          </Typography>
        </Box>
      </HeaderBox>

      <CardContent sx={{ p: 3 }}>
        {/* Eligibility Criteria */}
        <SectionHeader>
          <Box display="flex" alignItems="center" gap={2}>
            <CheckCircleIcon />
            <Typography variant="h6" fontWeight={600}>
              Eligibility Criteria
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenEligibility(true)}
            sx={{
              color: "white",
              background: alpha("#fff", 0.2),
              "&:hover": { background: alpha("#fff", 0.3) },
            }}
          >
            <EditIcon />
          </IconButton>
        </SectionHeader>

        <Grid container spacing={3}>
          {Object.entries(policies.eligibilityCriteria).map(([type, points]) => (
            <Grid item xs={12} md={6} lg={4} key={type}>
              <LoanCard>
                <LoanTypeHeader variant="subtitle1">{type}</LoanTypeHeader>
                <List dense>
                  {points.map((point, idx) => (
                    <StyledListItem key={idx}>
                      <CheckCircleIcon sx={{ color: "success.main", mr: 1, fontSize: 16 }} />
                      <ListItemText
                        primary={point}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      />
                    </StyledListItem>
                  ))}
                </List>
              </LoanCard>
            </Grid>
          ))}
        </Grid>

        {/* Eligibility Calculation */}
        <SectionHeader sx={{ mt: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <CalculateIcon />
            <Typography variant="h6" fontWeight={600}>
              Eligibility Calculation
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenCalculation(true)}
            sx={{
              color: "white",
              background: alpha("#fff", 0.2),
              "&:hover": { background: alpha("#fff", 0.3) },
            }}
          >
            <EditIcon />
          </IconButton>
        </SectionHeader>

        <Grid container spacing={3}>
          {Object.entries(policies.eligibilityCalculation).map(([type, points]) => (
            <Grid item xs={12} md={6} lg={4} key={type}>
              <LoanCard>
                <LoanTypeHeader variant="subtitle1">{type}</LoanTypeHeader>
                <List dense>
                  {points.map((point, idx) => (
                    <StyledListItem key={idx}>
                      <CalculateIcon sx={{ color: "primary.main", mr: 1, fontSize: 16 }} />
                      <ListItemText
                        primary={point}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      />
                    </StyledListItem>
                  ))}
                </List>
              </LoanCard>
            </Grid>
          ))}
        </Grid>

        {/* Dialogs */}
        <EditEligibilityDialog
          open={openEligibility}
          onClose={() => setOpenEligibility(false)}
          data={policies.eligibilityCriteria}
          onSave={(newCriteria) => setPolicies((prev) => ({ ...prev, eligibilityCriteria: newCriteria }))}
        />

        <EditCalculationDialog
          open={openCalculation}
          onClose={() => setOpenCalculation(false)}
          data={policies.eligibilityCalculation}
          onSave={(newCalc) => setPolicies((prev) => ({ ...prev, eligibilityCalculation: newCalc }))}
        />
      </CardContent>
    </StyledCard>
  )
}

export default LoanPolicies
