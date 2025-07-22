"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Avatar,
  Typography,
  Tooltip,
  Box,
  useTheme,
  Chip,
} from "@mui/material"
import { Edit, Delete, Person } from "@mui/icons-material"
import Pagination from "@mui/material/Pagination"

export interface Associate {
  _id: string
  associateId: string
  associateDisplayId: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  location: string
  status: string
  createdAt: string
}

interface AssociateTableProps {
  associates: Associate[]
  onEdit: (associate: Associate) => void
  onDelete: (associate: Associate) => void
}

const AssociateTable: React.FC<AssociateTableProps> = ({ associates, onEdit, onDelete }) => {
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const rowsPerPage = 5

  // Auto page navigation logic
  useEffect(() => {
    if (associates.length > 0) {
      const maxPage = Math.ceil(associates.length / rowsPerPage)
      if (page > maxPage) {
        setPage(maxPage)
      }
    } else if (page > 1) {
      setPage(1)
    }
  }, [associates.length, page, rowsPerPage])

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const paginated = associates.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Associate ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Associate</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No associates found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((assoc) => (
                <TableRow key={assoc._id} hover>
                  {/* Combine associateId and associateDisplayId */}
                  <TableCell>
                    <Typography variant="body2">
                      {assoc.associateId}{" "}
                      <Typography component="span" variant="caption" color="text.secondary">
                        ({assoc.associateDisplayId})
                      </Typography>
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          mr: 1.5,
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.main,
                        }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {assoc.firstName} {assoc.lastName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{assoc.email}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {assoc.mobile}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{assoc.location}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={assoc.status.charAt(0).toUpperCase() + assoc.status.slice(1)}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(assoc.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => onEdit(assoc)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDelete(assoc)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(associates.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="small"
        />
      </Box>
    </>
  )
}

export default AssociateTable
