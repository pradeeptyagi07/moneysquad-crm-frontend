import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosInstance from "../../services/api"

// Base User Interface
interface BaseUser {
  _id: string
  email: string
  mobile: string
  role: "admin" | "manager" | "partner" | "associate"
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
  __v: number
}

// Admin User Interface
interface AdminUser extends BaseUser {
  firstName: string
  lastName: string
  commissionPlan: string
  role: "admin"
}

// Manager User Interface
interface ManagerUser extends BaseUser {
  firstName: string
  lastName: string
  location: string
  managerId: string
  role: "manager"
}

// Partner User Interface
interface PartnerUser extends BaseUser {
  partnerId: string
  basicInfo: {
    fullName: string
    mobile: string
    email: string
    registeringAs: string
    _id: string
  }
  personalInfo: {
    dateOfBirth: string
    currentProfession: string
    emergencyContactNumber: string
    focusProduct: string
    roleSelection: string
    _id: string
  }
  addressDetails: {
    addressLine1: string
    addressLine2: string
    landmark: string
    city: string
    pincode: string
    addressType: string
    _id: string
  }
  bankDetails: {
    accountType: string
    accountHolderName: string
    bankName: string
    accountNumber: string
    ifscCode: string
    branchName: string
    relationshipWithAccountHolder: string
    isGstBillingApplicable: string
    _id: string
  }
  documents: {
    profilePhoto: string
    panCard: string
    aadharFront: string
    aadharBack: string
    cancelledCheque: string
    gstCertificate: string
    aditional: string
    _id: string
  }
  commissionPlan: string
  role: "partner"
}

// Associate User Interface
interface AssociateUser extends BaseUser {
  firstName: string
  lastName: string
  location: string
  commissionPlan: string
  associateOf: string
  associateDisplayId: string
  role: "associate"
}

// Union type for all user types
type UserData = AdminUser | ManagerUser | PartnerUser | AssociateUser

// API Response Interface
interface UserDataResponse {
  success: boolean
  data: UserData
}

// State Interface
interface UserDataState {
  userData: UserData | null
  loading: boolean
  error: string | null
  updating: boolean
  updateError: string | null
}

// Initial State
const initialState: UserDataState = {
  userData: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
}

// Async Thunk for fetching user data
export const fetchUserData = createAsyncThunk<UserData, void, { rejectValue: string }>(
  "userData/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<UserDataResponse>("/common/userdata")

      if (response.data.success) {
        return response.data.data
      } else {
        return rejectWithValue("Failed to fetch user data")
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data")
    }
  },
)

// Async Thunk for updating user data
export const updateUserData = createAsyncThunk<UserData, Partial<UserData>, { rejectValue: string }>(
  "userData/updateUserData",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<UserDataResponse>("/common/userdata", updateData)

      if (response.data.success) {
        return response.data.data
      } else {
        return rejectWithValue("Failed to update user data")
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user data")
    }
  },
)

// User Data Slice
const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    // Clear user data
    clearUserData: (state) => {
      state.userData = null
      state.error = null
      state.updateError = null
    },

    // Clear error
    clearError: (state) => {
      state.error = null
      state.updateError = null
    },

    // Update user data locally (for optimistic updates)
    updateUserDataLocally: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Data
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false
        state.userData = action.payload
        state.error = null
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch user data"
      })
      // Update User Data
      .addCase(updateUserData.pending, (state) => {
        state.updating = true
        state.updateError = null
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.updating = false
        state.userData = action.payload
        state.updateError = null
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.updating = false
        state.updateError = action.payload || "Failed to update user data"
      })
  },
})

// Export actions
export const { clearUserData, clearError, updateUserDataLocally } = userDataSlice.actions

// Export reducer
export default userDataSlice.reducer

// Selectors
export const selectUserData = (state: { userData: UserDataState }) => state.userData.userData
export const selectUserDataLoading = (state: { userData: UserDataState }) => state.userData.loading
export const selectUserDataError = (state: { userData: UserDataState }) => state.userData.error
export const selectUserDataUpdating = (state: { userData: UserDataState }) => state.userData.updating
export const selectUserDataUpdateError = (state: { userData: UserDataState }) => state.userData.updateError

// Type guards for checking user role
export const isAdminUser = (user: UserData | null): user is AdminUser => {
  return user?.role === "admin"
}

export const isManagerUser = (user: UserData | null): user is ManagerUser => {
  return user?.role === "manager"
}

export const isPartnerUser = (user: UserData | null): user is PartnerUser => {
  return user?.role === "partner"
}

export const isAssociateUser = (user: UserData | null): user is AssociateUser => {
  return user?.role === "associate"
}
