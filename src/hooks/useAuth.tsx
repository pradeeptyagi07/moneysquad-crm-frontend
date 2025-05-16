"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string
  userName: string
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users with different roles
const dummyUsers = [
  { email: "admin@example.com", password: "password123", role: "admin" },
  { email: "partner@example.com", password: "password123", role: "partner" },
  { email: "manager@example.com", password: "password123", role: "manager" },
]

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Check if user is already logged in
    const storedRole = localStorage.getItem("userRole")
    const storedName = localStorage.getItem("userName")

    if (storedRole && storedName) {
      setIsAuthenticated(true)
      setUserRole(storedRole)
      setUserName(storedName)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if credentials match any dummy user
    const user = dummyUsers.find((user) => user.email === email && user.password === password)

    if (user) {
      localStorage.setItem("userRole", user.role)
      localStorage.setItem("userName", user.email)
      setIsAuthenticated(true)
      setUserRole(user.role)
      setUserName(user.email)
      return true
    }

    return false
  }

  const logout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    setIsAuthenticated(false)
    setUserRole("")
    setUserName("")
  }

  const value = {
    isAuthenticated,
    userRole,
    userName,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
