"use client";

import { useState } from "react";
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
  Pagination,
} from "@mui/material";
import { MoreVert, Edit, Delete, Visibility } from "@mui/icons-material";
import type { Manager } from "../../../store/slices/teamSLice";

interface TeamMembersTableProps {
  teamMembers: Manager[];
  onEdit: (member: Manager) => void;
  onDelete: (member: Manager) => void;
  onViewDetails: (member: Manager) => void;
  onStatusChange: (memberId: string, newStatus: "active" | "inactive") => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  teamMembers,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Manager | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    member: Manager
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const handleEdit = () => {
    if (selectedMember) onEdit(selectedMember);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedMember) onDelete(selectedMember);
    handleMenuClose();
  };

  const handleViewDetails = () => {
    if (selectedMember) onViewDetails(selectedMember);
    handleMenuClose();
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedMembers = teamMembers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Manager</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No members found. Please create one to move forward.
                </TableCell>
              </TableRow>
            ) : (
              paginatedMembers.map((member) => (
                <TableRow key={member._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src="/professional-person.png"
                        alt="avatar"
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {member.firstName} {member.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {member.managerId || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
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
                        backgroundColor:
                          member.status === "active"
                            ? "success.lighter"
                            : "grey.200",
                        color:
                          member.status === "active"
                            ? "success.dark"
                            : "text.secondary",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="More options">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, member)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(teamMembers.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>

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
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TeamMembersTable;
