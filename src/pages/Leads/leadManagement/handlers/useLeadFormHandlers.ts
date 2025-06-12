// src/components/handlers/useLeadFormHandlers.ts

import { useCallback } from 'react';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import type { LeadFormData } from '../formDialog/LeadFormDialog';
import type { UserRole } from '../constants/roles';
import type { FormMode } from '../constants/formModes';
import { createLead, updateLead, duplicateLead } from '../../../../store/slices/leadSLice';

interface UseLeadFormHandlers {
  validate: (data: LeadFormData) => { valid: boolean; errorMessage?: string };
  onSubmit: (
    data: LeadFormData,
    role: UserRole,
    mode: FormMode
  ) => Promise<void>;
}

export function useLeadFormHandlers(): UseLeadFormHandlers {
  const dispatch = useAppDispatch();

  const validate = useCallback((data: LeadFormData) => {
    const amt = Number(data.loanAmount);
    if (isNaN(amt) || amt < 50000 || amt > 100000000) {
      return { valid: false, errorMessage: 'Loan Amount must be between ₹50,000 and ₹10 Cr.' };
    }
    if (!data.applicantName.trim()) {
      return { valid: false, errorMessage: 'Applicant Name is required.' };
    }
    if (!data.applicantEmail.trim()) {
      return { valid: false, errorMessage: 'Applicant Email is required.' };
    }
    if (!data.applicantMobile.trim()) {
      return { valid: false, errorMessage: 'Applicant Mobile is required.' };
    }
    if (!data.loanType) {
      return { valid: false, errorMessage: 'Loan Type is required.' };
    }
    return { valid: true };
  }, []);

  const onSubmit = useCallback(
    async (data: LeadFormData, role: UserRole, mode: FormMode) => {
      const { valid, errorMessage } = validate(data);
      if (!valid) throw new Error(errorMessage);

      if (mode === 'create') {
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
            partnerId: data.partnerName ?? '',
            assignto: data.assignTo,
          })
        ).unwrap();
      } else if (mode === 'edit') {
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
            assignto: data.assignTo!,
            lenderType: data.lenderName!,
          })
        ).unwrap();
      } else if (mode === 'duplicate') {
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
          })
        ).unwrap();
      }
    },
    [dispatch, validate]
  );

  return { validate, onSubmit };
}
