import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";

// Types
interface Partner {
  _id: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  partnerId: string;
  basicInfo: Record<string, any>;
  personalInfo: Record<string, any>;
  addressDetails: Record<string, any>;
  bankDetails: Record<string, any>;
  documents: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  pendingChangeRequestCount:number;
  lastSeen:string;
  __v: number;
}

interface ManagePartnerState {
  loading: boolean;
  error: string | null;
  partners: Partner[];
  selectedPartner: Partner | null;
}

const initialState: ManagePartnerState = {
  loading: false,
  error: null,
  partners: [],
  selectedPartner: null,
};

// 1. Get All Partners
export const fetchAllPartners = createAsyncThunk(
  "managePartner/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/partner");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch partners");
    }
  }
);

// 2. Get Partner by ID
export const fetchPartnerById = createAsyncThunk(
  "managePartner/fetchById",
  async (partnerId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/partner/${partnerId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch partner by ID");
    }
  }
);

// 3. Update Partner by ID (with FormData)
export const updatePartnerById = createAsyncThunk(
  "managePartner/updateById",
  async (
    {
      partnerId,
      data,
    }: {
      partnerId: string;
      data: {
        fullName: string;
        mobile: string;
        email: string;
        currentProfession: string;
        roleSelection: string;
        focusProduct: string;
        commission: string; // ✅
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("basicInfo.mobile", data.mobile);
      formData.append("basicInfo.fullName", data.fullName);
      formData.append("basicInfo.email", data.email);

      formData.append("personalInfo.currentProfession", data.currentProfession);
      formData.append("personalInfo.roleSelection", data.roleSelection);
      formData.append("personalInfo.focusProduct", data.focusProduct);
      formData.append("commission", data.commission); // ✅ instead of commissionPlan

      const response = await axiosInstance.put(`/partner/${partnerId}`, formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update partner");
    }
  }
);


const managePartnerSlice = createSlice({
  name: "managePartner",
  initialState,
  reducers: {
    clearManagePartnerState: (state) => {
      state.error = null;
      state.selectedPartner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Partners
      .addCase(fetchAllPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchAllPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Partner by ID
      .addCase(fetchPartnerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPartner = action.payload;
      })
      .addCase(fetchPartnerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Partner by ID
      .addCase(updatePartnerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePartnerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPartner = action.payload;
      })
      .addCase(updatePartnerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearManagePartnerState } = managePartnerSlice.actions;
export default managePartnerSlice.reducer;
