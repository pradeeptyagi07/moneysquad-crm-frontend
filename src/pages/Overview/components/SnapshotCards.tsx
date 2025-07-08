import React from 'react';
import CountUp from 'react-countup';
import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, People, CheckCircle, Cancel, AttachMoney } from '@mui/icons-material';
import { snapshotData } from '../data/dashboardData';
import { useAuth } from '../../../hooks/useAuth';

const SnapshotCards: React.FC = () => {
  const { userRole } = useAuth();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getCardData = () => {
    const baseCards = [
      {
        title: 'Total Disbursal',
        rawValue: snapshotData.totalDisbursal.current,
        previousValue: formatCurrency(snapshotData.totalDisbursal.previous),
        delta: snapshotData.totalDisbursal.deltaPercent,
        icon: <AccountBalance />,
        primaryColor: '#2563eb',
        lightColor: '#dbeafe',
        iconBg: '#eff6ff',
        gradientFrom: '#2563eb',
        gradientTo: '#1d4ed8',
        isPercentage: false,
      },
      {
        title: 'Active Leads',
        rawValue: snapshotData.activeLeads.count,
        subtitle: `${snapshotData.activeLeads.unique} unique`,
        delta: null,
        icon: <People />,
        primaryColor: '#16a34a',
        lightColor: '#d1fae5',
        iconBg: '#ecfdf5',
        gradientFrom: '#16a34a',
        gradientTo: '#15803d',
        isPercentage: false,
      },
      {
        title: 'Approval Rate',
        rawValue: snapshotData.approvalRate.currentPercent,
        previousValue: `${snapshotData.approvalRate.previousPercent}%`,
        delta: snapshotData.approvalRate.deltaPercent,
        icon: <CheckCircle />,
        primaryColor: '#9333ea',
        lightColor: '#e9d5ff',
        iconBg: '#f3e8ff',
        gradientFrom: '#9333ea',
        gradientTo: '#7c3aed',
        isPercentage: true,
      }
    ];

    if (userRole === 'partner') {
      baseCards.push({
        title: 'Commission Earned',
        rawValue: snapshotData.commissionEarned!.current,
        previousValue: formatCurrency(snapshotData.commissionEarned!.previous),
        delta: (snapshotData.commissionEarned!.deltaValue / snapshotData.commissionEarned!.previous) * 100,
        icon: <AttachMoney />,
        primaryColor: '#ea580c',
        lightColor: '#fed7aa',
        iconBg: '#fff7ed',
        gradientFrom: '#ea580c',
        gradientTo: '#dc2626',
        isPercentage: false,
      });
    } else {
      baseCards.push({
        title: 'Rejection Rate',
        rawValue: snapshotData.rejectionRate!.currentPercent,
        previousValue: `${snapshotData.rejectionRate!.previousPercent}%`,
        delta: snapshotData.rejectionRate!.deltaPercent,
        icon: <Cancel />,
        primaryColor: '#dc2626',
        lightColor: '#fecaca',
        iconBg: '#fef2f2',
        gradientFrom: '#dc2626',
        gradientTo: '#b91c1c',
        isPercentage: true,
      });
    }

    return baseCards;
  };

  const cards = getCardData();

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                borderColor: card.primaryColor,
                '& .bg-graphic': {
                  transform: 'scale(1.1) rotate(5deg)',
                  opacity: 0.25
                }
              }
            }}
          >
            {/* Prominent Background Graphic */}
            <Box
              className="bg-graphic"
              sx={{
                position: 'absolute',
                bottom: -30,
                right: -30,
                width: 180,
                height: 140,
                opacity: 0.15,
                pointerEvents: 'none',
                transition: 'all 0.4s ease-in-out',
                transform: 'rotate(-10deg)'
              }}
            >
              <svg
                width="180"
                height="140"
                viewBox="0 0 180 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`cardGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={card.gradientFrom} />
                    <stop offset="100%" stopColor={card.gradientTo} />
                  </linearGradient>
                  <pattern id={`dots-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill={card.primaryColor} opacity="0.3" />
                  </pattern>
                </defs>
                {index === 0 && (
                  <>
                    <rect x="40" y="20" width="30" height="60" fill={`url(#cardGradient-${index})`} rx="4" />
                    <rect x="80" y="35" width="30" height="45" fill={`url(#cardGradient-${index})`} rx="4" opacity="0.8" />
                    <rect x="120" y="50" width="30" height="30" fill={`url(#cardGradient-${index})`} rx="4" opacity="0.6" />
                    <rect x="0" y="100" width="180" height="40" fill={`url(#dots-${index})`} />
                  </>
                )}
                {index === 1 && (
                  <>
                    <circle cx="60" cy="40" r="20" fill={`url(#cardGradient-${index})`} opacity="0.8" />
                    <circle cx="100" cy="60" r="15" fill={`url(#cardGradient-${index})`} opacity="0.6" />
                    <circle cx="130" cy="30" r="12" fill={`url(#cardGradient-${index})`} opacity="0.7" />
                    <circle cx="40" cy="80" r="18" fill={`url(#cardGradient-${index})`} opacity="0.5" />
                    <path
                      d="M60,40 Q80,50 100,60 M100,60 Q115,45 130,30 M60,40 Q50,60 40,80"
                      stroke={card.primaryColor}
                      strokeWidth="3"
                      opacity="0.4"
                      fill="none"
                    />
                  </>
                )}
                {index === 2 && (
                  <>
                    <path
                      d="M30,60 L60,90 L120,30"
                      stroke={`url(#cardGradient-${index})`}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                    <path
                      d="M50,80 L80,110 L140,50"
                      stroke={`url(#cardGradient-${index})`}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.4"
                    />
                    <circle cx="150" cy="20" r="8" fill={`url(#cardGradient-${index})`} opacity="0.6" />
                    <circle cx="20" cy="100" r="12" fill={`url(#cardGradient-${index})`} opacity="0.5" />
                  </>
                )}
                {index === 3 && userRole === 'partner' && (
                  <>
                    <path
                      d="M20,100 Q60,60 100,80 Q140,40 180,60"
                      stroke={`url(#cardGradient-${index})`}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M30,110 Q70,70 110,90 Q150,50 190,70"
                      stroke={`url(#cardGradient-${index})`}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    <polygon points="160,45 180,60 160,75" fill={`url(#cardGradient-${index})`} opacity="0.8" />
                    <circle cx="40" cy="90" r="6" fill={`url(#cardGradient-${index})`} opacity="0.6" />
                    <circle cx="120" cy="70" r="8" fill={`url(#cardGradient-${index})`} opacity="0.5" />
                  </>
                )}
                {index === 3 && userRole !== 'partner' && (
                  <>
                    <path
                      d="M40,40 L120,120 M120,40 L40,120"
                      stroke={`url(#cardGradient-${index})`}
                      strokeWidth="10"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                    <path
                      d="M60,20 L140,100 M140,20 L60,100"
                      stroke={`url(#cardGradient-${index})`}
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                    <circle cx="30" cy="30" r="8" fill={`url(#cardGradient-${index})`} opacity="0.5" />
                    <circle cx="150" cy="110" r="10" fill={`url(#cardGradient-${index})`} opacity="0.4" />
                  </>
                )}
                <rect x="0" y="120" width="180" height="20" fill={`url(#dots-${index})`} opacity="0.3" />
              </svg>
            </Box>

            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    backgroundColor: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${card.lightColor}`,
                    position: 'relative',
                    boxShadow: `0 4px 12px ${card.primaryColor}20`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${card.primaryColor}20, ${card.primaryColor}10)`,
                      zIndex: 0
                    }
                  }}
                >
                  {React.cloneElement(card.icon, {
                    sx: {
                      fontSize: '1.75rem',
                      color: card.primaryColor,
                      position: 'relative',
                      zIndex: 1,
                      filter: 'brightness(1.2) saturate(1.4) contrast(1.1)',
                      fontWeight: 600
                    }
                  })}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: 1.3,
                    letterSpacing: '0.025em'
                  }}
                >
                  {card.title}
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#111827',
                  mb: 1.5,
                  fontSize: '2.25rem',
                  lineHeight: 1,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '-0.025em'
                }}
              >
                {card.isPercentage ? (
                  <CountUp start={0} end={card.rawValue} duration={1.5} suffix="%" />
                ) : (
                  <CountUp
                    start={0}
                    end={card.rawValue}
                    duration={1.5}
                    formattingFn={(n) => formatCurrency(Math.round(n))}
                  />
                )}
              </Typography>

              {card.previousValue && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    mb: 2.5,
                    fontWeight: 500
                  }}
                >
                  Previous: {card.previousValue}
                </Typography>
              )}

              {card.subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    mb: 2.5,
                    fontWeight: 500
                  }}
                >
                  {card.subtitle}
                </Typography>
              )}

              {card.delta !== null && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Chip
                    icon={card.delta >= 0 ? <TrendingUp sx={{ fontSize: '1.1rem' }} /> : <TrendingDown sx={{ fontSize: '1.1rem' }} />}
                    label={`${card.delta >= 0 ? '+' : ''}${card.delta.toFixed(1)}%`}
                    size="small"
                    sx={{
                      backgroundColor: card.delta >= 0 ? '#f0fdf4' : '#fef2f2',
                      color: card.delta >= 0 ? '#166534' : '#dc2626',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      height: '32px',
                      borderRadius: '8px',
                      border: `1px solid ${card.delta >= 0 ? '#bbf7d0' : '#fecaca'}`,
                      boxShadow: card.delta >= 0 ? '0 2px 4px #16653420' : '0 2px 4px #dc262620',
                      '& .MuiChip-icon': {
                        color: card.delta >= 0 ? '#166534' : '#dc2626',
                        fontSize: '1.1rem'
                      },
                      '& .MuiChip-label': {
                        px: 1.5,
                        fontWeight: 700
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SnapshotCards;
