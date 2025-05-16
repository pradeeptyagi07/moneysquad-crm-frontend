export interface BankOffer {
    id: string
    bankName: string
    logo: string
    loanType: string
    headline?: string
    validity?: string
    interestRate: string
    processingFee: string
    maxAmount: string
    features: string[]
    commission: string
    isFeatured?: boolean
    createdAt?: string
    eligibilityCriteria?: {
      minAge?: number
      maxAge?: number
      minIncome?: string
      employmentType?: string
      minCreditScore?: number
      businessVintage?: string
      courseEligibility?: string
      goldPurity?: string
      documents?: string[]
    }
  }
  
  export interface NewOfferFormData {
    bankName: string
    logo: string
    loanType: string
    headline?: string
    validity?: string
    interestRate: string
    processingFee: string
    maxAmount: string
    features: string[]
    commission: string
    isFeatured: boolean
    eligibilityCriteria?: {
      minAge?: number
      maxAge?: number
      minIncome?: string
      employmentType?: string
      minCreditScore?: number
      businessVintage?: string
      courseEligibility?: string
      goldPurity?: string
      documents?: string[]
    }
  }
  
  // Add loan type color mapping
  export const loanTypeColors: Record<string, { gradient: string; textColor: string }> = {
    "Personal Loan": {
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      textColor: "#ffffff",
    },
    "Home Loan": {
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      textColor: "#ffffff",
    },
    "Business Loan": {
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      textColor: "#ffffff",
    },
    "Education Loan": {
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      textColor: "#ffffff",
    },
    "Car Loan": {
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      textColor: "#ffffff",
    },
    "Gold Loan": {
      gradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
      textColor: "#ffffff",
    },
    "Credit Card": {
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      textColor: "#ffffff",
    },
    "Mortgage Loan": {
      gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      textColor: "#ffffff",
    },
    Other: {
      gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      textColor: "#ffffff",
    },
  }
  
  export const loanTypeOptions = [
    { value: "Personal Loan", icon: "CreditCard" },
    { value: "Home Loan", icon: "Home" },
    { value: "Business Loan", icon: "Business" },
    { value: "Education Loan", icon: "School" },
    { value: "Car Loan", icon: "DirectionsCar" },
    { value: "Gold Loan", icon: "Diamond" },
    { value: "Credit Card", icon: "CreditCard" },
    { value: "Mortgage Loan", icon: "AccountBalance" },
    { value: "Other", icon: "LocalOffer" },
  ]
  