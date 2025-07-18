"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
  TextField,
  Avatar,
  Chip,
  Tab,
  Tabs,
} from "@mui/material"
import { Close, Send, Comment, Timeline } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { getStatusColor, getStatusIcon } from "../utils/leadUtils"
import { motion, AnimatePresence } from "framer-motion"
import { clearTimeline, fetchLeadTimeline } from "../../../store/slices/leadSLice"

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

interface CommentEvent {
  _id: string
  leadId: string
  comment: string
  roleName: string
  userName: string
  createdAt: string
}

// Hardcoded comment data for demonstration
const hardcodedComments: CommentEvent[] = [
  {
    _id: "comment_1",
    leadId: "sample_lead",
    comment: "Customer has provided all required documents. Moving forward with verification process.",
    roleName: "Manager",
    userName: "John Smith",
    createdAt: "2024-01-15T04:00:00Z",
  },
  {
    _id: "comment_2",
    leadId: "sample_lead",
    comment: "Verification completed successfully. Customer's credit score looks good.",
    roleName: "Associate",
    userName: "Sarah Johnson",
    createdAt: "2024-01-15T08:15:00Z",
  },
  {
    _id: "comment_3",
    leadId: "sample_lead",
    comment: "Customer called to inquire about the loan status. Provided update on current progress.",
    roleName: "Partner",
    userName: "Mike Davis",
    createdAt: "2024-01-16T02:45:00Z",
  },
  {
    _id: "comment_4",
    leadId: "sample_lead",
    comment: "Final approval received from underwriting team. Preparing disbursement documents.",
    roleName: "Manager",
    userName: "John Smith",
    createdAt: "2024-01-16T09:50:00Z",
  },
  {
    _id: "comment_5",
    leadId: "sample_lead",
    comment: "Documents have been sent to the customer via email. Awaiting signature confirmation.",
    roleName: "Associate",
    userName: "Sarah Johnson",
    createdAt: "2024-01-17T05:00:00Z",
  },
]

// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

const LeadTimelineDialog: React.FC<LeadTimelineDialogProps> = ({ open, onClose, lead }) => {
  const theme = useTheme()
  console.log("Lead prop in Timeline Dialog:", lead);

  const dispatch = useAppDispatch()
  const { currentTimeline: timeline, loading } = useAppSelector((s) => s.leads)
  const [newComment, setNewComment] = useState("")
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (open && lead?.leadId) {
      dispatch(fetchLeadTimeline(lead.leadId))
    }
    return () => {
      dispatch(clearTimeline())
    }
  }, [open, lead?.leadId, dispatch])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsAddingComment(true)
    // Simulate API call
    setTimeout(() => {
      // Here you would normally dispatch an action to add the comment
      console.log("Adding comment:", newComment)
      setNewComment("")
      setIsAddingComment(false)
    }, 1000)
  }

  const events: TimelineEvent[] = timeline ? (Object.values(timeline).filter(Boolean) as TimelineEvent[]) : []
  const sortedEvents = events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const sortedComments = hardcodedComments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return theme.palette.error.main
      case "manager":
        return theme.palette.primary.main
      case "associate":
        return theme.palette.info.main
      case "partner":
        return theme.palette.success.main
      default:
        return theme.palette.grey[600]
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const renderTimelineEvents = () => (
    <AnimatePresence>
      <motion.div variants={listVariants} initial="hidden" animate="visible" exit="hidden">
        {sortedEvents.map((event, idx) => {
          const isLast = idx === sortedEvents.length - 1
          const statusColor = getStatusColor(event.status, theme)
          const Icon = getStatusIcon(event.status)

          return (
            <motion.div key={event._id} variants={itemVariants} style={{ position: "relative" }}>
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
                    border: `2px solid ${statusColor}`,
                  }}
                >
                  <Icon fontSize="small" />
                </Box>

                {/* Event card */}
                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    p: 2,
                    borderLeft: `3px solid ${statusColor}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: statusColor, mb: 1 }}>
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
                          <a href={event.rejectImage} target="_blank" rel="noopener noreferrer">
                            <img
                              src={event.rejectImage || "/placeholder.svg"}
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
                    <Typography variant="body2" fontWeight="medium" sx={{ color: statusColor }}>
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
  )

  const renderComments = () => (
    <Box>
      {/* Comments List */}
      <AnimatePresence>
        <motion.div variants={listVariants} initial="hidden" animate="visible" exit="hidden">
          {sortedComments.map((comment) => {
            return (
              <motion.div key={comment._id} variants={itemVariants}>
                <Box
                  sx={{
                    display: "flex",
                    mb: 1.5,
                    alignItems: "flex-start",
                  }}
                >
                  {/* User Avatar */}
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: getRoleColor(comment.roleName),
                      fontSize: "0.875rem",
                      mr: 1.5,
                      flexShrink: 0,
                    }}
                  >
                    {comment.userName.charAt(0)}
                  </Avatar>

                  {/* Comment content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Header with name, role, and timestamp */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                      <Typography variant="body2" fontWeight="600" sx={{ color: getRoleColor(comment.roleName) }}>
                        {comment.userName}
                      </Typography>
                      <Chip
                        label={comment.roleName}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          bgcolor: `${getRoleColor(comment.roleName)}15`,
                          color: getRoleColor(comment.roleName),
                          fontWeight: 500,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: "text.secondary", ml: "auto" }}>
                        {new Date(comment.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>

                    {/* Comment text */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        backgroundColor: "grey.50",
                        borderRadius: 2,
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5, color: "text.primary" }}>
                        {comment.comment}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </motion.div>
            )
          })}

          {!sortedComments.length && (
            <Typography align="center" color="textSecondary">
              No comments available.
            </Typography>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Fade} transitionDuration={300}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lead Timeline & Comments</Typography>
          <IconButton edge="end" onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", p: 0 }}>
        {/* Sticky Tab Bar */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="timeline tabs">
            <Tab icon={<Timeline />} label="Status Timeline" iconPosition="start" sx={{ minHeight: 48 }} />
            <Tab
              icon={<Comment />}
              label={`Comments (${sortedComments.length})`}
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        {/* Sticky Add Comment Section - Only visible in Comments tab */}
        {activeTab === 1 && (
          <Paper
            elevation={0}
            sx={{
              position: "sticky",
              top: 48,
              zIndex: 99,
              backgroundColor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField
                fullWidth
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                size="small"
                multiline
                maxRows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim() || isAddingComment}
                sx={{ minWidth: 60, borderRadius: 2 }}
                size="small"
              >
                {isAddingComment ? <CircularProgress size={16} /> : <Send fontSize="small" />}
              </Button>
            </Box>
          </Paper>
        )}

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {activeTab === 0 && renderTimelineEvents()}
              {activeTab === 1 && renderComments()}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeadTimelineDialog
