"use client"

import { useCallback } from "react"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import type { LeadFormData } from "../formDialog/LeadFormDialog"
import type { UserRole } from "../constants/roles"
import type { FormMode } from "../constants/formModes"
import { createLead, updateLead, duplicateLead } from "../../../../store/slices/leadSLice"
import { getFieldConfig } from "../../utils/fieldVisibility"

interface UseLeadFormHandlers {
  validate: (data: LeadFormData, role: UserRole, mode: FormMode) => { valid: boolean; errorMessage?: string }
  onSubmit: (data: LeadFormData, role: UserRole, mode: FormMode) => Promise<void>
}

export function useLeadFormHandlers(): UseLeadFormHandlers {
  const dispatch = useAppDispatch()

  const validate = useCallback((data: LeadFormData, role: UserRole, mode: FormMode) => {
    // Get field configuration for current role and mode
    const fieldConfig = getFieldConfig(role, mode)

    // Define all possible required fields with their validation logic
    const fieldValidations = [
      {
        field: "partnerName" as keyof LeadFormData,
        message: "Partner is required.",
        isRequired: fieldConfig.partnerName.visible && !fieldConfig.partnerName.readOnly,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "applicantProfile" as keyof LeadFormData,
        message: "Applicant Profile is required.",
        isRequired: fieldConfig.applicantProfile.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "applicantName" as keyof LeadFormData,
        message: "Applicant Name is required.",
        isRequired: fieldConfig.applicantName.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "applicantMobile" as keyof LeadFormData,
        message: "Applicant Mobile is required.",
        isRequired: fieldConfig.applicantMobile.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "applicantEmail" as keyof LeadFormData,
        message: "Applicant Email is required.",
        isRequired: fieldConfig.applicantEmail.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "applicantPincode" as keyof LeadFormData,
        message: "Pincode is required.",
        isRequired: fieldConfig.applicantPincode.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "loanType" as keyof LeadFormData,
        message: "Loan Type is required.",
        isRequired: fieldConfig.loanType.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "loanAmount" as keyof LeadFormData,
        message: "Loan Amount is required.",
        isRequired: fieldConfig.loanAmount.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "assignTo" as keyof LeadFormData,
        message: "Assignment is required.",
        isRequired: fieldConfig.assignTo.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
      {
        field: "lenderName" as keyof LeadFormData,
        message: "Lender Name is required.",
        isRequired: fieldConfig.lenderName.visible,
        validate: (value: any) => !value || (typeof value === "string" && !value.trim()),
      },
    ]

    // Check each field that is required for this role/mode combination
    for (const { field, message, isRequired, validate: fieldValidate } of fieldValidations) {
      if (isRequired && fieldValidate(data[field])) {
        return { valid: false, errorMessage: message }
      }
    }

    // Additional specific validations only if fields are visible and have values

    // Mobile number validation (only if field is visible and has value)
    if (fieldConfig.applicantMobile.visible && data.applicantMobile) {
      if (data.applicantMobile.length !== 10 || !/^\d{10}$/.test(data.applicantMobile)) {
        return { valid: false, errorMessage: "Mobile number must be exactly 10 digits." }
      }
    }

    // Email format validation (only if field is visible and has value)
    if (fieldConfig.applicantEmail.visible && data.applicantEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.applicantEmail)) {
        return { valid: false, errorMessage: "Please enter a valid email address." }
      }
    }

    // Pincode validation (only if field is visible and has value)
    if (fieldConfig.applicantPincode.visible && data.applicantPincode) {
      if (data.applicantPincode.length !== 6 || !/^\d{6}$/.test(data.applicantPincode)) {
        return { valid: false, errorMessage: "Pincode must be exactly 6 digits." }
      }
    }

    // Loan amount validation (only if field is visible and has value)
    if (fieldConfig.loanAmount.visible && data.loanAmount) {
      const amt = Number(data.loanAmount)
      if (isNaN(amt) || amt < 50000 || amt > 100000000) {
        return { valid: false, errorMessage: "Loan Amount must be between ₹50,000 and ₹10 Cr." }
      }
    }

    return { valid: true }
  }, [])

  const onSubmit = useCallback(
    async (data: LeadFormData, role: UserRole, mode: FormMode) => {
      const { valid, errorMessage } = validate(data, role, mode)
      if (!valid) throw new Error(errorMessage)

      if (mode === "create") {
        await dispatch(
          createLead({
            applicantName: data.applicantName,
            applicantProfile: data.applicantProfile,
            mobile: data.applicantMobile,
            email: data.applicantEmail,
            pincode: data.applicantPincode,
            loantType: data.loanType,
            loanAmount: data.loanAmount,
            comments: data.comments,
            businessName: data.businessName,
            city: data.city,
            state: data.state,
            partnerId: data.partnerName ?? "",
            assignto: data.assignTo,
          }),
        ).unwrap()
      } else if (mode === "edit") {
        await dispatch(
          updateLead({
            leadId: data.id!,
            applicantName: data.applicantName,
            applicantProfile: data.applicantProfile,
            mobile: data.applicantMobile,
            email: data.applicantEmail,
            pincode: data.applicantPincode,
            loantType: data.loanType,
            loanAmount: data.loanAmount,
            comments: data.comments!,
            businessName: data.businessName!,
            city: data.city,
            state: data.state,
            partnerId: data.partnerName!,
            assignedTo: data.assignTo!,
            lenderType: data.lenderName!,
          }),
        ).unwrap()
      } else if (mode === "duplicate") {
        await dispatch(
          duplicateLead({
            applicantName: data.applicantName,
            applicantProfile: data.applicantProfile,
            mobile: data.applicantMobile,
            email: data.applicantEmail,
            pincode: data.applicantPincode,
            loantType: data.loanType,
            loanAmount: data.loanAmount,
            comments: data.comments!,
            businessName: data.businessName!,
            city: data.city,
            state: data.state,
            partnerId: data.partnerName!,
            assignto: data.assignTo!,
            lenderType: data.lenderName!,
          }),
        ).unwrap()
      }
    },
    [dispatch, validate],
  )

  return { validate, onSubmit }
}
