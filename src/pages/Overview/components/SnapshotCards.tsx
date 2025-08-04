"use client"

import React from "react"
import CountUp from "react-countup"
import { useSelector } from "react-redux"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  Skeleton,
} from "@mui/material"
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  People,
  CheckCircle,
  Cancel,
  AttachMoney,
} from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import type { RootState } from "../../../store"

type SnapshotRaw = {
  totalDisbursal: {
    current_month_amount: number
    previous_month_amount: number
    delta_percentage: number
  }
  leadAdded: {
    leads_added: number
    unique_lead?: number // keep optional in case shape varies
  }
  activeLeads?: {
    totalActiveLeads?: number
    uniqueCount?: number
  }
  approvalStatus: {
    current_month_amount: number
    previous_month_amount: number
    delta_percentage: number
  }
  commissionEarned: {
    current_month_amount: number
    previous_month_amount: number
    delta_percentage: number
  }
  rejectionRation: {
    rejection_ratio_this_month: number
    rejection_ratio_prev_month: number
    delta_percentage: number
  }
}

interface CardDef {
  title: string
  rawValue: number
  previousValue?: string
  delta: number | null
  icon: React.ReactElement
  primaryColor: string
  lightColor: string
  iconBg: string
  gradientFrom: string
  gradientTo: string
  isPercentage: boolean
  isCurrency: boolean
  subtitle?: string
}

const SnapshotCards: React.FC = () => {
  const { userRole } = useAuth()
  const { snapshot, snapshotLoading, snapshotError } = useSelector(
    (state: RootState) => state.dashboard
  ) as { snapshot: SnapshotRaw | null; snapshotLoading: boolean; snapshotError: string | null }

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
    return `₹${amount.toLocaleString()}`
  }

  if (snapshotLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns:
            userRole === "admin"
              ? "repeat(5, minmax(0, 1fr))"
              : "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {Array.from({ length: 5 }).map((_, idx) => (
          <Card
            key={idx}
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: 4,
              overflow: "hidden",
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-4px)" },
              bgcolor: "background.paper",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={56}
                  height={56}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  width={80}
                  height={24}
                />
              </Box>
              <Skeleton
                animation="wave"
                variant="rectangular"
                height={32}
                sx={{ mb: 1, borderRadius: 1 }}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width="80%"
                height={32}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width="40%"
                height={20}
              />
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={60}
                  height={28}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    )
  }

  if (snapshotError) {
    return (
      <Alert severity="error" sx={{ fontSize: "1rem" }}>
        {snapshotError}
      </Alert>
    )
  }

  if (!snapshot) return null

  const buildLeadsSubtitle = () => {
    const uniqueLead = snapshot.leadAdded?.unique_lead ?? 0
    const activeLeads = snapshot.activeLeads?.totalActiveLeads ?? 0
    const activeUnique = snapshot.activeLeads?.uniqueCount ?? 0

    // Always show both pieces, even if zero, for clarity
    return `${uniqueLead} unique • ${activeLeads} active${activeUnique ? ` (${activeUnique} unique)` : activeUnique === 0 ? " (0 unique)" : ""}`
  }

  const baseCards: CardDef[] = [
    {
      title: "Total Disbursal",
      rawValue: snapshot.totalDisbursal?.current_month_amount ?? 0,
      previousValue: formatCurrency(
        snapshot.totalDisbursal?.previous_month_amount ?? 0
      ),
      delta: snapshot.totalDisbursal?.delta_percentage ?? 0,
      icon: <AccountBalance />,
      primaryColor: "#2563eb",
      lightColor: "#dbeafe",
      iconBg: "#eff6ff",
      gradientFrom: "#2563eb",
      gradientTo: "#1d4ed8",
      isPercentage: false,
      isCurrency: true,
    },
    {
      title: "Leads Added",
      rawValue: snapshot.leadAdded?.leads_added ?? 0,
      subtitle: buildLeadsSubtitle(),
      delta: null,
      icon: <People />,
      primaryColor: "#16a34a",
      lightColor: "#d1fae5",
      iconBg: "#ecfdf5",
      gradientFrom: "#16a34a",
      gradientTo: "#15803d",
      isPercentage: false,
      isCurrency: false,
    },
    {
      title: "Current Approval",
      rawValue: snapshot.approvalStatus?.current_month_amount ?? 0,
      previousValue: formatCurrency(
        snapshot.approvalStatus?.previous_month_amount ?? 0
      ),
      delta: snapshot.approvalStatus?.delta_percentage ?? 0,
      icon: <CheckCircle />,
      primaryColor: "#9333ea",
      lightColor: "#e9d5ff",
      iconBg: "#f3e8ff",
      gradientFrom: "#9333ea",
      gradientTo: "#7c3aed",
      isPercentage: false,
      isCurrency: true,
    },
  ]

  const partnerCard: CardDef = {
    title: "Commission Payable",
    rawValue: snapshot.commissionEarned?.current_month_amount ?? 0,
    previousValue: formatCurrency(
      snapshot.commissionEarned?.previous_month_amount ?? 0
    ),
    delta: snapshot.commissionEarned?.delta_percentage ?? 0,
    icon: <AttachMoney />,
    primaryColor: "#ea580c",
    lightColor: "#fed7aa",
    iconBg: "#fff7ed",
    gradientFrom: "#ea580c",
    gradientTo: "#dc2626",
    isPercentage: false,
    isCurrency: true,
  }

  const rejectionCard: CardDef = {
    title: "Rejection Rate",
    rawValue: snapshot.rejectionRation?.rejection_ratio_this_month ?? 0,
    previousValue: `${snapshot.rejectionRation?.rejection_ratio_prev_month ?? 0}%`,
    delta: snapshot.rejectionRation?.delta_percentage ?? 0,
    icon: <Cancel />,
    primaryColor: "#dc2626",
    lightColor: "#fecaca",
    iconBg: "#fef2f2",
    gradientFrom: "#dc2626",
    gradientTo: "#b91c1c",
    isPercentage: true,
    isCurrency: false,
  }

  const cards: CardDef[] = [...baseCards]
  if (userRole === "partner") {
    cards.push(partnerCard)
  } else if (userRole === "admin") {
    cards.push(partnerCard, rejectionCard)
  } else {
    cards.push(rejectionCard)
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns:
          userRole === "admin"
            ? "repeat(5, minmax(0, 1fr))"
            : "repeat(auto-fit, minmax(240px, 1fr))",
      }}
    >
      {cards.map((card, idx) => (
        <Card
          key={idx}
          sx={{
            height: "100%",
            borderRadius: 1.5,
            overflow: "hidden",
            position: "relative",
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
              borderColor: card.title,
              "& .bg-graphic": {
                transform: "scale(1.1) rotate(5deg)",
                opacity: 0.25,
              },
            },
          }}
        >
          <Box
            className="bg-graphic"
            sx={{
              position: "absolute",
              bottom: -30,
              right: -30,
              width: 180,
              height: 140,
              opacity: 0.15,
              pointerEvents: "none",
              transition: "all 0.4s ease",
              transform: "rotate(-10deg)",
            }}
          >
            <svg width="180" height="140" viewBox="0 0 180 140">
              <defs>
                <linearGradient
                  id={`grad-${idx}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={card.gradientFrom} />
                  <stop offset="100%" stopColor={card.gradientTo} />
                </linearGradient>
                <pattern
                  id={`dots-${idx}`}
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="2"
                    fill={card.primaryColor}
                    opacity="0.3"
                  />
                </pattern>
              </defs>

              {idx === 0 && (
                <>
                  <rect
                    x="40"
                    y="20"
                    width="30"
                    height="60"
                    fill={`url(#grad-${idx})`}
                    rx="4"
                  />
                  <rect
                    x="80"
                    y="35"
                    width="30"
                    height="45"
                    fill={`url(#grad-${idx})`}
                    rx="4"
                    opacity="0.8"
                  />
                  <rect
                    x="120"
                    y="50"
                    width="30"
                    height="30"
                    fill={`url(#grad-${idx})`}
                    rx="4"
                    opacity="0.6"
                  />
                </>
              )}

              {idx === 1 && (
                <>
                  <circle
                    cx="60"
                    cy="40"
                    r="20"
                    fill={`url(#grad-${idx})`}
                    opacity="0.8"
                  />
                  <circle
                    cx="100"
                    cy="60"
                    r="15"
                    fill={`url(#grad-${idx})`}
                    opacity="0.6"
                  />
                  <circle
                    cx="130"
                    cy="30"
                    r="12"
                    fill={`url(#grad-${idx})`}
                    opacity="0.7"
                  />
                  <circle
                    cx="40"
                    cy="80"
                    r="18"
                    fill={`url(#grad-${idx})`}
                    opacity="0.5"
                  />
                  <path
                    d="M60,40 Q80,50 100,60 M100,60 Q115,45 130,30 M60,40 Q50,60 40,80"
                    stroke={card.primaryColor}
                    strokeWidth="3"
                    fill="none"
                    opacity="0.4"
                  />
                </>
              )}

              {idx === 2 && (
                <path
                  d="M30,60 L60,90 L120,30"
                  stroke={`url(#grad-${idx})`}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
              )}

              {idx === 3 &&
                card.isCurrency &&
                (userRole === "partner" || userRole === "admin") && (
                  <>
                    <path
                      d="M20,100 Q60,60 100,80 Q140,40 180,60"
                      stroke={`url(#grad-${idx})`}
                      strokeWidth="8"
                      fill="none"
                      opacity="0.7"
                    />
                    <path
                      d="M30,110 Q70,70 110,90 Q150,50 190,70"
                      stroke={`url(#grad-${idx})`}
                      strokeWidth="6"
                      fill="none"
                      opacity="0.5"
                    />
                    <polygon
                      points="160,45 180,60 160,75"
                      fill={`url(#grad-${idx})`}
                      opacity="0.8"
                    />
                  </>
                )}

              {idx === 3 &&
                !card.isCurrency &&
                userRole !== "partner" &&
                userRole !== "admin" && (
                  <>
                    <path
                      d="M40,40 L120,120 M120,40 L40,120"
                      stroke={`url(#grad-${idx})`}
                      strokeWidth="10"
                      opacity="0.6"
                    />
                    <path
                      d="M60,20 L140,100 M140,20 L60,100"
                      stroke={`url(#grad-${idx})`}
                      strokeWidth="6"
                      opacity="0.4"
                    />
                  </>
                )}

              <rect
                x="0"
                y="120"
                width="180"
                height="20"
                fill={`url(#dots-${idx})`}
                opacity="0.3"
              />
            </svg>
          </Box>

          <CardContent sx={{ p: 2, position: "relative", zIndex: 1 }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${card.lightColor}`,
                  position: "relative",
                  boxShadow: `0 4px 12px ${card.primaryColor}20`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${card.primaryColor}20, ${card.primaryColor}10)`,
                    zIndex: 0,
                  },
                }}
              >
                {React.cloneElement(card.icon, {
                  sx: {
                    fontSize: 32,
                    color: card.primaryColor,
                    position: "relative",
                    zIndex: 1,
                  },
                })}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#6b7280",
                  fontSize: "1rem",
                }}
              >
                {card.title}
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#111827",
                mb: 2,
                fontSize: "2.5rem",
              }}
            >
              {card.isPercentage ? (
                <CountUp
                  start={0}
                  end={card.rawValue}
                  duration={1.5}
                  suffix="%"
                />
              ) : card.isCurrency ? (
                <CountUp
                  start={0}
                  end={card.rawValue}
                  duration={1.5}
                  formattingFn={(n) => formatCurrency(Math.round(n))}
                />
              ) : (
                <CountUp start={0} end={card.rawValue} duration={1.5} />
              )}
            </Typography>

            {card.previousValue && (
              <Typography
                variant="body1"
                sx={{ color: "#9ca3af", mb: 1, fontSize: "1rem" }}
              >
                Previous: {card.previousValue}
              </Typography>
            )}

            {card.subtitle && (
              <Typography
                variant="body1"
                sx={{ color: "#6b7280", mb: 1, fontSize: "1rem" }}
              >
                {card.subtitle}
              </Typography>
            )}

            {card.delta !== null && (
              <Chip
                icon={
                  card.delta >= 0 ? (
                    <TrendingUp fontSize="small" />
                  ) : (
                    <TrendingDown fontSize="small" />
                  )
                }
                label={`${card.delta >= 0 ? "+" : ""}${card.delta.toFixed(1)}%`}
                size="small"
                sx={{
                  fontSize: "1rem",
                  px: 1,
                  py: 0,
                  backgroundColor: card.delta >= 0 ? "#f0fdf4" : "#fef2f2",
                  color: card.delta >= 0 ? "#166534" : "#dc2626",
                  fontWeight: 700,
                }}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default SnapshotCards
