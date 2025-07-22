"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Card, Typography, Avatar, styled } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { LocationOn } from "@mui/icons-material"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  padding: 24,
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
  border: "none",
  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15)",
  overflow: "visible",
  position: "relative",
  minHeight: 400,
  display: "flex",
  flexDirection: "column",
}))

const TopPerformerBadge = styled(Box)({
  position: "absolute",
  top: -8,
  right: 16,
  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
  color: "#000",
  padding: "6px 16px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: 700,
  boxShadow: "0 4px 12px rgba(251, 191, 36, 0.4)",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  gap: "4px",
})

const PerformerAvatar = styled(Avatar)({
  width: 80,
  height: 80,
  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#000",
  boxShadow: "0 8px 24px rgba(251, 191, 36, 0.3)",
  marginBottom: "16px",
})

const MetricsGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "auto",
})

const MetricCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "16px 12px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.15)",
    transform: "translateY(-2px)",
  },
})

const NavigationDots = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  marginTop: "16px",
})

const Dot = styled(motion.div)<{ active: boolean }>(({ active }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: active ? "#fbbf24" : "rgba(255, 255, 255, 0.4)",
  cursor: "pointer",
}))

interface AdminTopPerformersProps {
  loanTypes?: string[]
  partnerNames?: string[]
  dateRange?: { from: Date | null; to: Date | null }
}

const AdminTopPerformers: React.FC<AdminTopPerformersProps> = ({ loanTypes = [], partnerNames = [], dateRange }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  // Mock data matching the design
  const topPerformers = [
    {
      id: 1,
      name: "Amit Patel",
      partnerId: "#P003",
      location: "Ahmedabad, Gujarat",
      disbursedAmount: 8600000,
      disbursedCount: 32,
      commissionEarned: 86000,
      currentApproved: 5,
      avatar: "AP",
      rank: 1,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      partnerId: "#P001",
      location: "Mumbai, Maharashtra",
      disbursedAmount: 12500000,
      disbursedCount: 45,
      commissionEarned: 125000,
      currentApproved: 8,
      avatar: "RK",
      rank: 2,
    },
    {
      id: 3,
      name: "Priya Sharma",
      partnerId: "#P002",
      location: "Delhi, NCR",
      disbursedAmount: 9800000,
      disbursedCount: 38,
      commissionEarned: 98000,
      currentApproved: 6,
      avatar: "PS",
      rank: 3,
    },
  ]

  useEffect(() => {
    if (!isAutoRotating) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topPerformers.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoRotating, topPerformers.length])

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(0)},00,000`
    }
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

  const currentPerformer = topPerformers[currentIndex]

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setIsAutoRotating(false)
    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsAutoRotating(true), 10000)
  }

  return (
    <StyledCard>
      <TopPerformerBadge>⭐ TOP PERFORMER</TopPerformerBadge>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          color="#fff"
          sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}
        >
          🏆 Leading Partners
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.8)">
          This month's champions
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPerformer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              flex: 1,
            }}
          >
            <PerformerAvatar>{currentPerformer.avatar}</PerformerAvatar>

            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h5" fontWeight={700} color="#fff" sx={{ mb: 0.5 }}>
                {currentPerformer.name}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.9)" sx={{ mb: 1 }}>
                {currentPerformer.partnerId}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                <LocationOn sx={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }} />
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  {currentPerformer.location}
                </Typography>
              </Box>
            </Box>

            <MetricsGrid sx={{ width: "100%" }}>
              <MetricCard>
                <Typography variant="h6" fontWeight={700} color="#fff" sx={{ mb: 0.5 }}>
                  {formatCurrency(currentPerformer.disbursedAmount)}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  Disbursed Amount
                </Typography>
              </MetricCard>

              <MetricCard>
                <Typography variant="h6" fontWeight={700} color="#fff" sx={{ mb: 0.5 }}>
                  {formatNumber(currentPerformer.disbursedCount)}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  Disbursed Count
                </Typography>
              </MetricCard>

              <MetricCard>
                <Typography variant="h6" fontWeight={700} color="#fff" sx={{ mb: 0.5 }}>
                  {formatCurrency(currentPerformer.commissionEarned)}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  Commission Earned
                </Typography>
              </MetricCard>

              <MetricCard>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#fff"
                  sx={{ mb: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}
                >
                  {currentPerformer.currentApproved}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#fbbf24",
                    }}
                  />
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  Current Approved
                </Typography>
              </MetricCard>
            </MetricsGrid>
          </motion.div>
        </AnimatePresence>
      </Box>

      <NavigationDots>
        {topPerformers.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </NavigationDots>
    </StyledCard>
  )
}

export default AdminTopPerformers
