import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance, { api } from "../../services/api"
import type { RootState } from "../index"

// Types
interface BankDetailsData {
  accountType: string
  accountHolderName: string
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
  relationshipWithAccountHolder: string
  isGstBillingApplicable: string
}

interface DocumentsData {
  [key: string]: string | File // URLs for previous, Files for current
}

interface ChangeRequestPayload {
  requestType: "bankDetails" | "documents"
  previousData: BankDetailsData | DocumentsData
  currentData: BankDetailsData | DocumentsData
  reason: string
}

interface ChangeRequestState {
  loading: boolean
  error: string | null
  success: boolean
  lastRequestId: string | null
  // Add new properties
  requests: any[]
  fetchLoading: boolean
  fetchError: string | null
  // Admin requests
  adminRequests: any[]
  adminFetchLoading: boolean
  adminFetchError: string | null
  // Action loading
  actionLoading: boolean
  actionError: string | null
  actionSuccess: boolean
}

// Initial state
const initialState: ChangeRequestState = {
  loading: false,
  error: null,
  success: false,
  lastRequestId: null,
  // Add new initial values
  requests: [],
  fetchLoading: false,
  fetchError: null,
  // Admin requests
  adminRequests: [],
  adminFetchLoading: false,
  adminFetchError: null,
  // Action loading
  actionLoading: false,
  actionError: null,
  actionSuccess: false,
}

// Async thunk for submitting change request
export const submitChangeRequest = createAsyncThunk(
  "changeRequest/submit",
  async (payload: ChangeRequestPayload, { rejectWithValue }) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData()

      // Add requestType
      formData.append("requestType", payload.requestType)

      // Add reason
      formData.append("reason", payload.reason)

      if (payload.requestType === "bankDetails") {
        // For bank details, both previous and current data are JSON strings
        formData.append("previousData", JSON.stringify(payload.previousData))
        formData.append("currentData", JSON.stringify(payload.currentData))
      } else if (payload.requestType === "documents") {
        // For documents, previous data is JSON string (URLs)
        formData.append("previousData", JSON.stringify(payload.previousData))

        // Current data contains files - append each file with its key
        const currentData = payload.currentData as DocumentsData
        Object.entries(currentData).forEach(([key, file]) => {
          if (file instanceof File) {
            formData.append(key, file)
          }
        })
      }

      const response = await axiosInstance.post("/request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error: any) {
      console.error("Change request submission error:", error)

      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }

      return rejectWithValue("Failed to submit change request. Please try again.")
    }
  },
)

// Async thunk for fetching partner requests
export const fetchPartnerRequests = createAsyncThunk(
  "changeRequest/fetchPartnerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/request/partner")
      return response.data.data || []
    } catch (error: any) {
      console.error("Fetch partner requests error:", error)

      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }

      return rejectWithValue("Failed to fetch requests. Please try again.")
    }
  },
)

// Async thunk for fetching admin requests for specific partner
export const fetchAdminRequests = createAsyncThunk(
  "changeRequest/fetchAdminRequests",
  async (partnerId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/request/admin/${partnerId}`)
      return response.data.data || []
    } catch (error: any) {
      console.error("Fetch admin requests error:", error)

      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }

      return rejectWithValue("Failed to fetch partner requests. Please try again.")
    }
  },
)

// Async thunk for approving/rejecting requests
export const updateRequestStatus = createAsyncThunk(
  "changeRequest/updateStatus",
  async (
    { requestId, status, message }: { requestId: string; status: "approved" | "rejected"; message?: string },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData()
      formData.append("status", status)
      if (message) {
        formData.append("message", message)
      }

      const response = await axiosInstance.put(`/request/action/${requestId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error: any) {
      console.error("Update request status error:", error)

      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }

      return rejectWithValue("Failed to update request status. Please try again.")
    }
  },
)

// Slice
const changeRequestSlice = createSlice({
  name: "changeRequest",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = false
    },
    resetState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
      state.lastRequestId = null
    },
    clearActionState: (state) => {
      state.actionLoading = false
      state.actionError = null
      state.actionSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit change request
      .addCase(submitChangeRequest.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitChangeRequest.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.success = true
        state.lastRequestId = action.payload?.requestId || null
      })
      .addCase(submitChangeRequest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
      // Fetch partner requests
      .addCase(fetchPartnerRequests.pending, (state) => {
        state.fetchLoading = true
        state.fetchError = null
      })
      .addCase(fetchPartnerRequests.fulfilled, (state, action) => {
        state.fetchLoading = false
        state.fetchError = null
        state.requests = action.payload
      })
      .addCase(fetchPartnerRequests.rejected, (state, action) => {
        state.fetchLoading = false
        state.fetchError = action.payload as string
      })
      // Fetch admin requests
      .addCase(fetchAdminRequests.pending, (state) => {
        state.adminFetchLoading = true
        state.adminFetchError = null
      })
      .addCase(fetchAdminRequests.fulfilled, (state, action) => {
        state.adminFetchLoading = false
        state.adminFetchError = null
        state.adminRequests = action.payload
      })
      .addCase(fetchAdminRequests.rejected, (state, action) => {
        state.adminFetchLoading = false
        state.adminFetchError = action.payload as string
      })
      // Update request status
      .addCase(updateRequestStatus.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.actionSuccess = false
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.actionLoading = false
        state.actionError = null
        state.actionSuccess = true
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload as string
        state.actionSuccess = false
      })
  },
})

// Actions
export const { clearError, clearSuccess, resetState, clearActionState } = changeRequestSlice.actions

// Selectors
export const selectChangeRequestLoading = (state: RootState) => state.changeRequest.loading
export const selectChangeRequestError = (state: RootState) => state.changeRequest.error
export const selectChangeRequestSuccess = (state: RootState) => state.changeRequest.success
export const selectLastRequestId = (state: RootState) => state.changeRequest.lastRequestId

export const selectPartnerRequests = (state: RootState) => state.changeRequest.requests
export const selectFetchLoading = (state: RootState) => state.changeRequest.fetchLoading
export const selectFetchError = (state: RootState) => state.changeRequest.fetchError

export const selectAdminRequests = (state: RootState) => state.changeRequest.adminRequests
export const selectAdminFetchLoading = (state: RootState) => state.changeRequest.adminFetchLoading
export const selectAdminFetchError = (state: RootState) => state.changeRequest.adminFetchError

export const selectActionLoading = (state: RootState) => state.changeRequest.actionLoading
export const selectActionError = (state: RootState) => state.changeRequest.actionError
export const selectActionSuccess = (state: RootState) => state.changeRequest.actionSuccess

// Reducer
export default changeRequestSlice.reducer
