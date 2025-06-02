import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../../services/authServices"
import axiosInstance from "../../services/api"

// Types
interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    mobile: string
  } | null
  userRole: string | null
  loading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  userRole: localStorage.getItem("userRole") || null,
  loading: false,
  error: null,
}

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      const role = response.user.role

      let userData

      if (role === "partner") {
        const fullName = response.user.basicInfo?.fullName || ""
        const [firstName, ...lastNameParts] = fullName.split(" ")
        userData = {
          id: response.user._id,
          firstName,
          lastName: lastNameParts.join(" ") || "",
          email: response.user.basicInfo?.email || response.user.email,
          mobile: response.user.basicInfo?.mobile || response.user.mobile || "",
        }
      } else {
        userData = {
          id: response.user._id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          mobile: response.user.mobile || "",
        }
      }

      localStorage.setItem("token", response.token)
      localStorage.setItem("userRole", role)
      localStorage.setItem("user", JSON.stringify(userData))

      return { ...response, user: userData } // Return normalized user data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials.")
    }
  },
)


// Logout user
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userRole")
  localStorage.removeItem("user")
})

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("currentPassword", data.currentPassword)
      formData.append("newPassword", data.newPassword)
      await axiosInstance.post("/auth/reset-password", formData)
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to reset password")
    }
  }
)

// Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("email", email)
      await axiosInstance.post("/auth/send-opt", formData)
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP")
    }
  }
)

// Forget Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("otp", data.otp)
      await axiosInstance.post("/auth/forgot-password", formData)
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to reset password with OTP")
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.userRole = action.payload.user.role
        state.user = {
          id: action.payload.user._id,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          email: action.payload.user.email,
          mobile: action.payload.user.mobile || "",
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.userRole = null
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer
