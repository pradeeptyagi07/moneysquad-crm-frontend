"use client"

// src/components/FormDialog/LeadFormFields.tsx

import type React from "react"
import { useEffect, useRef } from "react"
import { Grid, TextField, InputAdornment, Autocomplete, Box, Divider } from "@mui/material"
import type { AppDispatch, RootState } from "../../../../store/index"
import { fetchAllPartners } from "../../../../store/slices/managePartnerSlice"
import { fetchManagers } from "../../../../store/slices/teamSLice"
import { fetchLoanTypes, fetchLendersByLoanType } from "../../../../store/slices/lenderLoanSlice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useAuth } from "../../../../hooks/useAuth"
import type { FieldConfig, FieldKey } from "../../utils/fieldVisibility"
import type { LeadFormData } from "./LeadFormDialog"

interface Option {
  id: string
  label: string
}

interface LeadFormFieldsProps {
  open: boolean
  fieldConfig: Record<FieldKey, FieldConfig>
  formValues: LeadFormData
  onFieldChange: <K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => void
  role: string
  mode: string
  showValidation: boolean // New prop to control when to show validation
  leadStatus?: string
}

const LeadFormFields: React.FC<LeadFormFieldsProps> = ({
  open,
  fieldConfig,
  formValues,
  onFieldChange,
  role,
  mode,
  showValidation,
  leadStatus,
}) => {
  const dispatch = useAppDispatch<AppDispatch>()
  const { userName: authUserName, userId: authUserId } = useAuth()

  const partners = useAppSelector((s: RootState) => s.managePartners.partners)
  const managers = useAppSelector((s: RootState) => s.team.managers)
  const loanTypes = useAppSelector((s: RootState) => s.lenderLoan.loanTypes)
  const lendersByType = useAppSelector((s: RootState) => s.lenderLoan.lendersByLoanType)

  // track last loanType fetched
  const fetchedLoanRef = useRef<string | null>(null)
  // track last pincode looked up
  const lastPincodeRef = useRef<string | null>(null)
  // remember which lead ID we last reset on
  const lastFormIdRef = useRef<string | undefined>(undefined)

  // -- RESET PINCODE REF ON EVERY OPEN OR WHEN ID/MODE CHANGES --
  useEffect(() => {
    lastFormIdRef.current = formValues.id
    lastPincodeRef.current = null
  }, [formValues.id, mode, open])

  // 1) load static lists once
  useEffect(() => {
    if (!partners.length) dispatch(fetchAllPartners())
    if (!managers.length) dispatch(fetchManagers())
    if (!loanTypes.length) dispatch(fetchLoanTypes())
  }, [dispatch, partners.length, managers.length, loanTypes.length])

  // 2) prefill assignTo for managers
  useEffect(() => {
    if (role === "manager" && (mode === "create" || mode === "duplicate") && authUserId) {
      onFieldChange("assignTo", authUserId)
    }
  }, [role, mode, authUserId, onFieldChange])

  // 3) FIXED: fetch lenders immediately when form opens with existing lead data
  useEffect(() => {
    if (
      open &&
      (mode === "edit" || mode === "duplicate") &&
      formValues.loanType &&
      loanTypes.length > 0 &&
      formValues.loanType !== fetchedLoanRef.current
    ) {
      const sel = loanTypes.find((lt) => lt.name === formValues.loanType)
      if (sel) {
        dispatch(fetchLendersByLoanType(sel._id))
        fetchedLoanRef.current = formValues.loanType
      }
    }
  }, [open, mode, formValues.loanType, loanTypes, dispatch])

  // 4) handle loanType changes during form interaction (not initial load)
  useEffect(() => {
    if (
      formValues.loanType &&
      formValues.loanType !== fetchedLoanRef.current &&
      fetchedLoanRef.current !== null // This means it's not the initial load
    ) {
      const sel = loanTypes.find((lt) => lt.name === formValues.loanType)
      if (sel) {
        dispatch(fetchLendersByLoanType(sel._id))
        fetchedLoanRef.current = formValues.loanType
        // Clear lenderName when user changes loanType
        onFieldChange("lenderName", "")
      }
    }
  }, [formValues.loanType, loanTypes, dispatch, onFieldChange])

  // 5) debounced pincode lookup: fires on open + whenever PIN changes
  useEffect(() => {
    const pin = formValues.applicantPincode
    // if we already looked up this pin since last reset, do nothing
    if (pin === lastPincodeRef.current) return
    lastPincodeRef.current = pin

    if (pin.length !== 6) {
      onFieldChange("city", "")
      onFieldChange("state", "")
      return
    }

    const timeout = setTimeout(() => {
      fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
            const { State, District } = data[0].PostOffice[0]
            onFieldChange("state", State)
            onFieldChange("city", District)
          }
        })
        .catch(() => {})
    }, 500)

    return () => clearTimeout(timeout)
  }, [formValues.applicantPincode, formValues.id, mode, open])

  // Helper function to check if field should show error based on field config and validation state
  const shouldShowFieldError = (fieldName: keyof LeadFormData, customValidation?: (value: any) => boolean) => {
    if (!showValidation) return false

    const fieldKey = fieldName as FieldKey
    const config = fieldConfig[fieldKey]

    // Only show error if field is visible and required (not read-only for required fields)
    const isFieldRequired = config?.visible && (fieldKey === "partnerName" ? !config.readOnly : true)

    if (!isFieldRequired) return false

    const value = formValues[fieldName]

    if (customValidation) {
      return customValidation(value)
    }

    return !value || (typeof value === "string" && !value.trim())
  }

  // Helper function to get error message
  const getFieldErrorMessage = (fieldName: string, customMessage?: string) => {
    if (!showValidation) return ""
    return customMessage || `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
  }

  // build option arrays
  const partnerOptions: Option[] = partners.map((p) => ({
    id: p._id,
    label: p.basicInfo.fullName,
  }))
  const managerOptions: Option[] = managers.map((m) => ({
    id: m._id,
    label: `${m.firstName} ${m.lastName}`,
  }))
  const loanTypeOptions: Option[] = loanTypes.map((lt) => ({
    id: lt._id,
    label: lt.name,
  }))
  const lenderOptions: Option[] = lendersByType.map((l) => ({
    id: l._id,
    label: l.name,
  }))

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
              value={partnerOptions.find((o) => o.id === formValues.partnerName) || null}
              getOptionLabel={(o) => o.label}
              onChange={(_, o) => onFieldChange("partnerName", o?.id || "")}
              disabled={fieldConfig.partnerName.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Partner"
                  required={!fieldConfig.partnerName.readOnly}
                  error={shouldShowFieldError("partnerName")}
                  helperText={shouldShowFieldError("partnerName") ? "Partner is required" : ""}
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
              options={["Salaried Individual", "Business (SENP)", "Professional (SEP - Dr/CA/CS/Architect)", "Others"]}
              value={formValues.applicantProfile}
              onChange={(_, v) => onFieldChange("applicantProfile", v || "")}
              disabled={fieldConfig.applicantProfile.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Applicant Profile"
                  required
                  error={shouldShowFieldError("applicantProfile")}
                  helperText={shouldShowFieldError("applicantProfile") ? "Applicant Profile is required" : ""}
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
              error={shouldShowFieldError("applicantName")}
              helperText={shouldShowFieldError("applicantName") ? "Applicant Name is required" : ""}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          {fieldConfig.businessName.visible && formValues.applicantProfile !== "Salaried Individual" && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Business Name"
                fullWidth
                value={formValues.businessName}
                onChange={(e) => onFieldChange("businessName", e.target.value)}
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
              onChange={(e) => onFieldChange("applicantMobile", e.target.value.replace(/\D/g, ""))}
              disabled={fieldConfig.applicantMobile.readOnly}
              error={shouldShowFieldError("applicantMobile", (value) => {
                if (!value || !value.trim()) return true
                return value.length > 0 && value.length !== 10
              })}
              helperText={
                shouldShowFieldError("applicantMobile", (value) => !value || !value.trim())
                  ? "Mobile number is required"
                  : shouldShowFieldError("applicantMobile", (value) => value && value.length > 0 && value.length !== 10)
                    ? "Mobile number must be 10 digits"
                    : ""
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
              }}
              inputProps={{ maxLength: 10 }}
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
              error={shouldShowFieldError("applicantEmail", (value) => {
                if (!value || !value.trim()) return true
                return value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              })}
              helperText={
                shouldShowFieldError("applicantEmail", (value) => !value || !value.trim())
                  ? "Email is required"
                  : shouldShowFieldError(
                        "applicantEmail",
                        (value) => value && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                      )
                    ? "Please enter a valid email address"
                    : ""
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Pincode"
              fullWidth
              required
              value={formValues.applicantPincode}
              onChange={(e) => onFieldChange("applicantPincode", e.target.value.replace(/\D/g, ""))}
              disabled={fieldConfig.applicantPincode.readOnly}
              error={shouldShowFieldError("applicantPincode", (value) => {
                if (!value || !value.trim()) return true
                return value.length > 0 && value.length !== 6
              })}
              helperText={
                shouldShowFieldError("applicantPincode", (value) => !value || !value.trim())
                  ? "Pincode is required"
                  : shouldShowFieldError("applicantPincode", (value) => value && value.length > 0 && value.length !== 6)
                    ? "Pincode must be 6 digits"
                    : ""
              }
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
              value={loanTypeOptions.find((o) => o.label === formValues.loanType) || null}
              getOptionLabel={(o) => o.label}
              onChange={(_, o) => onFieldChange("loanType", o?.label || "")}
              disabled={fieldConfig.loanType.readOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Loan Type"
                  required
                  error={shouldShowFieldError("loanType")}
                  helperText={shouldShowFieldError("loanType") ? "Loan Type is required" : ""}
                />
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
              error={shouldShowFieldError("loanAmount", (value) => {
                if (!value || !value.trim()) return true
                const amt = Number(value)
                return value && (isNaN(amt) || amt < 50000 || amt > 100000000)
              })}
              helperText={
                shouldShowFieldError("loanAmount", (value) => !value || !value.trim())
                  ? "Loan Amount is required"
                  : shouldShowFieldError("loanAmount", (value) => {
                        if (!value) return false
                        const amt = Number(value)
                        return isNaN(amt) || amt < 50000 || amt > 100000000
                      })
                    ? "Amount must be between ₹50,000 and ₹10,00,00,000"
                    : "50,000 – 1,00,00,000"
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
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
            options={role === "manager" ? [{ id: authUserId!, label: authUserName! }] : managerOptions}
            value={
              role === "manager"
                ? { id: authUserId!, label: authUserName! }
                : managerOptions.find((o) => o.id === formValues.assignTo) || null
            }
            getOptionLabel={(o) => o.label}
            onChange={(_, o) => onFieldChange("assignTo", o?.id || "")}
            disabled={fieldConfig.assignTo.readOnly}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign To"
                required
                error={shouldShowFieldError("assignTo")}
                helperText={shouldShowFieldError("assignTo") ? "Assignment is required" : ""}
              />
            )}
          />
        </Grid>
      )}

      {fieldConfig.lenderName.visible && (
        <Grid item xs={12} sm={6}>
          <Autocomplete<Option, false, false, false>
            fullWidth
            options={lenderOptions}
            value={lenderOptions.find((o) => o.label === formValues.lenderName) || null}
            getOptionLabel={(o) => o.label}
            onChange={(_, o) => onFieldChange("lenderName", o?.label || "")}
            disabled={!formValues.loanType || fieldConfig.lenderName.readOnly}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lender Name"
                required
                error={shouldShowFieldError("lenderName")}
                helperText={shouldShowFieldError("lenderName") ? "Lender Name is required" : ""}
              />
            )}
          />
        </Grid>
      )}
    </>
  )
}

export default LeadFormFields
