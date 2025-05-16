export interface Partner {
    partnerId: string
    fullName: string
    email: string
    mobileNumber: string
    profilePhoto?: string
    registrationType: string
    role: "leadSharing" | "fileSharing"
    status: "active" | "inactive"
    joinedOn: string
    leadCount?: number
    city: string
    pincode: string
    gender: string
    dateOfBirth: string
    employmentType: string
    focusProduct: string
    emergencyContact: string
    addressLine1: string
    addressLine2?: string
    landmark?: string
    addressType: string
    accountType: string
    accountHolderName: string
    bankName: string
    accountNumber: string
    ifscCode: string
    branchName: string
    documents: {
      profilePhoto?: string
      panCard?: string
      aadharFront?: string
      aadharBack?: string
      cancelledCheque?: string
      gstCertificate?: string
      additionalDocuments?: string[]
    }
  }
  