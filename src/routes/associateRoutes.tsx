// src/routes/associateRoutes.tsx

"use client";

import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AssociateLayout from "../components/Layout/AssociateLayout";
import Leads from "../pages/Leads/Leads";
import Offers from "../pages/Offers/Offers";
import Settings from "../pages/Settings/Settings";
import { useAppSelector } from "../hooks/useAppSelector";
import type { JSX } from "react/jsx-runtime";
import HelpSupportMain from "../pages/HelpAndSupport/HelpSupportMain";
import TrainingResourcesTab from "../pages/TrainingResources/TrainingResources";
import PartnerOverview from "../pages/Overview/CommonOverview";
import CommonOverview from "../pages/Overview/CommonOverview";

// Protected route component specific to associate role
const AssociateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== "associate") {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
};

const associateRoutes: RouteObject[] = [
  {
    path: "/associate",
    element: (
      <AssociateRoute>
        <AssociateLayout />
      </AssociateRoute>
    ),
    children: [
      {
        index: true,
        element: <CommonOverview />,
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
        path: "help-support",
        element: <HelpSupportMain />,
      },
      {
        path: "training-resorces",
        element: <TrainingResourcesTab/>
      },
    ],
  },
];

export default associateRoutes;
