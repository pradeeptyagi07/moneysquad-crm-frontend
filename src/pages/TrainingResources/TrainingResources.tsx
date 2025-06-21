"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store"
import { fetchProductInfo } from "../../store/slices/resourceAndSupportSlice"
import { Container, Grid, Typography, Box, Fade } from "@mui/material"
import { styled } from "@mui/material/styles"
import ProductGuide from "./ProductGuide"
import LoanPolicies from "./LoanPolicies"
import DocumentsList from "./DocumentsList"
import Disclaimer from "./Disclaimer"
import SchoolIcon from "@mui/icons-material/School"

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: theme.spacing(3),
  color: "white",
  boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
}))

const SectionWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& > *": {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    },
  },
}))

const TrainingResourcesTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProductInfo())
  }, [dispatch])

  return (
    <StyledContainer maxWidth="xl">
      <Fade in timeout={800}>
        <HeaderSection>
          <SchoolIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Training Resources
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: "auto" }}>
            Comprehensive guide for loan products, policies, and documentation requirements
          </Typography>
        </HeaderSection>
      </Fade>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Fade in timeout={1000}>
            <SectionWrapper>
              <ProductGuide />
            </SectionWrapper>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in timeout={1200}>
            <SectionWrapper>
              <LoanPolicies />
            </SectionWrapper>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in timeout={1400}>
            <SectionWrapper>
              <DocumentsList />
            </SectionWrapper>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in timeout={1600}>
            <SectionWrapper>
              <Disclaimer />
            </SectionWrapper>
          </Fade>
        </Grid>
      </Grid>
    </StyledContainer>
  )
}

export default TrainingResourcesTab
