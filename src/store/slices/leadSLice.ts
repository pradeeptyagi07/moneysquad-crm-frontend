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
  closeReason: string | null;
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

// --- 3. New helper types to match response ---
export interface Pincode {
  pincode: string;
  state: string;
  city: string;
  _id: string;
}

export interface Loan {
  type: string;
  amount: number;
  _id: string;
}

export interface Partner {
  _id: string;
  partnerId: string;
  basicInfo: { fullName: string };
}

// --- 4. Updated Lead type matching new API ---
export interface Manager {
  _id: string;
  firstName: string;
  lastName: string;
  managerId: string;
}

export interface Associate {
  _id: string;
  firstName: string;
  lastName: string;
  associateDisplayId: string;
}

// --- 4. Updated Lead type matching new API ---
export interface Lead {
  id: string;                          
  leadId: string;                      
  applicantName: string;
  applicantProfile: string;
  email: string;
  mobile: string;
  pincode: Pincode;
  comments: string;
  loan: Loan;
  lenderType: string | null;
  partnerId: Partner;
  manager: Manager | null;             // ← updated
  associate: Associate | null;         // ← already object
  status: string;
  createdAt: string;
  disbursedData: DisbursementData | null;
  statusUpdatedAt: string;
  businessName: string;
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
  DUPLICATE = "/lead/duplicate",
  CREATE = "/lead/create",
  UPDATE = "/lead/update",
  ASSIGN = "/lead/assign-manager",
  UPDATE_STATUS = "/lead/update-status",
  DELETE = "/lead/delete",
  FETCH_ALL = "/lead",
  FETCH_ONE = "/lead",
  DISBURSE = "/lead/disbursed",
  TIMELINE = "/lead/timeline",
  DISBURSE_UPDATE = "/lead/disbursed",

}



// Create Lead
export const createLead = createAsyncThunk<
  Lead,
  {
    applicantName: string
    applicantProfile: string
    mobile: string
    email: string
    pincode: string
    loantType: string
    loanAmount: string
    comments?: string
    businessName?: string
    city: string
    state: string
    partnerId?: string
    assignto?: string
  },
  { rejectValue: string }
>(
  "leads/create",
  async (formValues, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("applicantName", formValues.applicantName);
      formData.append("applicantProfile", formValues.applicantProfile);
      formData.append("mobile", formValues.mobile);
      formData.append("email", formValues.email);
      formData.append("pincode", formValues.pincode);
      formData.append("loantType", formValues.loantType);
      formData.append("loanAmount", formValues.loanAmount);
      if (formValues.comments) {
        formData.append("comments", formValues.comments);
      }
      if (formValues.businessName) {
        formData.append("businessName", formValues.businessName);
      }
      formData.append("city", formValues.city);
      formData.append("state", formValues.state);
      if (formValues.partnerId) {
        formData.append("partnerId", formValues.partnerId);
      }
      if (formValues.assignto) {
        formData.append("assignto", formValues.assignto);
      }

      const { data } = await axiosInstance.post(Endpoints.CREATE, formData);
      return data.data as Lead;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);


// Duplicate Lead
export const duplicateLead = createAsyncThunk<
  Lead,
  {
    applicantName: string;
    applicantProfile: string;
    mobile: string;
    email: string;
    pincode: string;
    loantType: string;
    loanAmount: string;
    comments: string;
    businessName: string;
    city: string;
    state: string;
    partnerId: string;
    assignto: string;
    lenderType: string;
  },
  { rejectValue: string }
>(
  "leads/duplicate",
  async (formValues, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("applicantName", formValues.applicantName);
      formData.append("applicantProfile", formValues.applicantProfile);
      formData.append("mobile", formValues.mobile);
      formData.append("email", formValues.email);
      formData.append("pincode", formValues.pincode);
      formData.append("loantType", formValues.loantType);
      formData.append("loanAmount", formValues.loanAmount);
      formData.append("comments", formValues.comments);
      formData.append("businessName", formValues.businessName);
      formData.append("city", formValues.city);
      formData.append("state", formValues.state);
      formData.append("partnerId", formValues.partnerId);
      formData.append("assignto", formValues.assignto);
      formData.append("lenderType", formValues.lenderType);

      const { data } = await axiosInstance.post(Endpoints.DUPLICATE, formData);
      return data.data as Lead;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Duplicate failed");
    }
  }
);

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

// New “Edit Disbursement” (PUT)
export const editDisbursement = createAsyncThunk<
  Lead,
  { leadId: string; disbData: DisbursementData },
  { rejectValue: string }
>("leads/editDisbursement", async ({ leadId, disbData }, { rejectWithValue }) => {
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

    const response = await axiosInstance.put(
      `${Endpoints.DISBURSE_UPDATE}/${leadId}`,
      formData
    );
    if (!response.data.success || !response.data.form) {
      return rejectWithValue("Edit disbursement failed on server");
    }
    const updatedLead = response.data.form as Lead;
    return { ...updatedLead, id: updatedLead._id };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Edit disbursement failed");
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
// src/store/slices/leadSlice.ts

// Update Lead
export const updateLead = createAsyncThunk<
  Lead,
  {
    leadId: string;
    applicantName: string;
    applicantProfile: string;
    mobile: string;
    email: string;
    pincode: string;
    loantType: string;
    loanAmount: string;
    comments: string;
    businessName: string;
    city: string;
    state: string;
    partnerId: string;
    assignto: string;
    lenderType: string;
  },
  { rejectValue: string }
>(
  "leads/update",
  async (formValues, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Applicant fields
      formData.append("applicantName", formValues.applicantName);
      formData.append("applicantProfile", formValues.applicantProfile);
      formData.append("mobile", formValues.mobile);
      formData.append("email", formValues.email);
      formData.append("pincode", formValues.pincode);
      // Business (optional but here mandatory)
      formData.append("businessName", formValues.businessName);
      // Loan fields
      formData.append("loantType", formValues.loantType);
      formData.append("loanAmount", formValues.loanAmount);
      formData.append("comments", formValues.comments);
      // Location fields
      formData.append("city", formValues.city);
      formData.append("state", formValues.state);
      // Assignment fields
      formData.append("partnerId", formValues.partnerId);
      formData.append("assignto", formValues.assignto);
      // Lender type
      formData.append("lenderType", formValues.lenderType);

      const response = await axiosInstance.put(
        `${Endpoints.UPDATE}/${formValues.leadId}`,
        formData
      );
      const updatedLead = response.data.lead as Lead;
      return { ...updatedLead, id: updatedLead._id };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update lead"
      );
    }
  }
);

// Update Lead Status
// ↓ UPDATED updateLeadStatus thunk:
export const updateLeadStatus = createAsyncThunk<
  { leadId: string; status: string },
  {
    leadId: string;
    statusData: {
      action: string;
      comment: string;
      rejectReason?: string;
      rejectImage?: File;
      approvedAmount?: string;  // ← new
      closeReason?: string;     // ← new
    };
  },
  { rejectValue: string }
>(
  "leads/updateStatus",
  async ({ leadId, statusData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("action", statusData.action);
      formData.append("comment", statusData.comment);
      if (statusData.rejectReason)
        formData.append("rejectReason", statusData.rejectReason);
      if (statusData.rejectImage)
        formData.append("rejectImage", statusData.rejectImage);
      if (statusData.approvedAmount)
        formData.append("approvedAmount", statusData.approvedAmount);
      if (statusData.closeReason)
        formData.append("closeReason", statusData.closeReason);

      await axiosInstance.put(
        `${Endpoints.UPDATE_STATUS}/${leadId}`,
        formData
      );
      return { leadId, status: statusData.action };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

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
      .addCase(duplicateLead.fulfilled, (state, { payload }) => {
        state.leads.unshift(payload);
        state.success = "Lead duplicated!";
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
