export interface Partner {
    partnerId: string
    basicInfo: {
      fullName: string
      email: string
      mobile: string
      profilePhoto?: string
    }
    personalDetails: {
      dateOfBirth: string
      gender: string
      fatherName?: string
      motherName?: string
    }
    addressDetails: {
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      pincode: string
      country?: string
    }
    bankDetails: {
      bankName: string
      accountNumber: string
      ifscCode: string
      accountHolderName: string
      branchName?: string
    }
    documents: {
      panCard?: string
      aadharCard?: string
      bankPassbook?: string
      photo?: string
    }
    status: "active" | "inactive"
    registrationDate: string
    lastLoginDate?: string
    createdAt: string
    updatedAt: string
  }
  