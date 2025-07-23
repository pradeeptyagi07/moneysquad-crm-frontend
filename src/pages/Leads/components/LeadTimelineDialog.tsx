"use client"

import React, { useEffect, useState, useRef } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  TextField,
  Avatar,
  Chip,
  Tab,
  Tabs,
  Divider,
} from "@mui/material"
import { Close, Send, Comment, Timeline as TimelineIcon } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { motion, AnimatePresence } from "framer-motion"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { getStatusColor, getStatusIcon } from "../utils/leadUtils"
import {
  clearTimeline,
  fetchLeadTimeline,
  fetchLeadRemarks,
  createLeadRemark,
  clearRemarks,
} from "../../../store/slices/leadSLice"

interface LeadTimelineDialogProps {
  open: boolean
  onClose: () => void
  lead: { leadId: string }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
}

const LeadTimelineDialog: React.FC<LeadTimelineDialogProps> = ({ open, onClose, lead }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { currentTimeline: timeline, currentRemarks: remarks, loading } = useAppSelector(s => s.leads)
  const [newRemark, setNewRemark] = useState("")
  const [activeTab, setActiveTab] = useState(0)

  // ref for scrollable content to reset on tab change
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [activeTab])

  useEffect(() => {
    if (open && lead.leadId) {
      setActiveTab(0)
      dispatch(fetchLeadTimeline(lead.leadId))
      dispatch(fetchLeadRemarks(lead.leadId))
    }
    return () => {
      dispatch(clearTimeline())
      dispatch(clearRemarks())
    }
  }, [open, lead.leadId, dispatch])

  const handleAddRemark = async () => {
    if (!newRemark.trim() || !lead.leadId) return
    const text = newRemark.trim()
    setNewRemark("")
    try {
      await dispatch(createLeadRemark({ leadId: lead.leadId, message: text })).unwrap()
      dispatch(fetchLeadRemarks(lead.leadId))
    } catch (err) {
      console.error("Failed to add remark:", err)
    }
  }

  const events = timeline ? Object.values(timeline).filter(Boolean) : []
  const sortedEvents = events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const getRoleColor = (role: string) => {
    const map: Record<string, string> = {
      admin: theme.palette.error.main,
      manager: theme.palette.primary.main,
      associate: theme.palette.info.main,
      partner: theme.palette.success.main,
    }
    return map[role.toLowerCase()] || theme.palette.grey[600]
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffH = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    return {
      relative:
        diffH < 1
          ? "Just now"
          : diffH < 24
          ? `${Math.floor(diffH)}h ago`
          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      absolute: date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    }
  }

  const renderTimelineEvents = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ position: "relative", maxWidth: 800, mx: "auto" }}>
        <AnimatePresence>
          {sortedEvents.map((event, idx) => {
            const statusColor = getStatusColor(event.status, theme)
            const Icon = getStatusIcon(event.status)
            const timeInfo = formatDateTime(event.createdAt)

            return (
              <motion.div key={event._id} variants={itemVariants}>
                <Box sx={{ display: "flex", mb: 3, alignItems: "flex-start" }}>
                  {/* Icon on the left */}
                  <Box
                    sx={{
                      width: "10%",
                      display: "flex",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {idx < sortedEvents.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 50,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 2,
                          height: 80,
                          bgcolor: `${statusColor}30`,
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: statusColor,
                        color: "white",
                        boxShadow: `0 4px 12px ${statusColor}40`,
                        zIndex: 2,
                        mt: 1,
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                  </Box>

                  {/* Card on the right */}
                  <Box sx={{ flex: 1, ml: 2 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: `1px solid ${statusColor}30`,
                        borderLeft: `4px solid ${statusColor}`,
                        boxShadow: `0 2px 8px ${statusColor}15`,
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 20,
                          left: -8,
                          width: 0,
                          height: 0,
                          borderTop: "8px solid transparent",
                          borderBottom: "8px solid transparent",
                          borderRight: `8px solid ${theme.palette.background.paper}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1.5,
                        }}
                      >
                        <Chip
                          label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: `${statusColor}15`,
                            color: statusColor,
                            fontWeight: 600,
                            height: 26,
                            fontSize: "0.75rem",
                          }}
                        />
                        <Box sx={{ textAlign: "left" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.primary",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                            }}
                          >
                            {timeInfo.relative}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.8rem",
                            }}
                          >
                            {timeInfo.absolute}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Backend message */}
                      {event.message && (
                        <>
                          <Divider sx={{ mb: 1.5, opacity: 0.3 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              lineHeight: 1.6,
                              color: "text.primary",
                            }}
                          >
                            {event.message}
                          </Typography>
                        </>
                      )}

                      {/* Always show rejectComment as comment */}
                      {event.rejectComment && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontStyle: "italic",
                              color: "text.secondary",
                              lineHeight: 1.5,
                            }}
                          >
                            {event.rejectComment}
                          </Typography>
                        </Box>
                      )}

                      {/* Rejection details when status is rejected */}
                      {event.status.toLowerCase() === "rejected" && (
                        <Box sx={{ mt: 1.5 }}>
                          {event.rejectReason && (
                            <Box sx={{ mb: 1 }}>
                              <Typography
                                variant="caption"
                                color="error.main"
                                sx={{
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Rejection Reason
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  p: 1,
                                  bgcolor: "error.50",
                                  borderRadius: 1,
                                  border: `1px solid ${theme.palette.error.light}30`,
                                }}
                              >
                                {event.rejectReason}
                              </Typography>
                            </Box>
                          )}
                          {event.rejectImage && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Proof Image
                              </Typography>
                              <img
                                src={event.rejectImage}
                                alt="Rejection Proof"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: 120,
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  border: "1px solid #ddd",
                                }}
                                onClick={() => window.open(event.rejectImage!, "_blank")}
                              />
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Close details */}
                      {event.status.toLowerCase() === "closed" && event.closeReason && (
                        <Box sx={{ mt: 1.5 }}>
                          <Typography
                            variant="caption"
                            color="warning.main"
                            sx={{
                              fontWeight: 600,
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Close Reason
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              p: 1,
                              bgcolor: "warning.50",
                              borderRadius: 1,
                              border: `1px solid ${theme.palette.warning.light}30`,
                            }}
                          >
                            {event.closeReason}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </Box>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {!sortedEvents.length && (
          <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50", borderRadius: 2 }}>
            <TimelineIcon sx={{ fontSize: 32, color: "grey.400", mb: 1 }} />
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              No Timeline Events
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Events will appear here as the lead progresses
            </Typography>
          </Paper>
        )}
      </Box>
    </motion.div>
  )

  const renderRemarks = () => {
    if (!remarks?.remarkMessage) {
      return (
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
          <Comment sx={{ fontSize: 32, color: "grey.400", mb: 1 }} />
          <Typography variant="subtitle1" color="text.secondary">
            No Remarks Yet
          </Typography>
        </Paper>
      )
    }

    const allMessages = remarks.remarkMessage
      .flatMap(userRemark =>
        userRemark.messages.map(message => ({
          ...message,
          userName: userRemark.name,
          userRole: userRemark.role,
          userId: userRemark.userId,
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence>
          {allMessages.map((message, idx) => {
            const timeInfo = formatDateTime(message.timestamp)
            return (
              <motion.div
                key={`${message.userId}-${message.timestamp}-${idx}`}
                variants={itemVariants}
              >
                <Box sx={{ display: "flex", mb: 2, alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      fontSize: "0.85rem",
                      bgcolor: getRoleColor(message.userRole),
                      fontWeight: 600,
                    }}
                  >
                    {message.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: getRoleColor(message.userRole),
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        {message.userName}
                      </Typography>
                      <Chip
                        label={message.userRole}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          bgcolor: `${getRoleColor(message.userRole)}15`,
                          color: getRoleColor(message.userRole),
                        }}
                      />
                      <Box sx={{ ml: "auto", textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.75rem",
                          }}
                        >
                          {timeInfo.relative}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.disabled",
                            fontSize: "0.7rem",
                            display: "block",
                          }}
                        >
                          {timeInfo.absolute}
                        </Typography>
                      </Box>
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.grey[200]}`,
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                        {message.text}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    )
  }

  const remarkCount = remarks?.remarkMessage?.reduce((sum, ur) => sum + ur.messages.length, 0) || 0

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Lead Timeline & Remarks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track progress and communications
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="medium">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent ref={contentRef} sx={{ maxHeight: "70vh", p: 0 }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab icon={<TimelineIcon />} label="Timeline" iconPosition="start" sx={{ minHeight: 48 }} />
            <Tab
              icon={<Comment />}
              label={`Remarks${remarkCount ? ` (${remarkCount})` : ""}`}
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        {activeTab === 1 && (
          <Paper
            elevation={0}
            sx={{
              position: "sticky",
              top: 48,
              zIndex: 99,
              borderBottom: 1,
              borderColor: "divider",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField
                fullWidth
                placeholder="Add a remark..."
                value={newRemark}
                onChange={e => setNewRemark(e.target.value)}
                size="small"
                multiline
                maxRows={3}
                sx={{ "& .MuiOutlinedInput-root": { bgcolor: "grey.50" } }}
              />
              <Button variant="contained" onClick={handleAddRemark} disabled={!newRemark.trim()} sx={{ minWidth: 48 }}>
                <Send fontSize="small" />
              </Button>
            </Box>
          </Paper>
        )}

        <Box sx={{ p: 3 }}>
          {loading && activeTab === 0 ? (
            <Box display="flex" justifyContent="center" p={4}>
              <TimelineIcon sx={{ fontSize: 24, color: "primary.main", mr: 1 }} />
              <Typography color="text.secondary">Loading...</Typography>
            </Box>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 0 ? renderTimelineEvents() : renderRemarks()}
            </AnimatePresence>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ px: 3 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeadTimelineDialog
