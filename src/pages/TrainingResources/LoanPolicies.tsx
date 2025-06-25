"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../store"
import {
  fetchProductInfo,
  updateProductPolicies,
  selectProductInfo,
  selectProductInfoLoading,
  selectProductInfoUpdateLoading,
  selectProductInfoUpdateSuccess,
  clearProductInfoUpdateSuccess,
} from "../../store/slices/resourceAndSupportSlice"
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
import { useAuth } from "../../hooks/useAuth"

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

const LoanPolicies: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const productInfo = useSelector(selectProductInfo)
  const loading = useSelector(selectProductInfoLoading)
  const updateLoading = useSelector(selectProductInfoUpdateLoading)
  const updateSuccess = useSelector(selectProductInfoUpdateSuccess)

  const { userRole } = useAuth() // ✅ Use context
  const isAdmin = userRole === "admin" || userRole === "superadmin"

  const [openEligibility, setOpenEligibility] = useState(false)
  const [openCalculation, setOpenCalculation] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    if (!productInfo) {
      dispatch(fetchProductInfo())
    }
  }, [dispatch, productInfo])

  useEffect(() => {
    if (updateSuccess) {
      setOpenEligibility(false)
      setOpenCalculation(false)
      dispatch(clearProductInfoUpdateSuccess())
    }
  }, [updateSuccess, dispatch])

  const handleSaveEligibility = (newCriteria: Record<string, string[]>) => {
    if (productInfo?.policies) {
      dispatch(
        updateProductPolicies({
          ...productInfo.policies,
          eligibilityCriteria: newCriteria,
        })
      )
    }
  }

  const handleSaveCalculation = (newCalc: Record<string, string[]>) => {
    if (productInfo?.policies) {
      dispatch(
        updateProductPolicies({
          ...productInfo.policies,
          eligibilityCalculation: newCalc,
        })
      )
    }
  }

  if (loading) {
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
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography>Loading...</Typography>
        </CardContent>
      </StyledCard>
    )
  }

  const policies = productInfo?.policies || {
    eligibilityCriteria: {},
    eligibilityCalculation: {},
  }

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
          {isAdmin && (
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
          )}
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
          {isAdmin && (
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
          )}
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

        {/* Dialogs - only render for admin */}
        {isAdmin && (
          <>
            <EditEligibilityDialog
              open={openEligibility}
              onClose={() => setOpenEligibility(false)}
              data={policies.eligibilityCriteria}
              onSave={handleSaveEligibility}
              loading={updateLoading}
            />

            <EditCalculationDialog
              open={openCalculation}
              onClose={() => setOpenCalculation(false)}
              data={policies.eligibilityCalculation}
              onSave={handleSaveCalculation}
              loading={updateLoading}
            />
          </>
        )}
      </CardContent>
    </StyledCard>
  )
}

export default LoanPolicies
