export interface CommissionRate {
    id: string
    lenderName: string
    loanType: string
    applicantType: string
    commissionPercentage: number
    tier: "Gold" | "Diamond"
    notes?: string
  }
  
  export interface DisbursedLead {
    id: string
    partnerId: string
    partnerName: string
    lenderName: string
    loanType: string
    applicantType: string
    disbursedAmount: number
    disbursedDate: string
    commissionPercentage: number
    grossPayout: number
    tdsPercentage: number
    gstApplicable: boolean
    status: "Pending" | "Processing" | "Paid"
    remarks: string
    tier: "Gold" | "Diamond"
  }
  
  export interface PartnerPayout {
    id: string
    partnerId: string
    partnerName: string
    month: string
    grossPayout: number
    tdsPercentage: number
    tdsAmount: number
    netPayout: number
    gstApplicable: boolean
    status: "Pending" | "Processing" | "Paid"
  }
  
  export interface PartnerCommissionSummary {
    id: string
    month: string
    lenderName: string
    loanType: string
    grossPayout: number
    tdsPercentage: number
    tdsAmount: number
    netPayout: number
    status: "Pending" | "Processing" | "Paid"
  }
  
  export interface CommissionFilter {
    month?: string
    applicantType?: string
    status?: string
    tier?: string
    lenderName?: string
  }
  