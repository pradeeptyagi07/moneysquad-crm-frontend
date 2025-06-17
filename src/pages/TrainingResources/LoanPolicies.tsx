import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditEligibilityDialog from "./EditEligibilityDialog";
import EditCalculationDialog from "./EditCalculationDialog";

const initialPolicies = {
  eligibilityCriteria: {
    "PL -- Term Loan": [
      "Net Salary: 15000+",
      "Age: 21-59 Years",
      "CIBIL: 650+",
      "Work Experience: 3+ Months",
    ],
    "PL -- Overdraft": [
      "Net Salary: 25000+",
      "Age: 21-59 Years",
      "CIBIL: 690+",
      "Work Experience: 6+ Months",
    ],
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
    "SEP -- Term Loan": [
      "Age: 23-59 Years",
      "CIBIL: 680+",
      "Professional Certificate: 6+ Months old",
    ],
    "SEP -- Overdraft": [
      "Net Salary: 15000+",
      "Age: 21-59 Years",
      "CIBIL: 650+",
      "Work Experience: 3+ Months",
    ],
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
    "SEP -- Overdraft": [
      "Older certificate = more OD eligibility.",
      "Receipts of 5 Cr+ → 50L+ OD possible.",
    ],
  },
};

const LoanPolicies: React.FC = () => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [openEligibility, setOpenEligibility] = useState(false);
  const [openCalculation, setOpenCalculation] = useState(false);

  return (
    <Card elevation={4} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Loan Policies
          </Typography>
        </Box>

        {/* Eligibility Criteria */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={600}>
              Eligibility Criteria
            </Typography>
            <IconButton onClick={() => setOpenEligibility(true)}>
              <EditIcon />
            </IconButton>
          </Box>
          {Object.entries(policies.eligibilityCriteria).map(([type, points]) => (
            <Box key={type} mt={2}>
              <Typography variant="body1" fontWeight={600}>
                {type}
              </Typography>
              <List dense>
                {points.map((point, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Eligibility Calculation */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={600}>
              Eligibility Calculation
            </Typography>
            <IconButton onClick={() => setOpenCalculation(true)}>
              <EditIcon />
            </IconButton>
          </Box>
          {Object.entries(policies.eligibilityCalculation).map(([type, points]) => (
            <Box key={type} mt={2}>
              <Typography variant="body1" fontWeight={600}>
                {type}
              </Typography>
              <List dense>
                {points.map((point, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Dialogs */}
        <EditEligibilityDialog
          open={openEligibility}
          onClose={() => setOpenEligibility(false)}
          data={policies.eligibilityCriteria}
          onSave={(newCriteria) =>
            setPolicies((prev) => ({ ...prev, eligibilityCriteria: newCriteria }))
          }
        />

        <EditCalculationDialog
          open={openCalculation}
          onClose={() => setOpenCalculation(false)}
          data={policies.eligibilityCalculation}
          onSave={(newCalc) =>
            setPolicies((prev) => ({ ...prev, eligibilityCalculation: newCalc }))
          }
        />
      </CardContent>
    </Card>
  );
};

export default LoanPolicies;
