"use client";

// src/components/dashboard/components/PerformanceMetrics.tsx

import React, { useEffect, useState } from "react";
import { Box, Card, Typography, styled, Alert } from "@mui/material";
import {
  Timeline,
  Speed,
  AccountBalance,
  Adjust,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatrix } from "../../../store/slices/dashboardSlice";
import type { RootState, AppDispatch } from "../../../store";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced Counter Animation Hook with smooth transitions
const useCountUp = (end: number, duration = 2500, delay = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number;
      let animationFrame: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOutCubic * end));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, delay);
    return () => clearTimeout(timeout);
  }, [end, duration, delay]);
  return count;
};

// Premium Styled Card with enhanced gradients
const StyledCard = styled(Card)({
  borderRadius: 24,
  padding: 32,
  background:
    "linear-gradient(145deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 100%)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: `
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  overflow: "visible",
  position: "relative",
  minHeight: 480,
  display: "flex",
  flexDirection: "column",
  backdropFilter: "blur(20px)",
});

// Enhanced badge with premium styling
const MetricsBadge = styled(Box)({
  position: "absolute",
  top: -12,
  right: 24,
  background:
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
  color: "#fff",
  padding: "8px 20px",
  borderRadius: "24px",
  fontSize: "0.75rem",
  fontWeight: 700,
  boxShadow: `
    0 8px 25px rgba(99, 102, 241, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

// Always two columns
const MetricsGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "20px",
  marginTop: "auto",
  flex: 1,
  alignItems: "stretch",
});

// Premium metric block
const MetricBlock = styled(motion.div)({
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
  borderRadius: "20px",
  padding: "24px 20px",
  textAlign: "center",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: "180px",
  maxHeight: "180px",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 50%, transparent 100%)",
    opacity: 0,
    transition: "opacity 0.4s ease",
  },
  "&:hover": {
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    "&::before": { opacity: 1 },
  },
});

// Floating background for active
const FloatingMetric = styled(motion.div)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(145deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)",
  borderRadius: "20px",
  border: "1px solid rgba(99,102,241,0.3)",
  zIndex: -1,
});

const PerformanceMetrics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userRole } = useAuth();
  const { matrixError } = useSelector((s: RootState) => s.dashboard);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    dispatch(fetchMatrix());
  }, [dispatch]);

  const data = {
    disbursalRatePct: 11.8,
    disbursalRatePrevious: 12.0,
    disbursalRateDelta: -1.67,
    avgDisbursalTATdays: 5,
    avgDisbursalTATdaysPrevious: 6,
    avgDisbursalTATdaysDelta: -16.67,
    avgLoanAmount: 60833,
    avgLoanAmountPrevious: 55000,
    avgLoanAmountDelta: 10.61,
    targetAchievedPct: userRole === "partner" ? 85.5 : null,
    targetAchievedPrevious: userRole === "partner" ? 78.2 : null,
    targetAchievedDelta: userRole === "partner" ? 9.33 : null,
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e7) return `₹${(amount/1e7).toFixed(1)}Cr`;
    if (amount >= 1e5) return `₹${(amount/1e5).toFixed(1)}L`;
    if (amount >= 1e3) return `₹${(amount/1e3).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const metrics = [
    {
      id: 1, title: "Disbursal Rate", value: data.disbursalRatePct,
      previous: data.disbursalRatePrevious, delta: data.disbursalRateDelta,
      icon: <Timeline sx={{ fontSize: "2rem", color: "#6366f1" }} />, isAmount: false, color: "#6366f1",
    },
    {
      id: 2, title: "Avg. TAT Days", value: data.avgDisbursalTATdays,
      previous: data.avgDisbursalTATdaysPrevious, delta: data.avgDisbursalTATdaysDelta,
      icon: <Speed sx={{ fontSize: "2rem", color: "#10b981" }} />, isAmount: false, color: "#10b981",
    },
    {
      id: 3, title: "Avg. Loan Amount", value: data.avgLoanAmount,
      previous: data.avgLoanAmountPrevious, delta: data.avgLoanAmountDelta,
      icon: <AccountBalance sx={{ fontSize: "2rem", color: "#f59e0b" }} />, isAmount: true, color: "#f59e0b",
    },
  ];
  if (userRole === "partner" && data.targetAchievedPct != null) {
    metrics.push({
      id: 4, title: "Target Achieved", value: data.targetAchievedPct!,
      previous: data.targetAchievedPrevious!, delta: data.targetAchievedDelta!,
      icon: <Adjust sx={{ fontSize: "2rem", color: "#ec4899" }} />,
      isAmount: false, color: "#ec4899",
    });
  }

  useEffect(() => {
    if (!isAutoRotating) return;
    const iv = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % metrics.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [isAutoRotating, metrics.length]);

  if (matrixError) {
    return <Alert severity="error">{matrixError}</Alert>;
  }

  return (
    <StyledCard>
      <MetricsBadge>📊 Performance Metrics</MetricsBadge>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            mb: 1,
            background: "linear-gradient(135deg, #fff 0%, #e2e8f0 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          📈 Key Performance Indicators
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          Real-time insights and performance tracking
        </Typography>
      </Box>

      <MetricsGrid>
        <AnimatePresence>
          {metrics.map((m, idx) => {
            const val = useCountUp(m.value, 2000, idx * 300);
            const active = currentIndex === idx;

            const card = (
              <MetricBlock
                key={m.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: active ? 1.05 : 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                  delay: idx * 0.1,
                }}
                whileHover={{ scale: 1.08 }}
                onMouseEnter={() => setIsAutoRotating(false)}
                onMouseLeave={() => setIsAutoRotating(true)}
                style={{ position: "relative" }}
              >
                {active && (
                  <FloatingMetric
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <Box sx={{ mb: 2, zIndex: 1 }}>{m.icon}</Box>
                <Typography
                  variant="caption"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    zIndex: 1,
                  }}
                >
                  {m.title}
                </Typography>
                <Box sx={{ mb: 1.5, zIndex: 1 }}>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ color: "#fff", textShadow: `0 0 20px ${m.color}40` }}
                  >
                    {m.isAmount ? formatCurrency(val) : val}
                    {!m.isAmount && m.title.includes("Rate") ? "%" : ""}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ mb: 1.5, color: "rgba(255,255,255,0.6)", zIndex: 1 }}
                >
                  Previous:{" "}
                  {m.isAmount ? formatCurrency(m.previous) : m.previous}
                  {!m.isAmount && m.title.includes("Rate") ? "%" : ""}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    px: 2,
                    py: 0.75,
                    borderRadius: "12px",
                    backgroundColor:
                      m.delta >= 0
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(239,68,68,0.15)",
                    border: `1.5px solid ${
                      m.delta >= 0
                        ? "rgba(16,185,129,0.3)"
                        : "rgba(239,68,68,0.3)"
                    }`,
                    backdropFilter: "blur(10px)",
                    zIndex: 1,
                  }}
                >
                  {m.delta >= 0 ? (
                    <TrendingUp sx={{ fontSize: "1rem", color: "#10b981" }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: "1rem", color: "#ef4444" }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: m.delta >= 0 ? "#10b981" : "#ef4444",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    {m.delta >= 0 ? "+" : ""}
                    {m.delta.toFixed(1)}%
                  </Typography>
                </Box>
              </MetricBlock>
            );

            // span full width when only 3 metrics and on the 3rd
            if (userRole !== "partner" && metrics.length === 3 && idx === 2) {
              return (
                <Box key={m.id} sx={{ gridColumn: "1 / -1", width: "100%" }}>
                  {card}
                </Box>
              );
            }

            return card;
          })}
        </AnimatePresence>
      </MetricsGrid>
    </StyledCard>
  );
};

export default PerformanceMetrics;
