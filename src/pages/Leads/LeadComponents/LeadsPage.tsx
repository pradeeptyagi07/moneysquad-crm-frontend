// src/pages/Leads/LeadsPage.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button, Paper, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

import LeadsDialogs from "./LeadsDialogs";
import { LeadFormData } from "../leadManagement/formDialog/LeadFormDialog";
import { fetchAllLeads, Lead } from "../../../store/slices/leadSLice";
import LeadsDataTable from "./LeadsDataTabel";
import { useAuth } from "../../../hooks/useAuth";
import LeadsFilterBar from "./LeadsFilterBar";

interface FilterOption {
  value: string;
  label: string;
  id?: string;
}

const LeadsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userRole } = useAuth();
  const { leads: apiLeads } = useAppSelector((s) => s.leads);

  // Basic filters & pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Role-based filters
  const [partnerFilter, setPartnerFilter] = useState("all");
  const [lenderFilter, setLenderFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [associateFilter, setAssociateFilter] = useState("all");

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
  const [apiDisbursementLead, setApiDisbursementLead] = useState<Lead | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Fetch leads
  useEffect(() => {
    dispatch(fetchAllLeads());
  }, [dispatch]);

  // Build filter options
  const filterOptions = useMemo(() => {
    const partnersSet = new Set<string>();
    const lendersSet = new Set<string>();
    const managersSet = new Set<string>();
    const associatesSet = new Set<string>();
    const partners: FilterOption[] = [];
    const lenders: FilterOption[] = [];
    const managers: FilterOption[] = [];
    const associates: FilterOption[] = [];

    apiLeads.forEach((lead) => {
      if (lead.partnerId?.basicInfo?.fullName) {
        const key = lead.partnerId._id;
        if (!partnersSet.has(key)) {
          partnersSet.add(key);
          partners.push({ value: key, label: lead.partnerId.basicInfo.fullName, id: lead.partnerId.partnerId });
        }
      }
      if (lead.lenderType?.trim()) {
        const key = lead.lenderType;
        if (!lendersSet.has(key)) {
          lendersSet.add(key);
          lenders.push({ value: key, label: key });
        }
      }
      if (lead.manager?.firstName) {
        const key = lead.manager._id;
        if (!managersSet.has(key)) {
          managersSet.add(key);
          managers.push({ value: key, label: `${lead.manager.firstName} ${lead.manager.lastName}`.trim(), id: lead.manager.managerId });
        }
      }
      if (lead.associate?.firstName) {
        const key = lead.associate._id;
        if (!associatesSet.has(key)) {
          associatesSet.add(key);
          associates.push({ value: key, label: `${lead.associate.firstName} ${lead.associate.lastName}`.trim(), id: lead.associate.associateDisplayId });
        }
      }
    });

    partners.sort((a, b) => a.label.localeCompare(b.label));
    lenders.sort((a, b) => a.label.localeCompare(b.label));
    managers.sort((a, b) => a.label.localeCompare(b.label));
    associates.sort((a, b) => a.label.localeCompare(b.label));

    return { partners, lenders, managers, associates };
  }, [apiLeads]);

  // Prepare form data
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

  // Rows & filteredRows
  const rows = useMemo(
    () =>
      apiLeads.map((l) => ({
        dbId: l.id,
        leadId: l.leadId,
        partnerName: l.partnerId?.basicInfo?.fullName ?? "Unknown Partner",
        partnerId: l.partnerId?.partnerId ?? "",
        associateName: l.associate
          ? `${l.associate.firstName} ${l.associate.lastName}`.trim()
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
          ? `${l.manager.firstName} ${l.manager.lastName}`.trim()
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
          if (
            !(
              r.leadId.toLowerCase().includes(s) ||
              r.applicantName.toLowerCase().includes(s) ||
              r.applicantEmail.toLowerCase().includes(s)
            )
          )
            return false;
        }
        if (partnerFilter !== "all") {
          const lead = apiLeads.find((l) => l.id === r.dbId);
          if (!lead?.partnerId || lead.partnerId._id !== partnerFilter) return false;
        }
        if (lenderFilter !== "all" && r.lenderName !== lenderFilter) return false;
        if (managerFilter !== "all") {
          const lead = apiLeads.find((l) => l.id === r.dbId);
          if (!lead?.manager || lead.manager._id !== managerFilter) return false;
        }
        if (associateFilter !== "all") {
          const lead = apiLeads.find((l) => l.id === r.dbId);
          if (!lead?.associate || lead.associate._id !== associateFilter) return false;
        }
        return true;
      }),
    [
      rows,
      statusFilter,
      loanTypeFilter,
      searchTerm,
      partnerFilter,
      lenderFilter,
      managerFilter,
      associateFilter,
      apiLeads,
    ]
  );

  // Create / Refresh / Reset
  const openCreate = () => {
    setSelectedLead(null);
    setFormMode("create");
    setFormOpen(true);
  };
  const handleRefresh = () => {
    dispatch(fetchAllLeads());
    setSnackbar({ open: true, message: "Data refreshed", severity: "success" });
  };
  const handleReset = () => {
    setStatusFilter("all");
    setLoanTypeFilter("all");
    setSearchTerm("");
    setPartnerFilter("all");
    setLenderFilter("all");
    setManagerFilter("all");
    setAssociateFilter("all");
    setPage(0);
  };

  // EXPORT: only current page
  const handleExportCsv = () => {
    const visible = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const data = visible.map((r) => ({
      LeadID: r.leadId,
      Partner: r.partnerName,
      Associate: r.associateName,
      Applicant: r.applicantName,
      Contact: r.applicantMobile,
      Email: r.applicantEmail,
      Lender: r.lenderName,
      LoanType: r.loanType,
      LoanAmount: r.loanAmount,
      Status: r.status,
      Manager: r.managerName,
      CreatedAt: r.createdAt,
    }));
    const csv = unparse(data);
    saveAs(new Blob([csv], { type: "text/csv" }), `leads_${Date.now()}.csv`);
  };

  const handleExportExcel = () => {
    const visible = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const ws = XLSX.utils.json_to_sheet(
      visible.map((r) => ({
        LeadID: r.leadId,
        Partner: r.partnerName,
        Associate: r.associateName,
        Applicant: r.applicantName,
        Contact: r.applicantMobile,
        Email: r.applicantEmail,
        Lender: r.lenderName,
        LoanType: r.loanType,
        LoanAmount: r.loanAmount,
        Status: r.status,
        Manager: r.managerName,
        CreatedAt: r.createdAt,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    const blob = new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]);
    saveAs(blob, `leads_${Date.now()}.xlsx`);
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
        partnerFilter={partnerFilter}
        lenderFilter={lenderFilter}
        managerFilter={managerFilter}
        associateFilter={associateFilter}
        onPartnerChange={setPartnerFilter}
        onLenderChange={setLenderFilter}
        onManagerChange={setManagerFilter}
        onAssociateChange={setAssociateFilter}
        partners={filterOptions.partners}
        lenders={filterOptions.lenders}
        managers={filterOptions.managers}
        associates={filterOptions.associates}
        onReset={handleReset}
        onRefresh={handleRefresh}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
      />

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}>
        <LeadsDataTable
          rows={filteredRows}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={false}
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
