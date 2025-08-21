"use client"

import React, { useState, useEffect } from "react"
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
  useMediaQuery,
} from "@mui/material"
import { MoreVert, Timeline as TimelineIcon, Visibility, VisibilityOff } from "@mui/icons-material"
import { formatCurrency, getStatusColor } from "../utils/leadUtils"
import { useAuth } from "../../../hooks/useAuth"
import LeadsActionMenu from "./LeadsActionMenu"

const DotLegend = styled("span")(
  ({ theme }) => `
  position: relative;
  width: 6px;
  height: 6px;
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
)

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  overflowX: "auto",
  "& .MuiTable-root": {
    minWidth: 700,
    fontSize: "0.75rem",
    [theme.breakpoints.down("md")]: {
      minWidth: 550,
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 450,
      fontSize: "0.7rem",
    },
  },
  "& .MuiTableCell-root": {
    padding: "8px 10px",
    [theme.breakpoints.down("sm")]: {
      padding: "6px 8px",
      fontSize: "0.7rem",
    },
  },
  "& .MuiTableHead-root": {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    "& .MuiTableCell-head": {
      color: "#1e293b",
      fontWeight: 700,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
      borderBottom: "none",
      padding: "5px 8px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.65rem",
        padding: "8px 8px",
      },
      "&:first-of-type": {
        borderTopLeftRadius: "8px",
      },
      "&:last-of-type": {
        borderTopRightRadius: "8px",
      },
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        backgroundColor: "rgba(102, 126, 234, 0.04)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "& .timelineIcon": {
          visibility: "visible",
        },
      },
    },
    "& .MuiTableCell-body": {
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      padding: "8px 10px",
      fontSize: "0.75rem",
      [theme.breakpoints.down("sm")]: {
        padding: "6px 8px",
        fontSize: "0.7rem",
      },
    },
  },
  "& .MuiChip-root": {
    height: 22,
    fontSize: "0.65rem",
    padding: "0 6px",
    [theme.breakpoints.down("sm")]: {
      height: 20,
      fontSize: "0.6rem",
      padding: "0 4px",
    },
  },
  "& .MuiIconButton-root": {
    padding: "6px",
    [theme.breakpoints.down("sm")]: {
      padding: "4px",
    },
  },
}))

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  borderTop: "1px solid rgba(0, 0, 0, 0.06)",
  backgroundColor: "#f8fafc",
  flexShrink: 0,
  "& .MuiTablePagination-toolbar": {
    padding: "8px 16px",
    minHeight: "52px",
    [theme.breakpoints.down("sm")]: {
      padding: "6px 12px",
      minHeight: "48px",
    },
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: 500,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
  "& .MuiTablePagination-select": {
    fontSize: "0.75rem",
    margin: "0 4px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
  "& .MuiTablePagination-actions": {
    marginLeft: theme.spacing(1),
    "& button": {
      padding: "6px",
      [theme.breakpoints.down("sm")]: {
        padding: "4px",
      },
    },
  },
}))

// Skeleton row component
const SkeletonRow: React.FC<{
  showPartnerCol: boolean
  showAssociateCol: boolean
  showManagerCol: boolean
}> = ({ showPartnerCol, showAssociateCol, showManagerCol }) => (
  <TableRow>
    <TableCell>
      <Box>
        <Skeleton variant="text" width={60} height={16} />
        <Skeleton variant="text" width={80} height={12} />
      </Box>
    </TableCell>
    {showPartnerCol && (
      <TableCell>
        <Skeleton variant="text" width={70} height={16} />
        <Skeleton variant="text" width={50} height={12} />
      </TableCell>
    )}
    {showAssociateCol && (
      <TableCell>
        <Skeleton variant="text" width={70} height={16} />
        <Skeleton variant="text" width={45} height={12} />
      </TableCell>
    )}
    <TableCell>
      <Skeleton variant="text" width={85} height={16} />
      <Skeleton variant="text" width={65} height={12} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={75} height={16} />
      <Skeleton variant="text" width={90} height={12} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={55} height={16} />
      <Skeleton variant="text" width={60} height={12} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={50} height={16} />
    </TableCell>
    <TableCell>
      <Box display="flex" alignItems="center" gap={0.5}>
        <Skeleton variant="circular" width={6} height={6} />
        <Skeleton variant="text" width={55} height={16} />
      </Box>
      <Skeleton variant="text" width={70} height={12} />
    </TableCell>
    {showManagerCol && (
      <TableCell>
        <Skeleton variant="rounded" width={60} height={20} />
        <Skeleton variant="text" width={40} height={12} />
      </TableCell>
    )}
    <TableCell align="right">
      <Skeleton variant="circular" width={20} height={20} />
    </TableCell>
  </TableRow>
)

interface LeadsDataTableProps {
  rows: any[]
  page: number
  rowsPerPage: number
  loading: boolean
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newRows: number) => void
  onOpenEdit: (row: any) => void
  onOpenDuplicate: (row: any) => void
  onOpenAssign: (row: any) => void
  onOpenStatus: (row: any) => void
  onOpenTimeline: (row: any) => void
  onOpenDetails: (row: any) => void
  onOpenDisbursement: (row: any) => void
  onOpenDelete: (row: any) => void
}

const LeitStateCode: Record<string, string> = {
  Delhi: "DL",
  "Uttar Pradesh": "UP",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Karnataka: "KA",
  "Tamil Nadu": "TN",
  Gujarat: "GJ",
  Rajasthan: "RJ",
  "West Bengal": "WB",
  "Andhra Pradesh": "AP",
  Telangana: "TG",
  Bihar: "BR",
  Odisha: "OR",
  Assam: "AS",
  Punjab: "PB",
  Haryana: "HR",
  Jharkhand: "JH",
  "Himachal Pradesh": "HP",
  Uttarakhand: "UK",
  Chhattisgarh: "CG",
  Goa: "GA",
  Kerala: "KL",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Sikkim: "SK",
  Tripura: "TR",
  "Arunachal Pradesh": "AR",
  "Jammu and Kashmir": "JK",
  Ladakh: "LA",
  Puducherry: "PY",
  Chandigarh: "CH",
  "Dadra and Nagar Haveli and Daman and Diu": "DN",
  Lakshadweep: "LD",
  "Andaman and Nicobar Islands": "AN",
}

const getStateCode = (stateName: string) =>
  LeitStateCode[stateName] || stateName

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { userRole } = useAuth()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuDbId, setMenuDbId] = useState<string | null>(null)
  const [currentRowData, setCurrentRowData] = useState<any>(null)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)
// which row’s phone is revealed (null => all masked)
const [revealedRowId, setRevealedRowId] = useState<string | null>(null)

  useEffect(() => {
    if (rows.length > 0) {
      const maxPage = Math.ceil(rows.length / rowsPerPage) - 1
      if (page > maxPage) onPageChange(maxPage)
    } else if (rows.length === 0 && page > 0) {
      onPageChange(0)
    }
  }, [rows.length, page, rowsPerPage, onPageChange])

  useEffect(() => {
  const onDocClick = () => setRevealedRowId(null)
  document.addEventListener("click", onDocClick)
  return () => document.removeEventListener("click", onDocClick)
}, [])

  const handleMenuOpen = (
    e: React.MouseEvent<HTMLElement>,
    dbId: string,
    rowData: any
  ) => {
    e.stopPropagation()
    setMenuDbId(dbId)
    setCurrentRowData(rowData)
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuDbId(null)
    setCurrentRowData(null)
  }

  const showPartnerCol =
    userRole === "admin" || userRole === "manager"
  const showAssociateCol =
    userRole === "partner" && rows.some((r) => !!r.associateName)
  const showManagerCol = userRole !== "manager"

  const handleChangePage = (_: any, newPage: number) => {
    onPageChange(newPage)
  }

  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(+e.target.value)
    onPageChange(0)
  }
  // Mask phone helper: hides all digits except last 4, keeps non-digit formatting intact
function maskPhone(input?: string | null): string {
  if (!input) return ""
  const digits = input.replace(/\D/g, "")
  if (digits.length <= 4) return input

  const keep = 4
  const maskUntil = digits.length - keep
  let digitIdx = 0
  let masked = ""

  for (const ch of input) {
    if (/\d/.test(ch)) {
      masked += digitIdx < maskUntil ? "•" : ch // use bullet for cleaner look
      digitIdx++
    } else {
      masked += ch
    }
  }
  return masked
}


  return (
    <>
      <StyledTableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Lead Id</TableCell>
              {showPartnerCol && <TableCell>Partner</TableCell>}
              {showAssociateCol && <TableCell>Associate</TableCell>}
              <TableCell>Applicant</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Lender</TableCell>
              <TableCell>L-Amount</TableCell>
              <TableCell>Status</TableCell>
              {showManagerCol && <TableCell>Manager</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && rows.length === 0 ? (
              Array.from({ length: Math.min(rowsPerPage, 10) }).map(
                (_, idx) => (
                  <SkeletonRow
                    key={`skeleton-${idx}`}
                    showPartnerCol={showPartnerCol}
                    showAssociateCol={showAssociateCol}
                    showManagerCol={showManagerCol}
                  />
                )
              )
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    showPartnerCol
                      ? showAssociateCol
                        ? 10
                        : 9
                      : showAssociateCol
                      ? 9
                      : 8
                  }
                  align="center"
                  sx={{
                    py: 8,
                    color: "#64748b",
                    fontStyle: "italic",
                    backgroundColor: "#f9fafb",
                    borderBottom: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" color="textSecondary">
                      🚫 No leads available
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your filters or create a new lead to get
                      started
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((r) => {
                  const statusRaw = r.status || ""
                  const statusLabel =
                    statusRaw.charAt(0).toUpperCase() +
                    statusRaw.slice(1)
                  return (
                    <TableRow
                      key={r.dbId}
                      hover
                      onMouseEnter={() => setHoveredRowId(r.dbId)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      {/* Lead Id */}
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: "#667eea",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              "&:hover": { color: "#5a6fd8" },
                            }}
                            onClick={() => onOpenDetails(r)}
                          >
                            {r.leadId}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.65rem" }}
                          >
                            {r.createdAt &&
                              new Date(r.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "2-digit",
                                }
                              )}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Partner */}
                      {showPartnerCol && (
                        <TableCell>
                          <ListItemText
                            primary={r.partnerName}
                            secondary={
                              r.partnerId ? `(${r.partnerId})` : undefined
                            }
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 600,
                              color: "#1a1a1a",
                              fontSize: "0.75rem",
                            }}
                            secondaryTypographyProps={{
                              variant: "caption",
                              color: "text.secondary",
                              fontSize: "0.65rem",
                              noWrap: true,
                            }}
                          />
                        </TableCell>
                      )}

                      {/* Associate */}
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
                                variant: "body2",
                                fontWeight: 600,
                                color: "#764ba2",
                                fontSize: "0.75rem",
                              }}
                              secondaryTypographyProps={{
                                variant: "caption",
                                color: "text.secondary",
                                fontSize: "0.65rem",
                                noWrap: true,
                              }}
                            />
                          ) : (
                            <Chip
                              label="Not Applicable"
                              size="small"
                              sx={{
                                fontWeight: 500,
                                backgroundColor: "#f1f5f9",
                                color: "#64748b",
                                fontSize: "0.65rem",
                              }}
                            />
                          )}
                        </TableCell>
                      )}

                      {/* Applicant */}
                      <TableCell>
                        <ListItemText
                          primary={r.applicantName}
                          secondary={
                            r.applicantLocation
                              ? r.applicantLocation
                                  .split(", ")
                                  .map((part, idx, arr) =>
                                    idx === arr.length - 1
                                      ? getStateCode(part.trim())
                                      : part.trim()
                                  )
                                  .join(", ")
                              : ""
                          }
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 600,
                            color: "#059669",
                            fontSize: "0.75rem",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                            color: "text.secondary",
                            fontSize: "0.65rem",
                            noWrap: true,
                          }} />
                      </TableCell>

                      {/* Contact */}
             {/* Contact (masked with eye / eye-off) */}
<TableCell>
  {(() => {
    const isRevealed = revealedRowId === r.dbId
    const displayPhone = isRevealed ? r.applicantMobile : maskPhone(r.applicantMobile)
    return (
      <>
        {/* stopPropagation so clicks here don't trigger the global auto-mask */}
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              fontSize: "0.75rem",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              letterSpacing: "0.2px",
            }}
          >
            {displayPhone}
          </Typography>
          <Tooltip title={isRevealed ? "Hide" : "Show"}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setRevealedRowId((prev) => (prev === r.dbId ? null : r.dbId))
              }}
              sx={{
                ml: 0.5,
                color: isRevealed ? "#ef4444" : "#64748b",
                "&:hover": {
                  backgroundColor: "rgba(102,126,234,0.08)",
                  color: "#667eea",
                },
              }}
            >
              {isRevealed ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.65rem" }}
        >
          {r.applicantEmail}
        </Typography>
      </>
    )
  })()}
</TableCell>


                      {/* Lender */}
                      <TableCell>
                        {r.lenderName ? (
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {r.lenderName}
                          </Typography>
                        ) : (
                          <Chip
                            label="Not Provided"
                            size="small"
                            sx={{
                              fontWeight: 500,
                              backgroundColor: "#fef3c7",
                              color: "#92400e",
                              fontSize: "0.65rem",
                            }}
                          />
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ fontSize: "0.65rem" }}
                        >
                          {r.loanType}
                        </Typography>
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {formatCurrency(r.loanAmount)}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DotLegend
                            className="dot"
                            style={{ color: getStatusColor(statusRaw, theme) }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: getStatusColor(statusRaw, theme),
                              fontSize: "0.75rem",
                            }}
                          >
                            {statusLabel}
                          </Typography>
                          {!isMobile && (
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
                                  ml: 0.5,
                                  color: "#667eea",
                                  "&:hover": {
                                    backgroundColor:
                                      "rgba(102, 126, 234, 0.1)",
                                  },
                                }}
                                onClick={() => onOpenTimeline(r)}
                              >
                                <TimelineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 0.5, fontSize: "0.65rem" }}
                        >
                          {r.lastUpdate
                            ? new Date(r.lastUpdate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "2-digit",
                                }
                              ) +
                              ", " +
                              new Date(r.lastUpdate).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </Typography>
                      </TableCell>

                      {/* Manager */}
                      {showManagerCol && (
                        <TableCell>
                          {r.managerName ? (
                            <Chip
                              label={r.managerName}
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{
                                fontWeight: 500,
                                borderColor: "#667eea",
                                color: "#667eea",
                                backgroundColor:
                                  "rgba(102, 126, 234, 0.05)",
                                fontSize: "0.65rem",
                              }}
                            />
                          ) : (
                            <Chip
                              label="Unassigned"
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: "#e2e8f0",
                                color: "#64748b",
                                fontWeight: 500,
                                backgroundColor: "#f8fafc",
                                fontSize: "0.65rem",
                              }}
                            />
                          )}
                          {r.managerDisplayId && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ fontSize: "0.65rem" }}
                            >
                              ({r.managerDisplayId})
                            </Typography>
                          )}
                        </TableCell>
                      )}

                      {/* Actions */}
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, r.dbId, r)}
                          sx={{
                            color: "#64748b",
                            "&:hover": {
                              backgroundColor: "rgba(102,126,234,0.1)",
                              color: "#667eea",
                            },
                          }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                        <LeadsActionMenu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) && menuDbId === r.dbId
                          }
                          onClose={handleMenuClose}
                          onSelectAction={(action) => {
                            switch (action) {
                              case "view":
                                onOpenDetails(r)
                                break
                              case "edit":
                                onOpenEdit(r)
                                break
                              case "duplicate":
                                onOpenDuplicate(r)
                                break
                              case "assign":
                                onOpenAssign(r)
                                break
                              case "status":
                                onOpenStatus(r)
                                break
                              case "timeline":
                                onOpenTimeline(r)
                                break
                              case "disbursement":
                                onOpenDisbursement(r)
                                break
                              case "delete":
                                onOpenDelete(r)
                                break
                            }
                          }}
                          userRole={userRole as any}
                          rowData={currentRowData}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <StyledTablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default LeadsDataTable
