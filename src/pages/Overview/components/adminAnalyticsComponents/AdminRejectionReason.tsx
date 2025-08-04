"use client"

import type React from "react"
import { Box, Card, Typography, Chip, styled } from "@mui/material"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  overflow: "hidden",
  height: "100%",
}))

interface RejectionReason {
  reason: string
  count: number
  percentage: number
  color: string
}

const mockRejectionData: RejectionReason[] = [
  { reason: "Bad CIBIL Score", count: 245, percentage: 28.5, color: "#ef4444" },
  { reason: "Recent EMI Bounces", count: 198, percentage: 23.1, color: "#f97316" },
  { reason: "Past Settlement", count: 156, percentage: 18.2, color: "#eab308" },
  { reason: "Scorecard Reject", count: 134, percentage: 15.6, color: "#22c55e" },
  { reason: "Overleverage", count: 89, percentage: 10.4, color: "#3b82f6" },
  { reason: "Hunter/Fraud", count: 67, percentage: 7.8, color: "#8b5cf6" },
  { reason: "Insufficient Income", count: 45, percentage: 5.2, color: "#06b6d4" },
  { reason: "Invalid Documents", count: 34, percentage: 4.0, color: "#84cc16" },
  { reason: "Employment Issues", count: 28, percentage: 3.3, color: "#f43f5e" },
  { reason: "Others", count: 64, percentage: 7.5, color: "#64748b" },
]

const AdminRejectionReasons: React.FC = () => {
  const totalRejections = mockRejectionData.reduce((sum, item) => sum + item.count, 0)

  // Chart configuration
  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        columnWidth: "70%",
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: mockRejectionData.map((item) => item.color),
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: mockRejectionData.map((item) => item.reason),
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          colors: "#64748b",
          fontSize: "11px",
          fontWeight: 500,
        },
        maxHeight: 100,
        offsetY: 10,
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "11px",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
        fontWeight: 600,
        colors: ["#fff"],
      },
      offsetY: -15,
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "#f1f5f9",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        bottom: 20,
      },
    },
    tooltip: {
      enabled: true,
      theme: "light",
      y: {
        formatter: (val, opts) => {
          const percentage = mockRejectionData[opts.dataPointIndex]?.percentage ?? 0
          return `${val} cases (${percentage}%)`
        },
      },
    },
    legend: { show: false },
  }

  const series = [
    {
      name: "Rejections",
      data: mockRejectionData.map((item) => item.count),
    },
  ]

  return (
    <StyledCard>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #f3f4f6" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={700} color="#1e293b">
              📊 Rejection Reasons
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
              Top 9 rejection reasons analysis
            </Typography>
          </Box>
          <Chip
            label={`Total: ${totalRejections.toLocaleString()}`}
            sx={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              fontWeight: 700,
              fontSize: "0.75rem",
              height: 24,
            }}
          />
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ p: 1, pb: 1}}>
        <Chart options={chartOptions} series={series} type="bar" height={410} />
      </Box>
    </StyledCard>
  )
}

export default AdminRejectionReasons
