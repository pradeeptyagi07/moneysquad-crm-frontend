"use client"

import React from "react"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  TablePagination,
  Button,
} from "@mui/material"
import {
  MoreVert,
  Visibility,
  Edit,
  Block,
  CheckCircle,
  Person,
  Email,
  Phone,
  ChangeCircle,
  FileDownload,
  GetApp,
} from "@mui/icons-material"
import PartnerDetailsDialog from "./PartnerDetailsDialog"
import PartnerEditDialog from "./PartnerEditDialog"
import PartnerChangeRequestDialog from "./PartnerChangeRequestDialog"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { fetchAllPartners, fetchPartnerById, type Partner } from "../../../store/slices/managePartnerSlice"
import { updatePartnerById } from "../../../store/slices/managePartnerSlice"
import { exportPartnersToExcel, exportPartnersToCSV } from "../utils/exportUtils"

interface PartnersTableProps {
  partners: Partner[]
}

const PartnersTable: React.FC<PartnersTableProps> = ({ partners }) => {
  console.log("partners", partners)
  const dispatch = useAppDispatch()

  const partnerDetails = useAppSelector((state) => state.managePartners.selectedPartner)

  console.log("partnerDetails in component →", partnerDetails)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedPartnerId, setSelectedPartnerId] = React.useState<string | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [changeRequestDialogOpen, setChangeRequestDialogOpen] = React.useState(false)
  const [selectedPartner, setSelectedPartner] = React.useState<Partner | null>(null)

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedPartners = partners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Auto page navigation when filtered data changes
  React.useEffect(() => {
    if (partners.length > 0) {
      const maxPage = Math.ceil(partners.length / rowsPerPage) - 1
      if (page > maxPage) {
        setPage(maxPage)
      }
    } else if (page > 0) {
      setPage(0)
    }
  }, [partners.length, page, rowsPerPage])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, partnerId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedPartnerId(partnerId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedPartnerId(null)
  }

  const handleViewDetails = async (partnerId: string) => {
    const partner = partners.find((p) => p.partnerId === partnerId)
    if (partner?._id) {
      console.log("Dispatching fetchPartnerById for:", partner._id)
      setDetailsDialogOpen(true)

      const result = await dispatch(fetchPartnerById(partner._id))
      console.log("Thunk result →", result)
    }
  }

  const handleEditPartner = (partnerId: string) => {
    handleMenuClose()
    const partner = partners.find((p) => p.partnerId === partnerId) || null
    setSelectedPartner(partner)
    setEditDialogOpen(true)
  }

  const handleChangeRequests = (partnerId: string) => {
    handleMenuClose()
    const partner = partners.find((p) => p.partnerId === partnerId) || null
    setSelectedPartner(partner)
    setChangeRequestDialogOpen(true)
  }

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedPartner(null)
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setSelectedPartner(null)
  }

  const handleCloseChangeRequestDialog = () => {
    setChangeRequestDialogOpen(false)
    setSelectedPartner(null)
  }

  const handleSavePartner = async (updatedPartner: any) => {
    if (selectedPartner && selectedPartner._id) {
      const updatePayload = {
        partnerId: selectedPartner._id,
        data: updatedPartner,
      }

      try {
        await dispatch(updatePartnerById(updatePayload)).unwrap()
        await dispatch(fetchAllPartners())
        setEditDialogOpen(false)
      } catch (error) {
        console.error("Failed to update partner:", error)
      }
    }
  }

  // Export functions
  const handleExportExcel = () => {
    const result = exportPartnersToExcel(paginatedPartners, "partners_current_page")
    if (result.success) {
      console.log(`Exported ${paginatedPartners.length} partners to Excel: ${result.filename}`)
    } else {
      console.error("Export failed:", result.error)
    }
  }

  const handleExportCSV = () => {
    const result = exportPartnersToCSV(paginatedPartners, "partners_current_page")
    if (result.success) {
      console.log(`Exported ${paginatedPartners.length} partners to CSV: ${result.filename}`)
    } else {
      console.error("Export failed:", result.error)
    }
  }

  if (partners.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No partners found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Try adjusting your search or filters
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {/* Export Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExportExcel} size="small">
          Export Excel
        </Button>
        <Button variant="outlined" startIcon={<GetApp />} onClick={handleExportCSV} size="small">
          Export CSV
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none" }}>
        <Table sx={{ minWidth: 1350 }}>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Partner</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Registration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Commission Plan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Joined On</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Change Requests</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedPartners.map((partner) => (
              <TableRow key={partner.partnerId} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={partner.documents.profilePhoto} sx={{ mr: 2, bgcolor: "primary.main" }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {partner.basicInfo.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {partner.partnerId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Email fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                      <Typography variant="body2">{partner.basicInfo.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                      <Typography variant="body2">{partner.basicInfo.mobile}</Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{partner.basicInfo.registeringAs}</Typography>
                </TableCell>

                <TableCell>
                  {/* Commission Plan Chip logic unchanged */}
                  {(() => {
                    const plan = (partner.commissionPlan?.toLowerCase() || "n/a") as
                      | "gold"
                      | "diamond"
                      | "platinum"
                      | "n/a"
                    const planStyles = {
                      gold: { label: "Gold", icon: "🥇", bg: "#FFF8DC", color: "#DAA520" },
                      diamond: { label: "Diamond", icon: "💎", bg: "#E0FFFF", color: "#00BFFF" },
                      platinum: { label: "Platinum", icon: "🏆", bg: "#F8F8FF", color: "#A9A9A9" },
                      "n/a": { label: "N/A", icon: "❔", bg: "#ECEFF1", color: "#607D8B" },
                    } as const
                    const style = planStyles[plan]
                    return (
                      <Chip
                        label={`${style.icon} ${style.label}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: style.bg,
                          color: style.color,
                        }}
                      />
                    )
                  })()}
                </TableCell>

                <TableCell>
                  <Chip
                    label={partner.personalInfo.roleSelection === "leadSharing" ? "Lead Sharing" : "File Sharing"}
                    size="small"
                    sx={{
                      bgcolor:
                        partner.personalInfo.roleSelection === "leadSharing" ? "primary.lighter" : "secondary.lighter",
                      color: partner.personalInfo.roleSelection === "leadSharing" ? "primary.dark" : "secondary.dark",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    icon={partner.status === "active" ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                    label={partner.status === "active" ? "Active" : "Inactive"}
                    size="small"
                    color={partner.status === "active" ? "success" : "default"}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {new Date(partner.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </TableCell>

                {/* NEW: Change Requests Count */}
                <TableCell>
                  <Chip
                    icon={<ChangeCircle fontSize="small" />}
                    label={partner.pendingChangeRequestCount}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      bgcolor: partner.pendingChangeRequestCount > 0 ? "warning.lighter" : "grey.200",
                      color: partner.pendingChangeRequestCount > 0 ? "warning.dark" : "text.secondary",
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Actions">
                    <IconButton
                      aria-controls={`partner-menu-${partner.partnerId}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, partner.partnerId)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={partners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>

        <Menu
          id={`partner-menu-${selectedPartnerId}`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              if (selectedPartnerId) {
                handleViewDetails(selectedPartnerId)
                handleMenuClose()
              }
            }}
          >
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (selectedPartnerId) {
                handleEditPartner(selectedPartnerId)
                handleMenuClose()
              }
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Partner</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (selectedPartnerId) {
                handleChangeRequests(selectedPartnerId)
              }
            }}
          >
            <ListItemIcon>
              <ChangeCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change Requests</ListItemText>
          </MenuItem>
        </Menu>
      </TableContainer>

      {/* Existing Dialogs */}
      <PartnerDetailsDialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} partner={partnerDetails} />

      <PartnerEditDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        partner={selectedPartner}
        onSave={handleSavePartner}
      />

      {/* New Change Request Dialog */}
      <PartnerChangeRequestDialog
        open={changeRequestDialogOpen}
        onClose={handleCloseChangeRequestDialog}
        partner={selectedPartner}
      />
    </>
  )
}

export default PartnersTable
