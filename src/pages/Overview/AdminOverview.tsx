import type React from "react"
import { Box, Typography, Grid, Card, CardContent, Paper } from "@mui/material"
import { TrendingUp, People, CheckCircle, Info, SupervisorAccount } from "@mui/icons-material"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import MetricCard from "../../components/common/MetricCard"
import PerformanceMetric from "../../components/common/PerformanceMetric"
import ActivityItem from "../../components/common/ActivityItem"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const lineChartOptions = {
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

const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [50000, 75000, 60000, 90000, 80000, 120000],
      borderColor: "#2563eb",
      tension: 0.4,
    },
  ],
}

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
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

const barChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "New Partners",
      data: [12, 19, 15, 25, 22, 30],
      backgroundColor: "#3b82f6",
    },
    {
      label: "Active Partners",
      data: [10, 15, 12, 20, 18, 25],
      backgroundColor: "#10b981",
    },
  ],
}

const AdminOverview: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Partners"
            value="245"
            subValue="+15% from last month"
            icon={<SupervisorAccount />}
            iconBg="#7c3aed"
            targetValue="300"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Leads"
            value="3,542"
            subValue="+12.5% from last month"
            icon={<People />}
            iconBg="#2563eb"
            targetValue="4,000"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value="₹45.8L"
            subValue="+18.2% from last month"
            icon={<Info />}
            iconBg="#f59e0b"
            targetValue="₹50L"
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

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Trend
              </Typography>
              <Line options={lineChartOptions} data={lineChartData} height={80} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Metrics
              </Typography>
              <PerformanceMetric label="Partner Acquisition" value="85/100" color="#7c3aed" progress={85} />
              <PerformanceMetric label="Lead Conversion" value="92/100" color="#10b981" progress={92} />
              <PerformanceMetric label="Revenue Growth" value="88/100" color="#f59e0b" progress={88} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Partner Growth
              </Typography>
              <Bar options={barChartOptions} data={barChartData} height={100} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activities
              </Typography>
              <ActivityItem
                icon={<SupervisorAccount />}
                iconBg="#7c3aed"
                title="New Partner Joined"
                description="Rahul Sharma registered as a partner"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<CheckCircle />}
                iconBg="#10b981"
                title="Partner Verification Completed"
                description="Priya Patel's documents verified"
                time="4 hours ago"
              />
              <ActivityItem
                icon={<Info />}
                iconBg="#f59e0b"
                title="New Bank Offer Added"
                description="HDFC Bank Personal Loan offer added"
                time="1 day ago"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Admin Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              As an admin, you have access to all features of the platform. You can manage partners, view all leads,
              create and edit offers, track commissions, and configure system settings.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminOverview
