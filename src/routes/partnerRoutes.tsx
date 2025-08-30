"use client";

import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import PartnerLayout from "../components/Layout/PartnerLayout";
import PartnerOverview from "../pages/Overview/CommonOverview";
import Leads from "../pages/Leads/Leads";
import Offers from "../pages/Offers/Offers";
import Settings from "../pages/Settings/Settings";
import { useAppSelector } from "../hooks/useAppSelector";
import AssociateManagement from "../pages/Associates/AssociateManagement";
import CommissionDashboard from "../pages/Commissions/CommissionDashboard";
import HelpSupportMain from "../pages/HelpAndSupport/HelpSupportMain";
import TrainingResourcesTab from "../pages/TrainingResources/TrainingResources";
import ArchiveLeads from "../pages/Leads/ArchiveLeads";

// Protected route component specific to partner role
const PartnerRoute = ({ children }: { children: JSX.Element }) => {
  // Use Redux state instead of auth context
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== "partner") {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
};

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
        path: "archive-leads",
        element: <ArchiveLeads />,
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
        path: "team-management",
        element: <AssociateManagement />,
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
        element: <TrainingResourcesTab />,
      },
    ],
  },
];

export default partnerRoutes;
