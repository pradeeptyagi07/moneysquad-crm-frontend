"use client"

import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"
import ManagerLayout from "../components/Layout/ManagerLayout"
import ManagerOverview from "../pages/Overview/ManagerOverview"
import Leads from "../pages/Leads/Leads"
import Commissions from "../pages/Commissions/Commissions"
import Settings from "../pages/Settings/Settings"
import { useAuth } from "../hooks/useAuth"
import type { JSX } from "react/jsx-runtime"

// Protected route component specific to manager role
const ManagerRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, userRole } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (userRole !== "manager") {
    return <Navigate to={`/${userRole}`} replace />
  }

  return children
}

const managerRoutes: RouteObject[] = [
  {
    path: "/manager",
    element: (
      <ManagerRoute>
        <ManagerLayout />
      </ManagerRoute>
    ),
    children: [
      {
        index: true,
        element: <ManagerOverview />,
      },
      {
        path: "overview",
        element: <ManagerOverview />,
      },
      {
        path: "leads",
        element: <Leads />,
      },
      {
        path: "commissions",
        element: <Commissions />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]

export default managerRoutes
