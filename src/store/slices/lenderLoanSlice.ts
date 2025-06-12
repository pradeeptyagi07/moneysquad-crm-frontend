// src/store/slices/lenderLoanSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../services/api"

export interface LenderOrLoan {
  _id: string
  name: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

// Matrix entry returned by GET /api/matrix
export interface MatrixEntry {
  lenderId: string
  lenderName: string
  loanTypeId: string
  loanTypeName: string
  enabled: boolean
}

// Payload for toggling matrix rows
export interface MatrixTogglePayload {
  lenderId: string
  loanTypeId: string
  enabled: boolean
}

interface LenderLoanState {
  lenders: LenderOrLoan[]
  loanTypes: LenderOrLoan[]
  matrix: MatrixEntry[]
  lendersByLoanType: LenderOrLoan[]
  loading: boolean
  error: string | null
  success: string | null
}

const initialState: LenderLoanState = {
  lenders: [],
  loanTypes: [],
  matrix: [],
  lendersByLoanType: [],
  loading: false,
  error: null,
  success: null,
}

// Existing thunks
export const fetchLoanTypes = createAsyncThunk<
  LenderOrLoan[],
  void,
  { rejectValue: string }
>(
  "lenderLoan/fetchLoanTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/offers/loan-types")
      return response.data.data as LenderOrLoan[]
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch loan types"
      )
    }
  }
)

export const createLoanType = createAsyncThunk<
  LenderOrLoan,
  string,
  { rejectValue: string }
>(
  "lenderLoan/createLoanType",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/offers/loan-create", { name })
      return response.data.data as LenderOrLoan
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create loan type"
      )
    }
  }
)

export const fetchLenders = createAsyncThunk<
  LenderOrLoan[],
  void,
  { rejectValue: string }
>(
  "lenderLoan/fetchLenders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/offers/lenders")
      return response.data.data as LenderOrLoan[]
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch lenders"
      )
    }
  }
)

export const createLender = createAsyncThunk<
  LenderOrLoan,
  string,
  { rejectValue: string }
>(
  "lenderLoan/createLender",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/offers/lender-create", { name })
      return response.data.data as LenderOrLoan
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create lender"
      )
    }
  }
)

// New thunks for matrix operations
export const fetchMatrix = createAsyncThunk<
  MatrixEntry[],
  void,
  { rejectValue: string }
>(
  "lenderLoan/fetchMatrix",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/matrix")
      return response.data.data as MatrixEntry[]
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch matrix"
      )
    }
  }
)

export const toggleMatrix = createAsyncThunk<
  MatrixTogglePayload[],
  MatrixTogglePayload[],
  { rejectValue: string }
>(
  "lenderLoan/toggleMatrix",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      // Send entire array as JSON in a field
      formData.append('data', JSON.stringify(payload))
      await axiosInstance.patch("/matrix/toggle", formData)
      return payload
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle matrix entries"
      )
    }
  }
)

export const fetchLendersByLoanType = createAsyncThunk<
  LenderOrLoan[],
  string,
  { rejectValue: string }
>(
  "lenderLoan/fetchLendersByLoanType",
  async (loanTypeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/matrix/lenders/${loanTypeId}`
      )
      return response.data.data as LenderOrLoan[]
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch lenders by loan type"
      )
    }
  }
)

const lenderLoanSlice = createSlice({
  name: "lenderLoan",
  initialState,
  reducers: {
    clearLenderLoanState(state) {
      state.error = null
      state.success = null
    },
  },
  extraReducers: (builder) => {
    builder
      // existing handlers
      .addCase(fetchLoanTypes.fulfilled, (state, { payload }) => {
        state.loanTypes = payload
        state.loading = false
      })
      .addCase(fetchLenders.fulfilled, (state, { payload }) => {
        state.lenders = payload
        state.loading = false
      })
      .addCase(createLoanType.fulfilled, (state, { payload }) => {
        state.loanTypes.unshift(payload)
        state.success = "Loan type created successfully!"
        state.loading = false
      })
      .addCase(createLender.fulfilled, (state, { payload }) => {
        state.lenders.unshift(payload)
        state.success = "Lender created successfully!"
        state.loading = false
      })
      // new matrix handlers
      .addCase(fetchMatrix.fulfilled, (state, { payload }) => {
        state.matrix = payload
        state.loading = false
      })
      .addCase(toggleMatrix.fulfilled, (state, { payload }) => {
        // update local matrix entries
        payload.forEach((item) => {
          const idx = state.matrix.findIndex(
            (e) => e.lenderId === item.lenderId && e.loanTypeId === item.loanTypeId
          )
          if (idx !== -1) {
            state.matrix[idx].enabled = item.enabled
          }
        })
        state.success = "Matrix updated successfully!"
        state.loading = false
      })
      .addCase(fetchLendersByLoanType.fulfilled, (state, { payload }) => {
        state.lendersByLoanType = payload
        state.loading = false
      })
      // generic matchers
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true
          state.error = null
          state.success = null
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false
          state.error = action.payload as string
        }
      )
  },
})

export const { clearLenderLoanState } = lenderLoanSlice.actions
export default lenderLoanSlice.reducer
