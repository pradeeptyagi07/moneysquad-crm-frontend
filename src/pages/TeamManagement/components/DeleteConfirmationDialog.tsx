"use client"

import type React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from "@mui/material"
import { Close, WarningAmber } from "@mui/icons-material"

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  managerName: string
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  managerName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 700, color: "error.main" }}>
            Delete Manager
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" py={2}>
          <WarningAmber sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h6" align="center" gutterBottom>
            Are you sure you want to delete {managerName}?
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            This action cannot be undone. All data associated with this manager will be permanently removed from the
            system.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 2,
          }}
        >
          Delete Manager
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
