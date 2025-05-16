export interface TeamMember {
    id: string
    name: string
    email: string
    mobile: string
    location: string
    role: string
    status: "active" | "inactive"
    joinedDate: string
    assignedLeads?: number
    completedLeads?: number
    conversionRate?: number
    profileImage?: string
  }
  
  export interface TeamMemberFormData {
    name: string
    email: string
    mobile: string
    location: string
    role: string
  }
  