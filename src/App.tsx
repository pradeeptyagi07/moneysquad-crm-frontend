"use client"

import { Suspense } from "react"
import { Navigate, useRoutes } from "react-router-dom"
import { Box, CircularProgress } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { AuthProvider, useAuth } from "./hooks/useAuth"

// Import route configurations
import adminRoutes from "./routes/adminRoutes"
import managerRoutes from "./routes/managerRoutes"
import partnerRoutes from "./routes/partnerRoutes"

// Auth pages
import Login from "./pages/Auth/Login"
import BecomePartner from "./pages/Auth/BecomePartner"
import ForgotPassword from "./pages/Auth/ForgotPassword"
import associateRoutes from "./routes/associateRoutes"

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
    }}
  >
    <CircularProgress />
  </Box>
)

// Router component that uses authentication context
const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth()

  // Redirect authenticated users to their role-specific dashboard
  const getRedirect = () => {
    if (!isAuthenticated) return "/"

    switch (userRole) {
      case "admin":
        return "/admin"
      case "manager":
        return "/manager"
      case "partner":
        return "/partner"
         case "associate":
        return "/associate"
      default:
        return "/"
    }
  }

  // Combine all routes
  const allRoutes = [
    {
      path: "/",
      element: isAuthenticated ? <Navigate to={getRedirect()} replace /> : <Login />,
    },
    {
      path: "/become-partner",
      element: <BecomePartner />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    // Include all role-specific routes directly (without protection wrapper)
    ...adminRoutes,
    ...managerRoutes,
    ...partnerRoutes,
    ...associateRoutes,

    // Redirect any unknown routes to appropriate dashboard or login
    {
      path: "*",
      element: <Navigate to={getRedirect()} replace />,
    },
  ]

  const routes = useRoutes(allRoutes)
  return routes
}

function App() {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </LocalizationProvider>
    </AuthProvider>
  )
}

export default App
