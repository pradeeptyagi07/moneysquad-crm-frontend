"use client"

import type React from "react"
import { useState } from "react"
import { Box, Tab, Tabs, Typography, Paper } from "@mui/material"
import { Person, Security } from "@mui/icons-material"
import ProfileSection from "./components/ProfileSection"
import SecuritySection from "./components/SecuritySection"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`,
  }
}

interface ManagerSettingsProps {
  user: any
}

const ManagerSettings: React.FC<ManagerSettingsProps> = ({ user }) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 0,
        borderRadius: 2,
        overflow: "hidden",
        background: "linear-gradient(to right, #f7f9fc, #ffffff)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "#f0f4f8",
          background: "linear-gradient(145deg, #e6f7ff, #f0f9ff)",
        }}
      >
        <Typography variant="h5" sx={{ p: 2, fontWeight: 600, color: "#0f172a" }}>
          Manager Account Settings
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="settings tabs"
          sx={{
            "& .MuiTab-root": {
              minHeight: 64,
              fontWeight: 500,
            },
            "& .Mui-selected": {
              color: "#0f766e",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#0f766e",
              height: 3,
            },
          }}
        >
          <Tab icon={<Person />} label="Profile" iconPosition="start" {...a11yProps(0)} sx={{ px: 3 }} />
          <Tab icon={<Security />} label="Security" iconPosition="start" {...a11yProps(1)} sx={{ px: 3 }} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <ProfileSection user={user} isAdmin={false} isManager={true} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SecuritySection user={user} />
      </TabPanel>
    </Paper>
  )
}

export default ManagerSettings
