import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosInstance from "../../services/api"

// API response structure
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Update the CreateOfferRequest interface to match the API structure exactly
export interface CreateOfferRequest {
  bankName: string
  bankImage: File | string // Changed to accept both File object or string URL
  offerHeadline: string
  offerValidity: string
  loanType: string
  interestRate: number
  processingFee: number
  maximumAmount: number
  commissionPercent: number
  isFeatured: boolean
  keyFeatures: string[]
  eligibility: {
    minAge: number
    maxAge: number
    minIncome: number
    employmentType: string
    maxCreditScore: number
  }
}

// Also update the BankOffer interface to better match the API structure
export interface BankOffer {
  _id: string
  bankName: string
  bankImage: string
  offerHeadline: string
  offerValidity: string
  loanType: string
  interestRate: number
  processingFee: number
  maximumAmount: number
  commissionPercent: number
  isFeatured: boolean
  keyFeatures: string[]
  eligibility: {
    minAge: number
    maxAge: number
    minIncome: number
    employmentType: string
    maxCreditScore: number
  }
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface NewOfferFormData {
  bankName: string
  bankImage: File | string
  loanType: string
  offerHeadline?: string
  offerValidity?: string
  interestRate: number
  processingFee: number
  maximumAmount: number
  keyFeatures: string[]
  commissionPercent: number
  isFeatured: boolean
  eligibility?: {
    minAge?: number
    maxAge?: number
    minIncome?: number
    employmentType?: string
    maxCreditScore?: number
  }
}

// Add loan type color mapping
// src/constants/loanTypeColors.ts

export const loanTypeColors: Record<string, { gradient: string; textColor: string }> = {
  "PL-Term Loan": {
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    textColor: "#ffffff",
  },
  "PL-Overdraft": {
    gradient: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
    textColor: "#ffffff",
  },
  "BL-Term Loan": {
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    textColor: "#ffffff",
  },
  "BL-Overdraft": {
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    textColor: "#ffffff",
  },
  "SEPL-Term Loan": {
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    textColor: "#ffffff",
  },
  "SEPL-Overdraft": {
    gradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    textColor: "#ffffff",
  },
  // optional fallback
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

// Define the state interface
interface OffersState {
  offers: BankOffer[]
  selectedOffer: BankOffer | null
  loading: boolean
  detailsLoading: boolean
  error: string | null
  success: string | null
}

// Initial state
const initialState: OffersState = {
  offers: [],
  selectedOffer: null,
  loading: false,
  detailsLoading: false,
  error: null,
  success: null,
}

// Async thunks for API calls
export const fetchAllOffers = createAsyncThunk("offers/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<BankOffer[]>>(`/offers/get-all`)
    // Add console log to debug the response
    console.log("API Response:", response.data)
    return response.data.data // Return the data array from the response
  } catch (error: any) {
    console.error("API Error:", error)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch offers")
  }
})

// New thunk to fetch a single offer by ID
export const fetchOfferById = createAsyncThunk("offers/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<BankOffer>>(`/offers/${id}`)
    console.log("Offer Details Response:", response.data)
    return response.data.data
  } catch (error: any) {
    console.error("API Error:", error)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch offer details")
  }
})

export const createOffer = createAsyncThunk(
  "offers/create",
  async (offerData: CreateOfferRequest, { rejectWithValue }) => {
    try {
      // Create FormData object
      const formData = new FormData()

      // Add all fields to FormData
      formData.append("bankName", offerData.bankName)

      // Handle bankImage correctly - it should be a File object, not a URL string
      if (offerData.bankImage instanceof File) {
        formData.append("bankImage", offerData.bankImage)
      } else if (typeof offerData.bankImage === "string" && !offerData.bankImage.startsWith("blob:")) {
        // If it's a regular URL (not a blob URL), we can pass it as is
        formData.append("bankImage", offerData.bankImage)
      }
      // If it's a blob URL, we don't append it as it's not the actual file

      formData.append("offerHeadline", offerData.offerHeadline)
      formData.append("offerValidity", offerData.offerValidity)
      formData.append("loanType", offerData.loanType)
      formData.append("interestRate", offerData.interestRate.toString())
      formData.append("processingFee", offerData.processingFee.toString())
      formData.append("maximumAmount", offerData.maximumAmount.toString())
      formData.append("commissionPercent", offerData.commissionPercent.toString())
      formData.append("isFeatured", offerData.isFeatured.toString())

      // Add array of features
      offerData.keyFeatures.forEach((feature, index) => {
        formData.append(`keyFeatures[${index}]`, feature)
      })

      // Add eligibility criteria
      if (offerData.eligibility) {
        if (offerData.eligibility.minAge !== undefined)
          formData.append("eligibility[minAge]", offerData.eligibility.minAge.toString())
        if (offerData.eligibility.maxAge !== undefined)
          formData.append("eligibility[maxAge]", offerData.eligibility.maxAge.toString())
        if (offerData.eligibility.minIncome !== undefined)
          formData.append("eligibility[minIncome]", offerData.eligibility.minIncome.toString())
        if (offerData.eligibility.employmentType)
          formData.append("eligibility[employmentType]", offerData.eligibility.employmentType)
        if (offerData.eligibility.maxCreditScore !== undefined)
          formData.append("eligibility[maxCreditScore]", offerData.eligibility.maxCreditScore.toString())
      }


      // Log the FormData for debugging (can't directly log FormData contents)
      console.log("Creating offer with data:", Object.fromEntries(formData.entries()))

      const response = await axiosInstance.post<ApiResponse<BankOffer>>(`/offers/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data // Return the data from the response
    } catch (error: any) {
      console.error("Create offer error:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to create offer")
    }
  },
)

export const updateOffer = createAsyncThunk(
  "offers/update",
  async ({ id, offerData }: { id: string; offerData: Partial<CreateOfferRequest> }, { rejectWithValue }) => {
    try {
      // Create FormData object
      const formData = new FormData()

      // Add all available fields to FormData
      if (offerData.bankName) formData.append("bankName", offerData.bankName)

      // Handle bankImage correctly - it should be a File object, not a URL string
      if (offerData.bankImage) {
        if (offerData.bankImage instanceof File) {
          formData.append("bankImage", offerData.bankImage)
        } else if (typeof offerData.bankImage === "string" && !offerData.bankImage.startsWith("blob:")) {
          // If it's a regular URL (not a blob URL), we can pass it as is
          formData.append("bankImage", offerData.bankImage)
        }
        // If it's a blob URL, we don't append it as it's not the actual file
      }

      if (offerData.offerHeadline) formData.append("offerHeadline", offerData.offerHeadline)
      if (offerData.offerValidity) formData.append("offerValidity", offerData.offerValidity)
      if (offerData.loanType) formData.append("loanType", offerData.loanType)
      if (offerData.interestRate !== undefined) formData.append("interestRate", offerData.interestRate.toString())
      if (offerData.processingFee !== undefined) formData.append("processingFee", offerData.processingFee.toString())
      if (offerData.maximumAmount !== undefined) formData.append("maximumAmount", offerData.maximumAmount.toString())
      if (offerData.commissionPercent !== undefined)
        formData.append("commissionPercent", offerData.commissionPercent.toString())
      if (offerData.isFeatured !== undefined) formData.append("isFeatured", offerData.isFeatured.toString())

      // Add array of features if available
      if (offerData.keyFeatures) {
        offerData.keyFeatures.forEach((feature, index) => {
          formData.append(`keyFeatures[${index}]`, feature)
        })
      }

      // Add eligibility criteria if available
      if (offerData.eligibility) {
        if (offerData.eligibility.minAge !== undefined)
          formData.append("eligibility[minAge]", offerData.eligibility.minAge.toString())
        if (offerData.eligibility.maxAge !== undefined)
          formData.append("eligibility[maxAge]", offerData.eligibility.maxAge.toString())
        if (offerData.eligibility.minIncome !== undefined)
          formData.append("eligibility[minIncome]", offerData.eligibility.minIncome.toString())
        if (offerData.eligibility.employmentType)
          formData.append("eligibility[employmentType]", offerData.eligibility.employmentType)
        if (offerData.eligibility.maxCreditScore !== undefined)
          formData.append("eligibility[maxCreditScore]", offerData.eligibility.maxCreditScore.toString())
      }

      // Log the FormData for debugging (can't directly log FormData contents)
      console.log("Updating offer with data:", Object.fromEntries(formData.entries()))

      const response = await axiosInstance.put<ApiResponse<BankOffer>>(`/offers/${id}/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data // Return the data from the response
    } catch (error: any) {
      console.error("Update offer error:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to update offer")
    }
  },
)

export const deleteOffer = createAsyncThunk("offers/delete", async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<string>>(`/offers/${id}`)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete offer")
  }
})

// Create the offers slice
const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearOffersState: (state) => {
      state.error = null
      state.success = null
    },
    setSelectedOffer: (state, action: PayloadAction<BankOffer | null>) => {
      state.selectedOffer = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch all offers
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.loading = false
        state.offers = action.payload
        console.log("Offers in state:", state.offers) // Debug log
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch offer by ID
    builder
      .addCase(fetchOfferById.pending, (state) => {
        state.detailsLoading = true
        state.error = null
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.detailsLoading = false
        state.selectedOffer = action.payload
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.detailsLoading = false
        state.error = action.payload as string
      })

    // Create offer
    builder
      .addCase(createOffer.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false
        state.offers = [action.payload, ...state.offers]
        state.success = "Offer created successfully!"
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update offer
    builder
      .addCase(updateOffer.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loading = false
        state.offers = state.offers.map((offer) =>
          offer._id === action.payload._id ? { ...offer, ...action.payload } : offer,
        )
        state.selectedOffer = action.payload
        state.success = "Offer updated successfully!"
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Delete offer
    builder
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false
        state.offers = state.offers.filter((offer) => offer._id !== action.payload)
        state.success = "Offer deleted successfully!"
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearOffersState, setSelectedOffer } = offersSlice.actions
export default offersSlice.reducer
