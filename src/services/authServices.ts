import axiosInstance from "./api"

// Types
export interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    mobile: string
    role: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

// Auth service
const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", credentials)
    return response.data
  },

  // Logout user
  logout: async (): Promise<void> => {
    // Clear local storage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
}

export default authService
