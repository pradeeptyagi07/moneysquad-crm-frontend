"use client"

import React, { useEffect } from "react"
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
  CircularProgress,
  Fade,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { clearTimeline, fetchLeadTimeline } from "../../../store/slices/leadSlice"
import { getStatusColor, getStatusIcon } from "../utils/leadUtils"
import { motion, AnimatePresence } from "framer-motion"

interface LeadTimelineDialogProps {
  open: boolean
  onClose: () => void
  lead: { leadId: string }
}

interface TimelineEvent {
  _id: string
  leadId: string
  applicantName: string
  status: string
  message: string
  rejectImage: string | null
  rejectReason: string | null
  rejectComment: string | null
  closeReason: string | null
  createdAt: string
  __v: number
}

// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const LeadTimelineDialog: React.FC<LeadTimelineDialogProps> = ({ open, onClose, lead }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { currentTimeline: timeline, loading } = useAppSelector((s) => s.leads)

  useEffect(() => {
    if (open && lead?.leadId) {
      dispatch(fetchLeadTimeline(lead.leadId))
    }
    return () => {
      dispatch(clearTimeline())
    }
  }, [open, lead?.leadId, dispatch])

  const events: TimelineEvent[] = timeline
    ? (Object.values(timeline).filter(Boolean) as TimelineEvent[])
    : []
  const sortedEvents = events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lead Timeline</Typography>
          <IconButton edge="end" onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {sortedEvents.map((event, idx) => {
                const isLast = idx === sortedEvents.length - 1
                const statusColor = getStatusColor(event.status, theme)
                const Icon = getStatusIcon(event.status)

                return (
                  <motion.div
                    key={event._id}
                    variants={itemVariants}
                    style={{ position: "relative" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        mb: 3,
                        position: "relative",
                        "&:before": {
                          content: '""',
                          position: "absolute",
                          left: 20,
                          top: 32,
                          bottom: isLast ? "32px" : 0,
                          width: 2,
                          bgcolor: "divider",
                        },
                      }}
                    >
                      {/* Status icon */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: `${statusColor}20`,
                          color: statusColor,
                          zIndex: 1,
                          mr: 2,
                        }}
                      >
                        <Icon fontSize="small" />
                      </Box>

                      {/* Event card */}
                      <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: statusColor }}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Typography>

                        {/* Message */}
                        {event.message && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Message:</strong> {event.message}
                          </Typography>
                        )}

                        {/* Rejected-specific content */}
                        {event.status.toLowerCase() === "rejected" ? (
                          <Box sx={{ mt: 1 }}>
                            {event.rejectReason && (
                              <Typography variant="body2" color="error">
                                <strong>Reason:</strong> {event.rejectReason}
                              </Typography>
                            )}
                            {event.rejectComment && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Reject Comment:</strong> {event.rejectComment}
                              </Typography>
                            )}
                            {event.rejectImage && (
                              <Box sx={{ mt: 1 }}>
                                <a
                                  href={event.rejectImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={event.rejectImage}
                                    alt="Rejection Proof"
                                    style={{
                                      width: "100%",
                                      maxWidth: 300,
                                      borderRadius: 6,
                                      cursor: "pointer",
                                    }}
                                  />
                                </a>
                              </Box>
                            )}
                          </Box>
                        ) : (
                          event.rejectComment && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Comment:</strong> {event.rejectComment}
                            </Typography>
                          )
                        )}

                        {/* Closed-specific details */}
                        {event.status.toLowerCase() === "closed" && event.closeReason && (
                          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                            <strong>Close Reason:</strong> {event.closeReason}
                          </Typography>
                        )}

                        {/* Emphasized Timestamp */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ color: statusColor }}
                          >
                            {new Date(event.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </motion.div>
                )
              })}

              {!sortedEvents.length && (
                <Typography align="center" color="textSecondary">
                  No timeline events available.
                </Typography>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeadTimelineDialog
