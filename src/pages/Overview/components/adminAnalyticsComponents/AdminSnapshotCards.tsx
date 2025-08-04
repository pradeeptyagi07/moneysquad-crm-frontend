"use client"

import type React from "react"
import { Box, Card, Typography, Chip, styled } from "@mui/material"
import { People, Assignment, CheckCircle, AccountBalance, TrendingUp, PieChart } from "@mui/icons-material"
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  padding: 0,
  background: "#ffffff",
  border: "1px solid rgba(226, 232, 240, 0.8)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)",
  },
  "&:hover": {
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  },
}))

const MetricsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  "@media (min-width: 768px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (min-width: 1024px)": {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  "@media (min-width: 1440px)": {
    gridTemplateColumns: "repeat(6, 1fr)",
  },
}))

const MetricSection = styled(Box)(({ theme }) => ({
  padding: "20px 16px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  minHeight: "120px",
  justifyContent: "center",
  transition: "all 0.2s ease",
  "&:not(:last-child)": {
    borderRight: "1px solid rgba(226, 232, 240, 0.6)",
    "@media (max-width: 767px)": {
      borderRight: "none",
      borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
    },
    "@media (min-width: 768px) and (max-width: 1023px)": {
      "&:nth-of-type(2n)": {
        borderRight: "none",
      },
    },
    "@media (min-width: 1024px) and (max-width: 1439px)": {
      "&:nth-of-type(3n)": {
        borderRight: "none",
      },
    },
  },
  "&:hover": {
    backgroundColor: "rgba(255, 107, 53, 0.02)",
  },
}))

const IconContainer = styled(Box)(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
  position: "absolute",
  top: 12,
  left: 12,
  opacity: 0.9,
}))

const AnimatedNumber = styled(Typography)<{ animate: boolean }>(({ theme, animate }) => ({
  fontWeight: 700,
  fontSize: "1.75rem",
  lineHeight: 1,
  color: "#1e293b",
  letterSpacing: "-0.02em",
  marginBottom: 6,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  transition: animate ? "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
  transform: animate ? "translateY(0)" : "translateY(10px)",
  opacity: animate ? 1 : 0,
}))

const MetricTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.8rem",
  color: "#64748b",
  marginBottom: 8,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  lineHeight: 1.2,
}))

const MetricSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: "#94a3b8",
  fontWeight: 400,
  marginTop: 4,
  lineHeight: 1.3,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
}))

const GrowthChip = styled(Chip)(({ theme }) => ({
  background: "#10b981",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "0.7rem",
  height: 22,
  marginTop: 8,
  "& .MuiChip-label": {
    padding: "0 8px",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
}))

const AmountText = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#FF6B35",
  marginTop: 4,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
}))

interface AdminSnapshotCardsProps {
  timeFilter?: string
  loanTypes?: string[]
  partnerNames?: string[]
  statuses?: string[]
  dateRange?: { from: Date | null; to: Date | null }
}

const AdminSnapshotCards: React.FC<AdminSnapshotCardsProps> = ({
  timeFilter = "month",
  loanTypes = [],
  partnerNames = [],
  statuses = [],
  dateRange,
}) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Mock data for admin dashboard
  const mockData = {
    totalPartners: { count: 247, growth: 12.5 },
    activePartners: { active: 189, inactive: 58 },
    totalLeads: { count: 3456, growth: 8.3 },
    approvedLeads: { total: 1234, unique: 1156, amount: 45600000 },
    disbursedLeads: { total: 987, unique: 945, amount: 38900000 },
    averageTicketSize: 39400,
  }

  const activeInactiveData = [
    { name: "Active", value: mockData.activePartners.active, color: "#10B981" },
    { name: "Inactive", value: mockData.activePartners.inactive, color: "#ef4444" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  const cardData = [
    {
      title: "Total Partners",
      value: formatNumber(mockData.totalPartners.count),
      growth: mockData.totalPartners.growth,
      icon: People,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Active Partners",
      value: mockData.activePartners.active,
      subtitle: `${mockData.activePartners.inactive} inactive`,
      icon: PieChart,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      showChart: true,
    },
    {
      title: "Total Leads",
      value: formatNumber(mockData.totalLeads.count),
      growth: mockData.totalLeads.growth,
      icon: Assignment,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Approved Leads",
      value: formatNumber(mockData.approvedLeads.total),
      subtitle: `${formatNumber(mockData.approvedLeads.unique)} unique applications`,
      amount: formatCurrency(mockData.approvedLeads.amount),
      icon: CheckCircle,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Disbursed Leads",
      value: formatNumber(mockData.disbursedLeads.total),
      subtitle: `${formatNumber(mockData.disbursedLeads.unique)} unique disbursals`,
      amount: formatCurrency(mockData.disbursedLeads.amount),
      icon: AccountBalance,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "Avg Ticket Size",
      value: formatCurrency(mockData.averageTicketSize),
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ]

  return (
    <Box sx={{ mb: 3 }}>
   
      <StyledCard>
        {/* Metrics Grid */}
        <MetricsGrid>
          {cardData.map((card, index) => (
            <MetricSection key={index}>
              <IconContainer sx={{ background: card.gradient }}>
                <card.icon sx={{ color: "#fff", fontSize: 14 }} />
              </IconContainer>

              <Box sx={{ pt: 2 }}>
                <MetricTitle>{card.title}</MetricTitle>

                {card.showChart ? (
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={0.5}>
                    <ResponsiveContainer width={24} height={24}>
                      <RechartsPieChart>
                        <RechartsPieChart data={activeInactiveData} cx={12} cy={12} innerRadius={6} outerRadius={11}>
                          {activeInactiveData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <AnimatedNumber animate={animate} sx={{ fontSize: "1.5rem" }}>
                      {card.value}
                    </AnimatedNumber>
                  </Box>
                ) : (
                  <AnimatedNumber animate={animate}>{card.value}</AnimatedNumber>
                )}

                {card.subtitle && <MetricSubtitle>{card.subtitle}</MetricSubtitle>}

                {card.amount && <AmountText>{card.amount}</AmountText>}

                {card.growth && <GrowthChip label={`↗ ${card.growth}%`} size="small" />}
              </Box>
            </MetricSection>
          ))}
        </MetricsGrid>
      </StyledCard>
    </Box>
  )
}

export default AdminSnapshotCards
