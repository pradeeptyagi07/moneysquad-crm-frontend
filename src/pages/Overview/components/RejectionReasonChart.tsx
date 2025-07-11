// src/components/dashboard/components/RejectionReasonsChart.tsx

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  Grid,
  Typography,
  alpha,
  LinearProgress,
  styled,
  linearProgressClasses,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import type { RejectionReasonCount } from '../../../store/slices/dashboardSlice';
import type { RootState } from '../../../store';

const makeProgress = (bg: string) =>
  styled(LinearProgress)(() => `
    height: 6px;
    border-radius: 8px;
    &.${linearProgressClasses.colorPrimary} {
      background-color: ${alpha(bg, 0.3)};
    }
    & .${linearProgressClasses.bar} {
      border-radius: 8px;
      background-color: ${bg};
    }
  `);

const colors = [
  '#5569FF',
  '#FF1943',
  '#FFA319',
  '#57CA22',
  '#9333ea',
  '#06b6d4',
  '#374151',
];

const defaultReasons = [
  'Bad CIBIL Score / DPDs',
  'Recent EMI Bounces',
  'Past Settlement History',
  'Scorecard Reject',
  'Overleverage / Not eligible',
  'Hunter/Fraud Reject',
];

const MAX_ITEMS = 6;

const RejectionReasonsChart: React.FC = () => {
  const {
    rejectionReasonCount: rrObj,
    rejectionLoading,
    rejectionError,
  } = useSelector((state: RootState) => state.dashboard);

  const rawData: RejectionReasonCount[] = rrObj?.rejectionReasonCount ?? [];
  const totalCount: number = rrObj?.totalCount ?? 0;

  if (rejectionLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (rejectionError) {
    return <Alert severity="error">{rejectionError}</Alert>;
  }

  let displayData: RejectionReasonCount[];
  if (rawData.length >= MAX_ITEMS) {
    displayData = rawData.slice(0, MAX_ITEMS);
  } else {
    const numDefaults = MAX_ITEMS - rawData.length;
    const zeroDefaults = defaultReasons
      .slice(0, numDefaults)
      .map(r => ({ reason: r, count: 0, percent: 0 } as RejectionReasonCount));
    displayData = [...rawData, ...zeroDefaults];
  }

  const maxCount = Math.max(...displayData.map(d => d.count), 1);

  const chartOptions: ApexOptions = {
    chart: { background: 'transparent', toolbar: { show: false }, zoom: { enabled: false } },
    plotOptions: { bar: { horizontal: false, borderRadius: 10, columnWidth: '40%' } },
    colors,
    stroke: { show: true, width: 2, colors: ['transparent'] },
    legend: { show: true },
    xaxis: {
      categories: displayData.map(d => d.reason),
      labels: {
        rotate: -45,
        rotateAlways: true,
        offsetX: 25,
        style: { colors: '#64748b', fontSize: '11px', fontWeight: 500 },
      },
      axisTicks: { show: false },
      axisBorder: { show: true },
    },
    dataLabels: { enabled: true },
    grid: {
      strokeDashArray: 3,
      borderColor: '#f1f5f9',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    yaxis: { show: true, min: 0, max: maxCount },
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: (val, opts) => {
          const idx = opts.dataPointIndex;
          const pct = displayData[idx]?.percent ?? 0;
          return `${val} cases (${pct}%)`;
        },
      },
    },
  };

  const series = [{ name: 'Count', data: displayData.map(d => d.count) }];

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <CardHeader
        sx={{ p: 3, pb: 3.5 }}
        title={
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1e293b">
              Rejection Reasons
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current month breakdown
            </Typography>
          </Box>
        }
        action={
          // Use a Chip for clearer total display
          <Chip
            label={`Total: ${totalCount}`}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        }
      />
      <Divider sx={{ borderColor: '#f3f4f6' }} />
      <CardContent sx={{ p: 2, pt: 5 }}>
        <Box mb={3}>
          <Chart options={chartOptions} series={series} type="bar" height={280} />
        </Box>
        <Grid container spacing={2}>
          {displayData.map((item, i) => {
            const Progress = makeProgress(colors[i % colors.length]);
            const pct = (item.count / maxCount) * 100;
            return (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box mb={2}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    mb={1}
                    noWrap
                    title={item.reason}
                  >
                    {item.reason}
                  </Typography>
                  <Progress variant="determinate" value={pct} />
                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      {item.count} cases
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      {item.percent}%
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
