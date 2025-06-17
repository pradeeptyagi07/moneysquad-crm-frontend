import React from "react";
import { Container, Grid } from "@mui/material";
import ProductGuide from "./ProductGuide";
import LoanPolicies from "./LoanPolicies";
import DocumentsList from "./DocumentsList";
import Disclaimer from "./Disclaimer";

const TrainingResourcesTab: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProductGuide />
        </Grid>
        <Grid item xs={12}>
          <LoanPolicies />
        </Grid>
       
        <Grid item xs={12}>
          <DocumentsList />
        </Grid>
        <Grid item xs={12}>
          <Disclaimer />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrainingResourcesTab;
