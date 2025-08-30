"use client"

// src/components/components/TrendsChart.tsx
import type React from "react"
import { useEffect, useState } from "react"
import { Card, Box, Typography, Button, ButtonGroup, Alert } from "@mui/material"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { useAuth } from "../../../hooks/useAuth"
import { useDispatch, useSelector } from "react-redux"
import { fetchTrends } from "../../../store/slices/dashboardSlice"
import type { RootState, AppDispatch } from "../../../store"

interface Props {
  loanType: string
  associateId: string
}

const TrendsChart: React.FC<Props> = ({ loanType, associateId }) => {
  const { userRole } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const { trends, trendsLoading, trendsError } = useSelector((state: RootState) => state.dashboard)

  const [selectedPeriod, setSelectedPeriod] = useState<"3M" | "6M" | "12M">("6M")
  const periods = ["3M", "6M", "12M"] as const

  const periodToMonths = (p: (typeof periods)[number]) => Number.parseInt(p.replace("M", ""), 10)

  useEffect(() => {
    const params: any = { trendMonths: periodToMonths(selectedPeriod) }
    if (loanType !== "all") params.loanType = loanType
    if (associateId !== "all") params.associateId = associateId
    dispatch(fetchTrends(params))
  }, [dispatch, loanType, associateId, selectedPeriod])

  if (trendsError) return <Alert severity="error">{trendsError}</Alert>
  if (!trends || trends.length === 0) return null

  // "YYYY-MM" -> "Mon YYYY"
  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Convert rupees -> ₹ Lakh (1 Lakh = 100,000)
  const toLakh = (amountInRupees: number) => Number(((amountInRupees || 0) / 100_000).toFixed(2))

  // Build series (amount in ₹ Lakh)
  const series: { name: string; data: number[] }[] = [
    {
      name: "Active Leads",
      data: trends.map((d) => d.activeLead),
    },
    {
      name: "Disbursals",
      data: trends.map((d) => d.totalDisbursed),
    },
    {
      name: "Disbursed Amount (₹ Lakh)",
      data: trends.map((d) => toLakh(d.totalDisbursedsumLoanAmounts)),
    },
  ]

  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: { horizontal: false, borderRadius: 5, columnWidth: "65%" },
    },
    colors: ["#5569FF", "#FF1943", "#57CA22"],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      fontWeight: 600,
      labels: { colors: "#64748b" },
      markers: { width: 12, height: 12, radius: 3 },
      itemMargin: { horizontal: 20, vertical: 5 },
    },
    xaxis: {
      categories: trends.map((d) => formatMonth(d.month)),
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontWeight: 500 },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    // Single y-axis representing counts and ₹ Lakh (keeps layout intact)
    yaxis: {
      show: true,
      labels: {
        style: { colors: "#64748b", fontSize: "11px", fontWeight: 500 },
        // Large values abbreviated for readability; applies to all series uniformly
        formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : `${val}`),
      },
      title: { text: "Count / ₹ Lakh", style: { color: "#64748b", fontSize: "12px", fontWeight: 600 } },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "#f1f5f9",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    tooltip: {
      enabled: true,
      theme: "light",
      x: {
        formatter: (_val, opts) => formatMonth(trends[opts.dataPointIndex].month),
      },
      y: {
        formatter: (val, opts) => {
          if (opts.seriesIndex === 0) return `${Number(val).toLocaleString()} active leads`
          if (opts.seriesIndex === 1) return `${Number(val).toLocaleString()} disbursals`
          // seriesIndex === 2 → already in Lakh
          return `₹${Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 })} Lakh`
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: { bar: { columnWidth: "80%" } },
          legend: { position: "bottom", horizontalAlign: "center" },
          xaxis: {
            labels: { rotate: -90, style: { fontSize: "10px" } },
          },
        },
      },
    ],
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b" mb={0.5}>
            Performance Trends
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monthly performance overview
          </Typography>
        </Box>
        <ButtonGroup
          variant="outlined"
          size="small"
          sx={{
            "& .MuiButton-root": {
              borderColor: "#e5e7eb",
              color: "#6b7280",
              fontWeight: 600,
              borderRadius: "8px",
              px: 2.5,
              py: 0.75,
              fontSize: "0.8rem",
              "&.selected": {
                backgroundColor: "#5569FF",
                color: "#fff",
                borderColor: "#5569FF",
              },
            },
          }}
        >
          {(["3M", "6M", "12M"] as const).map((p) => (
            <Button key={p} onClick={() => setSelectedPeriod(p)} className={selectedPeriod === p ? "selected" : ""}>
              {p}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box sx={{ p: 3, pt: 2 }}>
        <Chart options={chartOptions} series={series} type="bar" height={340} />
      </Box>
    </Card>
  )
}

export default TrendsChart
