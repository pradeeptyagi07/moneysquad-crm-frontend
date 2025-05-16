"use client"

import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  Fade,
} from "@mui/material"
import { Info, ArrowForward } from "@mui/icons-material"

interface ChangeItem {
  field: string
  oldValue: string
  newValue: string
}

interface RequestChangeDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  title: string
  changes: ChangeItem[]
}

const RequestChangeDialog: React.FC<RequestChangeDialogProps> = ({ open, onClose, onSubmit, title, changes }) => {
  const [reason, setReason] = React.useState("")

  const handleSubmit = () => {
    onSubmit(reason)
    setReason("")
  }

  const handleClose = () => {
    onClose()
    setReason("")
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#f8fafc",
          color: "#0f172a",
          fontWeight: 600,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, p: 2, bgcolor: "#f1f5f9", borderRadius: 2 }}>
          <Info sx={{ color: "#0369a1", mr: 1 }} />
          <Typography variant="body2" color="#0369a1">
            Changes to your information require approval from an administrator. Please provide a reason for these
            changes.
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#0f172a" }}>
          Requested Changes
        </Typography>

        {changes.length > 0 ? (
          <Paper variant="outlined" sx={{ borderRadius: 2, mb: 3, overflow: "hidden" }}>
            <List disablePadding>
              {changes.map((change, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600} color="#0f172a">
                          {change.field}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                            <Chip
                              label={change.oldValue}
                              size="small"
                              sx={{
                                bgcolor: "#f1f5f9",
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                            />
                            <ArrowForward sx={{ color: "#94a3b8", fontSize: 18 }} />
                            <Chip
                              label={change.newValue}
                              size="small"
                              sx={{
                                bgcolor: "rgba(15, 118, 110, 0.1)",
                                color: "#0f766e",
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < changes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              mb: 3,
              p: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#f8fafc",
            }}
          >
            <Typography color="#64748b">No changes detected. Make changes to submit for approval.</Typography>
          </Paper>
        )}

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "#0f172a" }}>
          Reason for Changes
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Please explain why you're requesting these changes"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., I've recently moved to a new address and need to update my contact information..."
          required
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: "#64748b",
            "&:hover": {
              bgcolor: "#f1f5f9",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={reason.trim() === "" || changes.length === 0}
          sx={{
            bgcolor: "#0f766e",
            "&:hover": {
              bgcolor: "#0e6660",
            },
            "&.Mui-disabled": {
              bgcolor: "#e2e8f0",
            },
          }}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RequestChangeDialog
