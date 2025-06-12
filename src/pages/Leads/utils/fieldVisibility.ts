export type FieldKey =
  | "partnerName"
  | "applicantProfile"
  | "applicantName"
  | "businessName"
  | "applicantMobile"
  | "applicantEmail"
  | "applicantPincode"
  | "city"
  | "state"
  | "loanType"
  | "loanAmount"
  | "comments"
  | "assignTo"
  | "lenderName";

export interface FieldConfig {
  visible: boolean;
  readOnly: boolean;
}

/**
 * Returns a mapping from FieldKey to FieldConfig (visible/readOnly)
 * based on the current user role and form mode.
 *
 * Roles: "admin" | "manager" | "partner" | "associate"
 * Modes: "create" | "edit" | "duplicate"
 *
 * Note:
 * - Business Name visibility should also be gated in the component by checking
 *   applicantProfile !== "Salaried Individual".
 * - city/state are always visible and always read-only (auto-filled).
 * - loanAmount is always editable.
 */
export const getFieldConfig = (
  role: "admin" | "manager" | "partner" | "associate",
  mode: "create" | "edit" | "duplicate"
): Record<FieldKey, FieldConfig> => {
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isPartner = role === "partner";
  const isAssociate = role === "associate";

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isDuplicate = mode === "duplicate";

  return {
    partnerName: {
      // Visible only for admin/manager, in all modes
      visible: isAdmin || isManager,
      // Editable only in Create; read-only in Edit/Duplicate
      readOnly: !isCreate,
    },
    applicantProfile: {
      visible: true,
      readOnly: isDuplicate,
    },
    applicantName: {
      visible: true,
      readOnly: isDuplicate,
    },
    businessName: {
      // Component should further check applicantProfile !== "Salaried Individual"
      visible: true,
      readOnly: isDuplicate,
    },
    applicantMobile: {
      visible: true,
      readOnly: isDuplicate,
    },
    applicantEmail: {
      visible: true,
      readOnly: isDuplicate,
    },
    applicantPincode: {
      visible: true,
      readOnly: isDuplicate,
    },
    city: {
      visible: true,
      readOnly: true,
    },
    state: {
      visible: true,
      readOnly: true,
    },
    loanType: {
      // ✅ Always editable now, even in duplicate mode
      visible: true,
      readOnly: false,
    },
    loanAmount: {
      visible: true,
      readOnly: false,
    },
    comments: {
      visible: true,
      readOnly: isDuplicate,
    },
    assignTo: {
      // ✅ Visible for admin and manager
      visible: isAdmin || isManager,
      // ✅ Editable only for admin
      readOnly: !isAdmin,
    },
    lenderName: {
      // Only visible for admin/manager in Edit or Duplicate
      visible: (isAdmin || isManager) && (isEdit || isDuplicate),
      readOnly: false,
    },
  };
};
