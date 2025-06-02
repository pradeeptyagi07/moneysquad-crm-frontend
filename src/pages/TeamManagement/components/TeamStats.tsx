import type React from "react"
import { Box, Grid, Paper, Typography, Avatar } from "@mui/material"
import { Groups, PersonAdd, PersonOff, Insights } from "@mui/icons-material"

interface TeamStatsProps {
  teamMembers: TeamMember[]
}

const TeamStats: React.FC<TeamStatsProps> = ({ teamMembers }) => {
  // Calculate statistics
  const totalMembers = teamMembers.length
  const activeMembers = teamMembers.filter((member) => member.status === "active").length
  const inactiveMembers = totalMembers - activeMembers

  // Calculate average conversion rate for active members
  const activeTeamMembers = teamMembers.filter((member) => member.status === "active" && member.conversionRate)
  const avgConversionRate =
    activeTeamMembers.length > 0
      ? activeTeamMembers.reduce((sum, member) => sum + (member.conversionRate || 0), 0) / activeTeamMembers.length
      : 0

  const statCards = [
    {
      title: "Total Team Members",
      value: totalMembers,
      icon: <Groups fontSize="large" sx={{ color: "primary.main" }} />,
      color: "primary.main",
      bgColor: "primary.lighter",
    },
    {
      title: "Active Members",
      value: activeMembers,
      icon: <PersonAdd fontSize="large" sx={{ color: "success.main" }} />,
      color: "success.main",
      bgColor: "success.lighter",
    },
    {
      title: "Inactive Members",
      value: inactiveMembers,
      icon: <PersonOff fontSize="large" sx={{ color: "text.secondary" }} />,
      color: "text.secondary",
      bgColor: "grey.100",
    },
    {
      title: "Avg. Conversion Rate",
      value: `${avgConversionRate.toFixed(1)}%`,
      icon: <Insights fontSize="large" sx={{ color: "info.main" }} />,
      color: "info.main",
      bgColor: "info.lighter",
    },
  ]

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: stat.bgColor,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {stat.title}
              </Typography>
              <Avatar
                sx={{
                  bgcolor: "white",
                  width: 40,
                  height: 40,
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {stat.icon}
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
              {stat.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default TeamStats
