// src/components/FormDialog/LeadFormDialog.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Snackbar,
  Alert,
  Box,
  Typography,
} from "@mui/material"
import type { UserRole } from "../constants/roles"
import type { FormMode } from "../constants/formModes"
import { getFieldConfig, type FieldConfig, type FieldKey } from "../../utils/fieldVisibility"
import { useLeadFormHandlers } from "../handlers/useLeadFormHandlers"
import { useAuth } from "../../../../hooks/useAuth"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { fetchLenders } from "../../../../store/slices/lenderLoanSlice"
import LeadFormFields from "./LeadFormFields"

export interface LeadFormData {
  id?: string
  leadId?: string
  partnerName?: string
  applicantProfile: string
  applicantName: string
  businessName: string
  applicantMobile: string
  applicantEmail: string
  applicantPincode: string
  city: string
  state: string
  loanType: string
  loanAmount: string
  comments: string
  assignTo?: string
  associate?: string
  lenderName?: string
  status?: string
}

interface LeadFormDialogProps {
  open: boolean
  onClose: () => void
  mode: FormMode
  role: UserRole
  selectedLead?: LeadFormData | null
  onSuccess: () => void
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({ open, onClose, mode, role, selectedLead, onSuccess }) => {
  const dispatch = useAppDispatch()
  const { userName: authUserName } = useAuth()
  const { validate, onSubmit } = useLeadFormHandlers()

  // Get lenders state
  const { lenders } = useAppSelector((s) => s.lenderLoan)

  const getInitialFormValues = (): LeadFormData => ({
    id: "",
    leadId: "",
    partnerName: "",
    applicantProfile: "",
    applicantName: "",
    businessName: "",
    applicantMobile: "",
    applicantEmail: "",
    applicantPincode: "",
    city: "",
    state: "",
    loanType: "",
    loanAmount: "",
    comments: "",
    assignTo: "",
    associate: "",
    lenderName: "",
    status: "",
  })

  const [formValues, setFormValues] = useState<LeadFormData>(getInitialFormValues())

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  // Pass the lead status to field configuration
  const fieldConfigMap: Record<FieldKey, FieldConfig> = getFieldConfig(role, mode, formValues.status)

  // Real-time validation for button state
  const { valid: formIsValid } = validate(formValues, role, mode)

  // Fetch lenders only once when dialog opens
  useEffect(() => {
    if (open && (mode === "edit" || mode === "duplicate") && lenders.length === 0) {
      dispatch(fetchLenders())
    }
  }, [open, mode, dispatch, lenders.length])

  // Initialize form values when dialog opens
  useEffect(() => {
    if (!open) return

    setShowValidation(false)
    setError(null)
    setSuccessMsg(null)

    // Always start with fresh form for create mode
    if (mode === "create") {
      const initialValues = getInitialFormValues()

      // Set manager assignment for create mode
      if (role === "manager" && authUserName) {
        initialValues.assignTo = authUserName
      }

      setFormValues(initialValues)
    } else if (selectedLead && (mode === "edit" || mode === "duplicate")) {
      // For edit/duplicate, use the selected lead data
      setFormValues({ ...selectedLead })
    } else {
      // Fallback to initial values
      setFormValues(getInitialFormValues())
    }
  }, [open, selectedLead, role, mode, authUserName])

  const handleFieldChange = <K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    if (error) {
      setError(null)
    }
  }

  const handleSubmitClick = async () => {
    setShowValidation(true)

    const { valid, errorMessage } = validate(formValues, role, mode)
    if (!valid) {
      setError(errorMessage)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formValues, role, mode)
      setSuccessMsg(
        mode === "create"
          ? "Lead created successfully."
          : mode === "edit"
            ? "Lead updated successfully."
            : "Lead duplicated successfully.",
      )
      setError(null)
      setTimeout(() => {
        setSuccessMsg(null)
        onClose()
        onSuccess()
      }, 1200)
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred."

      if (err?.message) {
        errorMessage = err.message
      } else if (typeof err === "string") {
        errorMessage = err
      }

      if (errorMessage.includes("A lead with the same lender type, email or mobile already exists")) {
        errorMessage = "A lead with the same lender type, email or mobile already exists"
      } else if (mode === "duplicate" && errorMessage.includes("Doesn't Match the Criteria")) {
        errorMessage = "Doesn't Match the Criteria To Duplicate"
      }

      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Reset form state when closing
    setFormValues(getInitialFormValues())
    setError(null)
    setSuccessMsg(null)
    setShowValidation(false)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 600 }}>
          {mode === "create" ? "Create New Lead" : mode === "edit" ? "Edit Lead" : "Duplicate Lead"}

          {/* ── REQUIRED FIELD NOTE ───────────────────────────────────────── */}
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Fields marked with{" "}
              <Box component="span" color="red">
                *
              </Box>{" "}
              are required. The "Submit" button will only be enabled once all required fields are valid.
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <LeadFormFields
              open={open}
              fieldConfig={fieldConfigMap}
              formValues={formValues}
              onFieldChange={handleFieldChange}
              role={role}
              mode={mode}
              showValidation={showValidation}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitClick}
            variant="contained"
            color="primary"
            disabled={!formIsValid || isSubmitting}
          >
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : mode === "edit"
                  ? "Saving..."
                  : "Duplicating..."
              : mode === "create"
                ? "Submit"
                : mode === "edit"
                  ? "Save Changes"
                  : "Create Duplicate"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default LeadFormDialog
