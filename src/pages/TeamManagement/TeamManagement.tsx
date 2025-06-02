"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Divider,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchManagers } from "../../store/slices/teamSLice";

import TeamStats from "./components/TeamStats";
import TeamMembersTable from "./components/TeamMembersTable";
import AddManagerDialog from "./components/AddManagerDialog";
import EditManagerDialog from "./components/EditManagerDialog";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import ManagerDetailsDialog from "./components/ManagerDetailsDialog";

const TeamManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { managers, loading } = useAppSelector((state) => state.team);

  const [filteredMembers, setFilteredMembers] = useState(managers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  useEffect(() => {
    filterMembers(searchQuery, statusFilter);
  }, [managers, searchQuery, statusFilter]);

  const filterMembers = (
    query: string,
    status: "all" | "active" | "inactive"
  ) => {
    let filtered = [...managers];

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          `${member.firstName} ${member.lastName}`
            .toLowerCase()
            .includes(lowerQuery) ||
          member.email.toLowerCase().includes(lowerQuery) ||
          member.mobile.includes(lowerQuery) ||
          member.managerId.toLowerCase().includes(lowerQuery) ||
          member.location.toLowerCase().includes(lowerQuery)
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((member) => member.status === status);
    }

    setFilteredMembers(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
  };

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

      <TeamStats teamMembers={filteredMembers} />

      <Paper sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {(["all", "active", "inactive"] as const).map((status) => (
                <Chip
                  key={status}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  variant={statusFilter === status ? "filled" : "outlined"}
                  onClick={() => handleStatusFilter(status)}
                  sx={{
                    fontWeight: 600,
                    backgroundColor:
                      statusFilter === status
                        ? `${
                            status === "active"
                              ? "success.main"
                              : status === "inactive"
                              ? "text.secondary"
                              : "primary.main"
                          }`
                        : "transparent",
                    color: statusFilter === status ? "white" : "text.primary",
                    "&:hover": {
                      backgroundColor:
                        statusFilter === status
                          ? `${
                              status === "active"
                                ? "success.dark"
                                : status === "inactive"
                                ? "text.disabled"
                                : "primary.dark"
                            }`
                          : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                />
              ))}
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
              setSelectedMember(member);
              setEditDialogOpen(true);
            }}
            onDelete={(member) => {
              setSelectedMember(member);
              setDeleteDialogOpen(true);
            }}
            onViewDetails={(member) => {
              setSelectedMember(member);
              setDetailsDialogOpen(true);
            }}
            onStatusChange={(id, status) => {
              // Add logic for status update API call if needed
              setFilteredMembers((prev) =>
                prev.map((m) => (m._id === id ? { ...m, status } : m))
              );
            }}
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <AddManagerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />

      <EditManagerDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={() => {}}
        manager={selectedMember}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        managerId={selectedMember?._id || ""}
        managerName={
          selectedMember
            ? `${selectedMember.firstName} ${selectedMember.lastName}`
            : ""
        }
      />

      <ManagerDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        managerId={selectedMember?._id || null} // ✅ correct prop
        onEdit={(id) => {
          setDetailsDialogOpen(false);
          setSelectedMember((prev) => prev); // Optional: update selectedMember or just open edit
          setEditDialogOpen(true);
        }}
      />
    </Box>
  );
};

export default TeamManagement;
