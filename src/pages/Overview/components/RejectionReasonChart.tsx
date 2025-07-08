import React from 'react';
import {
  CardContent,
  Box,
  CardHeader,
  Card,
  Grid,
  Typography,
  alpha,
  LinearProgress,
  Divider,
  styled,
  linearProgressClasses
} from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { rejectionReasonsData } from '../data/dashboardData';

const LinearProgressPrimary = styled(LinearProgress)(
  () => `
        height: 6px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#5569FF', 0.3)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #5569FF;
        }
    `
);

const LinearProgressError = styled(LinearProgress)(
  () => `
        height: 6px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#FF1943', 0.3)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #FF1943;
        }
    `
);

const LinearProgressWarning = styled(LinearProgress)(
  () => `
        height: 6px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#FFA319', 0.3)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #FFA319;
        }
    `
);

const LinearProgressSuccess = styled(LinearProgress)(
  () => `
        height: 6px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#57CA22', 0.3)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #57CA22;
        }
    `
);

const LinearProgressSecondary = styled(LinearProgress)(
  () => `
        height: 6px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#9333ea', 0.3)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #9333ea;
        }
    `
);

const LinearProgressInfo = styled(LinearProgress)(
  () => `
        height: 6px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#06b6d4', 0.3)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #06b6d4;
        }
    `
);

const LinearProgressDark = styled(LinearProgress)(
  () => `
        height: 6px;
        border-radius: 8px;

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha('#374151', 0.3)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: 8px;
            background-color: #374151;
        }
    `
);

const RejectionReasonsChart: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '60%'
      }
    },
    colors: [
      '#5569FF',
      '#FF1943', 
      '#57CA22',
      '#FFA319',
      '#9333ea',
      '#06b6d4',
      '#374151'
    ],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: rejectionReasonsData.map(item => item.reason.split(' ')[0]), // First word only
      labels: {
        show: true,
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 500
        }
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
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
      }
    },
    yaxis: {
      show: false,
      min: 0,
      max: Math.max(...rejectionReasonsData.map(item => item.count)) * 1.1
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val: number, opts: any) {
          const dataIndex = opts.dataPointIndex;
          const percentage = rejectionReasonsData[dataIndex]?.percentage || 0;
          return `${val} cases (${percentage}%)`;
        }
      }
    }
  };

  const chartData = [
    {
      name: 'Rejection Count',
      data: rejectionReasonsData.map(item => item.count)
    }
  ];

  const getProgressComponent = (index: number) => {
    const components = [
      LinearProgressPrimary,
      LinearProgressError,
      LinearProgressWarning,
      LinearProgressSuccess,
      LinearProgressSecondary,
      LinearProgressInfo,
      LinearProgressDark
    ];
    return components[index % components.length];
  };

  const maxCount = Math.max(...rejectionReasonsData.map(item => item.count));

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
      <CardHeader
        sx={{
          p: 3,
          pb: 2
        }}
        title={
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
              Rejection Reasons
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.875rem'
              }}
            >
              Current month breakdown
            </Typography>
          </Box>
        }
      />
      <Divider sx={{ borderColor: '#f3f4f6' }} />
      <CardContent
        sx={{
          p: 2,
          pt: 3
        }}
      >
        <Box
          sx={{
            mb: 3
          }}
        >
          <Chart
            options={chartOptions}
            series={chartData}
            type="bar"
            height={280}
          />
        </Box>
        
        <Grid container spacing={2}>
          {rejectionReasonsData.map((item, index) => {
            const ProgressComponent = getProgressComponent(index);
            const progressValue = (item.count / maxCount) * 100;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    component="div"
                    color="text.primary"
                    variant="body2"
                    sx={{
                      pb: 1,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: '#374151'
                    }}
                  >
                    {item.reason}
                  </Typography>
                  <ProgressComponent variant="determinate" value={progressValue} />
                  <Box
                    display="flex"
                    sx={{
                      mt: 0.5
                    }}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography 
                      component="div" 
                      variant="caption"
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      {item.count} cases
                    </Typography>
                    <Typography 
                      component="div" 
                      variant="caption"
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      {item.percentage}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RejectionReasonsChart;