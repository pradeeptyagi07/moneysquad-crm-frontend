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
import {
  Users,
  Search,
  Download,
  MapPin,
  Calendar,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Activity,
} from "lucide-react"

const AdminPartnerPerformance = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZone, setSelectedZone] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Mock data for partners
  const partnersData = [
    {
      id: "P001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      mobile: "+91 98765 43210",
      city: "Mumbai",
      zone: "West",
      onboardingDate: "2024-01-15",
      leadsSubmitted: { total: 342, unique: 298 },
      leadsDisbursed: { total: 156, unique: 142 },
      disbursedAmount: 12500000,
      conversionRate: 45.6,
      avgTicketSize: 80128,
      avgTAT: 7.2,
      commission: 125000,
      lastActive: "2024-12-20",
      lastLogin: "2024-12-19",
      status: "Active",
      type: "Individual",
      role: "Senior Partner",
      category: "Field Executive",
    },
    {
      id: "P002",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      mobile: "+91 87654 32109",
      city: "Delhi",
      zone: "North",
      onboardingDate: "2024-02-20",
      leadsSubmitted: { total: 287, unique: 251 },
      leadsDisbursed: { total: 134, unique: 119 },
      disbursedAmount: 9800000,
      conversionRate: 46.7,
      avgTicketSize: 73134,
      avgTAT: 6.8,
      commission: 98000,
      lastActive: "2024-12-21",
      lastLogin: "2024-12-21",
      status: "Active",
      type: "Corporate",
      role: "Partner",
      category: "Relationship Manager",
    },
    {
      id: "P003",
      name: "Amit Patel",
      email: "amit.patel@email.com",
      mobile: "+91 76543 21098",
      city: "Ahmedabad",
      zone: "West",
      onboardingDate: "2024-03-10",
      leadsSubmitted: { total: 251, unique: 223 },
      leadsDisbursed: { total: 98, unique: 89 },
      disbursedAmount: 8600000,
      conversionRate: 39.0,
      avgTicketSize: 87755,
      avgTAT: 8.1,
      commission: 86000,
      lastActive: "2024-12-18",
      lastLogin: "2024-12-17",
      status: "Inactive",
      type: "Individual",
      role: "Junior Partner",
      category: "Telecaller",
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

  const filteredPartners = partnersData.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = selectedZone === "all" || partner.zone === selectedZone
    const matchesStatus = selectedStatus === "all" || partner.status === selectedStatus
    const matchesType = selectedType === "all" || partner.type === selectedType

    return matchesSearch && matchesZone && matchesStatus && matchesType
  })

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Users size={20} color="#1976d2" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
              Partner Performance Report
            </Typography>
          </Box>
          <Button variant="outlined" size="small" startIcon={<Download size={16} />} sx={{ textTransform: "none" }}>
            Export
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <TextField
            placeholder="Search partners..."
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

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Zone</InputLabel>
            <Select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} label="Zone">
              <MenuItem value="all">All Zones</MenuItem>
              <MenuItem value="North">North</MenuItem>
              <MenuItem value="South">South</MenuItem>
              <MenuItem value="East">East</MenuItem>
              <MenuItem value="West">West</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} label="Status">
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} label="Type">
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
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
                  Partner
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
                  Leads Submitted
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
                  Commission
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}
                >
                  Last Active
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
              {filteredPartners.map((partner) => (
                <TableRow
                  key={partner.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9fafb" },
                    transition: "background-color 0.2s",
                  }}
                >
                  {/* Partner */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem" }}>{getInitials(partner.name)}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                          {partner.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          {partner.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#2563eb", display: "block" }}>
                          {partner.role}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <Typography variant="caption" sx={{ color: "#111827", display: "block" }}>
                      {partner.mobile}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280", display: "block" }}>
                      {partner.email}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280", display: "block" }}>
                      {partner.category}
                    </Typography>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <MapPin size={12} />
                      <Typography variant="caption" sx={{ color: "#111827" }}>
                        {partner.city}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {partner.zone} Zone
                    </Typography>
                  </TableCell>

                  {/* Onboarding */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Calendar size={12} />
                      <Typography variant="caption" sx={{ color: "#111827" }}>
                        {formatDate(partner.onboardingDate)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Leads Submitted */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                      {partner.leadsSubmitted.total.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {partner.leadsSubmitted.unique.toLocaleString()} unique
                    </Typography>
                  </TableCell>

                  {/* Leads Disbursed */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                      {partner.leadsDisbursed.total.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {partner.leadsDisbursed.unique.toLocaleString()} unique
                    </Typography>
                  </TableCell>

                  {/* Disbursed Amount */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                      {formatCurrency(partner.disbursedAmount)}
                    </Typography>
                  </TableCell>

                  {/* Conversion Rate */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <TrendingUp size={12} color="#10b981" />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                        {partner.conversionRate}%
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Avg Ticket Size */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <Target size={12} color="#3b82f6" />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                        {formatCurrency(partner.avgTicketSize)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Avg TAT */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <Clock size={12} color="#f59e0b" />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                        {partner.avgTAT} days
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Commission */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <DollarSign size={12} color="#10b981" />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827" }}>
                        {formatCurrency(partner.commission)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Last Active */}
                  <TableCell align="center">
                    <Typography variant="caption" sx={{ color: "#111827", display: "block" }}>
                      {formatDate(partner.lastActive)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      Login: {formatDate(partner.lastLogin)}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell align="center">
                    <Chip
                      icon={<Activity size={12} />}
                      label={partner.status}
                      color={getStatusColor(partner.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredPartners.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4, color: "#6b7280" }}>
            <Users size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
            <Typography>No partners found matching your criteria</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminPartnerPerformance
