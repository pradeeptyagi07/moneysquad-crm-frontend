"use client"

// src/components/Leads/LeadsDataTable.tsx

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
} from "@mui/material"
import { MoreVert } from "@mui/icons-material"
import { formatCurrency, getStatusColor, getStatusIcon } from "../utils/leadUtils"
import { useAuth } from "../../../hooks/useAuth"
import LeadsActionMenu from "./LeadsActionMenu"

interface LeadsDataTableProps {
  rows: any[]
  page: number
  rowsPerPage: number
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newSize: number) => void
  onOpenEdit: (lead: any) => void
  onOpenDuplicate: (lead: any) => void
  onOpenAssign: (lead: any) => void
  onOpenStatus: (lead: any) => void
  onOpenTimeline: (lead: any) => void
  onOpenDetails: (lead: any) => void
  onOpenDisbursement: (lead: any) => void
  onOpenDelete: (lead: any) => void
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
}) => {
  const theme = useTheme()
  const { userRole } = useAuth()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuDbId, setMenuDbId] = useState<string | null>(null)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, dbId: string) => {
    e.stopPropagation()
    setMenuDbId(dbId)
    setAnchorEl(e.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuDbId(null)
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
        <Table stickyHeader>
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
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showPartnerCol ? (showAssociateCol ? 11 : 10) : showAssociateCol ? 10 : 9}
                  align="center"
                >
                  No leads available.
                </TableCell>
              </TableRow>
            ) : (
              rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => {
                const statusRaw = r.status || ""
                const statusLabel = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1)

                return (
                  <TableRow hover key={r.dbId}>
                    <TableCell>{r.leadId}</TableCell>

                    {showPartnerCol && (
                      <TableCell>
                        <Typography fontWeight={500}>{r.partnerName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({r.partnerId})
                        </Typography>
                      </TableCell>
                    )}

                    {showAssociateCol && (
                      <TableCell>
                        {r.associateName ? (
                          <>
                            <Typography fontWeight={500}>{r.associateName}</Typography>
                            {r.associateDisplayId && (
                              <Typography variant="caption" color="text.secondary">
                                ({r.associateDisplayId})
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Chip label="Not Applicable" size="small" sx={{ fontWeight: 500 }} />
                        )}
                      </TableCell>
                    )}

                    <TableCell>
                      <Typography fontWeight={500}>{r.applicantName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.applicantLocation}
                      </Typography>
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
                      <Chip
                        icon={getStatusIcon(statusRaw)}
                        label={statusLabel}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(statusRaw, theme) + "20",
                          color: getStatusColor(statusRaw, theme),
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
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

                    <TableCell>
                      {r.createdAt &&
                        new Date(r.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, r.dbId)}>
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
                        currentStatus={r.status}
                        currentStatusUpdatedAt={r.lastUpdate}
                        disbursedData={r.disbursedData}
                        lenderType={r.lenderName}
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
