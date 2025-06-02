"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Add,
  Search,
  FilterAlt,
  Clear,
  MoreVert,
  Person,
  Business,
  Visibility,
  Edit,
  Assignment,
  History,
  Delete,
  AttachMoney,
  FileCopy,
} from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAuth } from "../../hooks/useAuth";
import {
  createLead,
  fetchAllLeads,
  updateLead,
  clearLeadState,
} from "../../store/slices/leadSLice";
import {
  formatCurrency,
  getStatusColor,
  getStatusIcon,
} from "./utils/leadUtils";
import LeadForm from "./components/LeadForm";
import LeadDetailsDialog from "./components/LeadDetailsDialog";
import AssignLeadDialog from "./components/AssignLeadDialog";
import StatusUpdateDialog from "./components/StatusUpdateDialog";
import LeadTimelineDialog from "./components/LeadTimelineDialog";
import DisbursementDialog from "./components/DisbursementDialog";
import LeadDeleteDialog from "./components/LeadDeleteDialog";

const LeadsTable: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { userRole } = useAuth();
  const { leads: apiLeads, success, error } = useAppSelector((s) => s.leads);

  // Dialog / selection state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [disbursementOpen, setDisbursementOpen] = useState(false);
  const [duplicateMode, setDuplicateMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Selection
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedDbId, setSelectedDbId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDbId, setMenuDbId] = useState<string | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as any,
  });

  // Filters & pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [partnerFilter, setPartnerFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch
  useEffect(() => {
    dispatch(fetchAllLeads());
  }, [dispatch]);

  // Close on success
  useEffect(() => {
    if (success === "Lead updated!" && editOpen) {
      setEditOpen(false);
      setSnackbar({ open: true, message: success, severity: "success" });
      dispatch(clearLeadState());
    }
    if (duplicateMode && success === "Lead created!" && editOpen) {
      setEditOpen(false);
      setDuplicateMode(false);
      setSnackbar({
        open: true,
        message: "Lead duplicated!",
        severity: "success",
      });
      dispatch(clearLeadState());
    }
  }, [success, editOpen, dispatch, duplicateMode]);

  // Map rows
  const rows = useMemo(
    () =>
      apiLeads.map((l) => ({
        dbId: l.id!,
        displayId: l.leadId || l.id,
        partner: l.parnetId?.basicInfo?.fullName || "NA",
        manager: l.manager,
        status: l.status || "NA",
        createdAt: l.createdAt || "",
        applicantName: l.applicant.name,
        applicantProfile: l.applicant.profile,
        email: l.applicant.email,
        loanType: l.loan.type,
        loanAmount:
          typeof l.loan.amount === "string" ? +l.loan.amount : l.loan.amount,
      })),
    [apiLeads]
  );

  // Filters
  const filteredRows = useMemo(() => {
    let f = rows.slice();
    if (statusFilter !== "all") f = f.filter((r) => r.status === statusFilter);
    if (loanTypeFilter !== "all")
      f = f.filter((r) => r.loanType === loanTypeFilter);
    if (partnerFilter !== "all")
      f = f.filter((r) => r.partner === partnerFilter);
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      f = f.filter(
        (r) =>
          r.displayId.toLowerCase().includes(s) ||
          r.applicantName.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s)
      );
    }
    return f;
  }, [rows, statusFilter, loanTypeFilter, partnerFilter, searchTerm]);

  // Menu
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, dbId: string) => {
    e.stopPropagation();
    setMenuDbId(dbId);
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDbId(null);
  };

  // Action openers
  const openDetails = (dbId: string) => {
    setSelectedDbId(dbId);
    setDetailsOpen(true);
    handleMenuClose();
  };
  const openEdit = () => {
    if (!menuDbId) return;
    setSelectedRow(apiLeads.find((l) => l.id === menuDbId)!);
    setEditOpen(true);
    handleMenuClose();
  };
  const openDuplicate = () => {
    if (!menuDbId) return;
    const lead = apiLeads.find((l) => l.id === menuDbId)!;
    setSelectedRow(lead);
    setDuplicateMode(true);
    setEditOpen(true);
    handleMenuClose();
  };
  const openAssign = () => {
    if (!menuDbId) return;
    setSelectedRow(apiLeads.find((l) => l.id === menuDbId)!);
    setAssignOpen(true);
    handleMenuClose();
  };
  const openStatus = () => {
    if (!menuDbId) return;
    setSelectedRow(apiLeads.find((l) => l.id === menuDbId)!);
    setStatusOpen(true);
    handleMenuClose();
  };
  const openTimeline = () => {
    if (!menuDbId) return;
    const lead = apiLeads.find((l) => l.id === menuDbId);
    if (!lead) return;
    setSelectedRow(lead);
    setTimelineOpen(true);
    handleMenuClose();
  };
  const openDisbursement = () => {
    if (!menuDbId) return;
    setSelectedRow(apiLeads.find((l) => l.id === menuDbId)!);
    setDisbursementOpen(true);
    handleMenuClose();
  };
  const handleDeleteLead = () => {
    const lead = apiLeads.find((l) => l.id === menuDbId)!;
    setSelectedRow(lead);
    setDeleteOpen(true);
    handleMenuClose();
  };

  // Handlers
  const handleCreateLead = async (data: any) => {
    // if we're duplicating, take the original partnerId from the selected lead
    const partnerId = duplicateMode
      ? selectedRow.parnetId._id
      : userRole !== "admin"
      ? JSON.parse(localStorage.getItem("user") || "{}").id
      : data.partnerId;

    if (!partnerId) {
      return setSnackbar({
        open: true,
        message: "Partner ID missing",
        severity: "error",
      });
    }

    const payload = {
      partnerId,
      leadData: {
        applicant: {
          name: data.applicantName,
          profile: data.applicantProfile,
          // include businessName when profile === "Business"
          ...(data.applicantProfile === "Business" && {
            businessName: data.businessName,
          }),

          mobile: data.mobileNumber,
          email: data.email,
          pincode: data.pincode,
        },
        loan: {
          type: data.loanType,
          amount: String(data.loanAmount),
          comments: data.comments,
        },
      },
    };

    try {
      await dispatch(createLead(payload)).unwrap();
      dispatch(fetchAllLeads());
      setSnackbar({
        open: true,
        message: duplicateMode ? "Lead duplicated!" : "Lead created!",
        severity: "success",
      });
      setCreateOpen(false);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: `Error: ${err.message}`,
        severity: "error",
      });
    }
  };
  const handleEditLead = async (data: any) => {
    if (!selectedRow) return;
    const payload = {
      leadId: selectedRow.id,
      leadData: {
        applicant: {
          name: data.applicantName,
          profile: data.applicantProfile,
                // include businessName when profile === "Business"
       ...(data.applicantProfile === "Business" && {
          businessName: data.businessName,
        }),

          mobile: data.mobileNumber,
          email: data.email,
          pincode: data.pincode,
        },
        loan: {
          type: data.loanType,
          amount: String(data.loanAmount),
          comments: data.comments,
        },
        lenderType: data.lenderType,
      },
    };
    try {
      await dispatch(updateLead(payload)).unwrap();
      dispatch(fetchAllLeads());
      setSnackbar({
        open: true,
        message: "Lead updated!",
        severity: "success",
      });
      setEditOpen(false);
    } catch (err: any) {
      setSnackbar({ open: true, message: `Error: ${err}`, severity: "error" });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Lead Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateOpen(true)}
        >
          Create New Lead
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="disbursed">Disbursed</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Loan Type"
              value={loanTypeFilter}
              onChange={(e) => setLoanTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="PL-Term Loan">PL-Term Loan</MenuItem>
              <MenuItem value="PL-Overdraft">PL-Overdraft</MenuItem>
              <MenuItem value="BL-Term Loan">BL-Term Loan</MenuItem>
              <MenuItem value="BL-Overdraft">CBL-Overdraft</MenuItem>
              <MenuItem value="SEPL-Term Loan">SEPL-Term Loan</MenuItem>
              <MenuItem value="SEPL-Overdraft">SEPL-Overdraft</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              placeholder="Name, Email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={() => {
              setStatusFilter("all");
              setLoanTypeFilter("all");
              setPartnerFilter("all");
              setSearchTerm("");
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2, mb: 4 }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Lead ID</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>Loan Details</TableCell>
                <TableCell>Partner</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No leads available. Please create a new lead to proceed.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => {
                    // filter menu items per role/status
                    const rawMenu = [
                      {
                        icon: <Visibility fontSize="small" />,
                        label: "View Details",
                        action: () => openDetails(r.dbId),
                      },
                      {
                        icon: <Edit fontSize="small" />,
                        label: "Edit Lead",
                        action: openEdit,
                      },
                      {
                        icon: <FileCopy fontSize="small" />,
                        label: "Duplicate Lead",
                        action: openDuplicate,
                      },
                      {
                        icon: <Assignment fontSize="small" />,
                        label: "Assign Lead",
                        action: openAssign,
                      },
                      {
                        icon: <Edit fontSize="small" />,
                        label: "Update Status",
                        action: openStatus,
                      },
                      {
                        icon: <History fontSize="small" />,
                        label: "View Timeline",
                        action: openTimeline,
                      },
                      {
                        icon: <AttachMoney fontSize="small" />,
                        label: "Disbursement Details",
                        action: openDisbursement,
                      },
                      {
                        icon: <Delete fontSize="small" />,
                        label: "Delete Lead",
                        action: handleDeleteLead,
                      },
                    ];

                    // Start with all eight
                    let menuItems = [...rawMenu];

                    // 1) Disbursement only when disbursed
                    if (r.status !== "disbursed") {
                      menuItems = menuItems.filter(
                        (i) => i.label !== "Disbursement Details"
                      );
                    }

                    // 2) Role‐based filtering
                    if (userRole === "admin") {
                      // no further filtering
                    } else if (userRole === "manager") {
                      // never delete
                      menuItems = menuItems.filter(
                        (i) => i.label !== "Delete Lead"
                      );
                      // once disbursed, also hide edit
                      if (r.status === "disbursed") {
                        menuItems = menuItems.filter(
                          (i) => i.label !== "Edit Lead"
                        );
                      }
                    } else if (userRole === "partner") {
                      // always hide duplicate, disbursement, assign, update‐status
                      menuItems = menuItems.filter(
                        (i) =>
                          ![
                            "Duplicate Lead",
                            "Disbursement Details",
                            "Assign Lead",
                            "Update Status",
                          ].includes(i.label)
                      );
                      // if a manager is assigned, also hide edit & delete
                      if (r.manager) {
                        menuItems = menuItems.filter(
                          (i) => !["Edit Lead", "Delete Lead"].includes(i.label)
                        );
                      }
                    }

                    return (
                      <TableRow hover key={r.dbId}>
                        <TableCell>{r.displayId}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                bgcolor: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                              }}
                            >
                              {r.applicantProfile === "Business" ? (
                                <Business fontSize="small" />
                              ) : (
                                <Person fontSize="small" />
                              )}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={500}>
                                {r.applicantName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {r.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>{r.loanType}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(r.loanAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell>{r.partner}</TableCell>
                        <TableCell>
                          {r.manager ? (
                            <Chip
                              label={r.manager}
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            <Chip
                              label="Unassigned"
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: theme.palette.grey[300],
                                color: theme.palette.text.disabled,
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(r.status)}
                            label={
                              r.status.charAt(0).toUpperCase() +
                              r.status.slice(1)
                            }
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(r.status, theme) + "20",
                              color: getStatusColor(r.status, theme),
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : "NA"}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, r.dbId)}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && menuDbId === r.dbId}
                            onClose={handleMenuClose}
                            PaperProps={{ sx: { borderRadius: 2 } }}
                          >
                            {menuItems.map(({ icon, label, action }) => (
                              <MenuItem
                                key={label}
                                onClick={action}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  px: 2,
                                  py: 1,
                                  gap: 1,
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                }}
                              >
                                {React.cloneElement(icon as any, {
                                  sx: { color: theme.palette.primary.main },
                                })}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    color: theme.palette.text.primary,
                                  }}
                                >
                                  {label}
                                </Typography>
                              </MenuItem>
                            ))}
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </Paper>

      {/* Dialogs */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create New Lead</DialogTitle>
        <DialogContent>
          <LeadForm
            onSubmit={handleCreateLead}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setDuplicateMode(false);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {duplicateMode ? "Duplicate Lead" : "Edit Lead"}
        </DialogTitle>
        <DialogContent>
          {selectedRow && (
            <LeadForm
              initialData={selectedRow}
              isEdit={!duplicateMode}
              isDuplicate={duplicateMode}
              onSubmit={duplicateMode ? handleCreateLead : handleEditLead}
              onCancel={() => {
                setEditOpen(false);
                setDuplicateMode(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {selectedRow && (
        <AssignLeadDialog
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          lead={selectedRow}
        />
      )}
      {selectedRow && (
        <StatusUpdateDialog
          open={statusOpen}
          onClose={() => setStatusOpen(false)}
          lead={selectedRow}
        />
      )}
      {selectedRow && (
        <LeadTimelineDialog
          open={timelineOpen}
          onClose={() => setTimelineOpen(false)}
          lead={selectedRow}
        />
      )}
      <LeadDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        leadId={selectedDbId!}
      />
      {selectedRow && (
        <DisbursementDialog
          open={disbursementOpen}
          onClose={() => setDisbursementOpen(false)}
          lead={selectedRow}
        />
      )}
      {selectedRow && (
        <LeadDeleteDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          leadId={selectedRow.id}
          leadName={selectedRow.applicant.name}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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

export default LeadsTable;
