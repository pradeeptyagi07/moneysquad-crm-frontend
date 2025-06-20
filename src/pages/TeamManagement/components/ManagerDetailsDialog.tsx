"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material"
import {
  Close,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Edit as EditIcon,
} from "@mui/icons-material"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { clearTeamState, fetchManagerById } from "../../../store/slices/teamSLice"

interface ManagerDetailsDialogProps {
  open: boolean
  onClose: () => void
  managerId: string | null
  onEdit: (managerId: string) => void
}

const ManagerDetailsDialog: React.FC<ManagerDetailsDialogProps> = ({ open, onClose, managerId, onEdit }) => {
  const dispatch = useAppDispatch()
  const { selectedManager: manager, loading, error } = useAppSelector((state) => state.team)

  useEffect(() => {
    if (open && managerId) {
      dispatch(fetchManagerById(managerId))
    }
    if (!open) {
      dispatch(clearTeamState())
    }
  }, [open, managerId, dispatch])

  const handleEdit = () => {
    if (managerId) {
      onEdit(managerId)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        } 
      }}
    >
      <DialogTitle sx={{ pb: 0, pt: 3, px: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: "text.primary"
            }}
          >
            Manager Profile
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="large"
            sx={{ 
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography color="error" variant="h6">{error}</Typography>
          </Box>
        ) : loading || !manager ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            {/* Header Section */}
            <Box 
              sx={{ 
                bgcolor: "grey.50",
                borderBottom: "1px solid",
                borderColor: "divider",
                p: 4
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${manager.email}`}
                      alt={manager.firstName}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mb: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                    />
                    <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
                      {manager.firstName} {manager.lastName}
                    </Typography>
                    <Chip
                      label={manager.status === "active" ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        backgroundColor: manager.status === "active" ? "success.main" : "grey.400",
                        color: "white",
                        fontWeight: 500,
                        mb: 1
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ID: {manager.managerId || "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
                        <Box display="flex" alignItems="center">
                          <Work sx={{ color: "primary.main", mr: 1.5, fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              ROLE
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {manager.role || "Not specified"}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
                        <Box display="flex" alignItems="center">
                          <CalendarToday sx={{ color: "primary.main", mr: 1.5, fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              JOINED DATE
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(manager.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      sx={{ 
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 500,
                        textTransform: "none"
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Contact Information Section */}
            <Box sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                sx={{ mb: 3, color: "text.primary", textTransform: "uppercase", letterSpacing: 1 }}
              >
                Contact Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      border: "1px solid",
                      borderColor: "divider",
                      p: 3,
                      height: "100%",
                      transition: "border-color 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main"
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <Email sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Email Address
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={500} sx={{ wordBreak: "break-all" }}>
                      {manager.email}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      border: "1px solid",
                      borderColor: "divider",
                      p: 3,
                      height: "100%",
                      transition: "border-color 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main"
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <Phone sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Phone Number
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={500}>
                      {manager.mobile}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      border: "1px solid",
                      borderColor: "divider",
                      p: 3,
                      height: "100%",
                      transition: "border-color 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main"
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <LocationOn sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Location
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={500}>
                      {manager.location}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Bottom Padding */}
            <Box sx={{ pb: 2 }} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ManagerDetailsDialog