import React, { useState } from 'react';
import { Box, Card, Typography, Button, ButtonGroup } from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { trendsData } from '../data/dashboardData';
import { useAuth } from '../../../hooks/useAuth';

const TrendsChart: React.FC = () => {
  const { userRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('6M');

  const periods = ['3M', '6M', '12M'];

  // Get data based on selected period
  const getPeriodData = () => {
    switch (selectedPeriod) {
      case '3M':
        return {
          months: trendsData.months.slice(-3),
          leadsAdded: trendsData.leadsAdded.slice(-3),
          disbursals: trendsData.disbursals.slice(-3),
          payouts: trendsData.payouts.slice(-3)
        };
      case '12M':
        // Extended data for 12 months
        return {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          leadsAdded: [980, 1050, 1120, 1280, 1450, 1380, 1520, 1680, 1750, 1620, 1580, 1720],
          disbursals: [145, 158, 165, 198, 245, 220, 268, 295, 310, 285, 275, 320],
          payouts: [72500, 79000, 82400, 99200, 122500, 110000, 134000, 147500, 155000, 142500, 137500, 160000]
        };
      default: // 6M
        return {
          months: trendsData.months,
          leadsAdded: trendsData.leadsAdded,
          disbursals: trendsData.disbursals,
          payouts: trendsData.payouts
        };
    }
  };

  const currentData = getPeriodData();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      type: 'bar',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '65%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: [
      '#5569FF',  // Blue for Leads Added
      '#FF1943',  // Red for Disbursals
      '#57CA22'   // Green for Payouts (if partner)
    ],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 600,
      labels: {
        colors: '#64748b'
      },
      markers: {
        width: 12,
        height: 12,
        radius: 3
      },
      itemMargin: {
        horizontal: 20,
        vertical: 5
      }
    },
    xaxis: {
      categories: currentData.months,
      labels: {
        show: true,
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 500
        },
        formatter: function (val) {
          if (val >= 1000) {
            return (val / 1000).toFixed(0) + 'K';
          }
          return val.toString();
        }
      },
      title: {
        text: 'Count',
        style: {
          color: '#64748b',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    grid: {
      strokeDashArray: 3,
      borderColor: '#f1f5f9',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px'
      },
      x: {
        show: true,
        formatter: function (val, opts) {
          return currentData.months[opts.dataPointIndex];
        }
      },
      y: {
        formatter: function (val, opts) {
          const seriesName = opts.series[opts.seriesIndex][opts.dataPointIndex];
          if (opts.seriesIndex === 0) {
            return `${val.toLocaleString()} leads added`;
          } else if (opts.seriesIndex === 1) {
            return `${val.toLocaleString()} disbursals`;
          } else if (opts.seriesIndex === 2) {
            return `₹${(val / 1000).toFixed(0)}K payouts`;
          }
          return val.toString();
        }
      },
      marker: {
        show: true
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '80%'
            }
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center'
          }
        }
      }
    ]
  };

  const getChartData = () => {
    const series = [
      {
        name: 'Leads Added',
        data: currentData.leadsAdded
      },
      {
        name: 'Disbursals',
        data: currentData.disbursals
      }
    ];

    if (userRole === 'partner') {
      series.push({
        name: 'Payouts (₹K)',
        data: currentData.payouts.map(p => Math.round(p / 1000))
      });
    }

    return series;
  };

  return (
    <Card
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f3f4f6'
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              fontSize: '1.25rem',
              mb: 0.5
            }}
          >
            Performance Trends
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: '0.875rem'
            }}
          >
            Monthly performance overview
          </Typography>
        </Box>

        <ButtonGroup
          variant="outlined"
          size="small"
          sx={{
            '& .MuiButton-root': {
              borderColor: '#e5e7eb',
              color: '#6b7280',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              py: 0.75,
              fontSize: '0.8rem',
              minWidth: '50px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: '#5569FF',
                backgroundColor: '#5569FF10',
                color: '#5569FF'
              },
              '&.selected': {
                backgroundColor: '#5569FF',
                color: '#fff',
                borderColor: '#5569FF',
                boxShadow: '0 2px 4px #5569FF40',
                '&:hover': {
                  backgroundColor: '#4c5fd9',
                  borderColor: '#4c5fd9'
                }
              }
            }
          }}
        >
          {periods.map((period) => (
            <Button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'selected' : ''}
            >
              {period}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box sx={{ p: 3, pt: 2 }}>
        <Chart
          options={chartOptions}
          series={getChartData()}
          type="bar"
          height={340}
        />
      </Box>
    </Card>
  );
};

export default TrendsChart;