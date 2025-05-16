"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Typography, Button, Paper, TextField, InputAdornment, Chip, Divider } from "@mui/material"
import { Add, Search } from "@mui/icons-material"
import { mockTeamMembers } from "./data/mockTeamMembers"
import type { TeamMember, TeamMemberFormData } from "./types/teamTypes"
import TeamStats from "./components/TeamStats"
import TeamMembersTable from "./components/TeamMembersTable"
import AddManagerDialog from "./components/AddManagerDialog"
import EditManagerDialog from "./components/EditManagerDialog"
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog"
import ManagerDetailsDialog from "./components/ManagerDetailsDialog"

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    // Initialize with mock data
    setTeamMembers(mockTeamMembers)
    setFilteredMembers(mockTeamMembers)
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)
    filterMembers(query, statusFilter)
  }

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status)
    filterMembers(searchQuery, status)
  }

  const filterMembers = (query: string, status: "all" | "active" | "inactive") => {
    let filtered = teamMembers

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.mobile.includes(query) ||
          member.id.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.location.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((member) => member.status === status)
    }

    setFilteredMembers(filtered)
  }

  // Dialog handlers
  const handleAddManager = (managerData: TeamMemberFormData) => {
    const newManager: TeamMember = {
      id: `MGR${String(teamMembers.length + 1).padStart(3, "0")}`,
      name: managerData.name,
      email: managerData.email,
      mobile: managerData.mobile,
      location: managerData.location,
      role: managerData.role,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      assignedLeads: 0,
      completedLeads: 0,
      conversionRate: 0,
      profileImage: "/professional-person.png",
    }

    const updatedMembers = [...teamMembers, newManager]
    setTeamMembers(updatedMembers)
    setFilteredMembers(updatedMembers)
  }

  const handleEditManager = (id: string, managerData: TeamMemberFormData, status: "active" | "inactive") => {
    const updatedMembers = teamMembers.map((member) => {
      if (member.id === id) {
        return {
          ...member,
          ...managerData,
          status,
        }
      }
      return member
    })

    setTeamMembers(updatedMembers)
    setFilteredMembers(updatedMembers)
  }

  const handleDeleteManager = () => {
    if (selectedMember) {
      const updatedMembers = teamMembers.filter((member) => member.id !== selectedMember.id)
      setTeamMembers(updatedMembers)
      setFilteredMembers(updatedMembers)
      setDeleteDialogOpen(false)
      setSelectedMember(null)
    }
  }

  const handleStatusChange = (memberId: string, newStatus: "active" | "inactive") => {
    const updatedMembers = teamMembers.map((member) => {
      if (member.id === memberId) {
        return {
          ...member,
          status: newStatus,
        }
      }
      return member
    })

    setTeamMembers(updatedMembers)
    setFilteredMembers(updatedMembers)
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
          Team Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          Add Manager
        </Button>
      </Box>

      <TeamStats teamMembers={teamMembers} />

      <Paper sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3 }}>
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
              placeholder="Search team members..."
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

          <TeamMembersTable
            teamMembers={filteredMembers}
            onEdit={(member) => {
              setSelectedMember(member)
              setEditDialogOpen(true)
            }}
            onDelete={(member) => {
              setSelectedMember(member)
              setDeleteDialogOpen(true)
            }}
            onViewDetails={(member) => {
              setSelectedMember(member)
              setDetailsDialogOpen(true)
            }}
            onStatusChange={handleStatusChange}
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <AddManagerDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onAdd={handleAddManager} />

      <EditManagerDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditManager}
        manager={selectedMember}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteManager}
        managerName={selectedMember?.name || ""}
      />

      <ManagerDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        manager={selectedMember}
        onEdit={(manager) => {
          setDetailsDialogOpen(false)
          setSelectedMember(manager)
          setEditDialogOpen(true)
        }}
      />
    </Box>
  )
}

export default TeamManagement
