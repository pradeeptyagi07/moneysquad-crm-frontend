// src/pages/Leads/components/LeadTimelineDialog.tsx
"use client"

import type React from "react"
import { useEffect } from "react"
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
} from "@mui/material"
import { Close } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { clearTimeline, fetchLeadTimeline } from "../../../store/slices/leadSLice"
import { getStatusColor, getStatusIcon } from "../utils/leadUtils"

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

const LeadTimelineDialog: React.FC<LeadTimelineDialogProps> = ({ open, onClose, lead }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { currentTimeline: timeline, loading } = useAppSelector((s) => s.leads)

  // Fetch timeline on open; clear on close
  useEffect(() => {
    if (open && lead?.leadId) {
      dispatch(fetchLeadTimeline(lead.leadId))
    }
    return () => {
      dispatch(clearTimeline())
    }
  }, [open, lead?.leadId, dispatch]) // Fixed: use lead?.leadId instead of lead

  // Flatten & sort newest→oldest
  const events: TimelineEvent[] = timeline ? (Object.values(timeline).filter(Boolean) as TimelineEvent[]) : []
  const sortedEvents = events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          <Box>
            {sortedEvents.map((event, idx) => (
              <Box
                key={event._id}
                sx={{
                  display: "flex",
                  mb: 3,
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    left: 20,
                    top: 32,
                    bottom: idx === sortedEvents.length - 1 ? "32px" : 0,
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
                    bgcolor: `${getStatusColor(event.status, theme)}20`,
                    color: getStatusColor(event.status, theme),
                    zIndex: 1,
                    mr: 2,
                  }}
                >
                  {getStatusIcon(event.status)}
                </Box>

                {/* Event card */}
                <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
                  <Typography variant="subtitle2">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Typography>

                  {/* Message */}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Message:</strong> {event.message}
                  </Typography>

                  {/* Rejection details (only when rejected) */}
                  {event.status.toLowerCase() === "rejected" && (
                    <Box sx={{ mt: 1 }}>
                      {event.rejectReason && (
                        <Typography variant="body2" color="error">
                          <strong>Reason:</strong> {event.rejectReason}
                        </Typography>
                      )}
                      {event.rejectComment && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Comment:</strong> {event.rejectComment}
                        </Typography>
                      )}
                      {event.rejectImage && (
                        <Box
                          component="img"
                          src={event.rejectImage}
                          alt="Rejection Proof"
                          sx={{
                            width: "100%",
                            maxWidth: 300,
                            mt: 1,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </Box>
                  )}

                  {/* Close details (only when closed) */}
                  {event.status.toLowerCase() === "closed" && (
                    <Box sx={{ mt: 1 }}>
                      {event.closeReason && (
                        <Typography variant="body2" color="warning.main">
                          <strong>Close Reason:</strong> {event.closeReason}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Timestamp */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(event.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            ))}

            {!sortedEvents.length && (
              <Typography align="center" color="textSecondary">
                No timeline events available.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeadTimelineDialog
