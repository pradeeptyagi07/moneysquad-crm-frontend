import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../services/api";

// API response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Interfaces --------------------------------------------------------------

export interface CreateOfferRequest {
  bankName: string;
  bankImage: File | string; // Changed to accept both File object or string URL
  offerHeadline: string;
  offerValidity: string;
  loanType: string;
  interestRate: number;
  processingFee: number;
  processingFeeType: "rupee" | "percentage"; // ✅ Add this line

  isFeatured: boolean;
  keyFeatures: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    employmentType: string;
    maxCreditScore: number;
  };
}

export interface BankOffer {
  _id: string;
  bankName: string;
  bankImage: string;
  offerHeadline: string;
  offerValidity: string;
  loanType: string;
  interestRate: number;
  processingFee: number;
  processingFeeType: "rupee" | "percentage"; // ✅ Add this line

  isFeatured: boolean;
  keyFeatures: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    employmentType: string;
    maxCreditScore: number;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NewOfferFormData {
  bankName: string;
  bankImage: File | string;
  loanType: string;
  offerHeadline?: string;
  offerValidity?: string;
  interestRate: number;
  processingFee: number;
  keyFeatures: string[];
  isFeatured: boolean;
  eligibility?: {
    minAge?: number;
    maxAge?: number;
    minIncome?: number;
    employmentType?: string;
    maxCreditScore?: number;
  };
}

// Add loan type color mapping
// src/constants/loanTypeColors.ts

export const loanTypeColors: Record<
  string,
  { gradient: string; textColor: string }
> = {
  "PL-Term Loan": {
    gradient: "#33C2FF",
    textColor: "#ffffff",
  },
  "PL-Overdraft": {
    gradient: "#5569FF",
    textColor: "#ffffff",
  },
  "BL-Term Loan": {
    gradient: "#57CA22",
    textColor: "#ffffff",
  },
  "BL-Overdraft": {
    gradient: "#FFA319",
    textColor: "#ffffff",
  },
  "SEPL-Term Loan": {
    gradient: "#0E1AFF",
    textColor: "#ffffff",
  },
  "SEPL-Overdraft": {
    gradient: "#FF1943",
    textColor: "#ffffff",
  },
  // optional fallback
  Other: {
    gradient: "#E052A3",
    textColor: "#ffffff",
  },
};

// Define the state interface
interface OffersState {
  offers: BankOffer[];
  selectedOffer: BankOffer | null;
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
  success: string | null;
}

// Initial state
const initialState: OffersState = {
  offers: [],
  selectedOffer: null,
  loading: false,
  detailsLoading: false,
  error: null,
  success: null,
};

// Async thunks for API calls
export const fetchAllOffers = createAsyncThunk(
  "offers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<BankOffer[]>>(
        `/offers/get-all`
      );
      console.log("API Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch offers"
      );
    }
  }
);

export const fetchOfferById = createAsyncThunk(
  "offers/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<BankOffer>>(
        `/offers/${id}`
      );
      console.log("Offer Details Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch offer details"
      );
    }
  }
);

export const createOffer = createAsyncThunk(
  "offers/create",
  async (offerData: CreateOfferRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("bankName", offerData.bankName);
      if (offerData.bankImage instanceof File) {
        formData.append("bankImage", offerData.bankImage);
      } else if (
        typeof offerData.bankImage === "string" &&
        !offerData.bankImage.startsWith("blob:")
      ) {
        formData.append("bankImage", offerData.bankImage);
      }
      formData.append("offerHeadline", offerData.offerHeadline);
      formData.append("offerValidity", offerData.offerValidity);
      formData.append("loanType", offerData.loanType);
      formData.append("interestRate", offerData.interestRate.toString());
      formData.append("processingFee", offerData.processingFee.toString());
      formData.append("processingFeeType", offerData.processingFeeType); // ✅

      formData.append("isFeatured", offerData.isFeatured.toString());
      offerData.keyFeatures.forEach((feature, index) => {
        formData.append(`keyFeatures[${index}]`, feature);
      });
      if (offerData.eligibility) {
        if (offerData.eligibility.minAge !== undefined)
          formData.append(
            "eligibility[minAge]",
            offerData.eligibility.minAge.toString()
          );
        if (offerData.eligibility.maxAge !== undefined)
          formData.append(
            "eligibility[maxAge]",
            offerData.eligibility.maxAge.toString()
          );
        if (offerData.eligibility.minIncome !== undefined)
          formData.append(
            "eligibility[minIncome]",
            offerData.eligibility.minIncome.toString()
          );
        if (offerData.eligibility.employmentType)
          formData.append(
            "eligibility[employmentType]",
            offerData.eligibility.employmentType
          );
        if (offerData.eligibility.maxCreditScore !== undefined)
          formData.append(
            "eligibility[maxCreditScore]",
            offerData.eligibility.maxCreditScore.toString()
          );
      }
      console.log(
        "Creating offer with data:",
        Object.fromEntries(formData.entries())
      );
      const response = await axiosInstance.post<ApiResponse<BankOffer>>(
        `/offers/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Create offer error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create offer"
      );
    }
  }
);

export const updateOffer = createAsyncThunk(
  "offers/update",
  async (
    { id, offerData }: { id: string; offerData: Partial<CreateOfferRequest> },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (offerData.bankName) formData.append("bankName", offerData.bankName);
      if (offerData.bankImage) {
        if (offerData.bankImage instanceof File) {
          formData.append("bankImage", offerData.bankImage);
        } else if (
          typeof offerData.bankImage === "string" &&
          !offerData.bankImage.startsWith("blob:")
        ) {
          formData.append("bankImage", offerData.bankImage);
        }
      }
      if (offerData.offerHeadline)
        formData.append("offerHeadline", offerData.offerHeadline);
      if (offerData.offerValidity)
        formData.append("offerValidity", offerData.offerValidity);
      if (offerData.loanType) formData.append("loanType", offerData.loanType);
      if (offerData.interestRate !== undefined)
        formData.append("interestRate", offerData.interestRate.toString());
      if (offerData.processingFee !== undefined)
        formData.append("processingFee", offerData.processingFee.toString());
      if (offerData.processingFeeType)
        formData.append("processingFeeType", offerData.processingFeeType); // ✅

      if (offerData.isFeatured !== undefined)
        formData.append("isFeatured", offerData.isFeatured.toString());
      if (offerData.keyFeatures) {
        offerData.keyFeatures.forEach((feature, index) => {
          formData.append(`keyFeatures[${index}]`, feature);
        });
      }
      if (offerData.eligibility) {
        if (offerData.eligibility.minAge !== undefined)
          formData.append(
            "eligibility[minAge]",
            offerData.eligibility.minAge.toString()
          );
        if (offerData.eligibility.maxAge !== undefined)
          formData.append(
            "eligibility[maxAge]",
            offerData.eligibility.maxAge.toString()
          );
        if (offerData.eligibility.minIncome !== undefined)
          formData.append(
            "eligibility[minIncome]",
            offerData.eligibility.minIncome.toString()
          );
        if (offerData.eligibility.employmentType)
          formData.append(
            "eligibility[employmentType]",
            offerData.eligibility.employmentType
          );
        if (offerData.eligibility.maxCreditScore !== undefined)
          formData.append(
            "eligibility[maxCreditScore]",
            offerData.eligibility.maxCreditScore.toString()
          );
      }
      console.log(
        "Updating offer with data:",
        Object.fromEntries(formData.entries())
      );
      const response = await axiosInstance.put<ApiResponse<BankOffer>>(
        `/offers/${id}/edit`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Update offer error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update offer"
      );
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "offers/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete<ApiResponse<string>>(`/offers/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete offer"
      );
    }
  }
);

// Create the offers slice
const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearOffersState: (state) => {
      state.error = null;
      state.success = null;
    },
    setSelectedOffer: (state, action: PayloadAction<BankOffer | null>) => {
      state.selectedOffer = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchAllOffers
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchOfferById
    builder
      .addCase(fetchOfferById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedOffer = action.payload;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      });

    // createOffer
    builder
      .addCase(createOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.unshift(action.payload);
        state.success = "Offer created successfully!";
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateOffer
    builder
      .addCase(updateOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = state.offers.map((offer) =>
          offer._id === action.payload._id ? action.payload : offer
        );
        state.selectedOffer = action.payload;
        state.success = "Offer updated successfully!";
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // deleteOffer
    builder
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = state.offers.filter(
          (offer) => offer._id !== action.payload
        );
        state.success = "Offer deleted successfully!";
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOffersState, setSelectedOffer } = offersSlice.actions;
export default offersSlice.reducer;
