// src/pages/Leads/LeadsPage.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button, Paper, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import LeadsFilterBar from "./LeadsFilterBar";
import LeadsDialogs from "./LeadsDialogs";
import { LeadFormData } from "../leadManagement/formDialog/LeadFormDialog";
import { fetchAllLeads, Lead } from "../../../store/slices/leadSLice";
import LeadsDataTable from "./LeadsDataTabel";

const LeadsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leads: apiLeads } = useAppSelector((s) => s.leads);

  // Filters & pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "duplicate">("create");
  const [selectedLead, setSelectedLead] = useState<LeadFormData | null>(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [disbursementOpen, setDisbursementOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // full-backend Lead for disbursement dialog
  const [apiDisbursementLead, setApiDisbursementLead] = useState<Lead | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Fetch leads on mount
  useEffect(() => {
    dispatch(fetchAllLeads());
  }, [dispatch]);

  const prepareFormData = (api: Lead): LeadFormData => ({
    id: api.id,
    leadId: api.leadId,
    partnerName: api.partnerId?._id || "",
    applicantProfile: api.applicantProfile || "",
    applicantName: api.applicantName,
    businessName: api.businessName || "",
    applicantMobile: api.mobile,
    applicantEmail: api.email,
    applicantPincode: api.pincode?.pincode || "",
    city: api.pincode?.city || "",
    state: api.pincode?.state || "",
    loanType: api.loan.type,
    loanAmount: String(api.loan.amount),
    comments: api.comments || "",
    status: api.status,

    assignTo: api.manager?._id || "",
    associate: api.associate?._id || "",
    lenderName: api.lenderType || "",
  });

  const rows = useMemo(
    () =>
      apiLeads.map((l) => ({
        dbId: l.id,
        leadId: l.leadId,
        // safe‐check here; default to "Unknown Partner"
        partnerName: l.partnerId?.basicInfo?.fullName ?? "Unknown Partner",
        partnerId: l.partnerId?.partnerId ?? "",

        associateName: l.associate
          ? `${l.associate.firstName ?? ""} ${l.associate.lastName ?? ""}`.trim()
          : "",
        associateDisplayId: l.associate?.associateDisplayId ?? "",

        applicantName: l.applicantName,
        applicantLocation: `${l.pincode?.city ?? ""}, ${l.pincode?.state ?? ""}`,

        applicantMobile: l.mobile,
        applicantEmail: l.email,

        lenderName: l.lenderType || "",
        loanType: l.loan.type,
        loanAmount: l.loan.amount,

        comments: l.comments || "",
        status: l.status,
        lastUpdate: l.statusUpdatedAt,

        managerName: l.manager
          ? `${l.manager.firstName ?? ""} ${l.manager.lastName ?? ""}`.trim()
          : "",
        managerDisplayId: l.manager?.managerId || "",

        createdAt: l.createdAt,
        disbursedData: l.disbursedData || null,
      })),
    [apiLeads]
  );

  const filteredRows = useMemo(
    () =>
      rows.filter((r) => {
        if (statusFilter !== "all" && r.status !== statusFilter) return false;
        if (loanTypeFilter !== "all" && r.loanType !== loanTypeFilter) return false;
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          return (
            r.leadId.toLowerCase().includes(s) ||
            r.applicantName.toLowerCase().includes(s) ||
            r.applicantEmail.toLowerCase().includes(s)
          );
        }
        return true;
      }),
    [rows, statusFilter, loanTypeFilter, searchTerm]
  );

  const openCreate = () => {
    setSelectedLead(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleRefresh = () => {
    dispatch(fetchAllLeads());
    setSnackbar({ open: true, message: "Data refreshed", severity: "success" });
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Lead Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          Create New Lead
        </Button>
      </Box>

      {/* Filters */}
      <LeadsFilterBar
        statusFilter={statusFilter}
        loanTypeFilter={loanTypeFilter}
        searchTerm={searchTerm}
        onStatusChange={setStatusFilter}
        onLoanTypeChange={setLoanTypeFilter}
        onSearchChange={setSearchTerm}
        onReset={() => {
          setStatusFilter("all");
          setLoanTypeFilter("all");
          setSearchTerm("");
        }}
      />

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}>
        <LeadsDataTable
          rows={filteredRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onOpenEdit={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setFormMode("edit");
            setFormOpen(true);
          }}
          onOpenDuplicate={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setFormMode("duplicate");
            setFormOpen(true);
          }}
          onOpenAssign={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setAssignOpen(true);
          }}
          onOpenStatus={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setStatusOpen(true);
          }}
          onOpenTimeline={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setTimelineOpen(true);
          }}
          onOpenDetails={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setDetailsOpen(true);
          }}
          onOpenDisbursement={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setApiDisbursementLead(api);
            setDisbursementOpen(true);
          }}
          onOpenDelete={(r) => {
            const api = apiLeads.find((l) => l.id === r.dbId)!;
            setSelectedLead(prepareFormData(api));
            setDeleteOpen(true);
          }}
        />
      </Paper>

      <LeadsDialogs
        formDialogOpen={formOpen}
        onFormClose={() => setFormOpen(false)}
        formMode={formMode}
        selectedLead={selectedLead}
        assignOpen={assignOpen}
        onAssignClose={() => setAssignOpen(false)}
        statusOpen={statusOpen}
        onStatusClose={() => setStatusOpen(false)}
        timelineOpen={timelineOpen}
        onTimelineClose={() => setTimelineOpen(false)}
        detailsOpen={detailsOpen}
        onDetailsClose={() => setDetailsOpen(false)}
        disbursementOpen={disbursementOpen}
        onDisbursementClose={() => {
          setDisbursementOpen(false);
          setApiDisbursementLead(null);
        }}
        apiDisbursementLead={apiDisbursementLead}
        deleteOpen={deleteOpen}
        onDeleteClose={() => setDeleteOpen(false)}
        onRefresh={handleRefresh}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadsPage;
