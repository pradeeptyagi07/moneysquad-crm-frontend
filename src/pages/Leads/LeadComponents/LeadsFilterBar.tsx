// src/components/Leads/LeadsFilterBar.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Paper,
  Grid,
  Autocomplete,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  styled,
  Divider,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Search,
  Refresh,
  RestartAlt,
  Business,
  AccountBalance,
  SupervisorAccount,
  AssignmentInd,
  ExpandMore,
  FileDownload,
  GridOn,
} from "@mui/icons-material";
import { fetchLoanTypes } from "../../../store/slices/lenderLoanSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAuth } from "../../../hooks/useAuth";

const FilterControl = styled(FormControl)(({ theme }) => ({
  position: "relative",
  "& .MuiInputLabel-root": {
    position: "absolute",
    top: -35,
    left: 1,
    backgroundColor: "transparent",
    padding: "0 4px",
    color: "#5569FF",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    height: 40,
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#5569FF" },
    "&.Mui-focused fieldset": { borderColor: "#5569FF", borderWidth: "2px" },
    "& .MuiInputBase-input": { padding: "10px 12px" },
  },
  "& .MuiAutocomplete-inputRoot .MuiAutocomplete-input": { padding: "10px 12px" },
}));

interface FilterOption { value: string; label: string; }
interface LeadsFilterBarProps {
  statusFilter: string;
  loanTypeFilter: string;
  searchTerm: string;
  partnerFilter: string;
  lenderFilter: string;
  managerFilter: string;
  associateFilter: string;
  onStatusChange: (v: string) => void;
  onLoanTypeChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onPartnerChange: (v: string) => void;
  onLenderChange: (v: string) => void;
  onManagerChange: (v: string) => void;
  onAssociateChange: (v: string) => void;
  partners: FilterOption[];
  lenders: FilterOption[];
  managers: FilterOption[];
  associates: FilterOption[];
  onReset: () => void;
  onRefresh?: () => void;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
}

const LeadsFilterBar: React.FC<LeadsFilterBarProps> = ({
  statusFilter,
  loanTypeFilter,
  searchTerm,
  partnerFilter,
  lenderFilter,
  managerFilter,
  associateFilter,
  onStatusChange,
  onLoanTypeChange,
  onSearchChange,
  onPartnerChange,
  onLenderChange,
  onManagerChange,
  onAssociateChange,
  partners,
  lenders,
  managers,
  associates,
  onReset,
  onRefresh,
  onExportCsv,
  onExportExcel,
}) => {
  const dispatch = useAppDispatch();
  const { userRole } = useAuth();
  const [fetched, setFetched] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const loanTypes = useAppSelector((s) => s.lenderLoan.loanTypes);
  useEffect(() => {
    if (!fetched) { dispatch(fetchLoanTypes()); setFetched(true); }
  }, [dispatch, fetched]);

  const statusOptions = useMemo<FilterOption[]>(() => [
    { value: "all", label: "All" },
    { value: "new lead", label: "New Lead" },
    { value: "pending", label: "Pending" },
    { value: "login", label: "Login" },
    { value: "approved", label: "Approved" },
    { value: "disbursed", label: "Disbursed" },
    { value: "closed", label: "Closed" },
        { value: "rejected", label: "Rejected" },

    { value: "expired", label: "Expired" },
  ], []);

  const loanOptions = useMemo<FilterOption[]>(() => [
    { value: "all", label: "All" },
    ...loanTypes.map((l) => ({ value: l.name, label: l.name }))
  ], [loanTypes]);

  const hasActive = useMemo(() =>
    statusFilter !== "all" ||
    loanTypeFilter !== "all" ||
    searchTerm !== "" ||
    partnerFilter !== "all" ||
    lenderFilter !== "all" ||
    managerFilter !== "all" ||
    associateFilter !== "all"
  , [statusFilter, loanTypeFilter, searchTerm, partnerFilter, lenderFilter, managerFilter, associateFilter]);

  const showPartner = ["admin","manager"].includes(userRole);
  const showManager = ["admin","partner"].includes(userRole);
  const showAssociate = userRole === "partner";
  const canExport = ["admin","partner"].includes(userRole) && (onExportCsv || onExportExcel);

  return (
    <Paper sx={{ p:3, mb:3, border:"1px solid", borderColor:"divider", borderRadius:2 }}>
      <Grid container spacing={2} alignItems="flex-start">
        {/* Applicant */}
        <Grid item xs={12} md={3}>
          <FilterControl fullWidth>
            <InputLabel>
              <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                <Search fontSize="small"/>Applicant
              </Box>
            </InputLabel>
            <TextField
              value={searchTerm}
              onChange={(e)=>onSearchChange(e.target.value)}
              placeholder="Search applicant..."
              size="small"
              fullWidth
            />
          </FilterControl>
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={2}>
          <FilterControl fullWidth>
            <InputLabel>
              <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                <Search fontSize="small"/>Status
              </Box>
            </InputLabel>
            <Autocomplete
              options={statusOptions}
              getOptionLabel={(o)=>o.label}
              value={statusOptions.find(o=>o.value===statusFilter)||statusOptions[0]}
              onChange={(_,v)=> onStatusChange(v?.value||"all")}
              size="small"
              renderInput={(params)=><TextField {...params} placeholder="Select status..." />}
            />
          </FilterControl>
        </Grid>

        {/* Loan */}
        <Grid item xs={12} md={2}>
          <FilterControl fullWidth>
            <InputLabel>
              <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                <Search fontSize="small"/>Loan Type
              </Box>
            </InputLabel>
            <Autocomplete
              options={loanOptions}
              getOptionLabel={(o)=>o.label}
              value={loanOptions.find(o=>o.value===loanTypeFilter)||loanOptions[0]}
              onChange={(_,v)=> onLoanTypeChange(v?.value||"all")}
              size="small"
              renderInput={(params)=><TextField {...params} placeholder="Select loan..." />}
            />
          </FilterControl>
        </Grid>

        {/* Actions */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display:"flex", justifyContent:"flex-end", gap:2, pt:1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh} size="small" disabled={!onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Filters">
              <IconButton onClick={onReset} size="small" color={hasActive?"primary":"default"}>
                <RestartAlt />
              </IconButton>
            </Tooltip>
            {canExport && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ExpandMore />}
                  onClick={(e)=>setMenuAnchor(e.currentTarget)}
                >
                  Export
                </Button>
               <Menu
  anchorEl={menuAnchor}
  open={Boolean(menuAnchor)}
  onClose={() => setMenuAnchor(null)}
  PaperProps={{ sx: { mt: 1, minWidth: 60, borderRadius: 1 } }}
>
  {onExportCsv && (
    <MenuItem onClick={() => { onExportCsv(); setMenuAnchor(null); }}>
  CSV
    </MenuItem>
  )}
  {onExportExcel && (
    <MenuItem onClick={() => { onExportExcel(); setMenuAnchor(null); }}>
Excel
    </MenuItem>
  )}
</Menu>

              </>
            )}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my:3 }} />

      <Grid container spacing={2} alignItems="flex-start">
        {showPartner && (
          <Grid item xs={12} md={3}>
            <FilterControl fullWidth>
              <InputLabel>
                <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                  <Business fontSize="small"/>Partner
                </Box>
              </InputLabel>
              <Autocomplete
                options={[{value:"all",label:"All Partners"},...partners]}
                getOptionLabel={o=>o.label}
                value={[{value:"all",label:"All Partners"},...partners].find(o=>o.value===partnerFilter)!}
                onChange={(_,v)=>onPartnerChange(v?.value||"all")}
                size="small"
                renderInput={params=><TextField {...params} placeholder="Search partner..." />}
              />
            </FilterControl>
          </Grid>
        )}
        <Grid item xs={12} md={3}>
          <FilterControl fullWidth>
            <InputLabel>
              <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                <AccountBalance fontSize="small"/>Lender
              </Box>
            </InputLabel>
            <Autocomplete
              options={[{value:"all",label:"All Lenders"},...lenders]}
              getOptionLabel={o=>o.label}
              value={[{value:"all",label:"All Lenders"},...lenders].find(o=>o.value===lenderFilter)!}
              onChange={(_,v)=>onLenderChange(v?.value||"all")}
              size="small"
              renderInput={params=><TextField {...params} placeholder="Search lender..." />}
            />
          </FilterControl>
        </Grid>
        {showManager && (
          <Grid item xs={12} md={3}>
            <FilterControl fullWidth>
              <InputLabel>
                <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                  <SupervisorAccount fontSize="small"/>Manager
                </Box>
              </InputLabel>
              <Autocomplete
                options={[{value:"all",label:"All Managers"},...managers]}
                getOptionLabel={o=>o.label}
                value={[{value:"all",label:"All Managers"},...managers].find(o=>o.value===managerFilter)!}
                onChange={(_,v)=>onManagerChange(v?.value||"all")}
                size="small"
                renderInput={params=><TextField {...params} placeholder="Search manager..." />}
              />
            </FilterControl>
          </Grid>
        )}
        {showAssociate && (
          <Grid item xs={12} md={3}>
            <FilterControl fullWidth>
              <InputLabel>
                <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                  <AssignmentInd fontSize="small"/>Associate
                </Box>
              </InputLabel>
              <Autocomplete
                options={[{value:"all",label:"All Associates"},...associates]}
                getOptionLabel={o=>o.label}
                value={[{value:"all",label:"All Associates"},...associates].find(o=>o.value===associateFilter)!}
                onChange={(_,v)=>onAssociateChange(v?.value||"all")}
                size="small"
                renderInput={params=><TextField {...params} placeholder="Search associate..." />}
              />
            </FilterControl>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default LeadsFilterBar;
