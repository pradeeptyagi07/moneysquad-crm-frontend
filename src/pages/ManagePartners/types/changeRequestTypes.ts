export interface DocumentFile {
    id: string
    name: string
    url: string
    type: string
    size: number
    uploadedAt: string
  }
  
  export interface BankChangeRequest {
    id: string
    type: "bank"
    submittedAt: string
    reason: string
    status: "pending" | "approved" | "declined"
    currentData: {
      bankName: string
      accountNumber: string
      ifscCode: string
      accountHolderName: string
      branchName: string
    }
    requestedData: {
      bankName: string
      accountNumber: string
      ifscCode: string
      accountHolderName: string
      branchName: string
    }
    adminNotes?: string
    processedBy?: string
    processedAt?: string
  }
  
  export interface DocumentChangeRequest {
    id: string
    type: "document"
    documentType: "panCard" | "aadharCard" | "bankPassbook" | "profilePhoto"
    submittedAt: string
    reason: string
    status: "pending" | "approved" | "declined"
    currentDocument: DocumentFile
    newDocument: DocumentFile
    adminNotes?: string
    processedBy?: string
    processedAt?: string
  }
  
  export type ChangeRequest = BankChangeRequest | DocumentChangeRequest
  
  export interface PartnerChangeRequests {
    partnerId: string
    partnerName: string
    bankRequests: BankChangeRequest[]
    documentRequests: DocumentChangeRequest[]
    totalPending: number
  }
  