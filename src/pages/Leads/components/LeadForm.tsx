// src/pages/Leads/components/LeadForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { fetchAllPartners } from "../../../store/slices/managePartnerSlice";
import {
  fetchLoanTypes,
  fetchLenders,
} from "../../../store/slices/lenderLoanSlice";
import { useAuth } from "../../../hooks/useAuth";
import type { Lead } from "../../../store/slices/leadSLice";

interface LeadFormProps {
  initialData?: Lead;
  isEdit?: boolean;
  isDuplicate?: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  isEdit = false,
  isDuplicate = false,
  onSubmit,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const { userRole } = useAuth();
  console.log("initaildata", initialData);

  // partners (only on create + admin)
  const partners = useAppSelector((s) => s.managePartners.partners);
  // loanTypes + lenders
  const {
    loanTypes,
    lenders,
    loading: llLoading,
    error: llError,
  } = useAppSelector((s) => s.lenderLoan);

  // form state
  const [formData, setFormData] = useState<any>({
    partnerId: initialData?.partner ?? "",
    applicantName: initialData?.applicant?.name ?? "",
    applicantProfile: initialData?.applicant?.profile ?? "Salaried",
    businessName:
      initialData?.applicant?.profile === "Business"
        ? initialData.applicant.name
        : "",
    mobileNumber: initialData?.applicant?.mobile ?? "",
    email: initialData?.applicant?.email ?? "",
    pincode: initialData?.applicant?.pincode ?? "",
    loanType: initialData?.loan?.type ?? "",
    loanAmount: initialData?.loan?.amount ?? 0,
    comments: initialData?.loan?.comments ?? "",
    lenderType: initialData?.lenderType ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // load dynamic lists
  useEffect(() => {
    dispatch(fetchLoanTypes());
    // fetch lenders on edit or duplicate
    if (isEdit || isDuplicate) dispatch(fetchLenders());
  }, [dispatch, isEdit, isDuplicate]);

  // partners only if admin + create/duplicate false
  useEffect(() => {
    if (userRole === "admin" && !isEdit && !isDuplicate) {
      dispatch(fetchAllPartners());
    }
  }, [dispatch, userRole, isEdit, isDuplicate]);

  // handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as any;
    setFormData((f: any) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: "" }));
    }
  };

  // validation
  const validate = (): boolean => {
    const errs: any = {};
    let ok = true;

    if (!formData.applicantName.trim()) {
      errs.applicantName = "Required";
      ok = false;
    }
    if (
      formData.applicantProfile === "Business" &&
      !formData.businessName.trim()
    ) {
      errs.businessName = "Required";
      ok = false;
    }
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      errs.mobileNumber = "Enter valid mobile";
      ok = false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Enter valid email";
      ok = false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      errs.pincode = "Enter 6 digit pincode";
      ok = false;
    }
    if (!formData.loanType) {
      errs.loanType = "Required";
      ok = false;
    }
    if (!(formData.loanAmount > 0)) {
      errs.loanAmount = "Must be > 0";
      ok = false;
    }
    // partner required on create, not on edit/duplicate
    if (
      !isEdit &&
      !isDuplicate &&
      userRole === "admin" &&
      !formData.partnerId
    ) {
      errs.partnerId = "Select partner";
      ok = false;
    }
    // lenderType required on edit or duplicate
    if ((isEdit || isDuplicate) && !formData.lenderType) {
      errs.lenderType = "Select lender";
      ok = false;
    }

    setErrors(errs);
    return ok;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" mb={3}>
        {isDuplicate
          ? "Duplicate Lead"
          : isEdit
          ? "Edit Lead Information"
          : "New Lead Information"}
      </Typography>

      <Grid container spacing={3}>
        {/* partner selector */}
        {userRole === "admin" && !isEdit && !isDuplicate && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.partnerId}>
              <InputLabel>Partner</InputLabel>
              <Select
                name="partnerId"
                value={formData.partnerId}
                label="Partner"
                onChange={handleChange}
                required
              >
                {partners.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.basicInfo?.fullName || p.partnerId}
                  </MenuItem>
                ))}
              </Select>
              {errors.partnerId && (
                <FormHelperText>{errors.partnerId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        {/* Applicant Info */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600}>
            Applicant Information
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleChange}
            error={!!errors.applicantName}
            helperText={errors.applicantName}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Profile</InputLabel>
            <Select
              name="applicantProfile"
              value={formData.applicantProfile}
              label="Profile"
              onChange={handleChange}
            >
              {[
                "Salaried",
                "Self-Employed",
                "Business",
                "Student",
                "Retired",
              ].map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {formData.applicantProfile === "Business" && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={!!errors.businessName}
              helperText={errors.businessName}
              required
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            required
            InputProps={{
              startAdornment: <InputAdornment>+91</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            error={!!errors.pincode}
            helperText={errors.pincode}
            required
          />
        </Grid>

        {/* Loan Info */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600}>
            Loan Information
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
  <FormControl fullWidth>
    <InputLabel>Loan Type</InputLabel>
    <Select
      name="loanType"
      value={formData.loanType}
      label="Loan Type"
      onChange={handleChange}
      required
    >
      {loanTypes.map((lt) => (
        <MenuItem key={lt._id} value={lt.name}>
          {lt.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Loan Amount"
            name="loanAmount"
            type="number"
            value={formData.loanAmount}
            onChange={handleChange}
            error={!!errors.loanAmount}
            helperText={errors.loanAmount}
            required
            InputProps={{ startAdornment: <InputAdornment>₹</InputAdornment> }}
          />
        </Grid>

        {/* Lender Type on edit or duplicate */}
        {(isEdit || isDuplicate) && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.lenderType}>
              <InputLabel>Lender Type</InputLabel>
              {llLoading ? (
                <CircularProgress size={24} />
              ) : llError ? (
                <Typography color="error">{llError}</Typography>
              ) : (
                <Select
                  name="lenderType"
                  value={formData.lenderType}
                  label="Lender Type"
                  onChange={handleChange}
                  required
                >
                  {lenders.map((l) => (
                    <MenuItem key={l._id} value={l.name}>
                      {l.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {errors.lenderType && (
                <FormHelperText>{errors.lenderType}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        {/* Comments */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Comments"
            name="comments"
            multiline
            rows={4}
            value={formData.comments}
            onChange={handleChange}
          />
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {isDuplicate
                ? "Duplicate Lead"
                : isEdit
                ? "Update Lead"
                : "Create Lead"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadForm;
