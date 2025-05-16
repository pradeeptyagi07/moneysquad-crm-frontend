"use client"

import type React from "react"
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material"
import { People, PersonAdd, TrendingUp, TrendingDown, CheckCircle, Block } from "@mui/icons-material"
import type { Partner } from "../types/partnerTypes"

interface PartnerStatsProps {
  partners: Partner[]
}

const PartnerStats: React.FC<PartnerStatsProps> = ({ partners }) => {
  const theme = useTheme()

  // Calculate statistics
  const totalPartners = partners.length
  const activePartners = partners.filter((partner) => partner.status === "active").length
  const inactivePartners = totalPartners - activePartners
  const activePercentage = totalPartners > 0 ? (activePartners / totalPartners) * 100 : 0

  // Get new partners in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const newPartners = partners.filter((partner) => new Date(partner.joinedOn) >= thirtyDaysAgo).length

  // Calculate trend (mock data for demonstration)
  const previousActivePercentage = 65 // This would come from historical data in a real app
  const trend = activePercentage - previousActivePercentage

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
        border: "1px solid",
        borderColor: `${color}20`,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 8px 24px ${color}15`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  )

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Partners" value={totalPartners} icon={<People />} color={theme.palette.primary.main} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="New Partners"
          value={newPartners}
          subtitle="Last 30 days"
          icon={<PersonAdd />}
          color={theme.palette.info.main}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Partners"
          value={`${activePartners} (${activePercentage.toFixed(0)}%)`}
          icon={<CheckCircle />}
          color={theme.palette.success.main}
          subtitle={
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              {trend > 0 ? (
                <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
              ) : (
                <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
              )}
              <Typography variant="caption" color={trend > 0 ? "success.main" : "error.main"} sx={{ fontWeight: 600 }}>
                {Math.abs(trend).toFixed(1)}% {trend > 0 ? "increase" : "decrease"}
              </Typography>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Inactive Partners"
          value={inactivePartners}
          icon={<Block />}
          color={theme.palette.text.secondary}
        />
      </Grid>
    </Grid>
  )
}

export default PartnerStats
