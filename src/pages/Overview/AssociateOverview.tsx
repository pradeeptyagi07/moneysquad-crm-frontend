// src/pages/Overview/AssociateOverview.tsx
import React from "react";
import {  Grid } from "@mui/material";

import GlobalFilters from "./components/GlobalFilters";
import SnapshotCards from "./components/SnapshotCards";
import TrendsChart from "./components/TrendsChart";
import PerformanceMetrics from "./components/PerformanceMetrics";
import FunnelChart from "./components/FunnelChart";
import RejectionReasonsChart from "./components/RejectionReasonChart";


const AssociateOverview: React.FC = () => {


  return (
   <Grid container spacing={4}>
          {/* Global Filters */}
          <Grid item xs={12}>
            <GlobalFilters />
          </Grid>

          {/* Snapshot Cards */}
          <Grid item xs={12}>
            <SnapshotCards />
          </Grid>

          {/* Trends Chart and Performance Metrics Row - 50/50 Split */}
          <Grid item xs={12} lg={5.6}>
            <TrendsChart />
          </Grid>
          
          <Grid item xs={12} lg={6.4}>
            <PerformanceMetrics />
          </Grid>

          {/* Charts Row */}
          <Grid item xs={12} lg={6}>
            <FunnelChart />
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <RejectionReasonsChart />
          </Grid>
        </Grid>
  );
};

export default AssociateOverview;
