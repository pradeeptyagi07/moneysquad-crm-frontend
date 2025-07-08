// src/components/Leads/LeadsDataTable.tsx
"use client";

import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  useTheme,
  styled,
  Box,
  ListItemText,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { MoreVert, Timeline as TimelineIcon } from "@mui/icons-material";
import {
  formatCurrency,
  getStatusColor,
} from "../utils/leadUtils";
import { useAuth } from "../../../hooks/useAuth";
import LeadsActionMenu from "./LeadsActionMenu";

const DotLegend = styled("span")(
  ({ theme }) => `
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: currentColor;
  margin-right: ${theme.spacing(0.5)};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
    opacity: 0.6;
    animation: ripple 1.5s infinite ease-out;
  }

  @keyframes ripple {
    0%   { transform: scale(1);   opacity: 0.6; }
    70%  { transform: scale(2);   opacity: 0;   }
    100% { transform: scale(2);   opacity: 0;   }
  }
`
);

interface LeadsDataTableProps {
  rows: any[];
  page: number;
  rowsPerPage: number;
  loading: boolean; // loading flag for skeletons
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
  onOpenEdit: (row: any) => void;
  onOpenDuplicate: (row: any) => void;
  onOpenAssign: (row: any) => void;
  onOpenStatus: (row: any) => void;
  onOpenTimeline: (row: any) => void;
  onOpenDetails: (row: any) => void;
  onOpenDisbursement: (row: any) => void;
  onOpenDelete: (row: any) => void;
}

const LeadsDataTable: React.FC<LeadsDataTableProps> = ({
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onOpenEdit,
  onOpenDuplicate,
  onOpenAssign,
  onOpenStatus,
  onOpenTimeline,
  onOpenDetails,
  onOpenDisbursement,
  onOpenDelete,
  loading,

}) => {
  const theme = useTheme();
  const { userRole } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDbId, setMenuDbId] = useState<string | null>(null);
  const [currentRowData, setCurrentRowData] = useState<any>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const handleMenuOpen = (
    e: React.MouseEvent<HTMLElement>,
    dbId: string,
    rowData: any
  ) => {
    e.stopPropagation();
    setMenuDbId(dbId);
    setCurrentRowData(rowData);
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDbId(null);
    setCurrentRowData(null);
  };

  const showPartnerCol = userRole === "admin" || userRole === "manager";
  const showAssociateCol =
    userRole === "partner" && rows.some((r) => Boolean(r.associateName));
  const showManagerCol = userRole !== "manager";

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(+e.target.value);
    onPageChange(0);
  };

  return (
    <>
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table
          stickyHeader
          sx={{
            minWidth: 1600,
            "& .MuiTableRow-root:hover .timelineIcon": {
              visibility: "visible",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Lead ID</TableCell>
              {showPartnerCol && <TableCell>Partner</TableCell>}
              {showAssociateCol && <TableCell>Associate</TableCell>}
              <TableCell>Applicant</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Lender</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Status</TableCell>
              {showManagerCol && <TableCell>Manager</TableCell>}
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}> 
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  {showPartnerCol && <TableCell><Skeleton variant="text" width={100} /></TableCell>}
                  {showAssociateCol && <TableCell><Skeleton variant="text" width={100} /></TableCell>}
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} /></TableCell>
                  {showManagerCol && <TableCell><Skeleton variant="text" width={100} /></TableCell>}
                  <TableCell><Skeleton variant="text" width={140} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    showPartnerCol
                      ? showAssociateCol
                        ? 11
                        : 10
                      : showAssociateCol
                      ? 10
                      : 9
                  }
                  align="center"
                >
                  No leads available.
                </TableCell>
              </TableRow>
            ) : (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((r) => {
                  const statusRaw = r.status || "";
                  const statusLabel =
                    statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

                  return (
                    <TableRow
                      hover
                      key={r.dbId}
                      onMouseEnter={() => setHoveredRowId(r.dbId)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                              color: "primary.main",
                            },
                          }}
                          onClick={() => onOpenDetails(r)}
                        >
                          {r.leadId}
                        </Typography>
                      </TableCell>

                      {showPartnerCol && (
                        <TableCell>
                          <ListItemText
                            primary={r.partnerName}
                            secondary={r.partnerId ? `(${r.partnerId})` : undefined}
                            primaryTypographyProps={{
                              variant: "h6",
                              fontWeight: 500,
                              color: "primary.main",
                            }}
                            secondaryTypographyProps={{
                              variant: "subtitle2",
                              color: "text.secondary",
                              noWrap: true,
                            }}
                          />
                        </TableCell>
                      )}

                      {showAssociateCol && (
                        <TableCell>
                          {r.associateName ? (
                            <ListItemText
                              primary={r.associateName}
                              secondary={
                                r.associateDisplayId
                                  ? `(${r.associateDisplayId})`
                                  : undefined
                              }
                              primaryTypographyProps={{
                                variant: "h6",
                                fontWeight: 500,
                                color: "secondary.main",
                              }}
                              secondaryTypographyProps={{
                                variant: "subtitle2",
                                color: "text.secondary",
                                noWrap: true,
                              }}
                            />
                          ) : (
                            <Chip
                              label="Not Applicable"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </TableCell>
                      )}

                      <TableCell>
                        <ListItemText
                          primary={r.applicantName}
                          secondary={r.applicantLocation}
                          primaryTypographyProps={{
                            variant: "h6",
                            fontWeight: 500,
                            color: "#4caf50",
                          }}
                          secondaryTypographyProps={{
                            variant: "subtitle2",
                            color: "text.secondary",
                            noWrap: true,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography>{r.applicantMobile}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.applicantEmail}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {r.lenderName ? (
                          <Typography fontWeight={500}>{r.lenderName}</Typography>
                        ) : (
                          <Chip
                            label="Not Provided"
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {r.loanType}
                        </Typography>
                      </TableCell>

                      <TableCell>{formatCurrency(r.loanAmount)}</TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DotLegend
                            className="dot"
                            style={{ color: getStatusColor(statusRaw, theme) }}
                          />
                          <Typography
                            variant="h4"
                            sx={{
                              fontSize: theme.typography.pxToRem(14),
                              lineHeight: 1,
                              color: getStatusColor(statusRaw, theme),
                            }}
                          >
                            {statusLabel}
                          </Typography>

                          <Tooltip
                            title="View Timeline"
                            placement="top"
                            arrow
                            open={hoveredRowId === r.dbId}
                            disableHoverListener
                            disableFocusListener
                            disableTouchListener
                          >
                            <IconButton
                              size="small"
                              className="timelineIcon"
                              sx={{
                                visibility: "hidden",
                                ml: 1,
                              }}
                              onClick={() => onOpenTimeline(r)}
                            >
                              <TimelineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          {r.lastUpdate
                            ? new Date(r.lastUpdate).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : ""}
                        </Typography>
                      </TableCell>

                      {showManagerCol && (
                        <TableCell>
                          {r.managerName ? (
                            <Chip
                              label={r.managerName}
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
                          {r.managerDisplayId && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              ({r.managerDisplayId})
                            </Typography>
                          )}
                        </TableCell>
                      )}

                      <TableCell>
                        {r.createdAt &&
                          new Date(r.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, r.dbId, r)}
                        >
                          <MoreVert />
                        </IconButton>
                        <LeadsActionMenu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && menuDbId === r.dbId}
                          onClose={handleMenuClose}
                          onSelectAction={(action) => {
                            switch (action) {
                              case "view":
                                onOpenDetails(r);
                                break;
                              case "edit":
                                onOpenEdit(r);
                                break;
                              case "duplicate":
                                onOpenDuplicate(r);
                                break;
                              case "assign":
                                onOpenAssign(r);
                                break;
                              case "status":
                                onOpenStatus(r);
                                break;
                              case "timeline":
                                onOpenTimeline(r);
                                break;
                              case "disbursement":
                                onOpenDisbursement(r);
                                break;
                              case "delete":
                                onOpenDelete(r);
                                break;
                            }
                          }}
                          userRole={userRole as any}
                          rowData={currentRowData}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default LeadsDataTable;
