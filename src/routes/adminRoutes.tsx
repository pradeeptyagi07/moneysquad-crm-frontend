"use client"

import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"
import AdminLayout from "../components/Layout/AdminLayout"
import AdminOverview from "../pages/Overview/AdminOverview"
import Leads from "../pages/Leads/Leads"
import Offers from "../pages/Offers/Offers"
import Commissions from "../pages/Commissions/Commissions"
import Settings from "../pages/Settings/Settings"
import ManagePartners from "../pages/ManagePartners/ManagePartners"
import PartnerDetails from "../pages/ManagePartners/PartnerDetails"
import { useAuth } from "../hooks/useAuth"
import type { JSX } from "react/jsx-runtime"
import TeamManagement from "../pages/TeamManagement/TeamManagement"

// Protected route component specific to admin role
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, userRole } = useAuth()

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
        element: <AdminOverview />,
      },
      {
        path: "overview",
        element: <AdminOverview />,
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
        element: <Commissions />,
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
        path: "manage-partners/:partnerId",
        element: <PartnerDetails />,
      },
      {
        path: "team-management",
        element: <TeamManagement />,
      },
    ],
  },
]

export default adminRoutes
