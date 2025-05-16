"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material"
import { MoreVert, Edit, Delete, Visibility, CheckCircle, Cancel } from "@mui/icons-material"
import type { TeamMember } from "../types/teamTypes"

interface TeamMembersTableProps {
  teamMembers: TeamMember[]
  onEdit: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
  onViewDetails: (member: TeamMember) => void
  onStatusChange: (memberId: string, newStatus: "active" | "inactive") => void
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  teamMembers,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: TeamMember) => {
    setAnchorEl(event.currentTarget)
    setSelectedMember(member)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedMember(null)
  }

  const handleEdit = () => {
    if (selectedMember) {
      onEdit(selectedMember)
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    if (selectedMember) {
      onDelete(selectedMember)
    }
    handleMenuClose()
  }

  const handleViewDetails = () => {
    if (selectedMember) {
      onViewDetails(selectedMember)
    }
    handleMenuClose()
  }

  const handleToggleStatus = () => {
    if (selectedMember) {
      const newStatus = selectedMember.status === "active" ? "inactive" : "active"
      onStatusChange(selectedMember.id, newStatus)
    }
    handleMenuClose()
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "none", border: "1px solid", borderColor: "divider" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Manager</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Performance</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={member.profileImage} alt={member.name} sx={{ width: 40, height: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {member.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.location}</TableCell>
                <TableCell>
                  <Typography variant="body2">{member.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.mobile}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.status === "active" ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      backgroundColor: member.status === "active" ? "success.lighter" : "grey.200",
                      color: member.status === "active" ? "success.dark" : "text.secondary",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {member.conversionRate ? (
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {member.conversionRate}% Conversion
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.completedLeads}/{member.assignedLeads} Leads
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No data
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="More options">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, member)}>
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {selectedMember?.status === "active" ? (
              <Cancel fontSize="small" color="error" />
            ) : (
              <CheckCircle fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>{selectedMember?.status === "active" ? "Deactivate" : "Activate"}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default TeamMembersTable
