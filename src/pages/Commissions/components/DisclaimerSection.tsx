"use client"

import type React from "react"
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { Info } from "@mui/icons-material"

interface DisclaimerSectionProps {
  disclaimers: string[]
}

const DisclaimerSection: React.FC<DisclaimerSectionProps> = ({ disclaimers }) => {
  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Terms & Conditions
      </Typography>
      <Paper sx={{ p: 2, bgcolor: "#f8f9fa" }}>
        <List dense>
          {disclaimers.map((disclaimer, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Info fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText primary={disclaimer} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default DisclaimerSection
