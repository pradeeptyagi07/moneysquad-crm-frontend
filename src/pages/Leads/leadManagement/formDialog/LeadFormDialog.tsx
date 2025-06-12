// src/components/FormDialog/LeadFormDialog.tsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import type { UserRole } from "../constants/roles";
import type { FormMode } from "../constants/formModes";
import {
  getFieldConfig,
  FieldConfig,
  FieldKey,
} from "../../utils/fieldVisibility";
import { useLeadFormHandlers } from "../handlers/useLeadFormHandlers";
import { useAuth } from "../../../../hooks/useAuth";
import LeadFormFields from "./LeadFormFields";

export interface LeadFormData {
  id?: string;
  leadId?: string;             // ← add this

  partnerName?: string;
  applicantProfile: string;
  applicantName: string;
  businessName: string;
  applicantMobile: string;
  applicantEmail: string;
  applicantPincode: string;
  city: string;
  state: string;
  loanType: string;
  loanAmount: string;
  comments: string;
  assignTo?: string;
  lenderName?: string;
}

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: FormMode;
  role: UserRole;
  selectedLead?: LeadFormData;
  onSuccess: () => void;
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({
  open,
  onClose,
  mode,
  role,
  selectedLead,
  onSuccess,
}) => {
  const { userName: authUserName } = useAuth();
  const { validate, onSubmit } = useLeadFormHandlers();

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
  });

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fieldConfigMap: Record<FieldKey, FieldConfig> = getFieldConfig(
    role,
    mode
  );

  // Prefill when opening
  useEffect(() => {
    if (!open) return;

    if (selectedLead) {
      setFormValues({ ...selectedLead });
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
      });
    }

    if (
      role === "manager" &&
      (mode === "create" || mode === "duplicate") &&
      authUserName
    ) {
      setFormValues((prev) => ({ ...prev, assignTo: authUserName }));
    }
  }, [open, selectedLead, role, mode, authUserName]);

  const handleFieldChange = <K extends keyof LeadFormData>(
    field: K,
    value: LeadFormData[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitClick = async () => {
    const { valid, errorMessage } = validate(formValues);
    if (!valid) {
      setError(errorMessage);
      return;
    }
    try {
      await onSubmit(formValues, role, mode);
      setSuccessMsg(
        mode === "create"
          ? "Lead created successfully."
          : mode === "edit"
          ? "Lead updated successfully."
          : "Lead duplicated successfully."
      );
      setError(null);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
        onSuccess();
      }, 1200);
    } catch (err: any) {
      // Check if it's duplicate mode and show specific error message
      if (mode === "duplicate") {
        setError("Doesn't Match the Criteria To Duplicate");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    }
  };

  // disable until all required fields valid
  const { valid: formIsValid } = validate(formValues);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 600 }}>
          {mode === "create"
            ? "Create New Lead"
            : mode === "edit"
            ? "Edit Lead"
            : "Duplicate Lead"}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <LeadFormFields
              fieldConfig={fieldConfigMap}
              formValues={formValues}
              onFieldChange={handleFieldChange}
              role={role}
              mode={mode}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitClick}
            variant="contained"
            color="primary"
            disabled={!formIsValid}
          >
            {mode === "create"
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
  );
};

export default LeadFormDialog;
