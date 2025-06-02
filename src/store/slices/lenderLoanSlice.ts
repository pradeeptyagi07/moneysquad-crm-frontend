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

interface LenderLoanState {
  lenders: LenderOrLoan[]
  loanTypes: LenderOrLoan[]
  loading: boolean
  error: string | null
  success: string | null
}

const initialState: LenderLoanState = {
  lenders: [],
  loanTypes: [],
  loading: false,
  error: null,
  success: null,
}

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
