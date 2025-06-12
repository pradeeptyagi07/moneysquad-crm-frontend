"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import DeleteAssociateDialog from "./components/DeleteAssociateDialog";
import EditAssociateDialog from "./components/EditAssociateDialog";
import AddAssociateDialog from "./components/AddAssociateDialog";
import AssociateTable from "./components/AssociateTable";
import { fetchAssociates } from "../../store/slices/associateSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";


const AssociateManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { associates, loading } = useAppSelector((state) => state.associate);

  const [filtered, setFiltered] = useState<Associate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(null);

  // Fetch list on mount & after any CRUD
  useEffect(() => {
    dispatch(fetchAssociates());
  }, [dispatch]);

  // Re-filter whenever data or filters change
  useEffect(() => {
    filterAssociates(searchQuery, statusFilter);
  }, [associates, searchQuery, statusFilter]);

 // ...
// src/pages/Associates/AssociateManagement.tsx

// … inside your component …

function filterAssociates(
  query: string,
  status: "all" | "active" | "inactive"
) {
  let list = [...associates];

  if (query) {
    const q = query.toLowerCase();
    list = list.filter((a) =>
      // Full name
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      // Email
      a.email?.toLowerCase().includes(q) ||
      // Mobile
      a.mobile?.toLowerCase().includes(q) ||
      // Location
      a.location?.toLowerCase().includes(q)
    );
  }

  if (status !== "all") {
    list = list.filter((a) => a.status === status);
  }

  setFiltered(list);
}

// … rest of your file unchanged …

// ...


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box>
      {/* Header */}
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
          Associate Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          Add Associate
        </Button>
      </Box>


      {/* Filters & Search */}
      <Paper sx={{ mt: 4, borderRadius: 3, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {(["all", "active", "inactive"] as const).map((status) => (
              <Chip
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                variant={statusFilter === status ? "filled" : "outlined"}
                onClick={() => setStatusFilter(status)}
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
                        : "rgba(0,0,0,0.05)",
                  },
                }}
              />
            ))}
          </Box>
          <TextField
            placeholder="Search associates..."
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

        {/* Associate Table */}
        <AssociateTable
          associates={filtered}
          onEdit={(assoc) => {
            setSelectedAssociate(assoc);
            setEditOpen(true);
          }}
          onDelete={(assoc) => {
            setSelectedAssociate(assoc);
            setDeleteOpen(true);
          }}
        />
      </Paper>

      {/* Add/Edit/Delete Dialogs */}
      <AddAssociateDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />

      <EditAssociateDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        associate={selectedAssociate}
        onSaveSuccess={() => dispatch(fetchAssociates())}
      />

      <DeleteAssociateDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        associateId={selectedAssociate?._id || ""}
        associateName={
          selectedAssociate
            ? `${selectedAssociate.firstName} ${selectedAssociate.lastName}`
            : ""
        }
      />
    </Box>
  );
};

export default AssociateManagement;
