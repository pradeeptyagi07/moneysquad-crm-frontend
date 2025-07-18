// src/components/Leads/LeadsDataTable.tsx
"use client"

import type React from "react"
import { useState } from "react"
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
} from "@mui/material"
import { MoreVert, Timeline as TimelineIcon } from "@mui/icons-material"
import { formatCurrency, getStatusColor } from "../utils/leadUtils"
import { useAuth } from "../../../hooks/useAuth"
import LeadsActionMenu from "./LeadsActionMenu"

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
`,
)

interface LeadsDataTableProps {
  rows: any[]
  page: number
  rowsPerPage: number
  loading: boolean // loading flag for skeletons
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

// Helper function to convert state names to codes
const getStateCode = (stateName: string): string => {
  const stateCodeMap: { [key: string]: string } = {
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

  return stateCodeMap[stateName] || stateName
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
  const theme = useTheme()
  const { userRole } = useAuth()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuDbId, setMenuDbId] = useState<string | null>(null)
  const [currentRowData, setCurrentRowData] = useState<any>(null)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, dbId: string, rowData: any) => {
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

  const showPartnerCol = userRole === "admin" || userRole === "manager"
  const showAssociateCol = userRole === "partner" && rows.some((r) => Boolean(r.associateName))
  const showManagerCol = userRole !== "manager"

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage)
  }
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(+e.target.value)
    onPageChange(0)
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table
          stickyHeader
          sx={{
            minWidth: 1420,
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
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  {showPartnerCol && (
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  )}
                  {showAssociateCol && (
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  )}
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={60} />
                  </TableCell>
                  {showManagerCol && (
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Skeleton variant="circular" width={24} height={24} />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showPartnerCol ? (showAssociateCol ? 10 : 9) : showAssociateCol ? 9 : 8}
                  align="left"
                  sx={{
                    color: "#64748b",
                    fontStyle: "italic",
                    paddingY: 2,
                    backgroundColor: "#f9fafb",
                    borderBottom: "none",
                  }}
                >
                  🚫 No leads available at the moment.
                </TableCell>
              </TableRow>
            ) : (
              rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => {
                const statusRaw = r.status || ""
                const statusLabel = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1)

                return (
                  <TableRow
                    hover
                    key={r.dbId}
                    onMouseEnter={() => setHoveredRowId(r.dbId)}
                    onMouseLeave={() => setHoveredRowId(null)}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: "primary.main",
                            fontWeight: 500,
                            "&:hover": {
                              color: "primary.dark",
                            },
                          }}
                          onClick={() => onOpenDetails(r)}
                        >
                          {r.leadId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.createdAt &&
                            new Date(r.createdAt).toLocaleString("en-IN", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                        </Typography>
                      </Box>
                    </TableCell>

                    {showPartnerCol && (
                      <TableCell>
                        <ListItemText
                          primary={r.partnerName}
                          secondary={r.partnerId ? `(${r.partnerId})` : undefined}
                          primaryTypographyProps={{
                            variant: "h6",
                            fontWeight: 500,
                            color: "black",
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
                            secondary={r.associateDisplayId ? `(${r.associateDisplayId})` : undefined}
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
                          <Chip label="Not Applicable" size="small" sx={{ fontWeight: 500 }} />
                        )}
                      </TableCell>
                    )}

                    <TableCell>
                      <ListItemText
                        primary={r.applicantName}
                        secondary={
                          r.applicantLocation
                            ? r.applicantLocation
                                .split(", ")
                                .map((part: string, index: number, array: string[]) => {
                                  if (index === array.length - 1) {
                                    // Last part is the state, convert to code
                                    return getStateCode(part.trim())
                                  }
                                  return part.trim()
                                })
                                .join(", ")
                            : ""
                        }
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
                        <Chip label="Not Provided" size="small" sx={{ fontWeight: 500 }} />
                      )}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {r.loanType}
                      </Typography>
                    </TableCell>

                    <TableCell>{formatCurrency(r.loanAmount)}</TableCell>

                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <DotLegend className="dot" style={{ color: getStatusColor(statusRaw, theme) }} />
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
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
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
                          <Typography variant="caption" color="text.secondary" display="block">
                            ({r.managerDisplayId})
                          </Typography>
                        )}
                      </TableCell>
                    )}

                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, r.dbId, r)}>
                        <MoreVert />
                      </IconButton>
                      <LeadsActionMenu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuDbId === r.dbId}
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
  )
}

export default LeadsDataTable
