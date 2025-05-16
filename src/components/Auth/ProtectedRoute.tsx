"use client"

import type React from "react"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

interface ProtectedRouteProps {
  allowedRoles: string[]
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { userRole, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />
    } else if (userRole === "manager") {
      return <Navigate to="/manager" replace />
    } else if (userRole === "partner") {
      return <Navigate to="/partner" replace />
    } else {
      // Fallback to login if role is unknown
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
