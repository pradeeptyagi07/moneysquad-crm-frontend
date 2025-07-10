// src/components/PartnerOverview.tsx
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  fetchFunnelData,
  fetchSnapshotData,
  fetchRejectionReasonCount,
  fetchMatrix,
} from "../../store/slices/dashboardSlice";
import PerformanceMetrics from "./components/PerformanceMetrics";
import FunnelChart from "./components/FunnelChart";
import RejectionReasonsChart from "./components/RejectionReasonChart";
import SnapshotCards from "./components/SnapshotCards";
import TrendsChart from "./components/TrendsChart";
import GlobalFilters from "./components/GlobalFilters";

function computePeriod(month: string): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = now.getMonth() + 1;
  const pad2 = (n: number) => n.toString().padStart(2, "0");

  if (month === "last") {
    const lastMonth = mm === 1 ? 12 : mm - 1;
    const yearOfLast = mm === 1 ? yyyy - 1 : yyyy;
    return `${yearOfLast}-${pad2(lastMonth)}`;
  }
  return `${yyyy}-${pad2(mm)}`;
}

const PartnerOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [loanType, setLoanType]       = useState("all");
  const [associateId, setAssociateId] = useState("all");
  const [month, setMonth]             = useState("current");

  useEffect(() => {
    const params: any = {};
    if (loanType !== "all")    params.loanType    = loanType;
    if (associateId !== "all") params.associateId = associateId;
    if (month !== "current")   params.period      = computePeriod(month);

    dispatch(fetchFunnelData(params));
    dispatch(fetchSnapshotData(params));
    dispatch(fetchRejectionReasonCount(params));
    dispatch(fetchMatrix(params));
  }, [loanType, associateId, month, dispatch]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <GlobalFilters
          loanType={loanType}
          onLoanTypeChange={setLoanType}
          associateId={associateId}
          onAssociateChange={setAssociateId}
          month={month}
          onMonthChange={setMonth}
        />
      </Grid>

      <Grid item xs={12}>
        <SnapshotCards />
      </Grid>

      <Grid item xs={12} lg={6}>
        <TrendsChart loanType={loanType} associateId={associateId} />
      </Grid>
      <Grid item xs={12} lg={6}>
        <PerformanceMetrics />
      </Grid>

      <Grid item xs={12} lg={6}>
        <FunnelChart />
      </Grid>
      <Grid item xs={12} lg={6}>
        <RejectionReasonsChart />
      </Grid>
    </Grid>
  );
};

export default PartnerOverview;
