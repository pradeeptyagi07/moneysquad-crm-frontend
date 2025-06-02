"use client"

import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"
import PartnerLayout from "../components/Layout/PartnerLayout"
import PartnerOverview from "../pages/Overview/PartnerOverview"
import Leads from "../pages/Leads/Leads"
import Offers from "../pages/Offers/Offers"
import Commissions from "../pages/Commissions/Commissions"
import Settings from "../pages/Settings/Settings"
import { useAppSelector } from "../hooks/useAppSelector"

// Protected route component specific to partner role
const PartnerRoute = ({ children }: { children: JSX.Element }) => {
  // Use Redux state instead of auth context
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (userRole !== "partner") {
    return <Navigate to={`/${userRole}`} replace />
  }

  return children
}

const partnerRoutes: RouteObject[] = [
  {
    path: "/partner",
    element: (
      <PartnerRoute>
        <PartnerLayout />
      </PartnerRoute>
    ),
    children: [
      {
        index: true,
        element: <PartnerOverview />,
      },
      {
        path: "overview",
        element: <PartnerOverview />,
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
    ],
  },
]

export default partnerRoutes
