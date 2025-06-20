import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosInstance from "../../services/api"

// Types
export interface CommissionEntry {
  _id: string
  lenderName: string
  termLoan: number
  overdraft: number
  remark: string
}

export interface CommissionSheet {
  _id: string
  sheetType: string
  entries: CommissionEntry[]
}

export interface CommissionPlan {
  _id: string
  commissionType: string
  __v: number
  sheets: CommissionSheet[]
}

// New types for disbursed leads
export interface DisbursedLead {
  _id: string
  leadId: string
  lead_Id: string
  payoutStatus: "pending" | "paid"
  warning: boolean
  remark: string
  disbursedAmount: number
  payoutStatusUpdatedAt: string
  createdAt: string
  updatedAt: string
  commission: number
  grossPayout: number
  netPayout: number
  isTopupLoan: boolean
  partner: {
    name: string
    partnerId: string
  }
  associate: {
    name: string
    associateDisplayId: string
  }
  applicant: {
    name: string
    business: string
  }
  lender: {
    name: string
    loanType: string
  }
  disbursedId: {
    _id: string
    leadUserId: string
    loanAmount: number
    tenureMonths: number
    interestRatePA: number
    processingFee: number
    insuranceCharges: number
    loanScheme: string
    lanNumber: string
    actualDisbursedDate: string
    createdAt: string
    updatedAt: string
  }
}

// New type for detailed payout information
export interface PayoutDetails {
  leadId: string
  disbursedAmount: number
  commission: number
  grossPayout: number
  tds: number
  netPayout: number
  remark: string
  commissionRemark: string
}

// New types for partner summary
export interface PartnerSummary {
  partnerName: string
  partnerId: string
  grossPayout: number
  tds: number
  netPayout: number
  amountPaid: number
  amountPending: number
  paymentStatus: string
  gstApplicable: string // Changed from boolean to string to match API response
  gstStatus: string
  advancesPaid: number
}

// New type for monthly breakdown
export interface MonthlyBreakdown {
  month: string
  totalDisbursals: number
  commissionEarned: number
  payoutPaid: number
  payoutPending: number
  paymentStatus: string
  gstStatus: string
}

export interface CommissionState {
  plans: CommissionPlan[]
  disbursedLeads: DisbursedLead[]
  partnerSummary: PartnerSummary[]
  monthlyBreakdown: MonthlyBreakdown[]
  payoutDetails: PayoutDetails | null
  loading: boolean
  error: string | null
  updating: boolean
  disbursedLeadsLoading: boolean
  payoutUpdating: boolean
  partnerSummaryLoading: boolean
  payoutDetailsLoading: boolean
  partnerPayoutUpdating: boolean
  monthlyBreakdownLoading: boolean
}

// Initial state
const initialState: CommissionState = {
  plans: [],
  disbursedLeads: [],
  partnerSummary: [],
  monthlyBreakdown: [],
  payoutDetails: null,
  loading: false,
  error: null,
  updating: false,
  disbursedLeadsLoading: false,
  payoutUpdating: false,
  partnerSummaryLoading: false,
  payoutDetailsLoading: false,
  partnerPayoutUpdating: false,
  monthlyBreakdownLoading: false,
}

// Existing async thunks
export const fetchCommissionData = createAsyncThunk(
  "commission/fetchCommissionData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/commission")
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch commission data")
    }
  },
)

export const updateCommissionEntry = createAsyncThunk(
  "commission/updateCommissionEntry",
  async (
    {
      planId,
      sheetName,
      lenderId,
      data,
    }: {
      planId: string
      sheetName: string
      lenderId: string
      data: {
        termLoan: number
        overdraft: number
        remark: string
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData()
      formData.append("termLoan", data.termLoan.toString())
      formData.append("overdraft", data.overdraft.toString())
      formData.append("remark", data.remark)

      const response = await axiosInstance.put(
        `/commission/entry/${planId}/${encodeURIComponent(sheetName)}/${lenderId}`,
        formData,
      )

      return {
        planId,
        sheetName,
        lenderId,
        updatedData: data,
        response: response.data,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update commission entry")
    }
  },
)

export const fetchDisbursedLeads = createAsyncThunk(
  "commission/fetchDisbursedLeads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/commission/get-payout")
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch disbursed leads")
    }
  },
)

export const updatePayoutStatus = createAsyncThunk(
  "commission/updatePayoutStatus",
  async (
    {
      payoutId,
      commission,
      payoutStatus,
      remark,
    }: {
      payoutId: string
      commission: number
      payoutStatus: "pending" | "paid"
      remark: string
    },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData()
      formData.append("commission", commission.toString()) // Already divided by 100 in component
      formData.append("payoutStatus", payoutStatus)
      formData.append("remark", remark)

      const response = await axiosInstance.put(`/commission/edit-payout/${payoutId}`, formData)

      return {
        payoutId,
        commission,
        payoutStatus,
        remark,
        response: response.data,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update payout status")
    }
  },
)

// New async thunk for fetching detailed payout information
export const fetchPayoutDetails = createAsyncThunk(
  "commission/fetchPayoutDetails",
  async (payoutId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/commission/payout-details/${payoutId}`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payout details")
    }
  },
)

// New async thunk for partner summary
export const fetchPartnerSummary = createAsyncThunk(
  "commission/fetchPartnerSummary",
  async ({ month, year }: { month: number; year: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/commission/partner-summary?month=${month}&year=${year}`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch partner summary")
    }
  },
)

// Updated async thunk for updating partner payout info with additional parameters
export const updatePartnerPayoutInfo = createAsyncThunk(
  "commission/updatePartnerPayoutInfo",
  async (
    {
      partnerId,
      month,
      year,
      gstStatus,
      advancesPaid,
    }: {
      partnerId: string
      month: number
      year: number
      gstStatus: string
      advancesPaid: number
    },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData()
      formData.append("partnerId", partnerId)
      formData.append("month", month.toString())
      formData.append("year", year.toString())
      formData.append("gstStatus", gstStatus)
      formData.append("advancesPaid", advancesPaid.toString())

      const response = await axiosInstance.put(`/commission/partner-summary/edit`, formData)

      return {
        partnerId,
        month,
        year,
        gstStatus,
        advancesPaid,
        response: response.data,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update partner payout info")
    }
  },
)

// New async thunk for monthly breakdown
export const fetchMonthlyBreakdown = createAsyncThunk(
  "commission/fetchMonthlyBreakdown",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/commission/partner-monthly-breakdown`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch monthly breakdown")
    }
  },
)

// Slice
const commissionSlice = createSlice({
  name: "commission",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearPayoutDetails: (state) => {
      state.payoutDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch commission data
      .addCase(fetchCommissionData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCommissionData.fulfilled, (state, action: PayloadAction<CommissionPlan[]>) => {
        state.loading = false
        state.plans = action.payload
        state.error = null
      })
      .addCase(fetchCommissionData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update commission entry
      .addCase(updateCommissionEntry.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateCommissionEntry.fulfilled, (state, action) => {
        state.updating = false
        const { planId, sheetName, lenderId, updatedData } = action.payload

        // Update the local state
        const plan = state.plans.find((p) => p._id === planId)
        if (plan) {
          const sheet = plan.sheets.find((s) => s.sheetType === sheetName)
          if (sheet) {
            const entry = sheet.entries.find((e) => e._id === lenderId)
            if (entry) {
              entry.termLoan = updatedData.termLoan
              entry.overdraft = updatedData.overdraft
              entry.remark = updatedData.remark
            }
          }
        }
      })
      .addCase(updateCommissionEntry.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload as string
      })
      // Fetch disbursed leads
      .addCase(fetchDisbursedLeads.pending, (state) => {
        state.disbursedLeadsLoading = true
        state.error = null
      })
      .addCase(fetchDisbursedLeads.fulfilled, (state, action: PayloadAction<DisbursedLead[]>) => {
        state.disbursedLeadsLoading = false
        state.disbursedLeads = action.payload
        state.error = null
      })
      .addCase(fetchDisbursedLeads.rejected, (state, action) => {
        state.disbursedLeadsLoading = false
        state.error = action.payload as string
      })
      // Update payout status
      .addCase(updatePayoutStatus.pending, (state) => {
        state.payoutUpdating = true
        state.error = null
      })
      .addCase(updatePayoutStatus.fulfilled, (state, action) => {
        state.payoutUpdating = false
        const { payoutId, commission, payoutStatus, remark } = action.payload

        // Update the local state
        const lead = state.disbursedLeads.find((lead) => lead._id === payoutId)
        if (lead) {
          lead.commission = commission * 100 // Convert back to percentage for display
          lead.payoutStatus = payoutStatus
          lead.remark = remark
          lead.payoutStatusUpdatedAt = new Date().toISOString()
          // Recalculate payouts based on new commission
          lead.grossPayout = lead.disbursedAmount * commission
          lead.netPayout = lead.grossPayout * 0.98 // Assuming 2% deduction
        }
      })
      .addCase(updatePayoutStatus.rejected, (state, action) => {
        state.payoutUpdating = false
        state.error = action.payload as string
      })
      // Fetch payout details
      .addCase(fetchPayoutDetails.pending, (state) => {
        state.payoutDetailsLoading = true
        state.error = null
      })
      .addCase(fetchPayoutDetails.fulfilled, (state, action: PayloadAction<PayoutDetails>) => {
        state.payoutDetailsLoading = false
        state.payoutDetails = action.payload
        state.error = null
      })
      .addCase(fetchPayoutDetails.rejected, (state, action) => {
        state.payoutDetailsLoading = false
        state.error = action.payload as string
      })
      // Fetch partner summary
      .addCase(fetchPartnerSummary.pending, (state) => {
        state.partnerSummaryLoading = true
        state.error = null
      })
      .addCase(fetchPartnerSummary.fulfilled, (state, action: PayloadAction<PartnerSummary[]>) => {
        state.partnerSummaryLoading = false
        state.partnerSummary = action.payload
        state.error = null
      })
      .addCase(fetchPartnerSummary.rejected, (state, action) => {
        state.partnerSummaryLoading = false
        state.error = action.payload as string
      })
      // Update partner payout info
      .addCase(updatePartnerPayoutInfo.pending, (state) => {
        state.partnerPayoutUpdating = true
        state.error = null
      })
      .addCase(updatePartnerPayoutInfo.fulfilled, (state, action) => {
        state.partnerPayoutUpdating = false
        const { partnerId, gstStatus, advancesPaid } = action.payload

        // Update the local state
        const partner = state.partnerSummary.find((p) => p.partnerId === partnerId)
        if (partner) {
          partner.gstStatus = gstStatus
          partner.advancesPaid = advancesPaid
        }
      })
      .addCase(updatePartnerPayoutInfo.rejected, (state, action) => {
        state.partnerPayoutUpdating = false
        state.error = action.payload as string
      })
      // Fetch monthly breakdown
      .addCase(fetchMonthlyBreakdown.pending, (state) => {
        state.monthlyBreakdownLoading = true
        state.error = null
      })
      .addCase(fetchMonthlyBreakdown.fulfilled, (state, action: PayloadAction<MonthlyBreakdown[]>) => {
        state.monthlyBreakdownLoading = false
        state.monthlyBreakdown = action.payload
        state.error = null
      })
      .addCase(fetchMonthlyBreakdown.rejected, (state, action) => {
        state.monthlyBreakdownLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearPayoutDetails } = commissionSlice.actions
export default commissionSlice.reducer
