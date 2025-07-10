"use client";

import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ManagerLayout from "../components/Layout/ManagerLayout";
import ManagerOverview from "../pages/Overview/ManagerOverview";
import Leads from "../pages/Leads/Leads";
import Settings from "../pages/Settings/Settings";
import type { JSX } from "react/jsx-runtime";
import { useAppSelector } from "../hooks/useAppSelector";
import TrainingResourcesTab from "../pages/TrainingResources/TrainingResources";
import Offers from "../pages/Offers/Offers";
import PartnerOverview from "../pages/Overview/PartnerOverview";

// Protected route component specific to manager role
const ManagerRoute = ({ children }: { children: JSX.Element }) => {
  // Use Redux state instead of auth context
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== "manager") {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
};

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
        path: "settings",
        element: <Settings />,
      },
      {
        path: "training-resorces",
        element: <TrainingResourcesTab />,
      },
    ],
  },
];

export default managerRoutes;
