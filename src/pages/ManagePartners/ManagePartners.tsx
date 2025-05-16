"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Typography, Paper, Tabs, Tab, Chip, Divider, TextField, InputAdornment } from "@mui/material"
import { Search } from "@mui/icons-material"
import PartnersTable from "./components/PartnersTable"
import PartnerEditRequestsTable from "./components/PartnerEditRequestsTable"
import PartnerStats from "./components/PartnerStats"
import { mockPartners } from "./data/mockPartners"
import { mockLeads } from "../../data/mockLeads"
import type { Partner } from "./types/partnerTypes"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`partner-tabpanel-${index}`}
      aria-labelledby={`partner-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `partner-tab-${index}`,
    "aria-controls": `partner-tabpanel-${index}`,
  }
}

const ManagePartners: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Calculate active status based on leads in the last 30 days
  useEffect(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const partnersWithStatus = mockPartners.map((partner) => {
      // Check if partner has any leads in the last 30 days
      const hasRecentLeads = mockLeads.some(
        (lead) => lead.createdBy === partner.fullName && new Date(lead.createdAt) >= thirtyDaysAgo,
      )

      return {
        ...partner,
        status: hasRecentLeads ? "active" : "inactive",
      }
    })

    setPartners(partnersWithStatus)
    setFilteredPartners(partnersWithStatus)
  }, [])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)
    filterPartners(query, statusFilter)
  }

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status)
    filterPartners(searchQuery, status)
  }

  const filterPartners = (query: string, status: "all" | "active" | "inactive") => {
    let filtered = partners

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (partner) =>
          partner.fullName.toLowerCase().includes(query) ||
          partner.email.toLowerCase().includes(query) ||
          partner.mobileNumber.includes(query) ||
          partner.partnerId.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((partner) => partner.status === status)
    }

    setFilteredPartners(filtered)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Partner Management
        </Typography>
      </Box>

      <PartnerStats partners={partners} />

      <Paper sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="partner management tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                px: 4,
              },
            }}
          >
            <Tab label="All Partners" {...a11yProps(0)} />
            <Tab label="Edit Requests" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label="All"
                  variant={statusFilter === "all" ? "filled" : "outlined"}
                  onClick={() => handleStatusFilter("all")}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: statusFilter === "all" ? "primary.main" : "transparent",
                    color: statusFilter === "all" ? "white" : "text.primary",
                    "&:hover": {
                      backgroundColor: statusFilter === "all" ? "primary.dark" : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                />
                <Chip
                  label="Active"
                  variant={statusFilter === "active" ? "filled" : "outlined"}
                  onClick={() => handleStatusFilter("active")}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: statusFilter === "active" ? "success.main" : "transparent",
                    color: statusFilter === "active" ? "white" : "text.primary",
                    "&:hover": {
                      backgroundColor: statusFilter === "active" ? "success.dark" : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                />
                <Chip
                  label="Inactive"
                  variant={statusFilter === "inactive" ? "filled" : "outlined"}
                  onClick={() => handleStatusFilter("inactive")}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: statusFilter === "inactive" ? "text.secondary" : "transparent",
                    color: statusFilter === "inactive" ? "white" : "text.primary",
                    "&:hover": {
                      backgroundColor: statusFilter === "inactive" ? "text.disabled" : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                />
              </Box>
              <TextField
                placeholder="Search partners..."
                size="small"
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
                sx={{ width: 300 }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />
            <PartnersTable partners={filteredPartners} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PartnerEditRequestsTable partners={partners} />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  )
}

export default ManagePartners
