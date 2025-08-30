"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { Box, Typography, Fab, Paper, Snackbar, Alert, Tooltip, useTheme, useMediaQuery } from "@mui/material"
import { Add, FilterList } from "@mui/icons-material"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { unparse } from "papaparse"

import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../hooks/useAppDispatch"

import LeadsDialogs from "./LeadsDialogs"
import type { LeadFormData } from "../leadManagement/formDialog/LeadFormDialog"
import {
  fetchAllLeads,
  fetchArchivedLeads, // ← NEW: bring in archived fetch
  type Lead,
} from "../../../store/slices/leadSLice"
import LeadsDataTable from "./LeadsDataTabel"
import { useAuth } from "../../../hooks/useAuth"
import LeadsFilterBar from "./LeadsFilterBar"

interface FilterOption {
  value: string
  label: string
  id?: string
}

interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

type LeadsPageProps = {
  dataSource?: "active" | "archived"
  title?: string
  hideCreate?: boolean
  fetchOnMount?: boolean // controls whether this page fires fetch on mount
}

const LeadsPage: React.FC<LeadsPageProps> = ({
  dataSource = "active",
  title,
  hideCreate = false,
  fetchOnMount = true,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const dispatch = useAppDispatch()
  const { userRole } = useAuth()

  // Pull both active + archived datasets from slice; choose based on dataSource
  const { leads, archivedLeads, loading, archivedLoading } = useAppSelector((s) => s.leads)
  const apiLeads = dataSource === "archived" ? archivedLeads : leads

  // Basic filters & pagination
  const [statusFilter, setStatusFilter] = useState("all")
  const [loanTypeFilter, setLoanTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Role-based filters
  const [partnerFilter, setPartnerFilter] = useState("all")
  const [lenderFilter, setLenderFilter] = useState("all")
  const [managerFilter, setManagerFilter] = useState("all")
  const [associateFilter, setAssociateFilter] = useState("all")

  // Date range filter
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  })

  // Filter panel visibility
  const [showFilters, setShowFilters] = useState(false)

  // Dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit" | "duplicate">("create")
  const [selectedLead, setSelectedLead] = useState<LeadFormData | null>(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [disbursementOpen, setDisbursementOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [apiDisbursementLead, setApiDisbursementLead] = useState<Lead | null>(null)

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })

  // Fetch data on mount (respects dataSource and fetchOnMount)
  useEffect(() => {
    if (!fetchOnMount) return
    if (dataSource === "archived") {
      dispatch(fetchArchivedLeads())
    } else {
      dispatch(fetchAllLeads())
    }
  }, [dispatch, dataSource, fetchOnMount])

  // Build filter options
  const filterOptions = useMemo(() => {
    const partnersSet = new Set<string>()
    const lendersSet = new Set<string>()
    const managersSet = new Set<string>()
    const associatesSet = new Set<string>()
    const partners: FilterOption[] = []
    const lenders: FilterOption[] = []
    const managers: FilterOption[] = []
    const associates: FilterOption[] = []

    apiLeads.forEach((lead) => {
      if (lead.partnerId?.basicInfo?.fullName) {
        const key = lead.partnerId._id
        if (!partnersSet.has(key)) {
          partnersSet.add(key)
          partners.push({
            value: key,
            label: lead.partnerId.basicInfo.fullName,
            id: lead.partnerId.partnerId,
          })
        }
      }
      if (lead.lenderType?.trim()) {
        const key = lead.lenderType
        if (!lendersSet.has(key)) {
          lendersSet.add(key)
          lenders.push({ value: key, label: key })
        }
      }
      if (lead.manager?.firstName) {
        const key = lead.manager._id
        if (!managersSet.has(key)) {
          managersSet.add(key)
          managers.push({
            value: key,
            label: `${lead.manager.firstName} ${lead.manager.lastName}`.trim(),
            id: lead.manager.managerId,
          })
        }
      }
      if (lead.associate?.firstName) {
        const key = lead.associate._id
        if (!associatesSet.has(key)) {
          associatesSet.add(key)
          associates.push({
            value: key,
            label: `${lead.associate.firstName} ${lead.associate.lastName}`.trim(),
            id: lead.associate.associateDisplayId,
          })
        }
      }
    })

    partners.sort((a, b) => a.label.localeCompare(b.label))
    lenders.sort((a, b) => a.label.localeCompare(b.label))
    managers.sort((a, b) => a.label.localeCompare(b.label))
    associates.sort((a, b) => a.label.localeCompare(b.label))

    return { partners, lenders, managers, associates }
  }, [apiLeads])

  // Prepare form data helper (reused by all modals)
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
  })

  // Date helpers
  const parseToDateOnly = (dateStr: string): Date => {
    const d = new Date(dateStr)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }
  const isSameDate = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const isDateInRange = (dateStr: string, startDate: Date | null, endDate: Date | null): boolean => {
    if (!startDate && !endDate) return true
    try {
      const leadDate = parseToDateOnly(dateStr)
      if (startDate && endDate) {
        const s = parseToDateOnly(startDate.toISOString())
        const e = parseToDateOnly(endDate.toISOString())
        return leadDate >= s && leadDate <= e
      }
      if (startDate) {
        return isSameDate(leadDate, parseToDateOnly(startDate.toISOString()))
      }
      return isSameDate(leadDate, parseToDateOnly(endDate!.toISOString()))
    } catch {
      return true
    }
  }

  // Build rows array
  const rows = useMemo(
    () =>
      apiLeads.map((l) => ({
        dbId: l.id,
        disbursedData: l.disbursedData ?? null,

        leadId: l.leadId,
        partnerName: l.partnerId?.basicInfo?.fullName ?? "Unknown Partner",
        partnerId: l.partnerId?.partnerId ?? "",
        associateName: l.associate ? `${l.associate.firstName} ${l.associate.lastName}`.trim() : "",
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
        managerName: l.manager ? `${l.manager.firstName} ${l.manager.lastName}`.trim() : "",
        managerDisplayId: l.manager?.managerId || "",
        createdAt: l.createdAt,
      })),
    [apiLeads],
  )

  // Filter rows
  const filteredRows = useMemo(
    () =>
      rows.filter((r) => {
        if (!isDateInRange(r.createdAt, dateRange.startDate, dateRange.endDate)) return false
        if (statusFilter !== "all" && r.status !== statusFilter) return false
        if (loanTypeFilter !== "all" && r.loanType !== loanTypeFilter) return false
        if (searchTerm) {
          const s = searchTerm.toLowerCase()
          if (
            !(
              r.leadId.toLowerCase().includes(s) ||
              r.applicantName.toLowerCase().includes(s) ||
              r.applicantEmail.toLowerCase().includes(s)
            )
          )
            return false
        }
        if (partnerFilter !== "all" && apiLeads.find((l) => l.id === r.dbId)?.partnerId?._id !== partnerFilter)
          return false
        if (lenderFilter !== "all" && r.lenderName !== lenderFilter) return false
        if (managerFilter !== "all" && apiLeads.find((l) => l.id === r.dbId)?.manager?._id !== managerFilter)
          return false
        if (associateFilter !== "all" && apiLeads.find((l) => l.id === r.dbId)?.associate?._id !== associateFilter)
          return false
        return true
      }),
    [
      rows,
      dateRange.startDate,
      dateRange.endDate,
      statusFilter,
      loanTypeFilter,
      searchTerm,
      partnerFilter,
      lenderFilter,
      managerFilter,
      associateFilter,
      apiLeads,
    ],
  )

  // Export handlers (keep identical, just vary filename prefix)
  const filePrefix = dataSource === "archived" ? "archived_leads" : "leads"

  const handleExportCsv = () => {
    const data = filteredRows.map((r) => ({
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
    const csv = unparse(data)
    saveAs(new Blob([csv], { type: "text/csv" }), `${filePrefix}_${Date.now()}.csv`)
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredRows.map((r) => ({
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
      })),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Leads")
    const blob = new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })])
    saveAs(blob, `${filePrefix}_${Date.now()}.xlsx`)
  }

  // Final loading logic: respect dataSource AND suppress spinner under open modals
  const anyModalOpen =
    formOpen || assignOpen || statusOpen || timelineOpen || detailsOpen || disbursementOpen || deleteOpen
  const finalTableLoading = (dataSource === "archived" ? archivedLoading : loading) && !anyModalOpen

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{ minHeight: 48, flexShrink: 0 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {title ?? (dataSource === "archived" ? "Archived Leads" : "Lead Management")}
          </Typography>
          <Tooltip title="Toggle Filters">
            <Fab
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                background: showFilters
                  ? "linear-gradient(135deg, #667eea, #764ba2)"
                  : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                color: showFilters ? "#fff" : "#64748b",
              }}
            >
              <FilterList fontSize="small" />
            </Fab>
          </Tooltip>
        </Box>

        {/* Hide Create for archived */}
        {!hideCreate && dataSource !== "archived" && (
          <Tooltip title="Create New Lead">
            <Fab
              color="primary"
              onClick={() => {
                setSelectedLead(null)
                setFormMode("create")
                setFormOpen(true)
              }}
            >
              <Add />
            </Fab>
          </Tooltip>
        )}
      </Box>

      {/* Filters + Table */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Filter Bar */}
        <Box
          sx={{
            flexShrink: 0,
            ...(isMobile &&
              showFilters && {
                maxHeight: "40vh",
                overflowY: "auto",
              }),
          }}
        >
          <LeadsFilterBar
            showFilters={showFilters}
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
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            partners={filterOptions.partners}
            lenders={filterOptions.lenders}
            managers={filterOptions.managers}
            associates={filterOptions.associates}
            onReset={() => {
              setStatusFilter("all")
              setLoanTypeFilter("all")
              setSearchTerm("")
              setPartnerFilter("all")
              setLenderFilter("all")
              setManagerFilter("all")
              setAssociateFilter("all")
              setDateRange({ startDate: null, endDate: null })
              setPage(0)
            }}
            onRefresh={() => {
              if (dataSource === "archived") {
                dispatch(fetchArchivedLeads())
              } else {
                dispatch(fetchAllLeads())
              }
              setSnackbar({
                open: true,
                message: "Data refreshed",
                severity: "success",
              })
            }}
            onExportCsv={handleExportCsv}
            onExportExcel={handleExportExcel}
          />
        </Box>

        {/* Scrollable table region */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mt: showFilters ? 1 : 0,
          }}
        >
          <Paper
            sx={{
              borderRadius: 0,
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <LeadsDataTable
              rows={filteredRows}
              page={page}
              rowsPerPage={rowsPerPage}
              loading={finalTableLoading}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              onOpenEdit={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setFormMode("edit")
                setFormOpen(true)
              }}
              onOpenDuplicate={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setFormMode("duplicate")
                setFormOpen(true)
              }}
              onOpenAssign={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setAssignOpen(true)
              }}
              onOpenStatus={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setStatusOpen(true)
              }}
              onOpenTimeline={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setTimelineOpen(true)
              }}
              onOpenDetails={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setDetailsOpen(true)
              }}
              onOpenDisbursement={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setApiDisbursementLead(api)
                setDisbursementOpen(true)
              }}
              onOpenDelete={(r) => {
                const api = apiLeads.find((l) => l.id === r.dbId)!
                setSelectedLead(prepareFormData(api))
                setDeleteOpen(true)
              }}
            />
          </Paper>
        </Box>
      </Box>

      {/* Dialogs & Snackbar */}
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
          setDisbursementOpen(false)
          setApiDisbursementLead(null)
        }}
        apiDisbursementLead={apiDisbursementLead}
        deleteOpen={deleteOpen}
        onDeleteClose={() => setDeleteOpen(false)}
        onRefresh={() => {
          if (dataSource === "archived") {
            dispatch(fetchArchivedLeads())
          } else {
            dispatch(fetchAllLeads())
          }
          setSnackbar({
            open: true,
            message: "Data refreshed",
            severity: "success",
          })
        }}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LeadsPage
