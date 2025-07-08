// src/components/FormDialog/LeadFormFields.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  Autocomplete,
  Box,
  Divider,
  useTheme,
  Theme,
} from "@mui/material";
import type { AppDispatch, RootState } from "../../../../store";
import { fetchAllPartners } from "../../../../store/slices/managePartnerSlice";
import { fetchManagers } from "../../../../store/slices/teamSLice";
import {
  fetchLoanTypes,
  fetchLendersByLoanType,
} from "../../../../store/slices/lenderLoanSlice";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAuth } from "../../../../hooks/useAuth";
import type { FieldConfig, FieldKey } from "../../utils/fieldVisibility";
import type { LeadFormData } from "./LeadFormDialog";

interface Option {
  id: string;
  label: string;
}

interface LeadFormFieldsProps {
  open: boolean;
  fieldConfig: Record<FieldKey, FieldConfig>;
  formValues: LeadFormData;
  onFieldChange: <K extends keyof LeadFormData>(
    field: K,
    value: LeadFormData[K]
  ) => void;
  role: string;
  mode: string;
  showValidation: boolean;
}

// Custom hook for blur/touched + validation + asterisk coloring
function useFieldValidation<K extends keyof LeadFormData>(
  value: LeadFormData[K],
  validateFn: (v: LeadFormData[K]) => boolean,
  showValidation: boolean,
  theme: Theme
) {
  const [touched, setTouched] = useState(false);
  const handleBlur = () => setTouched(true);

  const showError = (showValidation || touched) && !validateFn(value);

  const asteriskColor = !touched
    ? theme.palette.error.main
    : validateFn(value)
    ? theme.palette.primary.main
    : theme.palette.error.main;

  return { showError, handleBlur, asteriskColor };
}

const LeadFormFields: React.FC<LeadFormFieldsProps> = ({
  open,
  fieldConfig,
  formValues,
  onFieldChange,
  role,
  mode,
  showValidation,
}) => {
  const dispatch = useAppDispatch<AppDispatch>();
  const theme = useTheme();
  const { userName: authUserName, userId: authUserId } = useAuth();

  const partners = useAppSelector((s: RootState) => s.managePartners.partners);
  const managers = useAppSelector((s: RootState) => s.team.managers);
  const loanTypes = useAppSelector((s: RootState) => s.lenderLoan.loanTypes);
  const lendersByType = useAppSelector(
    (s: RootState) => s.lenderLoan.lendersByLoanType
  );

  const fetchedLoanRef = useRef<string | null>(null);
  const lastPincodeRef = useRef<string | null>(null);
  const lastFormIdRef = useRef<string | undefined>(undefined);

  // Reset refs on open or ID change
  useEffect(() => {
    lastFormIdRef.current = formValues.id;
    lastPincodeRef.current = null;
  }, [formValues.id, mode, open]);

  // Load static lists once
  useEffect(() => {
    if (!partners.length) dispatch(fetchAllPartners());
    if (!managers.length) dispatch(fetchManagers());
    if (!loanTypes.length) dispatch(fetchLoanTypes());
  }, [dispatch, partners.length, managers.length, loanTypes.length]);

  // Prefill assignTo for managers
  useEffect(() => {
    if (
      role === "manager" &&
      (mode === "create" || mode === "duplicate") &&
      authUserId
    ) {
      onFieldChange("assignTo", authUserId);
    }
  }, [role, mode, authUserId, onFieldChange]);

  // Initial fetch lenders on edit/duplicate
  useEffect(() => {
    if (
      open &&
      (mode === "edit" || mode === "duplicate") &&
      formValues.loanType &&
      loanTypes.length > 0 &&
      formValues.loanType !== fetchedLoanRef.current
    ) {
      const sel = loanTypes.find((lt) => lt.name === formValues.loanType);
      if (sel) {
        dispatch(fetchLendersByLoanType(sel._id));
        fetchedLoanRef.current = formValues.loanType;
      }
    }
  }, [open, mode, formValues.loanType, loanTypes, dispatch]);

  // Fetch lenders on loanType change
  useEffect(() => {
    if (
      formValues.loanType &&
      formValues.loanType !== fetchedLoanRef.current &&
      fetchedLoanRef.current !== null
    ) {
      const sel = loanTypes.find((lt) => lt.name === formValues.loanType);
      if (sel) {
        dispatch(fetchLendersByLoanType(sel._id));
        fetchedLoanRef.current = formValues.loanType;
        onFieldChange("lenderName", "");
      }
    }
  }, [formValues.loanType, loanTypes, dispatch, onFieldChange]);

  // Debounced PIN lookup
  useEffect(() => {
    const pin = formValues.applicantPincode;
    if (pin === lastPincodeRef.current) return;
    lastPincodeRef.current = pin;

    if (pin.length !== 6) {
      onFieldChange("city", "");
      onFieldChange("state", "");
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((res) => res.json())
        .then((data) => {
          if (
            Array.isArray(data) &&
            data[0]?.Status === "Success" &&
            data[0]?.PostOffice?.length
          ) {
            const { State, District } = data[0].PostOffice[0];
            onFieldChange("state", State);
            onFieldChange("city", District);
          }
        })
        .catch(() => {});
    }, 500);

    return () => clearTimeout(timeout);
  }, [formValues.applicantPincode, formValues.id, mode, open]);

  // Dropdown options
  const partnerOptions: Option[] = partners.map((p) => ({
    id: p._id,
    label: p.basicInfo.fullName,
  }));
  const managerOptions: Option[] = managers.map((m) => ({
    id: m._id,
    label: `${m.firstName} ${m.lastName}`,
  }));
  const loanTypeOptions: Option[] = loanTypes.map((lt) => ({
    id: lt._id,
    label: lt.name,
  }));
  const lenderOptions: Option[] = lendersByType.map((l) => ({
    id: l._id,
    label: l.name,
  }));

  // Validation hooks
  const partnerVal = useFieldValidation(
    formValues.partnerName || "",
    (v) => Boolean(v),
    showValidation,
    theme
  );
  const profileVal = useFieldValidation(
    formValues.applicantProfile,
    (v) => Boolean(v),
    showValidation,
    theme
  );
  const nameVal = useFieldValidation(
    formValues.applicantName,
    (v) => typeof v === "string" && v.trim().length > 0,
    showValidation,
    theme
  );
  const businessVal = { asteriskColor: theme.palette.text.secondary }; // optional
  const mobileVal = useFieldValidation(
    formValues.applicantMobile,
    (v) => /^\d{10}$/.test(String(v)),
    showValidation,
    theme
  );
  const emailVal = useFieldValidation(
    formValues.applicantEmail,
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
    showValidation,
    theme
  );
  const pincodeVal = useFieldValidation(
    formValues.applicantPincode,
    (v) => /^\d{6}$/.test(String(v)),
    showValidation,
    theme
  );
  const loanTypeVal = useFieldValidation(
    formValues.loanType,
    (v) => Boolean(v),
    showValidation,
    theme
  );
  const amountVal = useFieldValidation(
    formValues.loanAmount,
    (v) => {
      const n = Number(v);
      return !isNaN(n) && n >= 50000 && n <= 100000000;
    },
    showValidation,
    theme
  );
  const assignVal = useFieldValidation(
    formValues.assignTo || "",
    (v) => Boolean(v),
    showValidation,
    theme
  );
  const lenderVal = useFieldValidation(
    formValues.lenderName || "",
    (v) => Boolean(v),
    showValidation,
    theme
  );

  return (
    <>
      {/* 1. Partnership */}
      {fieldConfig.partnerName.visible && (
        <>
          <Grid item xs={12}>
            <Box mb={1}>
              <Divider textAlign="left">Partnership</Divider>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete<Option, false, false, false>
              fullWidth
              options={partnerOptions}
              value={
                partnerOptions.find((o) => o.id === formValues.partnerName) ||
                null
              }
              getOptionLabel={(o) => o.label}
              onChange={(_, o) =>
                onFieldChange("partnerName", (o?.id as string) || "")
              }
              disabled={fieldConfig.partnerName.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Partner"
                  required
                  error={partnerVal.showError}
                  helperText={
                    partnerVal.showError ? "Partner is required" : ""
                  }
                  onBlur={partnerVal.handleBlur}
                  sx={{
                    "& .MuiInputLabel-asterisk": {
                      color: partnerVal.asteriskColor,
                    },
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
              )}
            />
          </Grid>
        </>
      )}

      {/* 2. Applicant Details */}
      {fieldConfig.applicantProfile.visible && (
        <>
          <Grid item xs={12}>
            <Box mt={3} mb={1}>
              <Divider textAlign="left">Applicant Details</Divider>
            </Box>
          </Grid>

          {/* Profile */}
          <Grid item xs={12} sm={6}>
            <Autocomplete<string, false, false, false>
              fullWidth
              options={[
                "Salaried Individual",
                "Business (SENP)",
                "Professional (SEP - Dr/CA/CS/Architect)",
                "Others",
              ]}
              value={formValues.applicantProfile}
              onChange={(_, v) =>
                onFieldChange("applicantProfile", (v as string) || "")
              }
              disabled={fieldConfig.applicantProfile.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Applicant Profile"
                  required
                  error={profileVal.showError}
                  helperText={
                    profileVal.showError
                      ? "Applicant Profile is required"
                      : ""
                  }
                  onBlur={profileVal.handleBlur}
                  sx={{
                    "& .MuiInputLabel-asterisk": {
                      color: profileVal.asteriskColor,
                    },
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
              )}
            />
          </Grid>

          {/* Applicant Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Applicant Name"
              fullWidth
              required
              value={formValues.applicantName}
              onChange={(e) =>
                onFieldChange("applicantName", e.target.value)
              }
              disabled={fieldConfig.applicantName.readOnly}
              error={nameVal.showError}
              helperText={
                nameVal.showError ? "Applicant Name is required" : ""
              }
              onBlur={nameVal.handleBlur}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: nameVal.asteriskColor,
                },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* Business Name (only when not Salaried Individual) */}
          {formValues.applicantProfile !== "Salaried Individual" && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Business Name"
                fullWidth
                value={formValues.businessName}
                onChange={(e) =>
                  onFieldChange("businessName", e.target.value)
                }
                disabled={fieldConfig.businessName.readOnly}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          )}

          {/* Applicant Mobile */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Applicant Mobile"
              fullWidth
              required
              value={formValues.applicantMobile}
              onChange={(e) =>
                onFieldChange(
                  "applicantMobile",
                  e.target.value.replace(/\D/g, "")
                )
              }
              disabled={fieldConfig.applicantMobile.readOnly}
              error={mobileVal.showError}
              helperText={
                mobileVal.showError ? "Mobile must be 10 digits" : ""
              }
              onBlur={mobileVal.handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 10 }}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: mobileVal.asteriskColor,
                },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* Applicant Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Applicant Email"
              fullWidth
              required
              type="email"
              value={formValues.applicantEmail}
              onChange={(e) =>
                onFieldChange("applicantEmail", e.target.value)
              }
              disabled={fieldConfig.applicantEmail.readOnly}
              error={emailVal.showError}
              helperText={emailVal.showError ? "Enter a valid email" : ""}
              onBlur={emailVal.handleBlur}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: emailVal.asteriskColor,
                },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Pincode"
              fullWidth
              required
              value={formValues.applicantPincode}
              onChange={(e) =>
                onFieldChange(
                  "applicantPincode",
                  e.target.value.replace(/\D/g, "")
                )
              }
              disabled={fieldConfig.applicantPincode.readOnly}
              error={pincodeVal.showError}
              helperText={pincodeVal.showError ? "Must be 6 digits" : ""}
              onBlur={pincodeVal.handleBlur}
              inputProps={{ maxLength: 6 }}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: pincodeVal.asteriskColor,
                },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* City & State (readonly) */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              fullWidth
              value={formValues.city}
              disabled
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="State"
              fullWidth
              value={formValues.state}
              disabled
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
        </>
      )}

      {/* 3. Loan Details */}
      {fieldConfig.loanType.visible && (
        <>
          <Grid item xs={12}>
            <Box mt={3} mb={1}>
              <Divider textAlign="left">Loan Details</Divider>
            </Box>
          </Grid>

          {/* Loan Type */}
          <Grid item xs={12} sm={6}>
            <Autocomplete<Option, false, false, false>
              fullWidth
              options={loanTypeOptions}
              value={
                loanTypeOptions.find((o) => o.label === formValues.loanType) ||
                null
              }
              getOptionLabel={(o) => o.label}
              onChange={(_, o) =>
                onFieldChange("loanType", (o?.label as string) || "")
              }
              disabled={fieldConfig.loanType.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Loan Type"
                  required
                  error={loanTypeVal.showError}
                  helperText={
                    loanTypeVal.showError ? "Loan Type is required" : ""
                  }
                  onBlur={loanTypeVal.handleBlur}
                  sx={{
                    "& .MuiInputLabel-asterisk": {
                      color: loanTypeVal.asteriskColor,
                    },
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
              )}
            />
          </Grid>

          {/* Loan Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Loan Amount"
              fullWidth
              required
              type="number"
              value={formValues.loanAmount}
              onChange={(e) => onFieldChange("loanAmount", e.target.value)}
              disabled={fieldConfig.loanAmount.readOnly}
              error={amountVal.showError}
              helperText={
                amountVal.showError
                  ? "Amount must be between ₹50,000 and ₹1,00,00,000"
                  : "₹50,000 – ₹1,00,00,000"
              }
              onBlur={amountVal.handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: amountVal.asteriskColor,
                },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* Comments */}
          <Grid item xs={12}>
            <TextField
              label="Comments"
              fullWidth
              multiline
              minRows={3}
              value={formValues.comments}
              onChange={(e) => onFieldChange("comments", e.target.value)}
              disabled={fieldConfig.comments.readOnly}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
        </>
      )}

      {/* 4. Assignment & Lender */}
      {(fieldConfig.assignTo.visible || fieldConfig.lenderName.visible) && (
        <Grid item xs={12}>
          <Box mt={3} mb={1}>
            <Divider textAlign="left">Assignment & Lender</Divider>
          </Box>
        </Grid>
      )}

      {/* Assign To */}
      {fieldConfig.assignTo.visible && (
        <Grid item xs={12} sm={6}>
          <Autocomplete<Option, false, false, false>
            fullWidth
            options={
              role === "manager"
                ? [{ id: authUserId!, label: authUserName! }]
                : managerOptions
            }
            value={
              role === "manager"
                ? { id: authUserId!, label: authUserName! }
                : managerOptions.find(
                    (o) => o.id === formValues.assignTo
                  ) || null
            }
            getOptionLabel={(o) => o.label}
            onChange={(_, o) =>
              onFieldChange("assignTo", (o?.id as string) || "")
            }
            disabled={fieldConfig.assignTo.readOnly}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign To"
                required
                error={assignVal.showError}
                helperText={
                  assignVal.showError ? "Assignment is required" : ""
                }
                onBlur={assignVal.handleBlur}
                sx={{
                  "& .MuiInputLabel-asterisk": {
                    color: assignVal.asteriskColor,
                  },
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            )}
          />
        </Grid>
      )}

      {/* Lender Name */}
      {fieldConfig.lenderName.visible && (
        <Grid item xs={12} sm={6}>
          <Autocomplete<Option, false, false, false>
            fullWidth
            options={lenderOptions}
            value={
              lenderOptions.find((o) => o.label === formValues.lenderName) ||
              null
            }
            getOptionLabel={(o) => o.label}
            onChange={(_, o) =>
              onFieldChange("lenderName", (o?.label as string) || "")
            }
            disabled={!formValues.loanType || fieldConfig.lenderName.readOnly}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lender Name"
                required
                error={lenderVal.showError}
                helperText={
                  lenderVal.showError ? "Lender Name is required" : ""
                }
                onBlur={lenderVal.handleBlur}
                sx={{
                  "& .MuiInputLabel-asterisk": {
                    color: lenderVal.asteriskColor,
                  },
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            )}
          />
        </Grid>
      )}
    </>
  );
};

export default LeadFormFields;
