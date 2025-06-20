import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../services/api"

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

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      const response = await axiosInstance.post("/partner/create", formData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Partner creation failed")
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
    return rejectWithValue(error.response?.data?.message || "Failed to send OTP")
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
      return rejectWithValue(error.response?.data?.message || "OTP verification failed")
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
      .addCase(createPartner.fulfilled, (state) => {
        state.loading = false
        state.success = "Partner created successfully"
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Send OTP
      .addCase(sendPartnerOtp.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
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
        state.success = null
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

export const { clearSignupPartnerState } = signupPartnerSlice.actions
export default signupPartnerSlice.reducer
