// src/store/slices/teamSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axiosInstance from "../../services/api"

// Interfaces
export interface Manager {
  _id: string
  managerId: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  location: string
  role?: string
  status: string
  createdAt: string
  updatedAt?: string
  __v: number
}

export interface ManagerFormData {
  firstName: string
  lastName: string
  email: string
  mobile: string
  location: string
}

interface TeamState {
  managers: Manager[]
  selectedManager: Manager | null
  loading: boolean
  error: string | null
  success: string | null
}

const initialState: TeamState = {
  managers: [],
  selectedManager: null,
  loading: false,
  error: null,
  success: null,
}

// Create Manager
export const createManager = createAsyncThunk(
  "team/createManager",
  async (data: ManagerFormData, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
      const response = await axiosInstance.post("/manager", formData)
      return response.data.response as Manager
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create manager")
    }
  }
)

// Fetch All Managers
export const fetchManagers = createAsyncThunk(
  "team/fetchManagers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/manager")
      return response.data.response as Manager[]
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch managers")
    }
  }
)

// Fetch Manager by ID
export const fetchManagerById = createAsyncThunk(
  "team/fetchManagerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/manager/${id}`)
      return response.data.response as Manager
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch manager details")
    }
  }
)

// Update Manager
export const updateManager = createAsyncThunk(
  "team/updateManager",
  async ({ id, data }: { id: string; data: Partial<ManagerFormData> }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      const response = await axiosInstance.put(`/manager/${id}`, formData)
      return response.data.response as Manager
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update manager")
    }
  }
)

// Delete Manager
export const deleteManager = createAsyncThunk(
  "team/deleteManager",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/manager/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete manager")
    }
  }
)

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearTeamState: (state) => {
      state.error = null
      state.success = null
      state.selectedManager = null
    },
    setSelectedManager: (state, action: PayloadAction<Manager | null>) => {
      state.selectedManager = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false
        state.managers = action.payload
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(createManager.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(createManager.fulfilled, (state, action) => {
        state.loading = false
        state.success = "Manager created successfully!"
        state.managers.unshift(action.payload)
      })
      .addCase(createManager.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchManagerById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchManagerById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedManager = action.payload
      })
      .addCase(fetchManagerById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(updateManager.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateManager.fulfilled, (state, action) => {
        state.loading = false
        state.success = "Manager updated successfully!"
        state.managers = state.managers.map((m) =>
          m._id === action.payload._id ? action.payload : m
        )
        state.selectedManager = action.payload
      })
      .addCase(updateManager.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteManager.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.loading = false
        state.success = "Manager deleted successfully!"
        state.managers = state.managers.filter((m) => m._id !== action.payload)
      })
      .addCase(deleteManager.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearTeamState, setSelectedManager } = teamSlice.actions
export default teamSlice.reducer
