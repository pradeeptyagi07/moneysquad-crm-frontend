"use client"

import type React from "react"
import { Box, Card, Typography, styled } from "@mui/material"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  padding: 20,
  background: "linear-gradient(135deg, #fff 0%, #f8fafc 100%)",
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
}))

interface AdminDisbursalTrendProps {
  loanTypes?: string[]
  partnerNames?: string[]
  dateRange?: { from: Date | null; to: Date | null }
}

const AdminDisbursalTrend: React.FC<AdminDisbursalTrendProps> = ({ loanTypes = [], partnerNames = [], dateRange }) => {
  // Mock data for last 6 months
  const mockData = [
    { month: "Jul", amount: 2800000, count: 85 },
    { month: "Aug", amount: 3200000, count: 92 },
    { month: "Sep", amount: 2900000, count: 78 },
    { month: "Oct", amount: 3800000, count: 105 },
    { month: "Nov", amount: 4200000, count: 118 },
    { month: "Dec", amount: 3900000, count: 95 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={1}>
            {label} 2024
          </Typography>
          <Typography variant="body2" color="#6b7280">
            Count: {formatNumber(data.count)} leads
          </Typography>
          <Typography variant="body2" color="#6b7280">
            Amount: {formatCurrency(data.amount)}
          </Typography>
        </Box>
      )
    }
    return null
  }

  const currentCount = mockData[mockData.length - 1].count
  const previousCount = mockData[mockData.length - 2].count
  const trendPercentage = (((currentCount - previousCount) / previousCount) * 100).toFixed(1)
  const isPositiveTrend = Number.parseFloat(trendPercentage) > 0

  const totalCount = mockData.reduce((sum, item) => sum + item.count, 0)
  const totalAmount = mockData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <StyledCard>
      <Box mb={3}>
        <Typography variant="h6" fontWeight={700} color="#374151" mb={0.5}>
          📈 Disbursal Trends
        </Typography>
        <Typography variant="body2" color="text.secondary">
          6-month performance trajectory
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#FF6B35"
              strokeWidth={3}
              fill="url(#colorGradient)"
              dot={{ fill: "#FF6B35", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#FF6B35", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </StyledCard>
  )
}

export default AdminDisbursalTrend
