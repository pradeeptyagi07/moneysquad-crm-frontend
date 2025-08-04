"use client"

import type React from "react"
import { Box, Card, Typography, LinearProgress, styled, linearProgressClasses, alpha, Chip } from "@mui/material"
import { TrendingDown } from "@mui/icons-material"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  overflow: "hidden",
  height: "100%",
}))

const FunnelStageCard = styled(Box)<{ stageColor: string }>(({ stageColor }) => ({
  backgroundColor: "#fff",
  borderRadius: 8,
  padding: 12,
  border: "1px solid #f1f5f9",
  position: "relative",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 4px 15px ${stageColor}20`,
    borderColor: stageColor,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: stageColor,
    borderRadius: "8px 8px 0 0",
  },
}))

const LinearProgressStyled = styled(LinearProgress)<{ stageColor: string }>(({ stageColor }) => ({
  height: 6,
  borderRadius: 6,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: alpha(stageColor, 0.15),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 6,
    backgroundColor: stageColor,
  },
}))

interface FunnelStage {
  name: string
  count: number
  amount: number
  conversionRate: number
  dropOffRate: number
  color: string
}

const mockFunnelData: FunnelStage[] = [
  {
    name: "Leads Submitted",
    count: 2450,
    amount: 245000000,
    conversionRate: 100,
    dropOffRate: 0,
    color: "#3b82f6",
  },
  {
    name: "Leads Login",
    count: 1960,
    amount: 196000000,
    conversionRate: 80,
    dropOffRate: 20,
    color: "#8b5cf6",
  },
  {
    name: "Leads Approved",
    count: 1372,
    amount: 137200000,
    conversionRate: 70,
    dropOffRate: 30,
    color: "#10b981",
  },
  {
    name: "Leads Disbursed",
    count: 987,
    amount: 98700000,
    conversionRate: 72,
    dropOffRate: 28,
    color: "#f59e0b",
  },
]

const AdminLoanFunnel: React.FC = () => {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(0)}L`
    }
    return `₹${amount.toLocaleString()}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <StyledCard>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #f3f4f6" }}>
        <Typography variant="h6" fontWeight={700} color="#1e293b">
          📊 Loan Funnel & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
          Conversion funnel with date filters
        </Typography>
      </Box>

      {/* Funnel Stages */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {mockFunnelData.map((stage, index) => (
            <FunnelStageCard key={index} stageColor={stage.color}>
              <Box display="flex" alignItems="center" justifyContent="between" mb={1}>
                <Box display="flex" alignItems="center" gap={1.5} flex={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: stage.color,
                      boxShadow: `0 2px 6px ${stage.color}40`,
                    }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={600} color="#1e293b" fontSize="0.9rem">
                      {stage.name}
                    </Typography>
                  </Box>
                </Box>

                <Box textAlign="right">
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="h6" fontWeight={700} color={stage.color} fontSize="1.1rem">
                      {formatNumber(stage.count)}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#64748b" fontSize="0.85rem">
                      {formatCurrency(stage.amount)}
                    </Typography>
                  </Box>
                  {index > 0 && (
                    <Chip
                      icon={<TrendingDown sx={{ fontSize: 12 }} />}
                      label={`${stage.dropOffRate}% drop-off`}
                      size="small"
                      sx={{
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "0.7rem",
                        height: 20,
                      }}
                    />
                  )}
                </Box>
              </Box>

              <LinearProgressStyled variant="determinate" value={stage.conversionRate} stageColor={stage.color} />

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                <Typography variant="body2" color="text.secondary" fontSize="0.7rem">
                  Conversion Rate
                </Typography>
                <Typography variant="body2" fontWeight={600} color={stage.color} fontSize="0.75rem">
                  {stage.conversionRate}%
                </Typography>
              </Box>
            </FunnelStageCard>
          ))}
        </Box>
      </Box>
    </StyledCard>
  )
}

export default AdminLoanFunnel
