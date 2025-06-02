"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material"
import { Close, WarningAmber } from "@mui/icons-material"
import { deleteManager } from "../../../store/slices/teamSLice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"


interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  managerId: string
  managerName: string
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  managerId,
  managerName,
}) => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.team)
  const [showSnackbar, setShowSnackbar] = useState(false)

  const handleDelete = async () => {
    try {
      await dispatch(deleteManager(managerId)).unwrap()
      setShowSnackbar(true)
      onClose()
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
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
              This action cannot be undone. All data associated with this manager will be permanently removed from the system.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            Delete Manager
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Manager deleted successfully!
        </Alert>
      </Snackbar>
    </>
  )
}

export default DeleteConfirmationDialog
