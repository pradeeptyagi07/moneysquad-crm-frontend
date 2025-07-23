"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, logoutUser, clearAuthError } from "../store/slices/authSlice"
import type { RootState } from "../store"

interface AuthContextType {
  isAuthenticated: boolean
  user: UserData | null
  userId: string | null
  userRole: string | null
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
  const { isAuthenticated, user, userRole, loading, error } = useSelector((state: RootState) => state.auth)

  const userId = user?.id || null
  const userName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const resultAction = await dispatch(loginUser({ email, password }))

      // Use the proper type checking for fulfilled/rejected
      if (loginUser.fulfilled.match(resultAction)) {
        return true
      } else if (loginUser.rejected.match(resultAction)) {
        console.error("Login failed:", resultAction.payload)
        return false
      }

      return false
    } catch (err) {
      console.error("Login error in useAuth:", err)
      return false
    }
  }

  const logout = () => {
    dispatch(logoutUser())
  }

  const clearError = () => {
    dispatch(clearAuthError())
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    userId,
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
