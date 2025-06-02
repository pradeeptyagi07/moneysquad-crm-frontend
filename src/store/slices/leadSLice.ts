// src/store/slices/leadSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";

export interface DisbursementData {
  loanAmount: number;
  tenureMonths: number;
  interestRatePA: number;
  processingFee: number;
  insuranceCharges: number;
  loanScheme: string;
  lanNumber: string;
  actualDisbursedDate: string;
}

export interface LeadTimelineEvent {
  _id: string;
  leadId: string;
  applicantName: string;
  status: string;
  message: string;
  rejectImage: string | null;
  rejectReason: string | null;
  rejectComment: string | null;
  createdAt: string;
  __v: number;
}

export interface LeadTimeline {
  created?: LeadTimelineEvent;
  assigned?: LeadTimelineEvent;
  login?: LeadTimelineEvent;
  rejected?: LeadTimelineEvent;
  [key: string]: LeadTimelineEvent | undefined;
}

export interface Lead {
  _id?: string;
  id?: string;
  leadId?: string;
  partnerId?: {
    _id: string;
    basicInfo: { fullName: string };
  };
  manager?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  applicant: {
    name: string;
    businessName: string;
    profile: string;
    mobile: string;
    email: string;
    pincode: string;
    _id?: string;
  };
  loan: {
    type: string;
    amount: number | string;
    comments: string;
    _id?: string;
  };
  lenderType?: string;
}

interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  currentTimeline: LeadTimeline | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: LeadState = {
  leads: [],
  currentLead: null,
  currentTimeline: null,
  loading: false,
  error: null,
  success: null,
};

enum Endpoints {
  CREATE = "/lead/create",
  UPDATE = "/lead/update",
  ASSIGN = "/lead/assign-manager",
  UPDATE_STATUS = "/lead/update-status",
  DELETE = "/lead/delete",
  FETCH_ALL = "/lead",
  FETCH_ONE = "/lead",
  DISBURSE = "/lead/disbursed",
  TIMELINE = "/lead/timeline",
}

// Create Lead
export const createLead = createAsyncThunk<
  Lead,
  { partnerId: string; leadData: any },
  { rejectValue: string }
>("leads/create", async ({ partnerId, leadData }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("applicant.name", leadData.applicant.name);
    formData.append("applicant.profile", leadData.applicant.profile);
    formData.append("applicant.businessName", leadData.applicant.businessName);

    formData.append("applicant.mobile", leadData.applicant.mobile);
    formData.append("applicant.email", leadData.applicant.email);
    formData.append("applicant.pincode", leadData.applicant.pincode);
    formData.append("loan.type", leadData.loan.type);
    formData.append("loan.amount", String(leadData.loan.amount));
    formData.append("loan.comments", leadData.loan.comments);
    const { data } = await axiosInstance.post(
      `${Endpoints.CREATE}/${partnerId}`,
      formData
    );
    return data.data as Lead;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Create failed");
  }
});

// Disburse Lead
// store/slices/leadSlice.ts
export const disburseLead = createAsyncThunk<
  Lead,
  { leadId: string; disbData: DisbursementData },
  { rejectValue: string }
>("leads/disburse", async ({ leadId, disbData }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("loanAmount", String(disbData.loanAmount));
    formData.append("tenureMonths", String(disbData.tenureMonths));
    formData.append("interestRatePA", String(disbData.interestRatePA));
    formData.append("processingFee", String(disbData.processingFee));
    formData.append("insuranceCharges", String(disbData.insuranceCharges));
    formData.append("loanScheme", disbData.loanScheme);
    formData.append("lanNumber", disbData.lanNumber);
    formData.append("actualDisbursedDate", disbData.actualDisbursedDate);

    const response = await axiosInstance.post(
      `${Endpoints.DISBURSE}/${leadId}`,
      formData
    );

    // <-- change this line to use `form` instead of `data`
    if (!response.data.success || !response.data.form) {
      return rejectWithValue("Disbursement failed on server");
    }

    const updatedLead = response.data.form as Lead;

    // ensure we carry over the _id
    return { ...updatedLead, id: updatedLead._id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Disbursement failed"
    );
  }
});


// Assign Lead
export const assignLead = createAsyncThunk<
  Lead,
  { leadId: string; managerAssigned: string },
  { rejectValue: string }
>("leads/assign", async ({ leadId, managerAssigned }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("manager_assigned", managerAssigned);
    const response = await axiosInstance.put(
      `${Endpoints.ASSIGN}/${leadId}`,
      formData
    );
    const updated = response.data.lead as Lead;
    return { ...updated, id: updated._id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to assign lead"
    );
  }
});

// Update Lead
export const updateLead = createAsyncThunk<
  Lead,
  { leadId: string; leadData: any },
  { rejectValue: string }
>("leads/update", async ({ leadId, leadData }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("applicant.name", leadData.applicant.name);
    formData.append("applicant.profile", leadData.applicant.profile);
    formData.append("applicant.mobile", leadData.applicant.mobile);
    formData.append("applicant.email", leadData.applicant.email);
    formData.append("applicant.pincode", leadData.applicant.pincode);
    formData.append("loan.type", leadData.loan.type);
    formData.append("loan.amount", leadData.loan.amount);
    formData.append("loan.comments", leadData.loan.comments);
    if (leadData.lenderType) formData.append("lenderType", leadData.lenderType);
    const response = await axiosInstance.put(
      `${Endpoints.UPDATE}/${leadId}`,
      formData
    );
    const updatedLead = response.data.lead as Lead;
    return { ...updatedLead, id: updatedLead._id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update lead"
    );
  }
});

// Update Lead Status
export const updateLeadStatus = createAsyncThunk<
  { leadId: string; status: string },
  {
    leadId: string;
    statusData: {
      action: string;
      comment: string;
      rejectReason?: string;
      rejectImage?: File;
    };
  },
  { rejectValue: string }
>("leads/updateStatus", async ({ leadId, statusData }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("action", statusData.action);
    formData.append("comment", statusData.comment);
    if (statusData.rejectReason)
      formData.append("rejectReason", statusData.rejectReason);
    if (statusData.rejectImage)
      formData.append("rejectImage", statusData.rejectImage);
    await axiosInstance.put(`${Endpoints.UPDATE_STATUS}/${leadId}`, formData);
    return { leadId, status: statusData.action };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update status"
    );
  }
});

// Delete Lead
export const deleteLead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("leads/delete", async (leadId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`${Endpoints.DELETE}/${leadId}`);
    return leadId;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete lead"
    );
  }
});

// Fetch All Leads
export const fetchAllLeads = createAsyncThunk<
  Lead[],
  void,
  { rejectValue: string }
>("leads/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(Endpoints.FETCH_ALL);
    return data.data as Lead[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Fetch all failed");
  }
});

// Fetch One Lead
export const fetchLeadById = createAsyncThunk<
  Lead,
  string,
  { rejectValue: string }
>("leads/fetchById", async (leadId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(
      `${Endpoints.FETCH_ONE}/${leadId}`
    );
    return data.data as Lead;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Fetch one failed");
  }
});

// Fetch Lead Timeline
export const fetchLeadTimeline = createAsyncThunk<
  LeadTimeline,
  string,
  { rejectValue: string }
>("leads/fetchTimeline", async (leadId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`${Endpoints.TIMELINE}/${leadId}`);
    return data.data as LeadTimeline;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetch timeline failed"
    );
  }
});

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearLeadState: (state) => {
      state.error = null;
      state.success = null;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    clearTimeline: (state) => {
      state.currentTimeline = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLead.fulfilled, (state, { payload }) => {
        state.leads.unshift(payload);
        state.success = "Lead created!";
        state.loading = false;
      })
      .addCase(disburseLead.fulfilled, (state, { payload }) => {
        const idx = state.leads.findIndex((l) => l.id === payload.id);
        if (idx >= 0) state.leads[idx] = payload;
        state.success = "Disbursed successfully!";
        state.loading = false;
      })
      .addCase(assignLead.fulfilled, (state, { payload }) => {
        const idx = state.leads.findIndex((l) => l.id === payload.id);
        if (idx >= 0) state.leads[idx] = payload;
        state.success = "Manager assigned!";
        state.loading = false;
      })
      .addCase(updateLead.fulfilled, (state, { payload }) => {
        const idx = state.leads.findIndex((l) => l.id === payload.id);
        if (idx >= 0) state.leads[idx] = payload;
        state.success = "Lead updated!";
        state.loading = false;
      })
      .addCase(updateLeadStatus.fulfilled, (state, { payload }) => {
        const idx = state.leads.findIndex((l) => l.id === payload.leadId);
        if (idx >= 0) state.leads[idx].status = payload.status;
        state.success = "Status updated!";
        state.loading = false;
      })
      .addCase(deleteLead.fulfilled, (state, { payload }) => {
        state.leads = state.leads.filter((l) => l.id !== payload);
        state.success = "Lead deleted!";
        state.loading = false;
      })
      .addCase(fetchAllLeads.fulfilled, (state, { payload }) => {
        state.leads = payload;
        state.success = "Leads loaded";
        state.loading = false;
      })
      .addCase(fetchLeadById.fulfilled, (state, { payload }) => {
        state.currentLead = payload;
        state.loading = false;
      })
      .addCase(fetchLeadTimeline.fulfilled, (state, { payload }) => {
        state.currentTimeline = payload;
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { clearLeadState, clearCurrentLead, clearTimeline } =
  leadSlice.actions;
export default leadSlice.reducer;
