"use client"

import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"
import AdminLayout from "../components/Layout/AdminLayout"
import Leads from "../pages/Leads/Leads"
import Offers from "../pages/Offers/Offers"
import Settings from "../pages/Settings/Settings"
import ManagePartners from "../pages/ManagePartners/ManagePartners"
import type { JSX } from "react/jsx-runtime"
import TeamManagement from "../pages/TeamManagement/TeamManagement"
import { useAppSelector } from "../hooks/useAppSelector"
import CommissionDashboard from "../pages/Commissions/CommissionDashboard"
import HelpSupportMain from "../pages/HelpAndSupport/HelpSupportMain"
import TrainingResourcesTab from "../pages/TrainingResources/TrainingResources"
import CommonOverview from "../pages/Overview/CommonOverview"

// Protected route component specific to admin role
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  // Use Redux state instead of auth context
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (userRole !== "admin") {
    return <Navigate to={`/${userRole}`} replace />
  }

  return children
}

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <CommonOverview />,
      },
      {
        path: "overview",
        element: <CommonOverview />,
      },
      {
        path: "leads",
        element: <Leads />,
      },
      {
        path: "offers",
        element: <Offers />,
      },
      {
        path: "commissions",
        element: <CommissionDashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "manage-partners",
        element: <ManagePartners />,
      },
 
      {
        path: "team-management",
        element: <TeamManagement />,
      },
      {
        path: "help-support",
        element: <HelpSupportMain />,
      },
      {
        path: "training-resorces",
        element: <TrainingResourcesTab/>
      },
    ],
  },
]

export default adminRoutes
