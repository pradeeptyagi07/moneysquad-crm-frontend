import type React from "react"
import { Box, Typography, Grid, Card, CardContent, Paper } from "@mui/material"
import { TrendingUp, People, CheckCircle, Info, Assessment } from "@mui/icons-material"
import { Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import MetricCard from "../../components/common/MetricCard"
import PerformanceMetric from "../../components/common/PerformanceMetric"
import ActivityItem from "../../components/common/ActivityItem"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

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
      label: "Leads",
      data: [120, 190, 150, 220, 180, 250],
      borderColor: "#2563eb",
      tension: 0.4,
    },
  ],
}

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
  },
}

const doughnutChartData = {
  labels: ["Approved", "Pending", "Rejected"],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      borderWidth: 0,
    },
  ],
}

const ManagerOverview: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Manager Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Leads"
            value="1,845"
            subValue="+12.5% from last month"
            icon={<People />}
            iconBg="#2563eb"
            targetValue="2,000"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value="28%"
            subValue="+5.2% from last month"
            icon={<TrendingUp />}
            iconBg="#10b981"
            targetValue="35%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg. Processing Time"
            value="2.5 days"
            subValue="-0.5 days from last month"
            icon={<Assessment />}
            iconBg="#7c3aed"
            targetValue="2 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Team Efficiency"
            value="85%"
            subValue="+3.4% from last month"
            icon={<Info />}
            iconBg="#f59e0b"
            targetValue="90%"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Lead Trend
              </Typography>
              <Line options={lineChartOptions} data={lineChartData} height={80} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Lead Status Distribution
              </Typography>
              <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Team Performance
              </Typography>
              <PerformanceMetric label="Lead Processing" value="85/100" color="#2563eb" progress={85} />
              <PerformanceMetric label="Documentation Quality" value="92/100" color="#10b981" progress={92} />
              <PerformanceMetric label="Customer Satisfaction" value="88/100" color="#f59e0b" progress={88} />
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
                icon={<CheckCircle />}
                iconBg="#10b981"
                title="Lead Approved"
                description="Rahul Sharma's personal loan approved"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<People />}
                iconBg="#2563eb"
                title="New Lead Assigned"
                description="Priya Patel's home loan assigned to Team A"
                time="4 hours ago"
              />
              <ActivityItem
                icon={<Info />}
                iconBg="#f59e0b"
                title="Documentation Request"
                description="Additional documents requested for Amit Kumar"
                time="1 day ago"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manager Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              As a manager, you can oversee lead processing, assign leads to team members, review and approve
              applications, and monitor team performance metrics. Use the navigation menu to access different sections
              of the dashboard.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ManagerOverview
