import type React from "react"
import { Box, Typography, Grid, Card, CardContent } from "@mui/material"
import { TrendingUp, People, CheckCircle, Info } from "@mui/icons-material"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import MetricCard from "../../components/common/MetricCard"
import PerformanceMetric from "../../components/common/PerformanceMetric"
import ActivityItem from "../../components/common/ActivityItem"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [30, 45, 35, 50, 40, 60],
      borderColor: "#2563eb",
      tension: 0.4,
    },
  ],
}

const PartnerOverview: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Partner Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Leads"
            value="1,234"
            subValue="+12.5% from last month"
            icon={<People />}
            iconBg="#2563eb"
            targetValue="1,500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value="32%"
            subValue="+5.2% from last month"
            icon={<TrendingUp />}
            iconBg="#10b981"
            targetValue="40%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value="₹12.5L"
            subValue="+18.2% from last month"
            icon={<Info />}
            iconBg="#f59e0b"
            targetValue="₹15L"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Success Rate"
            value="85%"
            subValue="+2.4% from last month"
            icon={<CheckCircle />}
            iconBg="#ef4444"
            targetValue="90%"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Trend
              </Typography>
              <Line options={chartOptions} data={chartData} height={80} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Metrics
              </Typography>
              <PerformanceMetric label="Lead Quality" value="85/100" color="#2563eb" progress={85} />
              <PerformanceMetric label="Response Time" value="92/100" color="#10b981" progress={92} />
              <PerformanceMetric label="Customer Satisfaction" value="88/100" color="#f59e0b" progress={88} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activities
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ActivityItem
                    icon={<CheckCircle />}
                    iconBg="#10b981"
                    title="New Lead Converted"
                    description="Rahul Sharma approved for ₹5L personal loan"
                    time="2 hours ago"
                  />
                  <ActivityItem
                    icon={<People />}
                    iconBg="#2563eb"
                    title="New Lead Added"
                    description="Priya Patel requesting home loan"
                    time="4 hours ago"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ActivityItem
                    icon={<Info />}
                    iconBg="#f59e0b"
                    title="Commission Earned"
                    description="₹25,000 credited for loan #12345"
                    time="1 day ago"
                  />
                  <ActivityItem
                    icon={<TrendingUp />}
                    iconBg="#ef4444"
                    title="Performance Update"
                    description="Monthly target achieved"
                    time="2 days ago"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PartnerOverview
