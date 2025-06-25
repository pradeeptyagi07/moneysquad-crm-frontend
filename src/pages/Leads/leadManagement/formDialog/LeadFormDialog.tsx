"use client"

// src/components/FormDialog/LeadFormDialog.tsx

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Snackbar, Alert } from "@mui/material"
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
  leadId?: string // ← add this

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
  lenderName?: string
  status?: string
}

interface LeadFormDialogProps {
  open: boolean
  onClose: () => void
  mode: FormMode
  role: UserRole
  selectedLead?: LeadFormData
  onSuccess: () => void
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({ open, onClose, mode, role, selectedLead, onSuccess }) => {
  const dispatch = useAppDispatch()
  const { userName: authUserName } = useAuth()
  const { validate, onSubmit } = useLeadFormHandlers()

  // Get lenders state
  const { lenders } = useAppSelector((s) => s.lenderLoan)

  const [formValues, setFormValues] = useState<LeadFormData>({
    id: "",
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
    lenderName: "",
    status: "",
  })

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  // Pass the lead status to field configuration
  const fieldConfigMap: Record<FieldKey, FieldConfig> = getFieldConfig(role, mode, formValues.status)

  // Real-time validation for button state - now considers role and mode
  const { valid: formIsValid } = validate(formValues, role, mode)

  // Fetch lenders only once when dialog opens for edit/duplicate mode
  useEffect(() => {
    if (open && (mode === "edit" || mode === "duplicate") && lenders.length === 0) {
      dispatch(fetchLenders())
    }
  }, [open, mode, dispatch, lenders.length])

  // Initialize form values when dialog opens
  useEffect(() => {
    if (!open) return

    // Reset validation state when dialog opens
    setShowValidation(false)

    if (selectedLead) {
      setFormValues({ ...selectedLead })
    } else {
      setFormValues({
        id: "",
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
        lenderName: "",
        status: "",
      })
    }

    if (role === "manager" && (mode === "create" || mode === "duplicate") && authUserName) {
      setFormValues((prev) => ({ ...prev, assignTo: authUserName }))
    }

    // Clear any previous errors when dialog opens
    setError(null)
    setSuccessMsg(null)
  }, [open, selectedLead, role, mode, authUserName])

  const handleFieldChange = <K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleSubmitClick = async () => {
    // Show validation errors when submit is attempted
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
      // Check if it's duplicate mode and show specific error message
      if (mode === "duplicate") {
        setError("Doesn't Match the Criteria To Duplicate")
      } else {
        setError(err.message || "An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 600 }}>
          {mode === "create" ? "Create New Lead" : mode === "edit" ? "Edit Lead" : "Duplicate Lead"}
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
          <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
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
