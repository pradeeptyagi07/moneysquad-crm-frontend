import React, { useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Avatar, Box, useTheme, alpha } from '@mui/material'

import { getStatusIcon, getStatusColor } from '../utils/leadUtils'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { fetchAllLeads } from '../../../store/slices/leadSLice'

const LeadMetrics: React.FC = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()

  // Select leads and loading state from Redux store
  const { data: leads, loading } = useAppSelector((state) => state.leads)

  // Fetch all leads on mount
  useEffect(() => {
    dispatch(fetchAllLeads())
  }, [dispatch])

  if (loading) {
    return <Typography>Loading metrics...</Typography>
  }

  // Count leads per status
  const statusCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {})

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {Object.entries(statusCounts).map(([status, count]) => {
        const color = getStatusColor(status, theme)
        const icon = getStatusIcon(status)
        const label = status.charAt(0).toUpperCase() + status.slice(1)

        return (
          <Grid item xs={12} sm={6} md={3} key={status}>
            <Card
              sx={{
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
                border: `1px solid ${alpha(color, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {label}
                  </Typography>
                  <Avatar
                    sx={{
                      bgcolor: alpha(color, 0.1),
                      color,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {icon}
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default LeadMetrics
