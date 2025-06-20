"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Typography, Paper, Chip, Divider, TextField, InputAdornment } from "@mui/material"
import { Search } from "@mui/icons-material"
import PartnersTable from "./components/PartnersTable"
import PartnerStats from "./components/PartnerStats"
import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { fetchAllPartners } from "../../store/slices/managePartnerSlice"

const ManagePartners: React.FC = () => {
  const dispatch = useAppDispatch()
  const managePartnersState = useAppSelector((state) => state.managePartners) || {}
  const { partners: apiPartners = [], loading = false } = managePartnersState

  const [filteredPartners, setFilteredPartners] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    dispatch(fetchAllPartners())
  }, [dispatch])

  useEffect(() => {
    setFilteredPartners(apiPartners)
  }, [apiPartners])

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
    let filtered = apiPartners

    if (query) {
      filtered = filtered.filter((partner) => {
        const fullName = partner?.basicInfo?.fullName?.toLowerCase() || ""
        const email = partner?.basicInfo?.email?.toLowerCase() || ""
        const mobile = partner?.basicInfo?.mobile || ""
        const partnerId = partner?.partnerId?.toLowerCase() || ""
        return fullName.includes(query) || email.includes(query) || mobile.includes(query) || partnerId.includes(query)
      })
    }

    if (status !== "all") {
      filtered = filtered.filter((partner) => partner.status === status)
    }

    setFilteredPartners(filtered)
  }

  useEffect(() => {
    console.log("Fetched API Partners:", apiPartners)
    setFilteredPartners(apiPartners)
  }, [apiPartners])

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
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

      <PartnerStats partners={apiPartners} />

      <Paper sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {(["all", "active", "inactive"] as const).map((status) => (
                <Chip
                  key={status}
                  label={status[0].toUpperCase() + status.slice(1)}
                  variant={statusFilter === status ? "filled" : "outlined"}
                  onClick={() => handleStatusFilter(status)}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: statusFilter === status ? "primary.main" : "transparent",
                    color: statusFilter === status ? "white" : "text.primary",
                    "&:hover": {
                      backgroundColor: statusFilter === status ? "primary.dark" : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                />
              ))}
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
        </Box>
      </Paper>
    </Box>
  )
}

export default ManagePartners
