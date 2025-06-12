// src/components/FormDialog/LeadFormFields.tsx

import React, { useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  Autocomplete,
  Box,
  Divider,
} from "@mui/material";
import type { AppDispatch, RootState } from "../../../../store/index";
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
  fieldConfig: Record<FieldKey, FieldConfig>;
  formValues: LeadFormData;
  onFieldChange: <K extends keyof LeadFormData>(
    field: K,
    value: LeadFormData[K]
  ) => void;
  role: string;
  mode: string;
}

const LeadFormFields: React.FC<LeadFormFieldsProps> = ({
  fieldConfig,
  formValues,
  onFieldChange,
  role,
  mode,
}) => {
  const dispatch = useAppDispatch<AppDispatch>();
  const { userName: authUserName, userId: authUserId } = useAuth();

  const partners = useAppSelector((s: RootState) => s.managePartners.partners);
  const managers = useAppSelector((s: RootState) => s.team.managers);
  const loanTypes = useAppSelector((s: RootState) => s.lenderLoan.loanTypes);
  const lendersByType = useAppSelector(
    (s: RootState) => s.lenderLoan.lendersByLoanType
  );

  // track last loanType fetched
  const fetchedLoanRef = useRef<string | null>(null);
  // track last pincode looked up
  const lastPincodeRef = useRef<string | null>(null);
  // remember which lead ID we last reset on
  const lastFormIdRef = useRef<string | undefined>(undefined);

  // -- RESET PINCODE REF ON FORM OPEN FOR A NEW LEAD --
  useEffect(() => {
    if (formValues.id !== lastFormIdRef.current) {
      lastFormIdRef.current = formValues.id;
      lastPincodeRef.current = null;
    }
  }, [formValues.id]);

  // 1) load static lists once
  useEffect(() => {
    if (!partners.length) dispatch(fetchAllPartners());
    if (!managers.length) dispatch(fetchManagers());
    if (!loanTypes.length) dispatch(fetchLoanTypes());
  }, [dispatch, partners.length, managers.length, loanTypes.length]);

  // 2) prefill assignTo for managers
  useEffect(() => {
    if (
      role === "manager" &&
      (mode === "create" || mode === "duplicate") &&
      authUserId
    ) {
      onFieldChange("assignTo", authUserId);
    }
  }, [role, mode, authUserId, onFieldChange]);

  // 3) fetch lenders for the selected loanType only once in edit/duplicate
  useEffect(() => {
    if (
      (mode === "edit" || mode === "duplicate") &&
      formValues.loanType &&
      formValues.loanType !== fetchedLoanRef.current
    ) {
      const sel = loanTypes.find((lt) => lt.name === formValues.loanType);
      if (sel) {
        dispatch(fetchLendersByLoanType(sel._id));
        const prevLoan = fetchedLoanRef.current;
        fetchedLoanRef.current = formValues.loanType;
        // only clear lenderName on _subsequent_ changes, not the initial hydration
        if (prevLoan !== null) {
          onFieldChange("lenderName", "");
        }
      }
    }
  }, [
    mode,
    formValues.loanType,
    loanTypes,
    dispatch,
    onFieldChange,
  ]);

  // 4) debounced pincode lookup: always fires once on open + whenever user changes PIN
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
  }, [formValues.applicantPincode, onFieldChange]);

  // build option arrays
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
              onChange={(_, o) => onFieldChange("partnerName", o?.id || "")}
              disabled={fieldConfig.partnerName.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Partner"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
              onChange={(_, v) => onFieldChange("applicantProfile", v || "")}
              disabled={fieldConfig.applicantProfile.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Applicant Profile"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Applicant Name"
              fullWidth
              required
              value={formValues.applicantName}
              onChange={(e) => onFieldChange("applicantName", e.target.value)}
              disabled={fieldConfig.applicantName.readOnly}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          {fieldConfig.businessName.visible &&
            formValues.applicantProfile !== "Salaried Individual" && (
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Applicant Email"
              fullWidth
              required
              type="email"
              value={formValues.applicantEmail}
              onChange={(e) => onFieldChange("applicantEmail", e.target.value)}
              disabled={fieldConfig.applicantEmail.readOnly}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

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
              inputProps={{ maxLength: 6 }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

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

          <Grid item xs={12} sm={6}>
            <Autocomplete<Option, false, false, false>
              fullWidth
              options={loanTypeOptions}
              value={
                loanTypeOptions.find((o) => o.label === formValues.loanType)
                  || null
              }
              getOptionLabel={(o) => o.label}
              onChange={(_, o) => onFieldChange("loanType", o?.label || "")}
              disabled={fieldConfig.loanType.readOnly}
              renderInput={(params) => (
                <TextField {...params} label="Loan Type" required />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Loan Amount"
              fullWidth
              required
              type="number"
              value={formValues.loanAmount}
              onChange={(e) => onFieldChange("loanAmount", e.target.value)}
              disabled={fieldConfig.loanAmount.readOnly}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              helperText="50,000 – 1,00,00,000"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Comments"
              fullWidth
              multiline
              minRows={3}
              value={formValues.comments}
              onChange={(e) => onFieldChange("comments", e.target.value)}
              disabled={fieldConfig.comments.readOnly}
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
                : managerOptions.find((o) => o.id === formValues.assignTo)
                || null
            }
            getOptionLabel={(o) => o.label}
            onChange={(_, o) => onFieldChange("assignTo", o?.id || "")}
            disabled={fieldConfig.assignTo.readOnly}
            renderInput={(params) => (
              <TextField {...params} label="Assign To" required />
            )}
          />
        </Grid>
      )}

      {fieldConfig.lenderName.visible && (
        <Grid item xs={12} sm={6}>
          <Autocomplete<Option, false, false, false>
            fullWidth
            options={lenderOptions}
            value={
              lenderOptions.find((o) => o.label === formValues.lenderName)
              || null
            }
            getOptionLabel={(o) => o.label}
            onChange={(_, o) => onFieldChange("lenderName", o?.label || "")}
            disabled={!formValues.loanType || fieldConfig.lenderName.readOnly}
            renderInput={(params) => (
              <TextField {...params} label="Lender Name" required />
            )}
          />
        </Grid>
      )}
    </>
  );
};

export default LeadFormFields;
