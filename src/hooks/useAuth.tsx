"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, logoutUser, clearAuthError } from "../store/slices/authSlice"
import type { RootState } from "../store"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string
  userName: string
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, userRole, userName, loading, error } = useSelector((state: RootState) => state.auth)

  // Login function that dispatches the Redux action
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const resultAction = await dispatch(loginUser({ email, password }))
      return !resultAction.meta.requestStatus.includes("rejected")
    } catch (err) {
      console.error("Login error in useAuth:", err)
      return false
    }
  }

  // Logout function that dispatches the Redux action
  const logout = () => {
    dispatch(logoutUser())
  }

  // Clear error function
  const clearError = () => {
    dispatch(clearAuthError())
  }

  // Provide the auth context
  const value = {
    isAuthenticated,
    userRole,
    userName,
    loading,
    error,
    login,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
