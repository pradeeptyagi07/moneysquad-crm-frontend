import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../services/api"
import axios from "axios"

// Types
interface SignupState {
  loading: boolean
  error: string | null
  success: string | null
}

interface PartnerFormData {
  fullName: string
  mobileNumber: string
  email: string
  registrationType: string
  teamStrength?: string
  dateOfBirth?: string
  employmentType: string
  emergencyContact: string
  focusProduct: string
  role: string
  experienceInSellingLoans: string
  addressLine1: string
  addressLine2: string
  landmark: string
  city: string
  addressPincode: string
  addressType: string
  accountHolderName: string
  accountType: string
  relationshipWithAccountHolder: string
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
  isGstBillingApplicable?: string
  profilePhoto: File | null
  panCard: File | null
  aadharFront: File | null
  aadharBack: File | null
  cancelledCheque: File | null
  gstCertificate: File | null
  otherDocuments?: File[]
}

const initialState: SignupState = {
  loading: false,
  error: null,
  success: null,
}

// 1. Create Partner (with nested FormData)
export const createPartner = createAsyncThunk(
  "signup/createPartner",
  async (form: PartnerFormData, { rejectWithValue }) => {
    try {
      console.log("Creating FormData for partner registration...")

      const formData = new FormData()

      // Basic Info
      formData.append("basicInfo.fullName", form.fullName)
      formData.append("basicInfo.mobile", form.mobileNumber)
      formData.append("basicInfo.email", form.email)
      formData.append("basicInfo.registeringAs", form.registrationType)
      if (form.teamStrength) {
        formData.append("basicInfo.teamStrength", form.teamStrength)
      }

      // Personal Info
      formData.append("personalInfo.dateOfBirth", form.dateOfBirth || "")
      formData.append("personalInfo.currentProfession", form.employmentType)
      formData.append("personalInfo.emergencyContactNumber", form.emergencyContact)
      formData.append("personalInfo.focusProduct", form.focusProduct)
      formData.append("personalInfo.roleSelection", form.role)
      formData.append("personalInfo.experienceInSellingLoans", form.experienceInSellingLoans)

      // Address Details
      formData.append("addressDetails.addressLine1", form.addressLine1)
      formData.append("addressDetails.addressLine2", form.addressLine2)
      formData.append("addressDetails.landmark", form.landmark)
      formData.append("addressDetails.city", form.city)
      formData.append("addressDetails.pincode", form.addressPincode)
      formData.append("addressDetails.addressType", form.addressType)

      // Bank Details
      formData.append("bankDetails.accountHolderName", form.accountHolderName)
      formData.append("bankDetails.accountType", form.accountType)
      formData.append("bankDetails.relationshipWithAccountHolder", form.relationshipWithAccountHolder)
      formData.append("bankDetails.bankName", form.bankName)
      formData.append("bankDetails.accountNumber", form.accountNumber)
      formData.append("bankDetails.ifscCode", form.ifscCode)
      formData.append("bankDetails.branchName", form.branchName)
      if (form.isGstBillingApplicable) {
        formData.append("bankDetails.isGstBillingApplicable", form.isGstBillingApplicable)
      }

      // Documents – Flat keys
      if (form.profilePhoto) formData.append("profilePhoto", form.profilePhoto)
      if (form.panCard) formData.append("panCard", form.panCard)
      if (form.aadharFront) formData.append("aadharFront", form.aadharFront)
      if (form.aadharBack) formData.append("aadharBack", form.aadharBack)
      if (form.cancelledCheque) formData.append("cancelledCheque", form.cancelledCheque)
      if (form.gstCertificate) formData.append("gstCertificate", form.gstCertificate)

      // Additional documents as array
      form.otherDocuments?.forEach((file) => {
        if (file instanceof File) {
          formData.append("aditional", file)
        }
      })

      console.log("Making API request to create partner...")

      const response = await axiosInstance.post("/partner/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 second timeout for file uploads
      })

      console.log("Partner creation API response:", response.data)
      return response.data
    } catch (error: any) {
      console.error("Partner creation API error:", error)

      // Handle different types of errors
      let errorMessage = "An unexpected error occurred. Please try again."

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your internet connection and try again."
      } else if (error.response) {
        // Server responded with error status
        const serverMessage = error.response.data?.message

        if (serverMessage === "Partner already exists") {
          errorMessage =
            "This email or phone number is already registered. Try logging in instead or use a different email to create a new account."
        } else if (serverMessage) {
          errorMessage = serverMessage
        } else {
          errorMessage = `Server error (${error.response.status}). Please try again later.`
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection and try again."
      } else if (error.message) {
        errorMessage = error.message
      }

      console.error("Returning error message:", errorMessage)
      // Use rejectWithValue to properly handle the error without causing unhandled promise rejection
      return rejectWithValue(errorMessage)
    }
  },
)

// 2. Send OTP
export const sendPartnerOtp = createAsyncThunk("signup/sendPartnerOtp", async (email: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/partner/send-otp", {
      email,
    })
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to send OTP"
    return rejectWithValue(errorMessage)
  }
})

// 3. Verify OTP
export const verifyPartnerOtp = createAsyncThunk(
  "signup/verifyPartnerOtp",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/partner/verify-otp", {
        email: data.email,
        otp: data.otp,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "OTP verification failed"
      return rejectWithValue(errorMessage)
    }
  },
)

// Slice
const signupPartnerSlice = createSlice({
  name: "signupPartner",
  initialState,
  reducers: {
    clearSignupPartnerState: (state) => {
      state.error = null
      state.success = null
      state.loading = false
    },
    setSignupError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Partner
      .addCase(createPartner.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(createPartner.fulfilled, (state, action) => {
        state.loading = false
        state.success = "Partner created successfully"
        state.error = null
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = null
      })

      // Send OTP
      .addCase(sendPartnerOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendPartnerOtp.fulfilled, (state) => {
        state.loading = false
        state.success = "OTP sent successfully"
      })
      .addCase(sendPartnerOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Verify OTP
      .addCase(verifyPartnerOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyPartnerOtp.fulfilled, (state) => {
        state.loading = false
        state.success = "OTP verified successfully"
      })
      .addCase(verifyPartnerOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSignupPartnerState, setSignupError } = signupPartnerSlice.actions
export default signupPartnerSlice.reducer
