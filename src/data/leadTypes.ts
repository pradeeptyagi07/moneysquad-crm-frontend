// Lead status types
export type LeadStatus = "pending" | "login" | "approved" | "rejected" | "disbursed" | "closed" | "expired"

// Applicant profile types
export type ApplicantProfile = "Salaried" | "Self-Employed" | "Business" | "Student" | "Retired"

// Timeline event interface
export interface TimelineEvent {
  status: LeadStatus | "created" | "assigned" | "updated"
  timestamp: string
  comment: string
  updatedBy: string
}

// Lead interface
export interface Lead {
  id: string
  applicantName: string
  applicantProfile: ApplicantProfile
  businessName?: string
  mobileNumber: string
  email: string
  pincode: string
  loanType: string
  loanAmount: number
  status: LeadStatus
  createdBy: string
  createdAt: string
  updatedAt?: string
  assignedTo: string
  assignedToId: string
  lender: string
  comments: string
  timeline: TimelineEvent[]
}

// Lead form data interface
export interface LeadFormData {
  applicantName: string
  applicantProfile: ApplicantProfile
  businessName?: string
  mobileNumber: string
  email: string
  pincode: string
  loanType: string
  loanAmount: number
  comments: string
}
