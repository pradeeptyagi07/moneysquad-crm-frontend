"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { UserCheck, Search, Download, MapPin, Calendar, TrendingUp, Clock, Target, Activity, Users } from "lucide-react"

const AdminManagerPerformance = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")

  // Mock data for managers
  const managersData = [
    {
      id: "M001",
      name: "Suresh Gupta",
      email: "suresh.gupta@email.com",
      mobile: "+91 98765 43210",
      location: "Mumbai",
      onboardingDate: "2024-01-10",
      leadsAssigned: { total: 456, unique: 398 },
      leadsDisbursed: { total: 234, unique: 201 },
      disbursedAmount: 18500000,
      conversionRate: 51.3,
      avgTicketSize: 79059,
      avgTAT: 6.8,
      status: "Active",
    },
    {
      id: "M002",
      name: "Kavita Singh",
      email: "kavita.singh@email.com",
      mobile: "+91 87654 32109",
      location: "Delhi",
      onboardingDate: "2024-02-15",
      leadsAssigned: { total: 389, unique: 342 },
      leadsDisbursed: { total: 198, unique: 176 },
      disbursedAmount: 15200000,
      conversionRate: 50.9,
      avgTicketSize: 76768,
      avgTAT: 7.2,
      status: "Active",
    },
    {
      id: "M003",
      name: "Ravi Mehta",
      email: "ravi.mehta@email.com",
      mobile: "+91 76543 21098",
      location: "Bangalore",
      onboardingDate: "2024-03-20",
      leadsAssigned: { total: 312, unique: 278 },
      leadsDisbursed: { total: 145, unique: 132 },
      disbursedAmount: 12800000,
      conversionRate: 46.5,
      avgTicketSize: 88276,
      avgTAT: 8.1,
      status: "Active",
    },
    {
      id: "M004",
      name: "Anita Sharma",
      email: "anita.sharma@email.com",
      mobile: "+91 65432 10987",
      location: "Chennai",
      onboardingDate: "2024-04-05",
      leadsAssigned: { total: 267, unique: 234 },
      leadsDisbursed: { total: 98, unique: 89 },
      disbursedAmount: 8900000,
      conversionRate: 36.7,
      avgTicketSize: 90816,
      avgTAT: 9.3,
      status: "Inactive",
    },
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "success" : "error"
  }

  const filteredManagers = managersData.filter((manager) => {
    const matchesSearch =
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === "all" || manager.location === selectedLocation

    return matchesSearch && matchesLocation
  })

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <UserCheck size={20} color="#9333ea" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
              Manager Performance Report
            </Typography>
          </Box>
          <Button variant="outlined" size="small" startIcon={<Download size={16} />} sx={{ textTransform: "none" }}>
            Export
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <TextField
            placeholder="Search managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 200, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Location</InputLabel>
            <Select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} label="Location">
              <MenuItem value="all">All Locations</MenuItem>
              <MenuItem value="Mumbai">Mumbai</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
              <MenuItem value="Bangalore">Bangalore</MenuItem>
              <MenuItem value="Chennai">Chennai</MenuItem>
              <MenuItem value="Kolkata">Kolkata</MenuItem>
              <MenuItem value="Pune">Pune</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardHeader>

      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>
                  Manager
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>
                  Location
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>
                  Onboarding
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Leads Assigned
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Leads Disbursed
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Disbursed Amount
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Conversion Rate
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Avg Ticket Size
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Avg TAT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredManagers.map((manager) => (
                <TableRow
                  key={manager.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9fafb" },
                    transition: "background-color 0.2s",
                  }}
                >
                  {/* Manager */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem" }}>{getInitials(manager.name)}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                          {manager.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          {manager.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <Typography variant="caption" sx={{ color: "#111827", display: "block" }}>
                      {manager.mobile}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {manager.email}
                    </Typography>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <MapPin size={12} />
                      <Typography variant="caption" sx={{ color: "#111827" }}>
                        {manager.location}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Onboarding */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Calendar size={12} />
                      <Typography variant="caption" sx={{ color: "#111827" }}>
                        {formatDate(manager.onboardingDate)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Leads Assigned */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                      {manager.leadsAssigned.total.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {manager.leadsAssigned.unique.toLocaleString()} unique
                    </Typography>
                  </TableCell>

                  {/* Leads Disbursed */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                      {manager.leadsDisbursed.total.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {manager.leadsDisbursed.unique.toLocaleString()} unique
                    </Typography>
                  </TableCell>

                  {/* Disbursed Amount */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                      {formatCurrency(manager.disbursedAmount)}
                    </Typography>
                  </TableCell>

                  {/* Conversion Rate */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <TrendingUp size={12} color="#10b981" />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                        {manager.conversionRate}%
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Avg Ticket Size */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <Target size={12} color="#3b82f6" />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                        {formatCurrency(manager.avgTicketSize)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Avg TAT */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <Clock size={12} color="#f59e0b" />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                        {manager.avgTAT} days
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Status */}
                  <TableCell align="center">
                    <Chip
                      icon={<Activity size={12} />}
                      label={manager.status}
                      color={getStatusColor(manager.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredManagers.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4, color: "#6b7280" }}>
            <Users size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
            <Typography>No managers found matching your criteria</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminManagerPerformance
