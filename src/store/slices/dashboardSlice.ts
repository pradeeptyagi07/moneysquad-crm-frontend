// src/store/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";

// --- Types ---

export interface FunnelStage {
  name: string;
  count: number;
  currentCount: number;
  conversionPct: number;
}

export interface SnapshotData {
  totalDisbursal: { current: number; previous: number; deltaPercent: number };
  activeLeads: { count: number; unique: number };
  commissionEarned: { thisMonth: number; previousMonth: number; deltaPercent: number };
  approvalRate: { currentPercent: number; previousPercent: number; deltaPercent: number };
  rejectionRate: { currentPercent: number; previousPercent: number; deltaPercent: number };
}

export interface RejectionReasonCount {
  reason: string;
  count: number;
  percent: number;
}

export interface TrendData {
  month: string;
  value: number;
}

export interface Trends {
  leadsAdded: TrendData[];
  disbursals: TrendData[];
  payouts: TrendData[];
}

export interface MatrixData {
  disbursalRatePct: number;
  avgDisbursalTATdays: number;
  avgLoanAmount: number;
  targetAchievedPct: number | null;
}

interface DashboardState {
  // funnel
  funnelLoading: boolean;
  funnelError: string | null;
  funnelStages: FunnelStage[];
  // snapshot
  snapshotLoading: boolean;
  snapshotError: string | null;
  snapshot: SnapshotData | null;
  // rejection reasons
  rejectionLoading: boolean;
  rejectionError: string | null;
  rejectionReasonCount: RejectionReasonCount[];
  // trends
  trendsLoading: boolean;
  trendsError: string | null;
  trends: Trends | null;
  // matrix
  matrixLoading: boolean;
  matrixError: string | null;
  matrix: MatrixData | null;
}

const initialState: DashboardState = {
  funnelLoading: false,
  funnelError: null,
  funnelStages: [],

  snapshotLoading: false,
  snapshotError: null,
  snapshot: null,

  rejectionLoading: false,
  rejectionError: null,
  rejectionReasonCount: [],

  trendsLoading: false,
  trendsError: null,
  trends: null,

  matrixLoading: false,
  matrixError: null,
  matrix: null,
};

// --- Thunks ---

export const fetchFunnelData = createAsyncThunk<
  FunnelStage[],
  { period?: string; loanType?: string; associateId?: string } | undefined,
  { rejectValue: string }
>(
  "dashboard/fetchFunnel",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/funnel", { params });
      return res.data.stages as FunnelStage[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch funnel data");
    }
  }
);

export const fetchSnapshotData = createAsyncThunk<
  SnapshotData,
  { period?: string; loanType?: string; associateId?: string } | undefined,
  { rejectValue: string }
>(
  "dashboard/fetchSnapshot",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/snapshot", { params });
      return res.data.snapshot as SnapshotData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch snapshot data");
    }
  }
);

export const fetchRejectionReasonCount = createAsyncThunk<
  RejectionReasonCount[],
  { period?: string; loanType?: string; associateId?: string } | undefined,
  { rejectValue: string }
>(
  "dashboard/fetchRejectionReasonCount",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/rejection-reason-count", { params });
      return res.data.rejectionReasonCount as RejectionReasonCount[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch rejection reasons");
    }
  }
);

export const fetchTrends = createAsyncThunk<
  Trends,
  { loanType?: string; associateId?: string; trendMonths?: number } | undefined,
  { rejectValue: string }
>(
  "dashboard/fetchTrends",
  async (params = { trendMonths: 3 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/trends", { params });
      return res.data.trends as Trends;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch trends");
    }
  }
);

export const fetchMatrix = createAsyncThunk<
  MatrixData,
  { period?: string; loanType?: string; associateId?: string } | undefined,
  { rejectValue: string }
>(
  "dashboard/fetchMatrix",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/matrix", { params });
      return res.data.matrix as MatrixData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch matrix");
    }
  }
);

// --- Slice ---

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardState(state) {
      state.funnelError = null;
      state.snapshotError = null;
      state.rejectionError = null;
      state.trendsError = null;
      state.matrixError = null;
      state.funnelStages = [];
      state.snapshot = null;
      state.rejectionReasonCount = [];
      state.trends = null;
      state.matrix = null;
    },
  },
  extraReducers: (builder) => {
    // funnel
    builder
      .addCase(fetchFunnelData.pending, (s) => {
        s.funnelLoading = true;
        s.funnelError = null;
      })
      .addCase(fetchFunnelData.fulfilled, (s, a) => {
        s.funnelLoading = false;
        s.funnelStages = a.payload;
      })
      .addCase(fetchFunnelData.rejected, (s, a) => {
        s.funnelLoading = false;
        s.funnelError = a.payload as string;
      });

    // snapshot
    builder
      .addCase(fetchSnapshotData.pending, (s) => {
        s.snapshotLoading = true;
        s.snapshotError = null;
      })
      .addCase(fetchSnapshotData.fulfilled, (s, a) => {
        s.snapshotLoading = false;
        s.snapshot = a.payload;
      })
      .addCase(fetchSnapshotData.rejected, (s, a) => {
        s.snapshotLoading = false;
        s.snapshotError = a.payload as string;
      });

    // rejection reasons
    builder
      .addCase(fetchRejectionReasonCount.pending, (s) => {
        s.rejectionLoading = true;
        s.rejectionError = null;
      })
      .addCase(fetchRejectionReasonCount.fulfilled, (s, a) => {
        s.rejectionLoading = false;
        s.rejectionReasonCount = a.payload;
      })
      .addCase(fetchRejectionReasonCount.rejected, (s, a) => {
        s.rejectionLoading = false;
        s.rejectionError = a.payload as string;
      });

    // trends
    builder
      .addCase(fetchTrends.pending, (s) => {
        s.trendsLoading = true;
        s.trendsError = null;
      })
      .addCase(fetchTrends.fulfilled, (s, a) => {
        s.trendsLoading = false;
        s.trends = a.payload;
      })
      .addCase(fetchTrends.rejected, (s, a) => {
        s.trendsLoading = false;
        s.trendsError = a.payload as string;
      });

    // matrix
    builder
      .addCase(fetchMatrix.pending, (s) => {
        s.matrixLoading = true;
        s.matrixError = null;
      })
      .addCase(fetchMatrix.fulfilled, (s, a) => {
        s.matrixLoading = false;
        s.matrix = a.payload;
      })
      .addCase(fetchMatrix.rejected, (s, a) => {
        s.matrixLoading = false;
        s.matrixError = a.payload as string;
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
