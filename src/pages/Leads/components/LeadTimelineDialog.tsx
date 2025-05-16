"use client"

import type React from "react"
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
} from "@mui/material"
import { Close } from "@mui/icons-material"
import type { Lead } from "../../../data/leadTypes"
import { getStatusColor, getStatusIcon } from "../utils/leadUtils"
import { useTheme } from "@mui/material/styles"

interface LeadTimelineDialogProps {
  open: boolean
  onClose: () => void
  lead: Lead
}

const LeadTimelineDialog: React.FC<LeadTimelineDialogProps> = ({ open, onClose, lead }) => {
  const theme = useTheme()

  // If lead is undefined, don't render the dialog content
  if (!lead) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Lead Timeline</Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>No lead selected</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  // Sort timeline events by timestamp (newest first)
  const sortedTimeline = [...lead.timeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lead Timeline</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Lead ID
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {lead.id}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Applicant
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {lead.applicantName}
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          {sortedTimeline.map((event, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                mb: 2,
                position: "relative",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  left: "20px",
                  top: "24px",
                  bottom: "-24px",
                  width: "2px",
                  bgcolor: index === sortedTimeline.length - 1 ? "transparent" : "divider",
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `${getStatusColor(event.status as any, theme)}20`,
                  color: getStatusColor(event.status as any, theme),
                  zIndex: 1,
                  mr: 2,
                }}
              >
                {getStatusIcon(event.status as any)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" component="span">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {event.comment}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      By: {event.updatedBy}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(event.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeadTimelineDialog
